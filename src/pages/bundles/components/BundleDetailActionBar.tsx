import React from 'react';
import { BarChart3, FlaskConical, Send } from 'lucide-react';
import { BundlesCopy } from '../translations';
import { BundleListItem } from '../../../types/bundle';

interface BundleDetailActionBarProps {
  copy: BundlesCopy;
  bundle: BundleListItem;
  onAction: (
    action: 'create-campaign' | 'test-campaigns' | 'execution-campaigns',
    bundle: BundleListItem
  ) => void;
}

const actionClass =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-primary-200 bg-white px-4 py-3 text-sm font-semibold text-primary-700 transition hover:bg-primary-50';

const BundleDetailActionBar: React.FC<BundleDetailActionBarProps> = ({
  copy,
  bundle,
  onAction,
}) => {
  return (
    <section className='rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5'>
      <div className='grid gap-3 md:grid-cols-3'>
        <button
          type='button'
          className={`${actionClass} !bg-primary-600 !text-white hover:!bg-primary-700 hover:!text-white`}
          onClick={() => onAction('create-campaign', bundle)}
        >
          <Send className='h-4 w-4' />
          <span>{copy.detailPage.actions.createCampaign}</span>
        </button>
        <button
          type='button'
          className={actionClass}
          onClick={() => onAction('test-campaigns', bundle)}
        >
          <FlaskConical className='h-4 w-4' />
          <span>{copy.detailPage.actions.viewCampaignsWithPhaseAsTest}</span>
        </button>
        <button
          type='button'
          className={actionClass}
          onClick={() => onAction('execution-campaigns', bundle)}
        >
          <BarChart3 className='h-4 w-4' />
          <span>
            {copy.detailPage.actions.viewCampaignsWithPhaseAsExecution}
          </span>
        </button>
      </div>
    </section>
  );
};

export default BundleDetailActionBar;
