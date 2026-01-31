import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../hooks/useAuth';
import apiService from '../services/api';
import Button from '../components/ui/Button';
import { useToast } from '../hooks/useToast';
import { calculatorTranslations } from '../components/calculator/Calculator';
import FiltersBar from './customerManagement/components/FiltersBar';
import StatsSummary from './customerManagement/components/StatsSummary';
import ReportTable from './customerManagement/components/ReportTable';
import DiscountsTable from './customerManagement/components/DiscountsTable';
import CreateDiscountModal from './customerManagement/components/CreateDiscountModal';
import HistoryModal from './customerManagement/components/HistoryModal';
import { useAgencyReport } from './customerManagement/hooks/useAgencyReport';
import { useAgencyDiscounts } from './customerManagement/hooks/useAgencyDiscounts';
import { useAgencyCustomers } from './customerManagement/hooks/useAgencyCustomers';
import { useDiscountHistory } from './customerManagement/hooks/useDiscountHistory';
import { getWalletCopy } from './wallet/translations';
import { getCustomerManagementCopy } from './customerManagement/translations';

const CustomerManagementPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { accessToken } = useAuth();
  const walletCopy = useMemo(() => getWalletCopy(language), [language]);
  const agencyCopy = useMemo(
    () => getCustomerManagementCopy(language),
    [language]
  );
  const { showError, showSuccess } = useToast();
  const calcT = calculatorTranslations[language as keyof typeof calculatorTranslations] || calculatorTranslations.en;

  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [nameFilter, setNameFilter] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [isGlobalCreate, setIsGlobalCreate] = useState<boolean>(false);
  const [createForCustomerId, setCreateForCustomerId] = useState<number | null>(null);
  const [createCustomerInfo, setCreateCustomerInfo] = useState<{
    representative_first_name: string;
    representative_last_name: string;
    company_name?: string | null;
  } | null>(null);
  const [newDiscountName, setNewDiscountName] = useState<string>('');
  const [newDiscountRate, setNewDiscountRate] = useState<string>('');
  const [createSubmitting, setCreateSubmitting] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [globalCustomerId, setGlobalCustomerId] = useState<number | ''>('');
  const [showCalcModal, setShowCalcModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const historyCustomerIdRef = useRef<number | null>(null);

  const {
    items,
    sumTotalSent,
    sumTotalShare,
    loading: reportLoading,
    error: reportError,
    fetchReport,
  } = useAgencyReport(accessToken, showError);

  const {
    discounts,
    loading: discountsLoading,
    error: discountsError,
    fetchDiscounts,
  } = useAgencyDiscounts(accessToken, showError);

  const { customers, fetchCustomers } = useAgencyCustomers(accessToken, showError);

  const {
    items: historyItems,
    loading: historyLoading,
    error: historyError,
    fetchHistory,
    reset: resetHistory,
  } = useDiscountHistory(accessToken, showError);

  const fetchTriggerRef = useRef(0);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  useEffect(() => {
    if (!accessToken) return;
    if (fetchTrigger === 0) {
      // Kick off initial fetch once when token is available
      setFetchTrigger(1);
      return;
    }
    fetchReport(
      { startDate, endDate, name: nameFilter },
      agencyCopy.invalidRange
    );
    fetchDiscounts();
  }, [
    accessToken,
    agencyCopy.invalidRange,
    fetchDiscounts,
    fetchReport,
    startDate,
    endDate,
    nameFilter,
    fetchTrigger,
  ]);

  const handleApplyFilters = () => {
    fetchTriggerRef.current += 1;
    setFetchTrigger(fetchTriggerRef.current);
  };

  const handleOpenGlobalCreate = async () => {
    setShowCreateModal(true);
    setIsGlobalCreate(true);
    setCreateError(null);
    setNewDiscountName('');
    setNewDiscountRate('');
    setGlobalCustomerId('');
    try {
      await fetchCustomers();
    } catch {
      // errors handled in hook
    }
  };

  const handleOpenCreateForCustomer = (customerId: number, info: { representative_first_name: string; representative_last_name: string; company_name?: string | null }) => {
    setCreateForCustomerId(customerId);
    setCreateCustomerInfo(info);
    setIsGlobalCreate(false);
    setShowCreateModal(true);
    setCreateError(null);
    setNewDiscountName('');
    setNewDiscountRate('');
  };

  const handleOpenHistory = async (customerId: number) => {
    historyCustomerIdRef.current = customerId;
    setShowHistoryModal(true);
    resetHistory();
    await fetchHistory(customerId);
  };

  const handleSubmitDiscount = async () => {
    setCreateError(null);
    const rateNum = parseFloat(newDiscountRate);
    if (!newDiscountName.trim()) {
      const msg = agencyCopy.discountNameRequired;
      setCreateError(msg);
      showError(msg);
      return;
    }
    if (!(rateNum >= 0 && rateNum <= 100)) {
      const msg = agencyCopy.discountRateInvalid;
      setCreateError(msg);
      showError(msg);
      return;
    }
    setCreateSubmitting(true);
    try {
      const targetCustomerId = isGlobalCreate
        ? typeof globalCustomerId === 'number'
          ? globalCustomerId
          : null
        : createForCustomerId;
      if (targetCustomerId === null) {
        const msg = 'Missing customer id';
        setCreateError(msg);
        showError(msg);
        return;
      }
      const normalizedRate = rateNum / (rateNum + 100);
      if (accessToken) apiService.setAccessToken(accessToken);
      const res = await apiService.createAgencyDiscount({
        customer_id: targetCustomerId,
        name: newDiscountName.trim(),
        discount_rate: normalizedRate,
      });
      if (res.success) {
        showSuccess(res.message || agencyCopy.discountCreate);
        setShowCreateModal(false);
        setIsGlobalCreate(false);
        await fetchDiscounts();
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
  };

  const currencyLabel = walletCopy.currency;

  return (
    <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-semibold text-gray-900'>
            {t('dashboard.customerDiscountManagement')}
          </h2>
          <Button variant='primary' onClick={handleOpenGlobalCreate}>
            {agencyCopy.discountGlobalCreate}
          </Button>
        </div>

        <FiltersBar
          language={language}
          startDate={startDate}
          endDate={endDate}
          nameFilter={nameFilter}
          onStartChange={setStartDate}
          onEndChange={setEndDate}
          onNameChange={setNameFilter}
          onApply={handleApplyFilters}
          loading={reportLoading}
          copy={{
            startDate: agencyCopy.startDate,
            endDate: agencyCopy.endDate,
            name: agencyCopy.name,
            namePlaceholder: agencyCopy.namePlaceholder,
            applyFilters: agencyCopy.applyFilters,
          }}
        />

        <ReportTable
          items={items as any}
          loading={reportLoading}
          error={reportError}
          currencyLabel={currencyLabel}
          noTransactionsLabel={walletCopy.table.noTransactions}
          commonLoadingLabel={t('common.loading')}
          copy={{
            tableTitle: agencyCopy.tableTitle,
            firstName: agencyCopy.firstName,
            lastName: agencyCopy.lastName,
            representativeName: agencyCopy.representativeName,
            companyName: agencyCopy.companyName,
            totalSent: agencyCopy.totalSent,
            totalShare: agencyCopy.totalShare,
            discountCreateAction: agencyCopy.discountCreateAction,
            discountHistoryAction: agencyCopy.discountHistoryAction,
          }}
          onCreateForCustomer={handleOpenCreateForCustomer}
          onViewHistory={handleOpenHistory}
        />

        <StatsSummary
          totalSent={sumTotalSent}
          totalShare={sumTotalShare}
          currencyLabel={currencyLabel}
          copy={{
            totalSentAll: agencyCopy.totalSentAll,
            totalShareAll: agencyCopy.totalShareAll,
          }}
        />

        <DiscountsTable
          discounts={discounts}
          loading={discountsLoading}
          error={discountsError}
          currencyLabel={currencyLabel}
          noTransactionsLabel={walletCopy.table.noTransactions}
          commonLoadingLabel={t('common.loading')}
          language={language}
          copy={{
            discountsTitle: agencyCopy.discountsTitle,
            discountCustomer: agencyCopy.discountCustomer,
            companyName: agencyCopy.companyName,
            discountRate: agencyCopy.discountRate,
            discountCreatedAt: agencyCopy.discountCreatedAt,
            discountCreateAction: agencyCopy.discountCreateAction,
            discountHistoryAction: agencyCopy.discountHistoryAction,
          }}
          onCreate={item =>
            handleOpenCreateForCustomer(item.customer_id, {
              representative_first_name: item.representative_first_name,
              representative_last_name: item.representative_last_name,
              company_name: item.company_name,
            })
          }
          onHistory={item => handleOpenHistory(item.customer_id)}
        />
      </div>

      <CreateDiscountModal
        isOpen={showCreateModal}
        isGlobal={isGlobalCreate}
        customers={customers}
        selectedCustomerInfo={createCustomerInfo}
        globalCustomerId={globalCustomerId}
        onSelectCustomer={setGlobalCustomerId}
        newDiscountName={newDiscountName}
        newDiscountRate={newDiscountRate}
        onChangeName={setNewDiscountName}
        onChangeRate={setNewDiscountRate}
        onClose={() => {
          setShowCreateModal(false);
          setIsGlobalCreate(false);
        }}
        onSubmit={handleSubmitDiscount}
        createError={createError}
        submitting={createSubmitting}
        language={language}
        calcTranslations={calcT}
        calcOpen={showCalcModal}
        onCalcOpen={() => setShowCalcModal(true)}
        onCalcClose={() => setShowCalcModal(false)}
        onCalcApply={percent => {
          setNewDiscountRate(String(percent));
          setShowCalcModal(false);
        }}
        copy={agencyCopy}
      />

      <HistoryModal
        isOpen={showHistoryModal}
        loading={historyLoading}
        error={historyError}
        items={historyItems}
        onClose={() => setShowHistoryModal(false)}
        language={language}
        copy={agencyCopy}
        common={{ close: t('common.close'), loading: t('common.loading') }}
        noTransactionsLabel={walletCopy.table.noTransactions}
        createdAtLabel={walletCopy.table.createdAt || 'Created At'}
      />
    </div>
  );
};

export default CustomerManagementPage;
