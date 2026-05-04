import React, { useEffect, useMemo, useState } from 'react';
import {
  AdminPlatformBasePriceItem,
  AdminPagePriceItem,
} from '../../../types/admin';
import { AdminPlatformSettingsCopy } from '../translations';

type PlatformKey = 'sms' | 'rubika' | 'bale' | 'splus';

interface PricingCalculationSectionProps {
  basePriceItems: AdminPlatformBasePriceItem[];
  pagePriceItems: AdminPagePriceItem[];
  copy: AdminPlatformSettingsCopy;
}

interface RowDraft {
  segmentPriceFactor: string;
  numPages: string;
  platformBasePrice: string;
  lineNumberPriceFactor: string;
  pagePrice: string;
}

const SUPPORTED_PLATFORMS: PlatformKey[] = ['sms', 'rubika', 'bale', 'splus'];

const normalizePlatformKey = (platform: string): string =>
  platform.trim().toLowerCase();

const toPositiveNumber = (value: string, fallback = 1): number => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
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

  return SUPPORTED_PLATFORMS.reduce(
    (acc, platform) => {
      acc[platform] = {
        segmentPriceFactor: '1',
        numPages: '1',
        platformBasePrice: String(baseByPlatform.get(platform) ?? 0),
        lineNumberPriceFactor: '1',
        pagePrice: String(pageByPlatform.get(platform) ?? 0),
      };
      return acc;
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
    const nextBaseByPlatform = new Map(
      basePriceItems.map(item => [
        normalizePlatformKey(String(item.platform)),
        item.price || 0,
      ])
    );
    const nextPageByPlatform = new Map(
      pagePriceItems.map(item => [
        normalizePlatformKey(String(item.platform)),
        item.price || 0,
      ])
    );

    setDrafts(prev => {
      const next = { ...prev };
      SUPPORTED_PLATFORMS.forEach(platform => {
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
          platformBasePrice: String(nextBaseByPlatform.get(platform) ?? 0),
          pagePrice: String(nextPageByPlatform.get(platform) ?? 0),
        };
      });
      return next;
    });
  }, [basePriceItems, pagePriceItems]);

  const totalsByPlatform = useMemo(() => {
    return SUPPORTED_PLATFORMS.reduce(
      (acc, platform) => {
        const row = drafts[platform];
        const segmentPriceFactor = toPositiveNumber(row.segmentPriceFactor);
        const numPages = toPositiveNumber(row.numPages);
        const platformBasePrice = toPositiveNumber(row.platformBasePrice, 0);
        const lineNumberPriceFactor = toPositiveNumber(
          row.lineNumberPriceFactor
        );
        const pagePrice = toPositiveNumber(row.pagePrice, 0);

        acc[platform] =
          platform === 'sms'
            ? lineNumberPriceFactor * numPages * platformBasePrice +
              segmentPriceFactor * pagePrice
            : 1 * 1 * platformBasePrice + segmentPriceFactor * pagePrice;
        return acc;
      },
      {} as Record<PlatformKey, number>
    );
  }, [drafts]);

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
            {SUPPORTED_PLATFORMS.map(platform => {
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
                      onChange={e =>
                        handleChange(
                          platform,
                          'segmentPriceFactor',
                          e.target.value
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
                      onChange={e =>
                        handleChange(platform, 'numPages', e.target.value)
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
                      onChange={e =>
                        handleChange(
                          platform,
                          'platformBasePrice',
                          e.target.value
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
                      onChange={e =>
                        handleChange(
                          platform,
                          'lineNumberPriceFactor',
                          e.target.value
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
                      onChange={e =>
                        handleChange(platform, 'pagePrice', e.target.value)
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
