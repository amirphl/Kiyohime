import React from 'react';
import { AgencyReportTranslations } from '../translations';

interface StatsSummaryProps {
  totalSent: number;
  totalShare: number;
  currencyLabel: string;
  copy: Pick<AgencyReportTranslations, 'totalSentAll' | 'totalShareAll'>;
}

const StatsSummary: React.FC<StatsSummaryProps> = ({
  totalSent,
  totalShare,
  currencyLabel,
  copy,
}) => (
  <div className='mt-4 flex flex-col items-end space-y-2'>
    <div className='text-sm text-gray-700'>
      <span className='font-medium'>{copy.totalSentAll}:</span>{' '}
      {totalSent.toLocaleString()}
    </div>
    <div className='text-sm text-gray-700'>
      <span className='font-medium'>{copy.totalShareAll}:</span>{' '}
      {totalShare.toLocaleString()} {currencyLabel}
    </div>
  </div>
);

export default StatsSummary;
