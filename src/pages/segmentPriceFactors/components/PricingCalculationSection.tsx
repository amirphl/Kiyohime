import React, { useEffect, useMemo, useState } from 'react';
import {
  AdminPlatformBasePriceItem,
  AdminPagePriceItem,
} from '../../../types/admin';
import { SegmentPriceFactorTranslations } from '../translations';
import { normalizePlatformKey, SEGMENT_PRICE_FACTOR_PLATFORMS } from '../utils';

type PlatformKey = (typeof SEGMENT_PRICE_FACTOR_PLATFORMS)[number];

interface PricingCalculationSectionProps {
  basePriceItems: AdminPlatformBasePriceItem[];
  pagePriceItems: AdminPagePriceItem[];
  copy: SegmentPriceFactorTranslations;
}

interface RowDraft {
  segmentPriceFactor: string;
  numPages: string;
  platformBasePrice: string;
  lineNumberPriceFactor: string;
  pagePrice: string;
}

const toPositiveNumber = (value: string, fallback = 1): number => {
  const parsedValue = Number(value);
  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return fallback;
  }

  return parsedValue;
};

const buildInitialDrafts = (
  basePriceItems: AdminPlatformBasePriceItem[],
  pagePriceItems: AdminPagePriceItem[]
): Record<PlatformKey, RowDraft> => {
  const baseByPlatform = new Map(
    basePriceItems.map(item => [
      normalizePlatformKey(String(item.platform)),
      item.price || 0,
    ])
  );
  const pageByPlatform = new Map(
    pagePriceItems.map(item => [
      normalizePlatformKey(String(item.platform)),
      item.price || 0,
    ])
  );

  return SEGMENT_PRICE_FACTOR_PLATFORMS.reduce(
    (accumulator, platform) => {
      accumulator[platform] = {
        segmentPriceFactor: '1',
        numPages: '1',
        platformBasePrice: String(baseByPlatform.get(platform) ?? 0),
        lineNumberPriceFactor: '1',
        pagePrice: String(pageByPlatform.get(platform) ?? 0),
      };
      return accumulator;
    },
    {} as Record<PlatformKey, RowDraft>
  );
};

