import React from 'react';
import { Package } from 'lucide-react';
import Card from '../../ui/Card';
import FormField from '../../ui/FormField';
import { useNavigation } from '../../../contexts/NavigationContext';
import { useBundles } from './useBundles';

interface BundleInfoCardProps {
  bundleId: number | null | undefined;
  phase: string | undefined;
  onBundleChange: (value: number | null) => void;
  onPhaseChange: (value: string) => void;
  accessToken: string | null;
  title: string;
  bundleLabel: string;
  bundlePlaceholder: string;
  phaseLabel: string;
  phasePlaceholder: string;
  phaseTestLabel: string;
  phaseExecutionLabel: string;
  loadingLabel: string;
  errorLabel: string;
  emptyLabel: string;
  createLabel: string;
}

const BundleInfoCard: React.FC<BundleInfoCardProps> = ({
  bundleId,
  phase,
  onBundleChange,
  onPhaseChange,
  accessToken,
  title,
  bundleLabel,
  bundlePlaceholder,
  phaseLabel,
  phasePlaceholder,
  phaseTestLabel,
  phaseExecutionLabel,
  loadingLabel,
  errorLabel,
  emptyLabel,
  createLabel,
}) => {
  const { navigate } = useNavigation();
  const { bundleOptions, isLoading, error } = useBundles(accessToken);
  const hasNoBundles = !isLoading && !error && bundleOptions.length === 0;

  const phaseOptions = [
    { value: 'execution', label: phaseExecutionLabel },
    { value: 'test', label: phaseTestLabel },
  ];

  return (
    <Card>
      <div className='space-y-4'>
        <h3 className='text-lg font-medium text-gray-900 flex items-center gap-1'>
          <Package className='h-5 w-5 text-primary-600' />
          {title}
        </h3>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            {error ? (
              <div className='text-red-600 text-sm'>{errorLabel}</div>
            ) : (
              <FormField
                id='bundleId'
                label={isLoading ? loadingLabel : bundleLabel}
                type='select'
                options={bundleOptions}
                value={bundleId ? String(bundleId) : ''}
                onChange={(val: string) =>
                  onBundleChange(val ? Number(val) : null)
                }
                required
                placeholder={bundlePlaceholder}
              />
            )}

            {hasNoBundles && (
              <div className='mt-3 rounded-lg border border-primary-200 bg-primary-50 px-3 py-2'>
                <p className='text-sm text-primary-700'>{emptyLabel}</p>
                <button
                  type='button'
                  onClick={() => navigate('/dashboard/bundles/new')}
                  className='mt-2 inline-flex items-center text-sm font-semibold text-primary-700 transition hover:text-primary-800 hover:underline underline-offset-2'
                >
                  {createLabel}
                </button>
              </div>
            )}
          </div>

          <div>
            <FormField
              id='phase'
              label={phaseLabel}
              type='select'
              options={phaseOptions}
              value={phase || ''}
              onChange={onPhaseChange}
              required
              placeholder={phasePlaceholder}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BundleInfoCard;
