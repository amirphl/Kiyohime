import React, { useEffect, useMemo } from 'react';
import { Plus } from 'lucide-react';
import Button from '../components/ui/Button';
import { useLanguage } from '../hooks/useLanguage';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../hooks/useAuth';
import { useNavigation } from '../contexts/NavigationContext';
import { ROUTES } from '../config/routes';
import {
  createCampaignCreationDraft,
  prepareCampaignCreationDraft,
} from '../utils/campaignCreationDraft';
import { getReportsPathWithFilters } from '../utils/reportsNavigation';
import BundlesFiltersBar from './bundles/components/BundlesFiltersBar';
import BundlesTable from './bundles/components/BundlesTable';
import { useBundles } from './bundles/hooks/useBundles';
import { getBundlesCopy } from './bundles/translations';
import { BundleListItem } from '../types/bundle';
import {
  BUNDLE_TOAST_DURATION_MS,
  getBundleJob,
  getBundleJobCategory,
  getBundleShortLinkDomain,
} from './bundles/utils';

const BundlesPage: React.FC = () => {
  const { language } = useLanguage();
  const { showError, showInfo } = useToast();
  const { user } = useAuth();
  const { navigate } = useNavigation();
  const copy = useMemo(() => getBundlesCopy(language), [language]);
  const isAgency = user?.account_type === 'marketing_agency';
  const {
    items,
    loading,
    error,
    page,
    limit,
    titleFilter,
    customerFilter,
    customerOptions,
    totalItems,
    totalPages,
    setPage,
    setLimit,
    setTitleFilter,
    setCustomerFilter,
    clearFilters,
    retry,
  } = useBundles({ copy });

  useEffect(() => {
    if (error) {
      showError(error, BUNDLE_TOAST_DURATION_MS);
    }
  }, [error, showError]);

  const getBundleId = (bundle: BundleListItem): number | null => {
    return bundle.id > 0 ? bundle.id : null;
  };

  const openCampaignDraftForBundle = (bundle: BundleListItem) => {
    const bundleId = getBundleId(bundle);
    if (!bundleId) {
      showError(copy.messages.missingBundleId, BUNDLE_TOAST_DURATION_MS);
      return;
    }

    const link = bundle.adlink?.trim() || '';
    const shortLinkDomain = getBundleShortLinkDomain(bundle);
    const jobCategory = isAgency ? getBundleJobCategory(bundle) : '';
    const job = isAgency ? getBundleJob(bundle) : '';

    prepareCampaignCreationDraft(
      createCampaignCreationDraft({
        segment: {
          campaignTitle: '',
          level1: '',
          level2s: [],
          level3s: [],
          platform: 'sms',
          bundleId,
          jobCategory,
          job,
        },
        content: {
          insertLink: Boolean(link),
          link,
          shortLinkDomain: link ? shortLinkDomain : null,
          text: '',
        },
      })
    );

    showInfo(
      copy.messages.creatingCampaignFromBundle,
      BUNDLE_TOAST_DURATION_MS
    );
    window.location.href = ROUTES.CAMPAIGN_CREATION.path;
  };

  const handleActionClick = (action: string, bundle: BundleListItem) => {
    if (action === 'view') {
      const bundleId = getBundleId(bundle);
      if (!bundleId) {
        showError(copy.messages.missingBundleId, BUNDLE_TOAST_DURATION_MS);
        return;
      }
      navigate(`/dashboard/bundles/detail?id=${bundleId}`);
      return;
    }

    if (action === 'runNow') {
      openCampaignDraftForBundle(bundle);
      return;
    }

    if (action === 'testCampaigns') {
      const bundleId = getBundleId(bundle);
      if (!bundleId) {
        showError(copy.messages.missingBundleId, BUNDLE_TOAST_DURATION_MS);
        return;
      }
      showInfo(copy.messages.redirectingToReports, BUNDLE_TOAST_DURATION_MS);
      navigate(getReportsPathWithFilters({ phase: 'test', bundleId }));
      return;
    }

    if (action === 'createCampaign') {
      const bundleId = getBundleId(bundle);
      if (!bundleId) {
        showError(copy.messages.missingBundleId, BUNDLE_TOAST_DURATION_MS);
        return;
      }
      showInfo(copy.messages.redirectingToReports, BUNDLE_TOAST_DURATION_MS);
      navigate(getReportsPathWithFilters({ phase: 'execution', bundleId }));
      return;
    }

    // Fallback for unknown actions
    showInfo(copy.messages.actionTodo, BUNDLE_TOAST_DURATION_MS);
  };

  const handleCreateClick = () => {
    navigate('/dashboard/bundles/new');
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='mx-auto flex w-full max-w-[1920px] flex-col gap-5 px-2 py-6 sm:px-3 lg:px-4'>
        <section className='rounded-[28px] border border-gray-200 bg-white p-4 shadow-sm sm:p-6'>
          <div className='flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between'>
            <div className='max-w-2xl'>
              <p className='text-sm font-semibold uppercase tracking-[0.18em] text-primary-600'>
                {copy.title}
              </p>
              <h1 className='mt-3 text-3xl font-bold text-gray-900 sm:text-4xl'>
                {copy.title}
              </h1>
              <p className='mt-3 text-sm leading-7 text-gray-500 sm:text-base'>
                {copy.subtitle}
              </p>
            </div>

            <Button
              size='lg'
              icon={Plus}
              className='rounded-2xl px-6 py-3 shadow-sm'
              onClick={handleCreateClick}
            >
              {copy.create}
            </Button>
          </div>
        </section>

        <BundlesFiltersBar
          copy={copy}
          titleFilter={titleFilter}
          customerFilter={customerFilter}
          customerOptions={customerOptions}
          onTitleFilterChange={value => {
            setTitleFilter(value);
            setPage(1);
          }}
          onCustomerFilterChange={value => {
            setCustomerFilter(value);
            setPage(1);
          }}
          onClear={clearFilters}
        />

        {loading ? (
          <section className='rounded-3xl border border-gray-200 bg-white px-6 py-14 text-center shadow-sm'>
            <div className='mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary-600' />
            <h2 className='mt-4 text-lg font-semibold text-gray-900'>
              {copy.states.loading}
            </h2>
            <p className='mt-2 text-sm text-gray-500'>
              {copy.states.loadingDescription}
            </p>
          </section>
        ) : error ? (
          <section className='rounded-3xl border border-red-200 bg-white px-6 py-14 text-center shadow-sm'>
            <h2 className='text-lg font-semibold text-red-700'>{error}</h2>
            <div className='mt-5'>
              <Button variant='outline' onClick={retry}>
                {copy.states.retry}
              </Button>
            </div>
          </section>
        ) : items.length === 0 ? (
          <section className='rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center shadow-sm'>
            <h2 className='text-lg font-semibold text-gray-900'>
              {copy.table.empty}
            </h2>
            <p className='mt-2 text-sm text-gray-500'>{copy.subtitle}</p>
            <div className='mt-5'>
              <Button variant='outline' onClick={retry}>
                {copy.states.retry}
              </Button>
            </div>
          </section>
        ) : (
          <BundlesTable
            copy={copy}
            items={items}
            page={page}
            limit={limit}
            totalItems={totalItems}
            totalPages={totalPages}
            onPageChange={setPage}
            onLimitChange={value => {
              setLimit(value);
              setPage(1);
            }}
            onActionClick={handleActionClick}
          />
        )}
      </div>
    </div>
  );
};

export default BundlesPage;
