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
  AdminPreviewWalletChargeImpactResponse,
} from '../../../types/admin';
import ConfirmationModal from '../../../components/ConfirmationModal';
import {
  formatAdminPaymentsAmountInput,
  sanitizeAdminPaymentsAmountInput,
} from '../utils';

const MIN_AMOUNT = 1000;
const MAX_AMOUNT = 1000000000;
const TAX_RATE = 0.1;
const MAX_AMOUNT_DIGITS = String(MAX_AMOUNT).length;
const MAX_ADMIN_NOTE_LENGTH = 1000;

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
  const [adminNote, setAdminNote] = useState('');
  const [idempotencyKey] = useState<string>(() => createIdempotencyKey());
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [chargeResult, setChargeResult] =
    useState<AdminChargeWalletResponse | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewData, setPreviewData] =
    useState<AdminPreviewWalletChargeImpactResponse | null>(null);

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

  const formattedAmount = useMemo(
    () => formatAdminPaymentsAmountInput(amount, language),
    [amount, language]
  );
  const formatAmountWithCurrency = useCallback(
    (value: number) =>
      `${value.toLocaleString(language === 'fa' ? 'fa-IR' : 'en-US')} ${copy.currency}`,
    [copy.currency, language]
  );

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
  const trimmedAdminNote = adminNote.trim();

  useEffect(() => {
    setPreviewError(null);
    setPreviewData(null);
  }, [selectedCustomerId, amount]);

  const validatePreview = useCallback(() => {
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

    if (!trimmedAdminNote) {
      showError(copy.validation.adminNoteRequired);
      return false;
    }

    if (trimmedAdminNote.length > MAX_ADMIN_NOTE_LENGTH) {
      showError(copy.validation.adminNoteLength);
      return false;
    }

    return true;
  }, [
    amount,
    amountIsNumeric,
    amountIsValid,
    amountWithTax,
    copy.validation.adminNoteLength,
    copy.validation.adminNoteRequired,
    copy.validation.amountMustBeNumber,
    copy.validation.amountRange,
    copy.validation.amountRequired,
    copy.validation.customerRequired,
    selectedCustomerId,
    showError,
    trimmedAdminNote,
  ]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateSubmission()) return;
    setShowConfirmation(true);
  };

  const handlePreview = async () => {
    if (!validatePreview()) return;

    const customerId = Number(selectedCustomerId);
    setPreviewLoading(true);
    setPreviewError(null);

    const res = await adminPaymentsApi.previewWalletChargeImpact({
      customer_id: customerId,
      amount_with_tax: amountWithTax!,
    });

    setPreviewLoading(false);

    if (!res.success || !res.data) {
      const msg = res.message || copy.errors.previewFailed;
      setPreviewError(msg);
      setPreviewData(null);
      showError(msg);
      return;
    }

    setPreviewData(res.data);
  };

  const handleConfirmCharge = async () => {
    if (!validateSubmission()) return;

    const customerId = Number(selectedCustomerId);
    setSubmitting(true);
    const res = await adminPaymentsApi.chargeWallet({
      customer_id: customerId,
      amount_with_tax: amountWithTax!,
      admin_note: trimmedAdminNote,
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
            type='text'
            inputMode='numeric'
            value={formattedAmount}
            onChange={e =>
              setAmount(
                sanitizeAdminPaymentsAmountInput(
                  e.target.value,
                  MAX_AMOUNT_DIGITS
                )
              )
            }
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

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            {copy.form.adminNoteLabel}
          </label>
          <textarea
            value={adminNote}
            onChange={e => setAdminNote(e.target.value)}
            placeholder={copy.form.adminNotePlaceholder}
            maxLength={MAX_ADMIN_NOTE_LENGTH}
            rows={4}
            className='w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
          />
        </div>

        <div className='flex items-center justify-between'>
          <p className='text-xs text-gray-500'>
            {loadingCustomers ? 'Loading...' : copy.info.listLoaded}
          </p>
          <div className='flex items-center gap-2'>
            <button
              type='button'
              onClick={() => {
                void handlePreview();
              }}
              disabled={previewLoading || submitting || loadingCustomers}
              className='rounded border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:bg-blue-50 disabled:text-blue-300'
            >
              {previewLoading ? copy.preview.loading : copy.preview.action}
            </button>
            <button
              type='submit'
              disabled={submitting || loadingCustomers}
              className='rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300'
            >
              {submitting ? copy.form.submitting : copy.form.submit}
            </button>
          </div>
        </div>
      </form>

      <div className='rounded-lg border border-gray-200 bg-gray-50 p-4'>
        <h2 className='text-sm font-semibold text-gray-900'>
          {copy.preview.title}
        </h2>
        {previewError && (
          <div className='mt-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700'>
            {previewError}
          </div>
        )}
        {!previewError && !previewData ? (
          <p className='mt-2 text-sm text-gray-500'>{copy.info.previewEmpty}</p>
        ) : null}
        {previewData && (
          <div className='mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2'>
            <div className='rounded border border-gray-200 bg-white p-3'>
              <div className='text-xs text-gray-500'>
                {copy.preview.customerId}
              </div>
              <div className='mt-1 text-sm font-medium text-gray-900'>
                {previewData.customer_id}
              </div>
            </div>
            <div className='rounded border border-gray-200 bg-white p-3'>
              <div className='text-xs text-gray-500'>
                {copy.preview.agencyId}
              </div>
              <div className='mt-1 text-sm font-medium text-gray-900'>
                {previewData.agency_id}
              </div>
            </div>
            <div className='rounded border border-gray-200 bg-white p-3'>
              <div className='text-xs text-gray-500'>
                {copy.preview.agencyDiscountId}
              </div>
              <div className='mt-1 text-sm font-medium text-gray-900'>
                {previewData.agency_discount_id}
              </div>
            </div>
            <div className='rounded border border-gray-200 bg-white p-3'>
              <div className='text-xs text-gray-500'>
                {copy.preview.discountRate}
              </div>
              <div className='mt-1 text-sm font-medium text-gray-900'>
                {previewData.discount_rate}
              </div>
            </div>
            <div className='rounded border border-gray-200 bg-white p-3'>
              <div className='text-xs text-gray-500'>{copy.preview.amount}</div>
              <div className='mt-1 text-sm font-medium text-gray-900'>
                {formatAmountWithCurrency(previewData.amount)}
              </div>
            </div>
            <div className='rounded border border-gray-200 bg-white p-3'>
              <div className='text-xs text-gray-500'>{copy.preview.tax}</div>
              <div className='mt-1 text-sm font-medium text-gray-900'>
                {formatAmountWithCurrency(previewData.tax)}
              </div>
            </div>
            <div className='rounded border border-green-200 bg-green-50 p-3'>
              <div className='text-xs text-green-700'>
                {copy.preview.freeIncrease}
              </div>
              <div className='mt-1 text-sm font-medium text-green-900'>
                {formatAmountWithCurrency(previewData.free_increase)}
              </div>
            </div>
            <div className='rounded border border-blue-200 bg-blue-50 p-3'>
              <div className='text-xs text-blue-700'>
                {copy.preview.creditIncrease}
              </div>
              <div className='mt-1 text-sm font-medium text-blue-900'>
                {formatAmountWithCurrency(previewData.credit_increase)}
              </div>
            </div>
            <div className='rounded border border-amber-200 bg-amber-50 p-3'>
              <div className='text-xs text-amber-700'>
                {copy.preview.agencyShareWithTax}
              </div>
              <div className='mt-1 text-sm font-medium text-amber-900'>
                {formatAmountWithCurrency(previewData.agency_share_with_tax)}
              </div>
            </div>
            <div className='rounded border border-purple-200 bg-purple-50 p-3'>
              <div className='text-xs text-purple-700'>
                {copy.preview.systemShareWithTax}
              </div>
              <div className='mt-1 text-sm font-medium text-purple-900'>
                {formatAmountWithCurrency(previewData.system_share_with_tax)}
              </div>
            </div>
            <div className='rounded border border-gray-200 bg-white p-3 sm:col-span-2'>
              <div className='text-xs text-gray-500'>
                {copy.preview.amountWithTax}
              </div>
              <div className='mt-1 text-sm font-semibold text-gray-900'>
                {formatAmountWithCurrency(previewData.amount_with_tax)}
              </div>
            </div>
          </div>
        )}
      </div>

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
                {amountIsValid
                  ? formatAmountWithCurrency(parsedBaseAmount)
                  : '-'}
              </span>
            </div>
            <div className='flex items-center justify-between gap-3'>
              <span className='text-gray-500'>
                {copy.confirmation.taxAmount}
              </span>
              <span className='text-gray-900'>
                {taxAmount !== null ? formatAmountWithCurrency(taxAmount) : '-'}
              </span>
            </div>
            <div className='flex items-center justify-between gap-3 border-t border-gray-200 pt-2 font-medium'>
              <span className='text-gray-700'>
                {copy.confirmation.totalAmount}
              </span>
              <span className='text-gray-900'>
                {amountWithTax !== null
                  ? formatAmountWithCurrency(amountWithTax)
                  : '-'}
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
