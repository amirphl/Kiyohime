import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../hooks/useAuth';
import apiService from '../services/api';
import DateObject from 'react-date-object';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import Button from '../components/ui/Button';
import DatePicker from 'react-multi-date-picker';
import gregorian from 'react-date-object/calendars/gregorian';
import gregorian_en from 'react-date-object/locales/gregorian_en';
import TimePicker from 'react-multi-date-picker/plugins/time_picker';
import { useToast } from '../hooks/useToast';

const CustomerManagementPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { accessToken } = useAuth();
  const { showError, showSuccess } = useToast();
  const [items, setItems] = useState<Array<{ first_name: string; last_name: string; company_name: string; total_sent: number; total_agency_share_with_tax: number }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sumTotalSent, setSumTotalSent] = useState<number>(0);
  const [sumTotalShare, setSumTotalShare] = useState<number>(0);
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [nameFilter, setNameFilter] = useState<string>('');
  const [discounts, setDiscounts] = useState<Array<{ customer_id: number; first_name: string; last_name: string; company_name?: string | null; discount_rate: number; created_at: string }>>([]);
  const [discountsLoading, setDiscountsLoading] = useState<boolean>(false);
  const [discountsError, setDiscountsError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [createForCustomerId, setCreateForCustomerId] = useState<number | null>(null);
  const [createCustomerInfo, setCreateCustomerInfo] = useState<{ first_name: string; last_name: string; company_name?: string | null } | null>(null);
  const [newDiscountName, setNewDiscountName] = useState<string>('');
  const [newDiscountRate, setNewDiscountRate] = useState<string>('');
  const [createSubmitting, setCreateSubmitting] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [showGlobalCreateModal, setShowGlobalCreateModal] = useState<boolean>(false);
  const [customers, setCustomers] = useState<Array<{ customer_id: number; first_name: string; last_name: string; company_name?: string | null }>>([]);
  const [globalCustomerId, setGlobalCustomerId] = useState<number | ''>('');
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [historyCustomerId, setHistoryCustomerId] = useState<number | null>(null);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [historyItems, setHistoryItems] = useState<Array<{ discount_rate: number; created_at: string; expires_at?: string | null; total_sent: number; agency_share_with_tax: number }>>([]);
  const initialLoadRef = useRef<boolean>(false);

  const formatDatetime = (iso: string) => {
    try {
      const jsDate = new Date(iso);
      if (language === 'fa') {
        const tehranMs = jsDate.getTime() + 3.5 * 60 * 60 * 1000;
        const tehranDate = new Date(tehranMs);
        const dobj = new DateObject({ date: tehranDate, calendar: persian, locale: persian_fa });
        return dobj.format('YYYY/MM/DD HH:mm:ss');
      }
      return jsDate.toLocaleString(undefined, { hour12: false });
    } catch {
      return iso;
    }
  };

  const fetchReportOnce = async () => {
    setLoading(true);
    setError(null);
    try {
      if (startDate && endDate) {
        const startMs = new Date(startDate).getTime();
        const endMs = new Date(endDate).getTime();
        if (!(endMs > startMs)) {
          const msg = t('agencyReport.invalidRange');
          setError(msg);
          showError(msg);
          return;
        }
      }
      const res = await apiService.getAgencyCustomerReport({ start_date: startDate, end_date: endDate, name: nameFilter || undefined });
      if (res.success && res.data) {
        setItems(res.data.items || []);
        setSumTotalSent(res.data.sum_total_sent || 0);
        setSumTotalShare(res.data.sum_total_agency_share_with_tax || 0);
      } else {
        const msg = res.message || 'Failed to load report';
        setError(msg);
        showError(msg);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Network error';
      setError(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fetchDiscountsOnce = async () => {
    setDiscountsLoading(true);
    setDiscountsError(null);
    try {
      const res = await apiService.listAgencyActiveDiscounts();
      if (res.success && res.data) {
        setDiscounts(res.data.items || []);
      } else {
        const msg = res.message || 'Failed to load discounts';
        setDiscountsError(msg);
        showError(msg);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Network error';
      setDiscountsError(msg);
      showError(msg);
    } finally {
      setDiscountsLoading(false);
    }
  };

  useEffect(() => {
    if (initialLoadRef.current) return;
    if (!accessToken) return;
    apiService.setAccessToken(accessToken);
    initialLoadRef.current = true;
    // Call only once on load
    fetchReportOnce();
    fetchDiscountsOnce();
    // No retries on error per requirement
  }, [accessToken]);

  const currencyLabel = t('wallet.currency');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">{t('dashboard.customerDiscountManagement')}</h2>
            <Button
              variant="primary"
              onClick={async () => {
                setShowGlobalCreateModal(true);
                setCreateError(null);
                setNewDiscountName('');
                setNewDiscountRate('');
                setGlobalCustomerId('');
                try {
                  if (accessToken) apiService.setAccessToken(accessToken);
                  const res = await apiService.listAgencyCustomers();
                  if (res.success && res.data) {
                    setCustomers(res.data.items || []);
                  } else {
                    const msg = res.message || 'Failed to list customers';
                    showError(msg);
                  }
                } catch (e) {
                  const msg = e instanceof Error ? e.message : 'Network error';
                  showError(msg);
                }
              }}
            >
              {t('agencyReport.discountGlobalCreate')}
            </Button>
          </div>
          <br />
          <br />
          <br />
          <div className="mt-2 flex flex-wrap items-end gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                {t('agencyReport.startDate')}
              </label>
              <DatePicker
                calendar={language === 'fa' ? persian : gregorian}
                locale={language === 'fa' ? persian_fa : gregorian_en}
                plugins={[<TimePicker hideSeconds={false} />]}
                value={startDate ? new Date(startDate) : undefined}
                onChange={(val: any) => {
                  if (!val) { setStartDate(undefined); return; }
                  try {
                    const jsDate = val.toDate ? val.toDate() : new Date(val);
                    setStartDate(jsDate.toISOString());
                  } catch {
                    setStartDate(undefined);
                  }
                }}
                format="YYYY/MM/DD HH:mm:ss"
                className="w-full mt-1"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                {t('agencyReport.endDate')}
              </label>
              <DatePicker
                calendar={language === 'fa' ? persian : gregorian}
                locale={language === 'fa' ? persian_fa : gregorian_en}
                plugins={[<TimePicker hideSeconds={false} />]}
                value={endDate ? new Date(endDate) : undefined}
                onChange={(val: any) => {
                  if (!val) { setEndDate(undefined); return; }
                  try {
                    const jsDate = val.toDate ? val.toDate() : new Date(val);
                    setEndDate(jsDate.toISOString());
                  } catch {
                    setEndDate(undefined);
                  }
                }}
                format="YYYY/MM/DD HH:mm:ss"
                className="w-full mt-1"
              />
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-end gap-4">
            <div>
              <label htmlFor="nameFilter" className="block text-sm font-medium text-gray-700 mb-1">
                {t('agencyReport.name')}
              </label>
              <input
                id="nameFilter"
                type="text"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                placeholder={t('agencyReport.namePlaceholder')}
                className="w-56 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-primary-500 mt-1"
              />
            </div>
            <div className="pb-1">
              <Button variant="primary" onClick={fetchReportOnce} disabled={loading}>
                {t('agencyReport.applyFilters')}
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('agencyReport.tableTitle')}</h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{t('agencyReport.firstName')}</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{t('agencyReport.lastName')}</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{t('agencyReport.companyName')}</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{t('agencyReport.totalSent')}</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{t('agencyReport.totalShare')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-600">{t('common.loading')}</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-red-600">{error}</td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500">{t('wallet.table.noTransactions')}</td>
                </tr>
              ) : (
                items.map((it, idx) => (
                  <tr key={`${it.first_name}-${it.last_name}-${idx}`}>
                    <td className="px-4 py-2 text-sm text-gray-900 text-center">{idx + 1}</td>
                    <td className="px-4 py-2 text-sm text-gray-900 text-center">{it.first_name || '-'}</td>
                    <td className="px-4 py-2 text-sm text-gray-900 text-center">{it.last_name || '-'}</td>
                    <td className="px-4 py-2 text-sm text-gray-900 text-center">{it.company_name || '-'}</td>
                    <td className="px-4 py-2 text-sm text-gray-900 text-center">{(it.total_sent || 0).toLocaleString()}</td>
                    <td className="px-4 py-2 text-sm text-gray-900 text-center">{(it.total_agency_share_with_tax || 0).toLocaleString()} {currencyLabel}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <br />

        <div className="mt-4 flex flex-col items-end space-y-2">
          <div className="text-sm text-gray-700">
            <span className="font-medium">{t('agencyReport.totalSentAll')}:</span> {sumTotalSent.toLocaleString()}
          </div>
          <div className="text-sm text-gray-700">
            <span className="font-medium">{t('agencyReport.totalShareAll')}:</span> {sumTotalShare.toLocaleString()} {currencyLabel}
          </div>
        </div>

        {/* Active Discounts Section */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('agencyReport.discountsTitle')}</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{t('agencyReport.discountCustomer')}</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{t('agencyReport.companyName')}</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{t('agencyReport.discountRate')}</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{t('agencyReport.discountCreatedAt')}</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{t('agencyReport.discountCreateAction')}</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{t('agencyReport.discountHistoryAction')}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {discountsLoading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-gray-600">{t('common.loading')}</td>
                  </tr>
                ) : discountsError ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-red-600">{discountsError}</td>
                  </tr>
                ) : discounts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-gray-500">{t('wallet.table.noTransactions')}</td>
                  </tr>
                ) : (
                  discounts.map((d, idx) => (
                    <tr key={`${d.customer_id}-${idx}`}>
                      <td className="px-4 py-2 text-sm text-gray-900 text-center">{idx + 1}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-center">{`${d.first_name || ''} ${d.last_name || ''}`.trim() || '-'}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-center">{d.company_name ?? ''}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-center">{d.discount_rate.toFixed(2)}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-center">{formatDatetime(d.created_at)}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-center">
                        <Button
                          variant="outline"
                          onClick={() => { setCreateForCustomerId(d.customer_id); setCreateCustomerInfo({ first_name: d.first_name, last_name: d.last_name, company_name: d.company_name }); setNewDiscountName(''); setNewDiscountRate(''); setCreateError(null); setShowCreateModal(true); }}
                        >
                          {t('agencyReport.discountCreateAction')}
                        </Button>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-center">
                        <Button
                          variant="outline"
                          onClick={async () => {
                            setHistoryCustomerId(d.customer_id);
                            setHistoryItems([]);
                            setHistoryError(null);
                            setShowHistoryModal(true);
                            setHistoryLoading(true);
                            try {
                              if (accessToken) apiService.setAccessToken(accessToken);
                              const res = await apiService.listAgencyCustomerDiscounts(d.customer_id);
                              if (res.success && res.data) {
                                setHistoryItems(res.data.items || []);
                              } else {
                                const msg = res.message || 'Failed to load history';
                                setHistoryError(msg);
                                showError(msg);
                              }
                            } catch (e) {
                              const msg = e instanceof Error ? e.message : 'Network error';
                              setHistoryError(msg);
                              showError(msg);
                            } finally {
                              setHistoryLoading(false);
                            }
                          }}
                        >
                          {t('agencyReport.discountHistoryAction')}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Discount Modal */}
        {(showCreateModal || showGlobalCreateModal) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">{t('agencyReport.discountCreateTitle')}</h4>
              {createError && <div className="text-red-600 mb-2 text-sm">{createError}</div>}
              <div className="space-y-4">
                {showGlobalCreateModal && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('agencyReport.discountSelectCustomer')}</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-primary-500"
                      value={globalCustomerId}
                      onChange={(e) => setGlobalCustomerId(e.target.value ? parseInt(e.target.value, 10) : '')}
                    >
                      <option value="">--</option>
                      {customers.map(c => (
                        <option key={c.customer_id} value={c.customer_id}>
                          {`${c.first_name || ''} ${c.last_name || ''}`.trim()} {c.company_name ? `- ${c.company_name}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {!showGlobalCreateModal && createCustomerInfo && (
                  <div className="p-3 bg-gray-50 rounded border text-sm text-gray-700">
                    <div>
                      <span className="font-medium">{t('agencyReport.discountCustomer')}:</span> {`${createCustomerInfo.first_name || ''} ${createCustomerInfo.last_name || ''}`.trim()}
                    </div>
                    <div>
                      <span className="font-medium">{t('agencyReport.companyName')}:</span> {createCustomerInfo.company_name ?? ''}
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('agencyReport.discountName')}</label>
                  <input
                    type="text"
                    value={newDiscountName}
                    onChange={(e) => setNewDiscountName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('agencyReport.discountRateLabel')}</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newDiscountRate}
                    onChange={(e) => setNewDiscountRate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-primary-500"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => { setShowCreateModal(false); setShowGlobalCreateModal(false); }} disabled={createSubmitting}>
                    {t('agencyReport.discountCancel')}
                  </Button>
                  <Button
                    variant="primary"
                    disabled={(() => {
                      const rateNum = parseFloat(newDiscountRate);
                      const isValidRate = !Number.isNaN(rateNum) && rateNum > 0 && rateNum < 0.5;
                      const hasName = newDiscountName.trim().length > 0;
                      const hasCustomer = showGlobalCreateModal ? (typeof globalCustomerId === 'number') : (createForCustomerId !== null);
                      return createSubmitting || !isValidRate || !hasName || !hasCustomer;
                    })()}
                    onClick={async () => {
                      setCreateError(null);
                      const rateNum = parseFloat(newDiscountRate);
                      if (!newDiscountName.trim()) {
                        const msg = t('agencyReport.discountNameRequired');
                        setCreateError(msg);
                        showError(msg);
                        return;
                      }
                      if (!(rateNum > 0 && rateNum < 0.5)) {
                        const msg = t('agencyReport.discountRateInvalid');
                        setCreateError(msg);
                        showError(msg);
                        return;
                      }
                      setCreateSubmitting(true);
                      try {
                        // Ensure token attached
                        if (accessToken) apiService.setAccessToken(accessToken);
                        const targetCustomerId = showGlobalCreateModal ? (typeof globalCustomerId === 'number' ? globalCustomerId : null) : createForCustomerId;
                        if (targetCustomerId === null) {
                          const msg = 'Missing customer id';
                          setCreateError(msg);
                          showError(msg);
                          return;
                        }
                        const res = await apiService.createAgencyDiscount({ customer_id: targetCustomerId, name: newDiscountName.trim(), discount_rate: rateNum });
                        if (res.success) {
                          showSuccess(res.message || t('agencyReport.discountCreate'));
                          setShowCreateModal(false);
                          setShowGlobalCreateModal(false);
                          // Refresh discounts list (single reload, no retry logic)
                          await fetchDiscountsOnce();
                        } else {
                          const msg = res.message || 'Failed to create';
                          setCreateError(msg);
                          showError(msg);
                        }
                      } catch (e) {
                        const msg = e instanceof Error ? e.message : 'Network error';
                        setCreateError(msg);
                        showError(msg);
                      } finally {
                        setCreateSubmitting(false);
                      }
                    }}
                  >
                    {t('agencyReport.discountCreate')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History Modal */}
        {showHistoryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-gray-900">{t('agencyReport.discountHistoryTitle')}</h4>
                <Button variant="outline" onClick={() => setShowHistoryModal(false)}>{t('common.close')}</Button>
              </div>
              {historyLoading ? (
                <div className="text-center text-gray-600 py-8">{t('common.loading')}</div>
              ) : historyError ? (
                <div className="text-center text-red-600 py-8">{historyError}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{t('agencyReport.discountRate')}</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{t('agencyReport.totalSent')}</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{t('agencyReport.totalShare')}</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{t('wallet.table.createdAt') || 'Created At'}</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{t('agencyReport.discountExpiresAt')}</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {historyItems.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-6 text-center text-gray-500">{t('wallet.table.noTransactions')}</td>
                        </tr>
                      ) : (
                        historyItems.map((h, idx) => (
                          <tr key={`${idx}-${h.created_at}`}>
                            <td className="px-4 py-2 text-sm text-gray-900 text-center">{idx + 1}</td>
                            <td className="px-4 py-2 text-sm text-gray-900 text-center">{h.discount_rate.toFixed(2)}</td>
                            <td className="px-4 py-2 text-sm text-gray-900 text-center">{h.total_sent.toLocaleString()}</td>
                            <td className="px-4 py-2 text-sm text-gray-900 text-center">{h.agency_share_with_tax.toLocaleString()}</td>
                            <td className="px-4 py-2 text-sm text-gray-900 text-center">{formatDatetime(h.created_at)}</td>
                            <td className="px-4 py-2 text-sm text-gray-900 text-center">{h.expires_at ? formatDatetime(h.expires_at) : '-'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerManagementPage; 