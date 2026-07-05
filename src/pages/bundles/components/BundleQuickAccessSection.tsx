import React from 'react';
import { BarChart3, FlaskConical, Rocket, Send } from 'lucide-react';
import { BundleListItem } from '../../../types/bundle';
import { BundlesCopy } from '../translations';

type QuickAccessAction =
  | 'create-campaign-test'
  | 'create-campaign-execution'
  | 'test-campaigns'
  | 'execution-campaigns';

interface BundleQuickAccessSectionProps {
  copy: BundlesCopy;
  bundle: BundleListItem;
  onAction: (action: QuickAccessAction, bundle: BundleListItem) => void;
}

const BundleQuickAccessSection: React.FC<BundleQuickAccessSectionProps> = ({
  copy,
  bundle,
  onAction,
}) => {
  const actions: Array<{
    id: QuickAccessAction;
    label: string;
    icon: React.ReactNode;
    primary: boolean;
  }> = [
    {
      id: 'create-campaign-test',
      label: copy.detailPage.actions.createTestCampaign,
      icon: <FlaskConical className='h-4 w-4' />,
      primary: true,
    },
    {
      id: 'create-campaign-execution',
      label: copy.detailPage.actions.createExecutionCampaign,
      icon: <Rocket className='h-4 w-4' />,
      primary: true,
    },
    {
      id: 'test-campaigns',
      label: copy.detailPage.actions.viewTestReports,
      icon: <Send className='h-4 w-4' />,
      primary: false,
    },
    {
      id: 'execution-campaigns',
      label: copy.detailPage.actions.viewExecutionReports,
      icon: <BarChart3 className='h-4 w-4' />,
      primary: false,
    },
  ];

  return (
    <section className='rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6'>
      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-gray-900'>
          {copy.detailPage.sections.quickAccess}
        </h2>
      </div>

      <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
        {actions.map(action => (
          <button
            key={action.id}
            type='button'
            className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
              action.primary
                ? 'border-primary-600 bg-primary-600 text-white hover:bg-primary-700'
                : 'border-primary-200 bg-white text-primary-700 hover:bg-primary-50'
            }`}
            onClick={() => onAction(action.id, bundle)}
          >
            {action.icon}
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default BundleQuickAccessSection;
