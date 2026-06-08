import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useToast } from '../../../hooks/useToast';
import { useNavigation } from '../../../contexts/NavigationContext';
import { ROUTES } from '../../../config/routes';
import { adminPaymentsApi } from '../api';
import { adminPaymentsTranslations } from '../translations';
import { useLanguage } from '../../../hooks/useLanguage';
import {
  AdminChargeWalletResponse,
  AdminCustomerDetailDTO,
} from '../../../types/admin';
import ConfirmationModal from '../../../components/ConfirmationModal';

const MIN_AMOUNT = 1000;
const MAX_AMOUNT = 1000000000;
const TAX_RATE = 0.1;

const createIdempotencyKey = (): string => {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }
  return `admin-charge-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
};

const AdminChargeWalletSection: React.FC = () => {
  const { language } = useLanguage();
  const copy = useMemo(
    () =>
      adminPaymentsTranslations[
        language as keyof typeof adminPaymentsTranslations
      ] || adminPaymentsTranslations.en,
    [language]
  );
  const { showError, showSuccess } = useToast();
  const { navigate } = useNavigation();
  const didInitRef = useRef(false);

  const [customers, setCustomers] = useState<AdminCustomerDetailDTO[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [amount, setAmount] = useState('');
  const [idempotencyKey] = useState<string>(() => createIdempotencyKey());
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [chargeResult, setChargeResult] =
    useState<AdminChargeWalletResponse | null>(null);

  const loadCustomers = useCallback(async () => {
    setLoadingCustomers(true);
    const res = await adminPaymentsApi.listCustomers();
    setLoadingCustomers(false);

    if (!res.success) {
      const msg = res.message || copy.errors.listCustomersFailed;
      showError(msg);
      setCustomers([]);
      return;
    }

    setCustomers(res.data?.items || []);
  }, [copy.errors.listCustomersFailed, showError]);

  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    loadCustomers();
  }, [loadCustomers]);

  const filteredCustomers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return customers;

    return customers.filter(customer => {
      const firstName = customer.representative_first_name?.toLowerCase() || '';
      const lastName = customer.representative_last_name?.toLowerCase() || '';
      const companyName = customer.company_name?.toLowerCase() || '';
      return (
        firstName.includes(query) ||
        lastName.includes(query) ||
        companyName.includes(query)
      );
    });
  }, [customers, searchQuery]);

  const customerLabel = useCallback((customer: AdminCustomerDetailDTO) => {
    const fullName =
      `${customer.representative_first_name || ''} ${customer.representative_last_name || ''}`.trim();
    const company = customer.company_name ? ` - ${customer.company_name}` : '';
    return `${fullName || customer.email}${company} (#${customer.id})`;
  }, []);

  const parsedBaseAmount = amount.trim() ? Number(amount) : NaN;
  const amountIsNumeric =
    amount.trim().length > 0 &&
    Number.isFinite(parsedBaseAmount) &&
    !Number.isNaN(parsedBaseAmount);
  const amountIsValid =
    amountIsNumeric &&
    Number.isInteger(parsedBaseAmount) &&
    parsedBaseAmount >= MIN_AMOUNT &&
    parsedBaseAmount <= MAX_AMOUNT;
  const taxAmount = amountIsValid
    ? Math.round(parsedBaseAmount * TAX_RATE)
    : null;
  const amountWithTax =
    amountIsValid && taxAmount !== null ? parsedBaseAmount + taxAmount : null;

  const validateSubmission = useCallback(() => {
    const customerId = Number(selectedCustomerId);
    if (!customerId || customerId < 1) {
      showError(copy.validation.customerRequired);
      return false;
    }

    if (!amount.trim()) {
      showError(copy.validation.amountRequired);
      return false;
    }

    if (!amountIsNumeric) {
      showError(copy.validation.amountMustBeNumber);
      return false;
    }

    if (!amountIsValid || amountWithTax === null) {
      showError(copy.validation.amountRange);
      return false;
    }

    return true;
  }, [
    amount,
    amountIsNumeric,
    amountIsValid,
    amountWithTax,
    copy.validation.amountMustBeNumber,
    copy.validation.amountRange,
    copy.validation.amountRequired,
    copy.validation.customerRequired,
    selectedCustomerId,
    showError,
  ]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateSubmission()) return;
    setShowConfirmation(true);
  };

  const handleConfirmCharge = async () => {
    if (!validateSubmission()) return;

    const customerId = Number(selectedCustomerId);
    setSubmitting(true);
    const res = await adminPaymentsApi.chargeWallet({
      customer_id: customerId,
      amount_with_tax: amountWithTax!,
      idempotency_key: idempotencyKey,
    });
    setSubmitting(false);

    if (!res.success || !res.data) {
      const msg = res.message || copy.errors.chargeFailed;
      showError(msg);
      return;
    }

    setChargeResult(res.data);
    setShowConfirmation(false);
    showSuccess(res.message || copy.success.chargeSuccess);
  };

  const selectedCustomer = customers.find(
    customer => String(customer.id) === selectedCustomerId
  );

  return (
    <div className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm space-y-4'>
      <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold'>{copy.title}</h1>
          <p className='text-sm text-gray-600 mt-1'>{copy.subtitle}</p>
        </div>
        <button
          type='button'
          className='rounded border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50'
          onClick={() => navigate(ROUTES.ADMIN_SARDIS.path)}
        >
          {copy.backToSardis}
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm space-y-4'
      >
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            {copy.form.customerSearchLabel}
          </label>
          <input
            type='text'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={copy.form.customerSearchPlaceholder}
            className='w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            {copy.form.customerLabel}
          </label>
          <select
            value={selectedCustomerId}
            onChange={e => setSelectedCustomerId(e.target.value)}
            disabled={loadingCustomers}
            className='w-full rounded border border-gray-300 px-3 py-2 text-sm bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100'
          >
            <option value=''>{copy.form.customerPlaceholder}</option>
            {filteredCustomers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customerLabel(customer)}
              </option>
            ))}
          </select>
          {!loadingCustomers && filteredCustomers.length === 0 && (
            <p className='mt-1 text-xs text-gray-500'>
              {copy.info.noCustomersFound}
            </p>
          )}
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            {copy.form.amountLabel}
          </label>
          <input
            type='number'
            min={MIN_AMOUNT}
            max={MAX_AMOUNT}
            step={1}
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder={copy.form.amountPlaceholder}
            className='w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
          />
          {amountWithTax !== null && taxAmount !== null && (
            <p className='mt-1 text-xs text-gray-500'>
              {copy.info.taxPreview
                .replace('{{tax}}', taxAmount.toLocaleString())
                .replace('{{total}}', amountWithTax.toLocaleString())}
            </p>
          )}
        </div>

        <div className='flex items-center justify-between'>
          <p className='text-xs text-gray-500'>
            {loadingCustomers ? 'Loading...' : copy.info.listLoaded}
          </p>
          <button
            type='submit'
            disabled={submitting || loadingCustomers}
            className='rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300'
          >
            {submitting ? copy.form.submitting : copy.form.submit}
          </button>
        </div>
      </form>

      <ConfirmationModal
        isOpen={showConfirmation}
        onConfirm={handleConfirmCharge}
        onCancel={() => {
          if (submitting) return;
          setShowConfirmation(false);
        }}
        title={copy.confirmation.title}
        confirmText={
          submitting ? copy.form.submitting : copy.confirmation.confirm
        }
        cancelText={copy.confirmation.cancel}
        loading={submitting}
      >
        <div className='space-y-3 text-sm text-gray-700'>
          <p>{copy.confirmation.message}</p>
          <div className='space-y-2 rounded-md bg-gray-50 p-3'>
            <div className='flex items-center justify-between gap-3'>
              <span className='text-gray-500'>
                {copy.confirmation.customer}
              </span>
              <span className='text-right text-gray-900'>
                {selectedCustomer ? customerLabel(selectedCustomer) : '-'}
              </span>
            </div>
            <div className='flex items-center justify-between gap-3'>
              <span className='text-gray-500'>
                {copy.confirmation.baseAmount}
              </span>
              <span className='text-gray-900'>
                {amountIsValid ? parsedBaseAmount.toLocaleString() : '-'}
              </span>
            </div>
            <div className='flex items-center justify-between gap-3'>
              <span className='text-gray-500'>
                {copy.confirmation.taxAmount}
              </span>
              <span className='text-gray-900'>
                {taxAmount !== null ? taxAmount.toLocaleString() : '-'}
              </span>
            </div>
            <div className='flex items-center justify-between gap-3 border-t border-gray-200 pt-2 font-medium'>
              <span className='text-gray-700'>
                {copy.confirmation.totalAmount}
              </span>
              <span className='text-gray-900'>
                {amountWithTax !== null ? amountWithTax.toLocaleString() : '-'}
              </span>
            </div>
          </div>
        </div>
      </ConfirmationModal>

      {chargeResult && (
        <div className='rounded-lg border border-green-200 bg-green-50 p-4'>
          <h2 className='text-sm font-semibold text-green-900 mb-3'>
            {copy.result.title}
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-green-900'>
            <div>
              {copy.result.paymentRequestId}: {chargeResult.payment_request_id}
            </div>
            <div>
              {copy.result.invoiceNumber}: {chargeResult.invoice_number}
            </div>
            <div>
              {copy.result.referenceNumber}: {chargeResult.reference_number}
            </div>
            <div>
              {copy.result.customerId}: {chargeResult.customer_id}
            </div>
            <div>
              {copy.result.adminId}: {chargeResult.admin_id}
            </div>
            <div>
              {copy.result.amountWithTax}:{' '}
              {chargeResult.amount_with_tax.toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminChargeWalletSection;
