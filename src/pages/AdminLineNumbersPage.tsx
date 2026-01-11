import React, { useEffect, useMemo, useRef, useState } from 'react';
import { translations } from '../locales/translations';
import { useLanguage } from '../hooks/useLanguage';
import adminApi from '../services/adminApi';
import {
  AdminCreateLineNumberRequest,
  AdminLineNumberDTO,
  AdminLineNumberReportItem,
} from '../types/admin';
import { useToast } from '../hooks/useToast';
import { useNavigation } from '../contexts/NavigationContext';
import { ROUTES } from '../config/routes';

const AdminLineNumbersPage: React.FC = () => {
  const { language } = useLanguage();
  const t = useMemo(() => translations[language], [language]);
  const { showError, showSuccess } = useToast();
  const { navigate } = useNavigation();

  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<AdminCreateLineNumberRequest>({
    name: '',
    line_number: '',
    price_factor: 1,
    priority: undefined,
    is_active: true,
  });

  const [list, setList] = useState<AdminLineNumberDTO[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

  // Report state
  const [report, setReport] = useState<AdminLineNumberReportItem[]>([]);
  const [loadingReport, setLoadingReport] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  // Reorder state
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [hasOrderChanges, setHasOrderChanges] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);

  // StrictMode guard to ensure mount effect runs only once
  const didInitRef = useRef(false);

  const byPriorityAsc = (a: AdminLineNumberDTO, b: AdminLineNumberDTO) => {
    const ap = a.priority == null ? Number.MAX_SAFE_INTEGER : a.priority;
    const bp = b.priority == null ? Number.MAX_SAFE_INTEGER : b.priority;
    return ap - bp;
  };

  const loadList = async () => {
    setLoadingList(true);
    setListError(null);
    const resp = await adminApi.listLineNumbers();
    setLoadingList(false);
    if (!resp.success) {
      setListError(resp.message || t.common?.loading || 'Failed to load list');
      return;
    }
    const sorted = (resp.data || []).slice().sort(byPriorityAsc);
    setList(sorted);
    setHasOrderChanges(false);
  };

  const loadReport = async () => {
    setLoadingReport(true);
    setReportError(null);
    const resp = await adminApi.getLineNumbersReport();
    setLoadingReport(false);
    if (!resp.success) {
      setReportError(
        resp.message ||
          (language === 'fa'
            ? 'دریافت گزارش ناموفق بود'
            : 'Failed to load report')
      );
      return;
    }
    setReport(resp.data || []);
  };

  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    loadList();
    loadReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (field: keyof AdminCreateLineNumberRequest, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const validate = (): string | null => {
    if (
      !form.line_number ||
      form.line_number.trim().length < 3 ||
      form.line_number.trim().length > 50
    )
      return language === 'fa'
        ? 'شماره خط باید بین ۳ تا ۵۰ کاراکتر باشد'
        : 'Line number must be 3-50 chars';
    if (typeof form.price_factor !== 'number' || !(form.price_factor > 0))
      return language === 'fa'
        ? 'ضریب قیمت باید بیشتر از ۰ باشد'
        : 'Price factor must be > 0';
    if (form.name && form.name.length > 255)
      return language === 'fa'
        ? 'نام باید حداکثر ۲۵۵ کاراکتر باشد'
        : 'Name must be <= 255 chars';
    return null;
  };

  const mapCreateError = (code?: string, fallback?: string): string => {
    switch (code) {
      case 'LINE_NUMBER_VALUE_REQUIRED':
        return language === 'fa'
          ? t.adminLineNumbers?.fields?.lineNumber + ' ' + 'الزامی است'
          : 'Line number is required';
      case 'PRICE_FACTOR_INVALID':
        return language === 'fa'
          ? 'ضریب قیمت باید بیشتر از صفر باشد'
          : 'Price factor must be greater than zero';
      case 'LINE_NUMBER_ALREADY_EXISTS':
        return language === 'fa'
          ? 'شماره خط قبلاً وجود دارد'
          : 'Line number already exists';
      case 'VALIDATION_ERROR':
        return language === 'fa'
          ? 'اعتبارسنجی ناموفق بود'
          : 'Validation failed';
      default:
        return (
          fallback || (language === 'fa' ? 'ایجاد ناموفق بود' : 'Create failed')
        );
    }
  };

  const submit = async () => {
    const v = validate();
    if (v) {
      setError(v);
      showError(v);
      return;
    }
    setError(null);
    setConfirmOpen(true);
  };

  const confirm = async () => {
    setSubmitting(true);
    try {
      const payload: AdminCreateLineNumberRequest = {
        name: form.name?.trim() ? form.name.trim() : undefined,
        line_number: form.line_number.trim(),
        price_factor: Number(form.price_factor),
        priority: typeof form.priority === 'number' ? form.priority : undefined,
        is_active:
          typeof form.is_active === 'boolean' ? form.is_active : undefined,
      };
      const resp = await adminApi.createLineNumber(payload);
      if (!resp.success) {
        const code = (resp.error as any)?.code as string | undefined;
        const msg = mapCreateError(code, resp.message);
        setError(msg);
        showError(msg);
        setSubmitting(false);
        setConfirmOpen(false);
        return;
      }
      setSubmitting(false);
      setConfirmOpen(false);
      setOpen(false);
      setForm({
        name: '',
        line_number: '',
        price_factor: 1,
        priority: undefined,
        is_active: true,
      });
      showSuccess(t.common?.save || 'Saved');
      loadList();
    } catch (e) {
      setSubmitting(false);
      setConfirmOpen(false);
      const msg = language === 'fa' ? 'خطای شبکه' : 'Network error';
      setError(msg);
      showError(msg);
    }
  };

  // Drag & Drop handlers
  const arrayMove = (arr: AdminLineNumberDTO[], from: number, to: number) => {
    const copy = arr.slice();
    const [moved] = copy.splice(from, 1);
    copy.splice(to, 0, moved);
    return copy;
  };

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLTableRowElement>,
    index: number
  ) => {
    e.preventDefault();
  };

  const handleDrop = (index: number) => {
    if (dragIndex == null || dragIndex === index) {
      setDragIndex(null);
      return;
    }
    const updated = arrayMove(list, dragIndex, index);
    setList(updated);
    setHasOrderChanges(true);
    setDragIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  const saveOrder = async () => {
    try {
      setSavingOrder(true);
      // Assign sequential priorities based on current order (top = 1)
      const items = list.map((ln, idx) => ({
        id: ln.id,
        price_factor: ln.price_factor,
        priority: idx + 1,
      }));
      const resp = await adminApi.updateLineNumbersBatch({ items });
      setSavingOrder(false);
      if (!resp.success) {
        showError(resp.message || 'Batch update failed');
        return;
      }
      // Update local priorities and reset change flag
      const withNewPriorities = list.map((ln, idx) => ({
        ...ln,
        priority: idx + 1,
      }));
      setList(withNewPriorities);
      setHasOrderChanges(false);
      showSuccess(t.common?.save || 'Saved');
    } catch (e) {
      setSavingOrder(false);
      showError('Network error');
    }
  };

  return (
    <div className='p-4'>
      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-xl font-semibold'>
          {t.adminLineNumbers?.managementTitle || 'Line Number Management'}
        </h1>
        <button
          className='bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded'
          onClick={() => navigate(ROUTES.ADMIN_SARDIS.path)}
        >
          {t.adminCommon?.backToSardis || 'Back to Sardis'}
        </button>
      </div>

      <div className='flex items-center gap-2'>
        <button
          className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded'
          onClick={() => setOpen(true)}
        >
          {t.adminLineNumbers?.createNew || 'Create New Line Number'}
        </button>
      </div>

      <div className='mt-6'>
        <h2 className='text-lg font-medium mb-2'>
          {t.adminLineNumbers?.managementTitle || 'Line Number Management'}
        </h2>
        {loadingList ? (
          <div className='text-sm text-gray-500'>
            {t.common?.loading || 'Loading...'}
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full border text-sm'>
              <thead className='bg-gray-100'>
                <tr>
                  <th className='px-3 py-2 border'>
                    {t.adminLineNumbers?.columns?.row || '#'}
                  </th>
                  <th className='px-3 py-2 border'>
                    {t.adminLineNumbers?.columns?.lineNumber || 'Line Number'}
                  </th>
                  <th className='px-3 py-2 border'>
                    {t.adminLineNumbers?.columns?.priority || 'Priority'}
                  </th>
                  <th className='px-3 py-2 border'>
                    {t.adminLineNumbers?.columns?.priceFactor || 'Price Factor'}
                  </th>
                  <th className='px-3 py-2 border'>
                    {t.adminLineNumbers?.columns?.active || 'Active'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {listError ? (
                  <tr>
                    <td
                      colSpan={5}
                      className='px-3 py-6 text-center text-red-600'
                    >
                      {listError}
                    </td>
                  </tr>
                ) : (
                  <>
                    {list.map((ln, idx) => (
                      <tr
                        key={ln.uuid || idx}
                        className='odd:bg-white even:bg-gray-50 cursor-move'
                        draggable={true}
                        onDragStart={() => handleDragStart(idx)}
                        onDragOver={e => handleDragOver(e, idx)}
                        onDrop={() => handleDrop(idx)}
                        onDragEnd={handleDragEnd}
                      >
                        <td className='px-3 py-2 border'>{idx + 1}</td>
                        <td className='px-3 py-2 border'>{ln.line_number}</td>
                        <td className='px-3 py-2 border'>
                          {ln.priority ?? '-'}
                        </td>
                        <td className='px-3 py-2 border'>{ln.price_factor}</td>
                        <td className='px-3 py-2 border'>
                          {ln.is_active
                            ? t.common?.yes || 'Yes'
                            : t.common?.no || 'No'}
                        </td>
                      </tr>
                    ))}
                    {list.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className='px-3 py-6 text-center text-gray-500'
                        >
                          {t.adminLineNumbers?.noItems || 'No items'}
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
            <div className='mt-3 flex justify-end'>
              <button
                className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-60'
                onClick={saveOrder}
                disabled={!hasOrderChanges || savingOrder || !!listError}
              >
                {savingOrder
                  ? t.common?.loading || 'Loading...'
                  : t.common?.save || 'Save'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className='mt-8'>
        <h2 className='text-lg font-medium mb-2'>
          {language === 'fa' ? 'گزارش شماره‌های خط' : 'Line Numbers Report'}
        </h2>
        {loadingReport ? (
          <div className='text-sm text-gray-500'>
            {t.common?.loading || 'Loading...'}
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full border text-sm'>
              <thead className='bg-gray-100'>
                <tr>
                  <th className='px-3 py-2 border'>
                    {t.adminLineNumbers?.fields?.lineNumber || 'Line Number'}
                  </th>
                  <th className='px-3 py-2 border'>Total Sent</th>
                  <th className='px-3 py-2 border'>Total Parts Sent</th>
                  <th className='px-3 py-2 border'>Total Arrived Parts</th>
                  <th className='px-3 py-2 border'>Total Non-arrived Parts</th>
                  <th className='px-3 py-2 border'>Total Income</th>
                  <th className='px-3 py-2 border'>Total Cost</th>
                </tr>
              </thead>
              <tbody>
                {reportError ? (
                  <tr>
                    <td
                      colSpan={7}
                      className='px-3 py-6 text-center text-red-600'
                    >
                      {reportError}
                    </td>
                  </tr>
                ) : (
                  <>
                    {report.map((it, idx) => (
                      <tr
                        key={`${it.line_number}-${idx}`}
                        className='odd:bg-white even:bg-gray-50'
                      >
                        <td className='px-3 py-2 border'>{it.line_number}</td>
                        <td className='px-3 py-2 border'>{it.total_sent}</td>
                        <td className='px-3 py-2 border'>
                          {it.total_parts_sent}
                        </td>
                        <td className='px-3 py-2 border'>
                          {it.total_arrived_parts_sent}
                        </td>
                        <td className='px-3 py-2 border'>
                          {it.total_non_arrived_parts_sent}
                        </td>
                        <td className='px-3 py-2 border'>{it.total_income}</td>
                        <td className='px-3 py-2 border'>{it.total_cost}</td>
                      </tr>
                    ))}
                    {report.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className='px-3 py-6 text-center text-gray-500'
                        >
                          {t.adminLineNumbers?.noItems || 'No items'}
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {open && (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
          <div className='bg-white w-full max-w-lg rounded shadow p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-lg font-medium'>
                {t.adminLineNumbers?.createTitle || 'Create Line Number'}
              </h2>
              <button onClick={() => setOpen(false)} className='text-gray-500'>
                ✕
              </button>
            </div>

            {error && <div className='text-red-600 text-sm mb-3'>{error}</div>}

            <div className='space-y-4'>
              <div>
                <label className='block text-sm mb-1'>
                  {t.adminLineNumbers?.fields?.nameOptional ||
                    'Name (optional)'}
                </label>
                <input
                  className='w-full border rounded px-3 py-2'
                  value={form.name || ''}
                  onChange={e => onChange('name', e.target.value)}
                />
              </div>
              <div>
                <label className='block text-sm mb-1'>
                  {t.adminLineNumbers?.fields?.lineNumber || 'Line Number'}
                </label>
                <input
                  className='w-full border rounded px-3 py-2'
                  value={form.line_number}
                  onChange={e => onChange('line_number', e.target.value)}
                />
              </div>
              <div>
                <label className='block text-sm mb-1'>
                  {t.adminLineNumbers?.fields?.priceFactor || 'Price Factor'}
                </label>
                <input
                  type='number'
                  step='0.01'
                  className='w-full border rounded px-3 py-2'
                  value={form.price_factor}
                  onChange={e =>
                    onChange('price_factor', parseFloat(e.target.value))
                  }
                />
              </div>
              <div>
                <label className='block text-sm mb-1'>
                  {t.adminLineNumbers?.fields?.priorityOptional ||
                    'Priority (optional)'}
                </label>
                <input
                  type='number'
                  className='w-full border rounded px-3 py-2'
                  value={form.priority ?? ''}
                  onChange={e =>
                    onChange(
                      'priority',
                      e.target.value === ''
                        ? undefined
                        : parseInt(e.target.value)
                    )
                  }
                />
              </div>
              <div className='flex items-center gap-2'>
                <input
                  id='isActive'
                  type='checkbox'
                  checked={!!form.is_active}
                  onChange={e => onChange('is_active', e.target.checked)}
                />
                <label htmlFor='isActive'>
                  {t.adminLineNumbers?.fields?.active || 'Active'}
                </label>
              </div>
            </div>

            <div className='mt-6 flex justify-end gap-2'>
              <button
                className='px-4 py-2 rounded border'
                onClick={() => setOpen(false)}
              >
                {t.common?.cancel || 'Cancel'}
              </button>
              <button
                className='px-4 py-2 rounded bg-blue-600 text-white'
                onClick={submit}
              >
                {t.common?.submit || 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmOpen && (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
          <div className='bg-white w-full max-w-md rounded shadow p-6'>
            <h3 className='text-lg font-medium mb-3'>
              {t.adminLineNumbers?.confirmTitle || 'Confirm Create Line Number'}
            </h3>
            <ul className='text-sm mb-4 space-y-1'>
              <li>
                <strong>{t.adminLineNumbers?.confirm?.name || 'Name'}:</strong>{' '}
                {form.name || '-'}
              </li>
              <li>
                <strong>
                  {t.adminLineNumbers?.confirm?.lineNumber || 'Line Number'}:
                </strong>{' '}
                {form.line_number}
              </li>
              <li>
                <strong>
                  {t.adminLineNumbers?.confirm?.priceFactor || 'Price Factor'}:
                </strong>{' '}
                {form.price_factor}
              </li>
              <li>
                <strong>
                  {t.adminLineNumbers?.confirm?.priority || 'Priority'}:
                </strong>{' '}
                {form.priority ?? '-'}
              </li>
              <li>
                <strong>
                  {t.adminLineNumbers?.confirm?.active || 'Active'}:
                </strong>{' '}
                {form.is_active ? t.common?.yes || 'Yes' : t.common?.no || 'No'}
              </li>
            </ul>
            <div className='flex justify-end gap-2'>
              <button
                className='px-4 py-2 rounded border'
                onClick={() => setConfirmOpen(false)}
              >
                {t.common?.cancel || 'Cancel'}
              </button>
              <button
                className='px-4 py-2 rounded bg-green-600 text-white'
                onClick={confirm}
                disabled={submitting}
              >
                {submitting
                  ? t.common?.loading || 'Loading...'
                  : t.common?.confirm || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLineNumbersPage;
