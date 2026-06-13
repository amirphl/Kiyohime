import React, { useMemo } from 'react';
import { ROUTES } from '../../config/routes';
import { useNavigation } from '../../contexts/NavigationContext';
import { useLanguage } from '../../hooks/useLanguage';
import { useToast } from '../../hooks/useToast';
import CampaignDetailsModal from './components/CampaignDetailsModal';
import CustomersTable from './components/CustomersTable';
import DetailsModal from './components/DetailsModal';
import DiscountsHistoryModal from './components/DiscountsHistoryModal';
import FiltersBar from './components/FiltersBar';
import TotalsGrid from './components/TotalsGrid';
import { useAdminCustomerManagement } from './hooks/useAdminCustomerManagement';
import { getAdminCustomerManagementCopy } from './translations';
import { formatDateTime, formatNumber, toPct } from './utils/formatters';

const AdminCustomerManagementPage: React.FC = () => {
  const { language } = useLanguage();
  const { showError } = useToast();
  const { navigate } = useNavigation();

  const copy = useMemo(
    () => getAdminCustomerManagementCopy(language),
    [language]
  );

  const {
    start,
    end,
    loading,
    error,
    data,
    detailsOpen,
    detailsLoading,
    detailsError,
    details,
    campaignOpen,
    campaignLoading,
    campaignError,
    campaign,
    discountsOpen,
    discountsLoading,
    discountsError,
    discountsItems,
    toggleLoadingId,
    setStart,
    setEnd,
    setDetailsOpen,
    setCampaignOpen,
    setDiscountsOpen,
    load,
    openDetails,
    openCampaign,
    openDiscounts,
    handleToggleActive,
  } = useAdminCustomerManagement({
    copy,
    onError: showError,
  });

  const formatDate = useMemo(
    () => (iso?: string | null) => formatDateTime(iso, language),
    [language]
  );

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='mx-auto max-w-[1400px] space-y-6 p-4'>
        <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
          <button
            className='inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50'
            onClick={() => navigate(ROUTES.ADMIN_SARDIS.path)}
          >
            {copy.backToSardis}
          </button>
        </div>

        <FiltersBar
          start={start}
          end={end}
          onStartChange={setStart}
          onEndChange={setEnd}
          onApply={load}
          loading={loading}
          copy={copy}
        />

        <CustomersTable
          items={data?.items || []}
          loading={loading}
          error={error}
          copy={copy}
          onToggleActive={handleToggleActive}
          onViewDetails={openDetails}
          onShowDiscounts={openDiscounts}
          toggleLoadingId={toggleLoadingId}
          formatNumber={formatNumber}
          toPct={toPct}
        />

        <TotalsGrid totals={data} formatNumber={formatNumber} copy={copy} />
      </div>

      <DetailsModal
        isOpen={detailsOpen}
        loading={detailsLoading}
        error={detailsError}
        details={details}
        copy={copy}
        onClose={() => setDetailsOpen(false)}
        onViewCampaign={openCampaign}
        formatDateTime={formatDate}
        formatNumber={formatNumber}
        toPct={toPct}
      />

      <CampaignDetailsModal
        isOpen={campaignOpen}
        loading={campaignLoading}
        error={campaignError}
        campaign={campaign}
        copy={copy}
        onClose={() => setCampaignOpen(false)}
        formatDateTime={formatDate}
        formatNumber={formatNumber}
      />

      <DiscountsHistoryModal
        isOpen={discountsOpen}
        loading={discountsLoading}
        error={discountsError}
        items={discountsItems}
        copy={copy}
        onClose={() => setDiscountsOpen(false)}
        formatDateTime={formatDate}
        formatNumber={formatNumber}
      />
    </div>
  );
};

export default AdminCustomerManagementPage;
