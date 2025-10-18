import React, { useState } from 'react';
import { Wallet, ArrowLeft } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../hooks/useLanguage';
import DateObject from 'react-date-object';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import Button from '../components/ui/Button';
import ConfirmationModal from '../components/ConfirmationModal';
import apiService from '../services/api';
import { useEffect, useRef, useCallback } from 'react';
import { TransactionHistoryItem, TransactionHistoryResponse } from '../types/payments';
import { useAuth } from '../hooks/useAuth';

const WalletPage: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL, language } = useLanguage();
  const currencyLabel = t('wallet.currency');
  const { accessToken } = useAuth();
  const [chargeAmount, setChargeAmount] = useState<number | ''>('');
  const [error, setError] = useState<string>('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSubmitting, setPaymentSubmitting] = useState<boolean>(false);
  const [historyItems, setHistoryItems] = useState<TransactionHistoryItem[]>([]);
  const [historyPage, setHistoryPage] = useState<number>(1);
  const [historyHasNext, setHistoryHasNext] = useState<boolean>(false);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const initialHistoryLoadRef = useRef<boolean>(false);
  const isFetchingHistoryRef = useRef<boolean>(false);
  const [balanceFree, setBalanceFree] = useState<number | null>(null);
  const [balanceLocked, setBalanceLocked] = useState<number | null>(null);
  const [balanceReserved, setBalanceReserved] = useState<number | null>(null);
  const [balanceCredit, setBalanceCredit] = useState<number | null>(null);
  const [balanceTotal, setBalanceTotal] = useState<number | null>(null);
  const [balanceLastUpdated, setBalanceLastUpdated] = useState<string | null>(null);
  const [loadingBalance, setLoadingBalance] = useState<boolean>(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const initialBalanceLoadRef = useRef<boolean>(false);

  const recommendedAmounts = [5000000, 10000000, 15000000, 30000000, 50000000, 100000000];

  const handleChargeAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setChargeAmount('');
      setError('');
      return;
    }

    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) {
      setError(t('wallet.errorInvalidNumber'));
      return;
    }

    if (numValue < 1000) {
      setError(t('wallet.errorMinAmount'));
    } else if (numValue % 1000 !== 0) {
      setError(t('wallet.errorMultipleOf'));
    } else {
      setError('');
    }

    setChargeAmount(numValue);
  };

  const handleRecommendedAmountClick = (amount: number) => {
    setChargeAmount(amount);
    setError('');
  };

  const handlePayClick = () => {
    if (!error && chargeAmount !== '') {
      setShowPaymentModal(true);
    }
  };

  const handlePaymentContinue = async () => {
    if (chargeAmount === '' || error) return;
    if (paymentSubmitting) return;
    setPaymentSubmitting(true);
    try {
      const baseAmount = Number(chargeAmount);
      const tax = Math.round(baseAmount * 0.1);
      const amountWithTax = baseAmount + tax;
      const resp = await apiService.startWalletCharge(amountWithTax);
      if (resp.success && resp.data && (resp.data as any).token) {
        const token = (resp.data as any).token;
        // Build and submit a form to Atipay
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://mipg.atipay.net/v1/redirect-to-gateway';
        form.style.display = 'none';
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'token';
        input.value = token;
        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
      } else {
        setShowPaymentModal(false);
        setError(resp.message || 'Failed to start payment');
      }
    } catch (e) {
      setShowPaymentModal(false);
      setError(e instanceof Error ? e.message : 'Network error');
    } finally {
      setPaymentSubmitting(false);
    }
  };

  const fetchHistory = useCallback(async (page: number) => {
    if (isFetchingHistoryRef.current) return;
    isFetchingHistoryRef.current = true;
    setLoadingHistory(true);
    setHistoryError(null);
    try {
      const resp = await apiService.getPaymentHistory({ page, page_size: 20 });
      if (resp.success && resp.data) {
        const data = resp.data as TransactionHistoryResponse;
        setHistoryItems(data.items);
        setHistoryHasNext(data.pagination.has_next);
      } else {
        setHistoryError(resp.message || 'Failed to load history');
      }
    } catch (e) {
      setHistoryError(e instanceof Error ? e.message : 'Network error');
    } finally {
      setLoadingHistory(false);
      isFetchingHistoryRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (initialHistoryLoadRef.current) return;
    if (!accessToken) return;
    // Ensure apiService has the token before the first request (handles hard refresh race)
    apiService.setAccessToken(accessToken);
    initialHistoryLoadRef.current = true;
    fetchHistory(1);
  }, [fetchHistory, accessToken]);

  useEffect(() => {
    if (initialBalanceLoadRef.current) return;
    if (!accessToken) return;
    apiService.setAccessToken(accessToken);
    initialBalanceLoadRef.current = true;
    const getBalance = async () => {
      setLoadingBalance(true);
      setBalanceError(null);
      try {
        const resp = await apiService.getWalletBalance();
        if (resp.success && resp.data) {
          setBalanceFree(resp.data.free);
          setBalanceLocked(resp.data.locked);
          // Map frozen to reserved for UI per spec
          setBalanceReserved(resp.data.frozen);
          setBalanceCredit((resp.data as any).credit ?? 0);
          setBalanceTotal(resp.data.total ?? ((resp.data.free ?? 0) + (resp.data.locked ?? 0) + (resp.data.frozen ?? 0)));
          setBalanceLastUpdated(resp.data.last_updated || null);
        } else {
          setBalanceError(resp.message || 'Failed to load balance');
        }
      } catch (e) {
        setBalanceError(e instanceof Error ? e.message : 'Network error');
      } finally {
        setLoadingBalance(false);
      }
    };
    getBalance();
  }, [accessToken]);

  const formatDatetime = (iso: string) => {
    try {
      const jsDate = new Date(iso);
      if (language === 'fa') {
        // Convert to Tehran time and format in Shamsi (Jalali)
        const tehranMs = jsDate.getTime() + 3.5 * 60 * 60 * 1000;
        const tehranDate = new Date(tehranMs);
        const dobj = new DateObject({ date: tehranDate, calendar: persian, locale: persian_fa });
        return dobj.format('YYYY/MM/DD HH:mm:ss');
      }
      // For EN: use visitor local system time
      return jsDate.toLocaleString(undefined, { hour12: false });
    } catch {
      return iso;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => window.location.href = '/dashboard'}
                className={`flex items-center text-gray-600 hover:text-gray-900 transition-colors ${
                  isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'
                }`}
              >
                <ArrowLeft className="h-5 w-5" />
                <span>{t('dashboard.title')}</span>
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900 flex items-center">
                <Wallet className="h-6 w-6 mr-2 text-red-600" />
                {t('wallet.title')}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="space-y-6">
            {/* Balance Section */}
            <div className="space-y-2">
              <h2 className="text-lg font-medium text-gray-900">{t('wallet.currentBalance')}</h2>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">{t('wallet.free')}</p>
                  <p className="text-xl font-semibold">{loadingBalance && balanceFree === null ? t('common.loading') : `${(balanceFree ?? 0).toLocaleString()} ${currencyLabel}`}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">{t('wallet.locked')}</p>
                  <p className="text-xl font-semibold">{loadingBalance && balanceLocked === null ? t('common.loading') : `${(balanceLocked ?? 0).toLocaleString()} ${currencyLabel}`}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">{t('wallet.reserved')}</p>
                  <p className="text-xl font-semibold">{loadingBalance && balanceReserved === null ? t('common.loading') : `${(balanceReserved ?? 0).toLocaleString()} ${currencyLabel}`}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">{t('wallet.credit') || 'Credit'}</p>
                  <p className="text-xl font-semibold">{loadingBalance && balanceCredit === null ? t('common.loading') : `${(balanceCredit ?? 0).toLocaleString()} ${currencyLabel}`}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">{t('wallet.total') || 'Total'}</p>
                  <p className="text-xl font-semibold">{loadingBalance && balanceTotal === null ? t('common.loading') : `${(balanceTotal ?? 0).toLocaleString()} ${currencyLabel}`}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">{t('wallet.lastUpdated') || 'Last Updated'}</p>
                  <p className="text-sm font-medium text-gray-700">{balanceLastUpdated ? formatDatetime(balanceLastUpdated) : '-'}</p>
                </div>
              </div>
              {balanceError && (
                <p className="text-sm text-red-600">{balanceError}</p>
              )}
            </div>

            {/* Charge Wallet Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">{t('wallet.chargeTitle')}</h2>
              <div>
                <label htmlFor="chargeAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('wallet.amountLabel')}
                </label>
                <input
                  type="number"
                  id="chargeAmount"
                  value={chargeAmount}
                  onChange={handleChargeAmountChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-primary-500"
                  placeholder={t('wallet.amountPlaceholder')}
                />
                {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
              </div>

              {/* Recommended Amounts */}
              <div className="flex flex-wrap gap-2">
                {recommendedAmounts.map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    onClick={() => handleRecommendedAmountClick(amount)}
                    className="px-4 py-2"
                  >
                    {amount.toLocaleString()} {currencyLabel}
                  </Button>
                ))}
              </div>
            </div>

            {/* Pay Button */}
            <div className="pt-4">
              <Button
                variant="primary"
                disabled={!!error || chargeAmount === ''}
                className="w-full"
                onClick={handlePayClick}
              >
                {t('wallet.pay')}
              </Button>
            </div>

            {/* Payment History */}
            <div className="pt-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">{t('wallet.historyTitle')}</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{t('wallet.table.row')}</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{t('wallet.table.datetime')}</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{t('wallet.table.type')}</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{t('wallet.table.status')}</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{t('wallet.table.freeIncrease')}</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{t('wallet.table.creditIncrease')}</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{t('wallet.table.description')}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {historyError && (
                      <tr>
                        <td colSpan={7} className="px-4 py-6 text-center text-red-600">{historyError}</td>
                      </tr>
                    )}
                    {!historyError && historyItems.length === 0 && !loadingHistory && (
                      <tr>
                        <td colSpan={7} className="px-4 py-6 text-center text-gray-500">{t('wallet.table.noTransactions')}</td>
                      </tr>
                    )}
                    {historyItems.map((item, idx) => {
                      const freeBefore = (item.balance_before && (item.balance_before as any)['free']) ?? 0;
                      const freeAfter = (item.balance_after && (item.balance_after as any)['free']) ?? 0;
                      const creditBefore = (item.balance_before && (item.balance_before as any)['credit']) ?? 0;
                      const creditAfter = (item.balance_after && (item.balance_after as any)['credit']) ?? 0;
                      const freeInc = Math.max(0, freeAfter - freeBefore);
                      const creditInc = Math.max(0, creditAfter - creditBefore);
                      return (
                        <tr key={item.uuid} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">{idx + 1}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">{formatDatetime(item.datetime)}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">{t(`wallet.operationTypes.${item.operation}`)}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">{t(`wallet.statuses.${item.status}`)}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">{freeInc > 0 ? `${freeInc.toLocaleString()} ${currencyLabel}` : '-'}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">{creditInc > 0 ? `${creditInc.toLocaleString()} ${currencyLabel}` : '-'}</td>
                          <td className="px-4 py-3 text-sm text-gray-500 text-center">{item.metadata?.description || '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="outline"
                  onClick={() => { const prev = Math.max(1, historyPage - 1); setHistoryPage(prev); fetchHistory(prev); }}
                  disabled={loadingHistory || historyPage === 1}
                >
                  {t('common.previous')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => { const next = historyPage + 1; setHistoryPage(next); fetchHistory(next); }}
                  disabled={loadingHistory || !historyHasNext}
                >
                  {t('common.next')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Confirmation Modal */}
      <ConfirmationModal
        isOpen={showPaymentModal}
        onConfirm={handlePaymentContinue}
        onCancel={() => setShowPaymentModal(false)}
        title={t('wallet.modalTitle')}
        confirmText={t('common.continue')}
        cancelText={t('common.cancel')}
        loading={paymentSubmitting}
      >
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">{t('wallet.modalChargeAmount')}</span>
            <span className="font-medium">{Number(chargeAmount).toLocaleString()} {currencyLabel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{t('wallet.modalTax')}</span>
            <span className="font-medium">{Math.round(Number(chargeAmount) * 0.1).toLocaleString()} {currencyLabel}</span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-2">
            <span className="text-gray-800 font-medium">{t('wallet.modalTotal')}</span>
            <span className="font-bold">{(Number(chargeAmount) + Math.round(Number(chargeAmount) * 0.1)).toLocaleString()} {currencyLabel}</span>
          </div>
        </div>
      </ConfirmationModal>
    </div>
  );
};

export default WalletPage; 