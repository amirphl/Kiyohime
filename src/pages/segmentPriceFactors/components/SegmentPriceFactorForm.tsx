import React from 'react';
import { SegmentPriceFactorTranslations } from '../translations';
import {
  SEGMENT_PRICE_FACTOR_PLATFORMS,
  SegmentPriceFactorPlatform,
} from '../utils';

interface SegmentPriceFactorFormProps {
  platform: SegmentPriceFactorPlatform;
  level3: string;
  priceFactor: string;
  level3Options: string[];
  loadingOptions: boolean;
  optionsError: string | null;
  loadingFactors: boolean;
  submitting: boolean;
  copy: SegmentPriceFactorTranslations;
  onPlatformChange: (platform: string) => void;
  onLevel3Change: (value: string) => void;
  onPriceFactorChange: (value: string) => void;
  onSubmit: () => void;
  onRefresh: () => void;
}

const SegmentPriceFactorForm: React.FC<SegmentPriceFactorFormProps> = ({
  platform,
  level3,
  priceFactor,
  level3Options,
  loadingOptions,
  optionsError,
  loadingFactors,
  submitting,
  copy,
  onPlatformChange,
  onLevel3Change,
  onPriceFactorChange,
  onSubmit,
  onRefresh,
}) => (
  <div className='rounded-lg border bg-white p-4 shadow'>
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
      <div>
        <label className='mb-1 block text-sm font-medium'>
          {copy.platformLabel}
        </label>
        <select
          className='w-full rounded border px-3 py-2'
          value={platform}
          onChange={event => onPlatformChange(event.target.value)}
        >
          <option value=''>{copy.platformPlaceholder}</option>
          {SEGMENT_PRICE_FACTOR_PLATFORMS.map(item => (
            <option key={item} value={item}>
              {item.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className='mb-1 block text-sm font-medium'>
          {copy.level3Label}
        </label>
        <select
          className='w-full rounded border px-3 py-2'
          value={level3}
          onChange={event => onLevel3Change(event.target.value)}
        >
          <option value=''>{copy.level3Placeholder}</option>
          {level3Options.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {loadingOptions && (
          <div className='mt-1 text-xs text-gray-500'>
            {copy.common.loading}
          </div>
        )}
        {optionsError && (
          <div className='mt-1 text-xs text-red-600'>{optionsError}</div>
        )}
      </div>

      <div>
        <label className='mb-1 block text-sm font-medium'>
          {copy.priceFactorLabel}
        </label>
        <input
          type='number'
          step='0.01'
          min='0'
          value={priceFactor}
          onChange={event => onPriceFactorChange(event.target.value)}
          className='w-full rounded border px-3 py-2'
          placeholder={copy.priceFactorPlaceholder}
        />
      </div>
    </div>

    <div className='mt-4 flex items-center gap-3'>
      <button
        type='button'
        onClick={onSubmit}
        disabled={submitting}
        className='rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-70'
      >
        {submitting ? copy.common.loading : copy.createButton}
      </button>
      <button
        type='button'
        onClick={onRefresh}
        disabled={loadingOptions || loadingFactors}
        className='rounded bg-gray-100 px-3 py-2 text-gray-800 disabled:opacity-70'
      >
        {copy.refreshButton}
      </button>
    </div>
  </div>
);

export default SegmentPriceFactorForm;
