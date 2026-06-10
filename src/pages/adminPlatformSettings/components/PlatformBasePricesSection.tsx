import React from 'react';
import { AdminPlatformBasePriceItem } from '../../../types/admin';
import { AdminPlatformSettingsCopy } from '../translations';

interface PlatformBasePricesSectionProps {
  items: AdminPlatformBasePriceItem[];
  loading: boolean;
  error: string | null;
  copy: AdminPlatformSettingsCopy;
  getDraftPrice: (platform: string, currentPrice: number) => string;
  onChangeDraftPrice: (platform: string, value: string) => void;
  onUpdatePrice: (platform: 'sms' | 'rubika' | 'bale' | 'splus') => void;
  updatingByPlatform: Record<string, boolean>;
}

const SUPPORTED_PLATFORMS: Array<'sms' | 'rubika' | 'bale' | 'splus'> = [
  'sms',
  'rubika',
  'bale',
  'splus',
];

const PlatformBasePricesSection: React.FC<PlatformBasePricesSectionProps> = ({
  items,
  loading,
  error,
  copy,
  getDraftPrice,
  onChangeDraftPrice,
  onUpdatePrice,
  updatingByPlatform,
}) => {
  const byPlatform = new Map(
    items.map(item => [String(item.platform).toLowerCase(), item.price || 0])
  );

  const platformLabel = (platform: string) =>
    copy.basePrices.platformLabels[
      platform as keyof typeof copy.basePrices.platformLabels
    ] || platform.toUpperCase();

  return (
    <div className='rounded-lg border border-gray-200 bg-white p-4'>
      <div className='mb-4'>
        <h2 className='text-lg font-semibold text-gray-900'>
          {copy.basePrices.title}
        </h2>
        <p className='mt-1 text-sm text-gray-600'>{copy.basePrices.subtitle}</p>
      </div>

      {loading ? (
        <div className='py-8 text-center text-sm text-gray-500'>
          {copy.common.loading}
        </div>
      ) : (
        <div className='overflow-auto'>
          <table className='min-w-full text-sm'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='border px-3 py-2 text-center'>
                  {copy.basePrices.columns.platform}
                </th>
                <th className='border px-3 py-2 text-center'>
                  {copy.basePrices.columns.currentPrice}
                </th>
                <th className='border px-3 py-2 text-center'>
                  {copy.basePrices.columns.newPrice}
                </th>
                <th className='border px-3 py-2 text-center'>
                  {copy.basePrices.columns.actions}
                </th>
              </tr>
            </thead>
            <tbody>
              {SUPPORTED_PLATFORMS.map(platform => {
                const currentPrice = byPlatform.get(platform) ?? 0;
                const currentDraft = getDraftPrice(platform, currentPrice);
                return (
                  <tr key={platform} className='odd:bg-white even:bg-gray-50'>
                    <td className='border px-3 py-2 text-center font-medium'>
                      {platformLabel(platform)}
                    </td>
                    <td className='border px-3 py-2 text-center'>
                      {currentPrice}
                    </td>
                    <td className='border px-3 py-2 text-center'>
                      <input
                        type='number'
                        min='1'
                        step='1'
                        value={currentDraft}
                        onChange={e =>
                          onChangeDraftPrice(platform, e.target.value)
                        }
                        className='w-full max-w-[220px] rounded border border-gray-300 px-2 py-1 text-center'
                        placeholder={copy.basePrices.columns.newPrice}
                      />
                    </td>
                    <td className='border px-3 py-2 text-center'>
                      <button
                        type='button'
                        onClick={() => onUpdatePrice(platform)}
                        disabled={!!updatingByPlatform[platform]}
                        className='rounded border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 disabled:opacity-60'
                      >
                        {updatingByPlatform[platform]
                          ? copy.common.loading
                          : copy.basePrices.update}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {error && <div className='mt-3 text-sm text-red-600'>{error}</div>}
    </div>
  );
};

export default PlatformBasePricesSection;
