import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../locales/translations';
import { useToast } from '../hooks/useToast';
import adminApi from '../services/adminApi';
import { useNavigation } from '../contexts/NavigationContext';
import { ROUTES } from '../config/routes';
import { AdminCustomersSharesResponse, AdminCustomerWithCampaignsResponse, AdminGetCampaignResponse } from '../types/admin';

const AdminCustomerManagementPage: React.FC = () => {
  const { language } = useLanguage();
  const t = useMemo(() => translations[language], [language]);
  const { showError } = useToast();
  const { navigate } = useNavigation();
  const didInitRef = useRef(false);

  const [start, setStart] = useState<string>('');
  const [end, setEnd] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AdminCustomersSharesResponse | null>(null);

  // Top-half modal state (details)
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [details, setDetails] = useState<AdminCustomerWithCampaignsResponse | null>(null);

  // Bottom-half modal state (campaign details)
  const [campaignOpen, setCampaignOpen] = useState(false);
  const [campaignLoading, setCampaignLoading] = useState(false);
  const [campaignError, setCampaignError] = useState<string | null>(null);
  const [campaign, setCampaign] = useState<AdminGetCampaignResponse | null>(null);

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
    const res = await adminApi.getCustomersShares(params);
    setLoading(false);
    if (!res.success) {
      const msg = res.message || (language === 'fa' ? 'دریافت گزارش ناموفق بود' : 'Failed to retrieve report');
      setError(msg);
      showError(msg);
      setData(null);
      return;
    }
    setData(res.data || null);
  }, [start, end, showError, language]);

  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatNumber = (n?: number | null) => (typeof n === 'number' ? n.toLocaleString() : '-');
  const toPct = (v?: number | null) => (typeof v === 'number' ? `${(v * 100).toFixed(2)}%` : '-');

  const openDetails = async (customerId?: number) => {
    if (!customerId || customerId <= 0) {
      setDetailsError(t.adminCustomers?.detailsModal?.errors?.noCustomerId || 'Customer id not available');
      setDetailsOpen(true);
      return;
    }
    setDetailsOpen(true);
    setDetails(null);
    setDetailsError(null);
    setDetailsLoading(true);
    const res = await adminApi.getCustomerWithCampaigns(customerId);
    setDetailsLoading(false);
    if (!res.success) {
      const msg = res.message || (t.adminCustomers?.detailsModal?.errors?.loadFailed || 'Failed to retrieve customer details');
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
    const res = await adminApi.getCampaignById(id);
    setCampaignLoading(false);
    if (!res.success) {
      const msg = res.message || 'Failed to get campaign';
      setCampaignError(msg);
      showError(msg);
      return;
    }
    setCampaign(res.data || null);
  };

  return (
    <div className="p-4 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">{t.adminCustomers?.title || 'Customer Management'}</h1>
        <button
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded"
          onClick={() => navigate(ROUTES.ADMIN_SARDIS.path)}
        >
          {t.adminCommon?.backToSardis || 'Back to Sardis'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t.adminCustomers?.filters?.startDate || 'Start Date'}</label>
          <input
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t.adminCustomers?.filters?.endDate || 'End Date'}</label>
          <input
            type="datetime-local"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="flex items-end">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={load}
            disabled={loading}
          >
            {loading ? (t.common?.loading || 'Loading...') : (t.adminCustomers?.filters?.apply || 'Apply')}
          </button>
        </div>
      </div>

      {error && (
        <div className="text-red-600 mb-4">{error}</div>
      )}

      <div className="overflow-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="border px-2 py-2">#</th>
              <th className="border px-2 py-2">{t.adminCustomers?.table?.headers?.customerName || 'Customer Name'}</th>
              <th className="border px-2 py-2">{t.adminCustomers?.table?.headers?.representativeName || 'Representative Name'}</th>
              <th className="border px-2 py-2">{t.adminCustomers?.table?.headers?.agencyName || 'Agency Name'}</th>
              <th className="border px-2 py-2">{t.adminCustomers?.table?.headers?.totalSent || 'Total Sent'}</th>
              <th className="border px-2 py-2">{t.adminCustomers?.table?.headers?.clickRate || 'Click Rate'}</th>
              <th className="border px-2 py-2">{t.adminCustomers?.table?.headers?.agencyIncome || 'Agency Income'}</th>
              <th className="border px-2 py-2">{t.adminCustomers?.table?.headers?.systemIncome || 'System Income'}</th>
              <th className="border px-2 py-2">{t.adminCustomers?.table?.headers?.tax || 'Tax'}</th>
              <th className="border px-2 py-2">{t.adminCustomers?.table?.headers?.details || 'Details'}</th>
              <th className="border px-2 py-2">{t.adminCustomers?.table?.headers?.discounts || 'Discounts'}</th>
            </tr>
          </thead>
          <tbody>
            {!loading && (error || !data?.items?.length) ? (
              <tr>
                <td colSpan={11} className="text-center py-6">{error ? error : (t.adminCampaigns?.table?.noData || 'No data')}</td>
              </tr>
            ) : (data?.items || []).map((it, idx) => (
              <tr key={`${it.full_name}-${idx}`} className="odd:bg-white even:bg-gray-50">
                <td className="border px-2 py-2 text-center">{idx + 1}</td>
                <td className="border px-2 py-2">{it.company_name}</td>
                <td className="border px-2 py-2">{it.full_name || `${it.first_name} ${it.last_name}`.trim()}</td>
                <td className="border px-2 py-2">{it.referrer_agency_name}</td>
                <td className="border px-2 py-2 text-right">{formatNumber(it.total_sent)}</td>
                <td className="border px-2 py-2 text-right">{toPct(it.click_rate)}</td>
                <td className="border px-2 py-2 text-right">{formatNumber(it.agency_share_with_tax)}</td>
                <td className="border px-2 py-2 text-right">{formatNumber(it.system_share)}</td>
                <td className="border px-2 py-2 text-right">{formatNumber(it.tax_share)}</td>
                <td className="border px-2 py-2 text-center">
                  <button
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                    onClick={() => openDetails(it.customer_id || 0)}
                  >
                    {t.adminCustomers?.actions?.view || 'View'}
                  </button>
                </td>
                <td className="border px-2 py-2 text-center">
                  <button
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                    disabled
                    title={t.common?.comingSoon || 'Coming soon'}
                  >
                    {t.adminCustomers?.actions?.show || 'Show'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="border rounded p-3">
          <div className="text-xs text-gray-500">{t.adminCustomers?.totals?.agencyIncome || 'Sum Agency Income'}</div>
          <div className="text-lg font-semibold">{formatNumber(data?.sum_agency_share_with_tax)}</div>
        </div>
        <div className="border rounded p-3">
          <div className="text-xs text-gray-500">{t.adminCustomers?.totals?.systemIncome || 'Sum System Income'}</div>
          <div className="text-lg font-semibold">{formatNumber(data?.sum_system_share)}</div>
        </div>
        <div className="border rounded p-3">
          <div className="text-xs text-gray-500">{t.adminCustomers?.totals?.tax || 'Sum Tax'}</div>
          <div className="text-lg font-semibold">{formatNumber(data?.sum_tax_share)}</div>
        </div>
        <div className="border rounded p-3">
          <div className="text-xs text-gray-500">{t.adminCustomers?.totals?.totalSent || 'Sum Total Sent'}</div>
          <div className="text-lg font-semibold">{formatNumber(data?.sum_total_sent)}</div>
        </div>
      </div>

      {detailsOpen && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-black/50 pointer-events-auto">
            <div className="h-full flex items-start justify-center p-4">
              <div className="w-full max-w-5xl h-full bg-white rounded-xl shadow-2xl border overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                  <h2 className="text-lg font-semibold">{t.adminCustomers?.detailsModal?.title || 'Customer Details'}</h2>
                  <button className="text-gray-500 hover:text-gray-700" onClick={() => { setDetailsOpen(false); setCampaignOpen(false); }}>✕</button>
                </div>
                <div className="p-4 overflow-auto h-[calc(100%-56px)]">
                  {detailsLoading && <div className="text-sm text-gray-500">{t.common?.loading || 'Loading...'}</div>}
                  {detailsError && !detailsLoading && (
                    <div className="text-sm text-red-600">{detailsError}</div>
                  )}
                  {!detailsLoading && !detailsError && details && (
                    <div className="space-y-6">
                      {/* Customer fields grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div><div className="text-xs text-gray-500">{t.adminCustomers?.detailsModal?.fields?.id || 'ID'}</div><div className="font-medium">{details.customer.id}</div></div>
                        <div><div className="text-xs text-gray-500">{t.adminCustomers?.detailsModal?.fields?.uuid || 'UUID'}</div><div className="font-medium">{details.customer.uuid}</div></div>
                        <div><div className="text-xs text-gray-500">{t.adminCustomers?.detailsModal?.fields?.agencyRefererCode || 'Agency Referrer Code'}</div><div className="font-medium">{details.customer.agency_referer_code}</div></div>
                        <div><div className="text-xs text-gray-500">{t.adminCustomers?.detailsModal?.fields?.accountTypeId || 'Account Type ID'}</div><div className="font-medium">{details.customer.account_type_id}</div></div>
                        <div><div className="text-xs text-gray-500">{t.adminCustomers?.detailsModal?.fields?.accountType || 'Account Type'}</div><div className="font-medium">{details.customer.account_type_name}</div></div>
                        <div><div className="text-xs text-gray-500">{t.adminCustomers?.detailsModal?.fields?.company || 'Company'}</div><div className="font-medium">{details.customer.company_name || '-'}</div></div>
                        <div><div className="text-xs text-gray-500">{t.adminCustomers?.detailsModal?.fields?.nationalId || 'National ID'}</div><div className="font-medium">{details.customer.national_id || '-'}</div></div>
                        <div><div className="text-xs text-gray-500">{t.adminCustomers?.detailsModal?.fields?.companyPhone || 'Company Phone'}</div><div className="font-medium">{details.customer.company_phone || '-'}</div></div>
                        <div><div className="text-xs text-gray-500">{t.adminCustomers?.detailsModal?.fields?.companyAddress || 'Company Address'}</div><div className="font-medium">{details.customer.company_address || '-'}</div></div>
                        <div><div className="text-xs text-gray-500">{t.adminCustomers?.detailsModal?.fields?.postalCode || 'Postal Code'}</div><div className="font-medium">{details.customer.postal_code || '-'}</div></div>
                        <div><div className="text-xs text-gray-500">{t.adminCustomers?.detailsModal?.fields?.representativeFirstName || 'Representative First Name'}</div><div className="font-medium">{details.customer.representative_first_name}</div></div>
                        <div><div className="text-xs text-gray-500">{t.adminCustomers?.detailsModal?.fields?.representativeLastName || 'Representative Last Name'}</div><div className="font-medium">{details.customer.representative_last_name}</div></div>
                        <div><div className="text-xs text-gray-500">{t.adminCustomers?.detailsModal?.fields?.mobile || 'Mobile'}</div><div className="font-medium">{details.customer.representative_mobile}</div></div>
                        <div><div className="text-xs text-gray-500">{t.adminCustomers?.detailsModal?.fields?.email || 'Email'}</div><div className="font-medium">{details.customer.email}</div></div>
                        <div><div className="text-xs text-gray-500">{t.adminCustomers?.detailsModal?.fields?.shebaNumber || 'Sheba Number'}</div><div className="font-medium">{details.customer.sheba_number || '-'}</div></div>
                        <div><div className="text-xs text-gray-500">{t.adminCustomers?.detailsModal?.fields?.referrerAgencyId || 'Referrer Agency ID'}</div><div className="font-medium">{typeof details.customer.referrer_agency_id === 'number' ? details.customer.referrer_agency_id : '-'}</div></div>
                        <div><div className="text-xs text-gray-500">{t.adminCustomers?.detailsModal?.fields?.isEmailVerified || 'Email Verified'}</div><div className="font-medium">{details.customer.is_email_verified ? 'Yes' : 'No'}</div></div>
                        <div><div className="text-xs text-gray-500">{t.adminCustomers?.detailsModal?.fields?.isMobileVerified || 'Mobile Verified'}</div><div className="font-medium">{details.customer.is_mobile_verified ? 'Yes' : 'No'}</div></div>
                        <div><div className="text-xs text-gray-500">{t.adminCustomers?.detailsModal?.fields?.isActive || 'Active'}</div><div className="font-medium">{details.customer.is_active ? 'Yes' : 'No'}</div></div>
                        <div><div className="text-xs text-gray-500">{t.adminCustomers?.detailsModal?.fields?.createdAt || 'Created At'}</div><div className="font-medium">{new Date(details.customer.created_at).toLocaleString()}</div></div>
                        <div><div className="text-xs text-gray-500">{t.adminCustomers?.detailsModal?.fields?.updatedAt || 'Updated At'}</div><div className="font-medium">{details.customer.updated_at ? new Date(details.customer.updated_at).toLocaleString() : '-'}</div></div>
                        <div><div className="text-xs text-gray-500">{t.adminCustomers?.detailsModal?.fields?.emailVerifiedAt || 'Email Verified At'}</div><div className="font-medium">{details.customer.email_verified_at ? new Date(details.customer.email_verified_at).toLocaleString() : '-'}</div></div>
                        <div><div className="text-xs text-gray-500">{t.adminCustomers?.detailsModal?.fields?.mobileVerifiedAt || 'Mobile Verified At'}</div><div className="font-medium">{details.customer.mobile_verified_at ? new Date(details.customer.mobile_verified_at).toLocaleString() : '-'}</div></div>
                        <div><div className="text-xs text-gray-500">{t.adminCustomers?.detailsModal?.fields?.lastLoginAt || 'Last Login At'}</div><div className="font-medium">{details.customer.last_login_at ? new Date(details.customer.last_login_at).toLocaleString() : '-'}</div></div>
                      </div>

                      {/* Campaigns section title */}
                      <div className="mt-4 text-lg font-semibold">{t.adminCustomers?.detailsModal?.campaignsTable?.titleSection || 'Campaigns'}</div>

                      {/* Campaigns table */}
                      <div className="mt-2 overflow-auto">
                        <table className="min-w-full border text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="border px-2 py-2">#</th>
                              <th className="border px-2 py-2">{t.adminCustomers?.detailsModal?.campaignsTable?.title || 'Title'}</th>
                              <th className="border px-2 py-2">{t.adminCustomers?.detailsModal?.campaignsTable?.created || 'Created'}</th>
                              <th className="border px-2 py-2">{t.adminCustomers?.detailsModal?.campaignsTable?.schedule || 'Schedule'}</th>
                              <th className="border px-2 py-2">{t.adminCustomers?.detailsModal?.campaignsTable?.status || 'Status'}</th>
                              <th className="border px-2 py-2">{t.adminCustomers?.detailsModal?.campaignsTable?.sent || 'Sent'}</th>
                              <th className="border px-2 py-2">{t.adminCustomers?.detailsModal?.campaignsTable?.delivered || 'Delivered'}</th>
                              <th className="border px-2 py-2">{t.adminCustomers?.detailsModal?.campaignsTable?.clickRate || 'Click Rate'}</th>
                              <th className="border px-2 py-2">{t.adminCustomers?.detailsModal?.campaignsTable?.details || 'Details'}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {details.campaigns.length === 0 ? (
                              <tr><td colSpan={9} className="text-center py-4">{t.adminCustomers?.detailsModal?.campaignsTable?.noData || 'No data'}</td></tr>
                            ) : details.campaigns.map((c, idx) => (
                              <tr key={`${c.title || 'untitled'}-${idx}`} className="odd:bg-white even:bg-gray-50">
                                <td className="border px-2 py-2 text-center">{idx + 1}</td>
                                <td className="border px-2 py-2">{c.title || '-'}</td>
                                <td className="border px-2 py-2">{new Date(c.created_at).toLocaleString()}</td>
                                <td className="border px-2 py-2">{c.schedule_at ? new Date(c.schedule_at).toLocaleString() : '-'}</td>
                                <td className="border px-2 py-2">{c.status}</td>
                                <td className="border px-2 py-2 text-right">{(typeof c.total_sent === 'number') ? c.total_sent.toLocaleString() : '-'}</td>
                                <td className="border px-2 py-2 text-right">{(typeof c.total_delivered === 'number') ? c.total_delivered.toLocaleString() : '-'}</td>
                                <td className="border px-2 py-2 text-right">{(typeof c.click_rate === 'number') ? `${(c.click_rate * 100).toFixed(2)}%` : '-'}</td>
                                <td className="border px-2 py-2 text-center">
                                  <button
                                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                                    onClick={() => openCampaign(c.campaign_id || 0)}
                                  >
                                    {t.adminCustomers?.actions?.view || 'View'}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {campaignOpen && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-black/50 pointer-events-auto">
            <div className="h-full flex items-end justify-center p-4">
              <div className="w-full max-w-5xl h-full bg-white rounded-xl shadow-2xl border overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                  <h2 className="text-lg font-semibold">{t.adminCustomers?.campaignDetails?.title || 'Campaign Details'}</h2>
                  <button className="text-gray-500 hover:text-gray-700" onClick={() => setCampaignOpen(false)}>✕</button>
                </div>
                <div className="p-4 overflow-auto h-[calc(100%-56px)]">
                  {campaignLoading && <div className="text-sm text-gray-500">{t.common?.loading || 'Loading...'}</div>}
                  {campaignError && !campaignLoading && (
                    <div className="text-sm text-red-600">{campaignError}</div>
                  )}
                  {!campaignLoading && !campaignError && campaign && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div><div className="text-xs text-gray-500">{t.adminCustomers?.campaignDetails?.fields?.id || 'ID'}</div><div className="font-medium">{campaign.id}</div></div>
                      <div><div className="text-xs text-gray-500">{t.adminCustomers?.campaignDetails?.fields?.uuid || 'UUID'}</div><div className="font-medium">{campaign.uuid}</div></div>
                      <div><div className="text-xs text-gray-500">{t.adminCustomers?.campaignDetails?.fields?.status || 'Status'}</div><div className="font-medium">{campaign.status}</div></div>
                      <div><div className="text-xs text-gray-500">{t.adminCustomers?.campaignDetails?.fields?.created || 'Created'}</div><div className="font-medium">{new Date(campaign.created_at).toLocaleString()}</div></div>
                      <div><div className="text-xs text-gray-500">{t.adminCustomers?.campaignDetails?.fields?.updated || 'Updated'}</div><div className="font-medium">{campaign.updated_at ? new Date(campaign.updated_at).toLocaleString() : '-'}</div></div>
                      <div><div className="text-xs text-gray-500">{t.adminCustomers?.campaignDetails?.fields?.title || 'Title'}</div><div className="font-medium">{campaign.title || '-'}</div></div>
                      <div><div className="text-xs text-gray-500">{t.adminCustomers?.campaignDetails?.fields?.segment || 'Segment'}</div><div className="font-medium">{campaign.segment || '-'}</div></div>
                      <div><div className="text-xs text-gray-500">{t.adminCustomers?.campaignDetails?.fields?.subsegment || 'Subsegment'}</div><div className="font-medium">{Array.isArray(campaign.subsegment) && campaign.subsegment.length ? campaign.subsegment.join(', ') : '-'}</div></div>
                      <div><div className="text-xs text-gray-500">{t.adminCustomers?.campaignDetails?.fields?.sex || 'Sex'}</div><div className="font-medium">{campaign.sex || '-'}</div></div>
                      <div><div className="text-xs text-gray-500">{t.adminCustomers?.campaignDetails?.fields?.cities || 'Cities'}</div><div className="font-medium">{Array.isArray(campaign.city) && campaign.city.length ? campaign.city.join(', ') : '-'}</div></div>
                      <div><div className="text-xs text-gray-500">{t.adminCustomers?.campaignDetails?.fields?.adLink || 'Ad Link'}</div><div className="font-medium break-all">{campaign.adlink || '-'}</div></div>
                      <div><div className="text-xs text-gray-500">{t.adminCustomers?.campaignDetails?.fields?.content || 'Content'}</div><div className="font-medium break-all">{campaign.content || '-'}</div></div>
                      <div><div className="text-xs text-gray-500">{t.adminCustomers?.campaignDetails?.fields?.schedule || 'Schedule'}</div><div className="font-medium">{campaign.scheduleat ? new Date(campaign.scheduleat).toLocaleString() : '-'}</div></div>
                      <div><div className="text-xs text-gray-500">{t.adminCustomers?.campaignDetails?.fields?.lineNumber || 'Line Number'}</div><div className="font-medium">{campaign.line_number || '-'}</div></div>
                      <div><div className="text-xs text-gray-500">{t.adminCustomers?.campaignDetails?.fields?.budget || 'Budget'}</div><div className="font-medium">{typeof campaign.budget === 'number' ? campaign.budget.toLocaleString() : '-'}</div></div>
                      <div><div className="text-xs text-gray-500">{t.adminCustomers?.campaignDetails?.fields?.comment || 'Comment'}</div><div className="font-medium break-all">{campaign.comment || '-'}</div></div>
                      <div><div className="text-xs text-gray-500">{t.adminCustomers?.campaignDetails?.fields?.segmentPriceFactor || 'Segment Price Factor'}</div><div className="font-medium">{typeof campaign.segment_price_factor === 'number' ? campaign.segment_price_factor : '-'}</div></div>
                      <div><div className="text-xs text-gray-500">{t.adminCustomers?.campaignDetails?.fields?.lineNumberPriceFactor || 'Line Number Price Factor'}</div><div className="font-medium">{typeof campaign.line_number_price_factor === 'number' ? campaign.line_number_price_factor : '-'}</div></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomerManagementPage; 