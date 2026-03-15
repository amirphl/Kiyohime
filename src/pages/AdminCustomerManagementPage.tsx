import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useToast } from '../hooks/useToast';
import { useNavigation } from '../contexts/NavigationContext';
import { ROUTES } from '../config/routes';
import {
  AdminCustomersSharesResponse,
  AdminCustomerWithCampaignsResponse,
  AdminGetCampaignResponse,
  AdminCustomerDiscountHistoryItem,
  AdminSetCustomerActiveStatusRequest,
} from '../types/admin';
import { adminCustomerManagementApi } from './adminCustomerManagement/api';
import { getAdminCustomerManagementCopy } from './adminCustomerManagement/translations';
import FiltersBar from './adminCustomerManagement/components/FiltersBar';
import CustomersTable from './adminCustomerManagement/components/CustomersTable';
import TotalsGrid from './adminCustomerManagement/components/TotalsGrid';
import DetailsModal from './adminCustomerManagement/components/DetailsModal';
import CampaignDetailsModal from './adminCustomerManagement/components/CampaignDetailsModal';
import DiscountsHistoryModal from './adminCustomerManagement/components/DiscountsHistoryModal';

const AdminCustomerManagementPage: React.FC = () => {
  const { language } = useLanguage();
  const copy = useMemo(() => getAdminCustomerManagementCopy(language), [language]);
  const { showError } = useToast();
  const { navigate } = useNavigation();
  const didInitRef = useRef(false);

  const [start, setStart] = useState<string>('');
  const [end, setEnd] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AdminCustomersSharesResponse | null>(null);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [details, setDetails] = useState<AdminCustomerWithCampaignsResponse | null>(null);

  const [campaignOpen, setCampaignOpen] = useState(false);
  const [campaignLoading, setCampaignLoading] = useState(false);
  const [campaignError, setCampaignError] = useState<string | null>(null);
  const [campaign, setCampaign] = useState<AdminGetCampaignResponse | null>(null);

  const [discountsOpen, setDiscountsOpen] = useState(false);
  const [discountsLoading, setDiscountsLoading] = useState(false);
  const [discountsError, setDiscountsError] = useState<string | null>(null);
  const [discountsItems, setDiscountsItems] = useState<AdminCustomerDiscountHistoryItem[] | null>(null);
  const discountsOnceRef = useRef<number | null>(null);

  const formatNumber = (n?: number | null) =>
    typeof n === 'number' ? n.toLocaleString() : '-';
  const toPct = (v?: number | null) =>
    typeof v === 'number' ? `${(v * 100).toFixed(2)}%` : '-';
  const formatDateTime = (iso?: string | null) => {
    if (!iso) return '-';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '-';
    if (language === 'fa') {
      return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
        timeZone: 'Asia/Tehran',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(d);
    }
    return d.toLocaleString();
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params: { start_date?: string; end_date?: string } = {};
    if (start) {
      const d = new Date(start);
      if (!Number.isNaN(d.getTime())) params.start_date = d.toISOString();
    }
    if (end) {
      const d = new Date(end);
      if (!Number.isNaN(d.getTime())) params.end_date = d.toISOString();
    }
    const res = await adminCustomerManagementApi.getCustomersShares(params);
    setLoading(false);
    if (!res.success) {
      const msg = res.message || copy.table.noData;
      setError(msg);
      showError(msg);
      setData(null);
      return;
    }
    setData(res.data || null);
  }, [start, end, showError, copy.table.noData]);

  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    load();
  }, [load]);

  const openDetails = async (customerId?: number) => {
    if (!customerId || customerId <= 0) {
      const msg = copy.modals.detailsNoData;
      setDetailsError(msg);
      setDetailsOpen(true);
      return;
    }
    setDetailsOpen(true);
    setDetails(null);
    setDetailsError(null);
    setDetailsLoading(true);
    const res = await adminCustomerManagementApi.getCustomerWithCampaigns(customerId);
    setDetailsLoading(false);
    if (!res.success) {
      const msg = res.message || copy.modals.detailsNoData;
      setDetailsError(msg);
      showError(msg);
      return;
    }
    setDetails(res.data || null);
  };

  const openCampaign = async (id?: number | null) => {
    if (!id || id <= 0) return;
    setCampaignOpen(true);
    setCampaign(null);
    setCampaignError(null);
    setCampaignLoading(true);
    const res = await adminCustomerManagementApi.getCampaignById(id);
    setCampaignLoading(false);
    if (!res.success) {
      const msg = res.message || copy.table.noData;
      setCampaignError(msg);
      showError(msg);
      return;
    }
    setCampaign(res.data || null);
  };

  const openDiscounts = async (customerId?: number | null) => {
    if (!customerId || customerId <= 0) {
      setDiscountsError(copy.table.noData);
      setDiscountsOpen(true);
      return;
    }
    if (discountsOnceRef.current === customerId && (discountsLoading || discountsItems || discountsError)) {
      setDiscountsOpen(true);
      return;
    }
    discountsOnceRef.current = customerId;
    setDiscountsOpen(true);
    setDiscountsLoading(true);
    setDiscountsError(null);
    setDiscountsItems(null);
    const res = await adminCustomerManagementApi.getCustomerDiscountsHistory(customerId);
    setDiscountsLoading(false);
    if (!res.success) {
      const msg = res.message || copy.discountsTable.noData;
      setDiscountsError(msg);
      return;
    }
    setDiscountsItems(res.data?.items || []);
  };

  const toggleOnceRef = useRef<number | null>(null);
  const [toggleLoadingId, setToggleLoadingId] = useState<number | null>(null);
  const handleToggleActive = async (customerId?: number, current?: boolean | null) => {
    if (!customerId || customerId <= 0) return;
    if (toggleOnceRef.current === customerId && toggleLoadingId === customerId) return;
    toggleOnceRef.current = customerId;
    setToggleLoadingId(customerId);
    const payload: AdminSetCustomerActiveStatusRequest = {
      customer_id: customerId,
      is_active: !(!!current),
    };
    const res = await adminCustomerManagementApi.setCustomerActiveStatus(payload);
    setToggleLoadingId(null);
    if (!res.success) {
      const msg = res.message || copy.table.noData;
      showError(msg);
      return;
    }
    setData((prev) => {
      if (!prev) return prev;
      const items = (prev.items || []).map((row) =>
        row.customer_id === customerId ? { ...row, is_active: res.data?.is_active ?? !current } : row
      );
      return { ...prev, items } as AdminCustomersSharesResponse;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto p-4 space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <button
            className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50"
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
        formatDateTime={formatDateTime}
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
        formatDateTime={formatDateTime}
        formatNumber={formatNumber}
      />

      <DiscountsHistoryModal
        isOpen={discountsOpen}
        loading={discountsLoading}
        error={discountsError}
        items={discountsItems}
        copy={copy}
        onClose={() => setDiscountsOpen(false)}
        formatDateTime={formatDateTime}
        formatNumber={formatNumber}
      />
    </div>
  );
};

export default AdminCustomerManagementPage;