const PricingCalculationSection: React.FC<PricingCalculationSectionProps> = ({
  basePriceItems,
  pagePriceItems,
  copy,
}) => {
  const [drafts, setDrafts] = useState<Record<PlatformKey, RowDraft>>(
    buildInitialDrafts(basePriceItems, pagePriceItems)
  );

  useEffect(() => {
    const baseByPlatform = new Map(
      basePriceItems.map(item => [
        normalizePlatformKey(String(item.platform)),
        item.price || 0,
      ])
    );
    const pageByPlatform = new Map(
      pagePriceItems.map(item => [
        normalizePlatformKey(String(item.platform)),
        item.price || 0,
      ])
    );

    setDrafts(prev => {
      const next = { ...prev };
      SEGMENT_PRICE_FACTOR_PLATFORMS.forEach(platform => {
        const current =
          next[platform] ||
          ({
            segmentPriceFactor: '1',
            numPages: '1',
            platformBasePrice: '0',
            lineNumberPriceFactor: '1',
            pagePrice: '0',
          } as RowDraft);

        next[platform] = {
          ...current,
          platformBasePrice: String(baseByPlatform.get(platform) ?? 0),
          pagePrice: String(pageByPlatform.get(platform) ?? 0),
        };
      });
      return next;
    });
  }, [basePriceItems, pagePriceItems]);

  const totalsByPlatform = useMemo(
    () =>
      SEGMENT_PRICE_FACTOR_PLATFORMS.reduce(
        (accumulator, platform) => {
          const row = drafts[platform];
          const segmentPriceFactor = toPositiveNumber(row.segmentPriceFactor);
          const numPages = toPositiveNumber(row.numPages);
          const platformBasePrice = toPositiveNumber(row.platformBasePrice, 0);
          const lineNumberPriceFactor = toPositiveNumber(
            row.lineNumberPriceFactor
          );
          const pagePrice = toPositiveNumber(row.pagePrice, 0);

          accumulator[platform] =
            platform === 'sms'
              ? lineNumberPriceFactor * numPages * platformBasePrice +
                segmentPriceFactor * pagePrice
              : platformBasePrice + segmentPriceFactor * pagePrice;
          return accumulator;
        },
        {} as Record<PlatformKey, number>
      ),
    [drafts]
  );

  const handleChange = (
    platform: PlatformKey,
    key: keyof RowDraft,
    value: string
  ) => {
    setDrafts(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [key]: value,
      },
    }));
  };

  const platformLabel = (platform: PlatformKey) =>
    copy.basePrices.platformLabels[platform] || platform.toUpperCase();

  return (
    <div className='rounded-lg border border-gray-200 bg-white p-4'>
      <div className='mb-4'>
        <h2 className='text-lg font-semibold text-gray-900'>
          {copy.pricingCalculation.title}
        </h2>
        <p className='mt-1 text-sm text-gray-600'>
          {copy.pricingCalculation.subtitle}
        </p>
      </div>

      <div className='overflow-auto'>
        <table className='min-w-full text-sm'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='border px-3 py-2 text-center'>
                {copy.pricingCalculation.columns.platform}
              </th>
              <th className='border px-3 py-2 text-center'>
                {copy.pricingCalculation.columns.segmentPriceFactor}
              </th>
              <th className='border px-3 py-2 text-center'>
                {copy.pricingCalculation.columns.numPages}
              </th>
              <th className='border px-3 py-2 text-center'>
                {copy.pricingCalculation.columns.platformBasePrice}
              </th>
              <th className='border px-3 py-2 text-center'>
                {copy.pricingCalculation.columns.lineNumberPriceFactor}
              </th>
              <th className='border px-3 py-2 text-center'>
                {copy.pricingCalculation.columns.pagePrice}
              </th>
              <th className='border px-3 py-2 text-center'>
                {copy.pricingCalculation.columns.totalCost}
              </th>
            </tr>
          </thead>
          <tbody>
            {SEGMENT_PRICE_FACTOR_PLATFORMS.map(platform => {
              const row = drafts[platform];
              return (
                <tr key={platform} className='odd:bg-white even:bg-gray-50'>
                  <td className='border px-3 py-2 text-center font-medium'>
                    {platformLabel(platform)}
                  </td>
                  <td className='border px-3 py-2 text-center'>
                    <input
                      type='number'
                      min='1'
                      step='1'
                      value={row.segmentPriceFactor}
                      onChange={event =>
                        handleChange(
                          platform,
                          'segmentPriceFactor',
                          event.target.value
                        )
                      }
                      className='w-full max-w-[160px] rounded border border-gray-300 px-2 py-1 text-center'
                    />
                  </td>
                  <td className='border px-3 py-2 text-center'>
                    <input
                      type='number'
                      min='1'
                      step='1'
                      value={row.numPages}
                      onChange={event =>
                        handleChange(platform, 'numPages', event.target.value)
                      }
                      className='w-full max-w-[160px] rounded border border-gray-300 px-2 py-1 text-center'
                    />
                  </td>
                  <td className='border px-3 py-2 text-center'>
                    <input
                      type='number'
                      min='0'
                      step='1'
                      value={row.platformBasePrice}
                      onChange={event =>
                        handleChange(
                          platform,
                          'platformBasePrice',
                          event.target.value
                        )
                      }
                      className='w-full max-w-[180px] rounded border border-gray-300 px-2 py-1 text-center'
                    />
                  </td>
                  <td className='border px-3 py-2 text-center'>
                    <input
                      type='number'
                      min='1'
                      step='1'
                      value={row.lineNumberPriceFactor}
                      onChange={event =>
                        handleChange(
                          platform,
                          'lineNumberPriceFactor',
                          event.target.value
                        )
                      }
                      className='w-full max-w-[180px] rounded border border-gray-300 px-2 py-1 text-center'
                    />
                  </td>
                  <td className='border px-3 py-2 text-center'>
                    <input
                      type='number'
                      min='0'
                      step='1'
                      value={row.pagePrice}
                      onChange={event =>
                        handleChange(platform, 'pagePrice', event.target.value)
                      }
                      className='w-full max-w-[160px] rounded border border-gray-300 px-2 py-1 text-center'
                    />
                  </td>
                  <td className='border px-3 py-2 text-center font-semibold'>
                    {Math.round(totalsByPlatform[platform] || 0)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className='mt-3 text-xs text-gray-500'>
        {copy.pricingCalculation.note}
      </p>
    </div>
  );
};

export default PricingCalculationSection;
