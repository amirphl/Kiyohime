import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import adminApi from '../services/adminApi';
import { AdminGetCampaignResponse, AdminListCampaignsFilter, AdminListCampaignsResponse } from '../types/admin';
import { useToast } from '../hooks/useToast';
import { translations } from '../locales/translations';
import { useLanguage } from '../hooks/useLanguage';

const buildStatusOptions = (t: any): Array<{ value: AdminListCampaignsFilter['status']; label: string }> => [
  { value: undefined, label: t.adminCampaigns?.filters?.all || 'All' },
  { value: 'initiated', label: t.adminCampaigns?.filters?.statuses?.initiated || 'Initiated' },
  { value: 'in_progress', label: t.adminCampaigns?.filters?.statuses?.in_progress || 'In Progress' },
  { value: 'waiting_for_approval', label: t.adminCampaigns?.filters?.statuses?.waiting_for_approval || 'Waiting for Approval' },
  { value: 'approved', label: t.adminCampaigns?.filters?.statuses?.approved || 'Approved' },
  { value: 'rejected', label: t.adminCampaigns?.filters?.statuses?.rejected || 'Rejected' },
] as any;

const AdminCampaignsPage: React.FC = () => {
  const { language } = useLanguage();
  const t = useMemo(() => translations[language], [language]);
  const [title, setTitle] = useState<string>('');
  const [status, setStatus] = useState<AdminListCampaignsFilter['status']>();
  const [start, setStart] = useState<string>('');
  const [end, setEnd] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<AdminGetCampaignResponse[]>([]);
  const { showError } = useToast();
  const didInitRef = useRef(false);
  const statusOptions = useMemo(() => buildStatusOptions(t), [t]);

  // Approve/Reject modal state
  const [actionCampaign, setActionCampaign] = useState<AdminGetCampaignResponse | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [actionComment, setActionComment] = useState<string>('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSubmitting, setActionSubmitting] = useState<boolean>(false);

  const buildParams = useCallback((): AdminListCampaignsFilter => {
    const params: AdminListCampaignsFilter = {};
    if (title.trim()) params.title = title.trim();
    if (status) params.status = status;
    if (start) {
      const d = new Date(start);
      if (!Number.isNaN(d.getTime())) params.start_date = d.toISOString();
    }
    if (end) {
      const d = new Date(end);
      if (!Number.isNaN(d.getTime())) params.end_date = d.toISOString();
    }
    return params;
  }, [title, status, start, end]);

  const load = useCallback(async (initial: boolean = false) => {
    setLoading(true);
    setError(null);
    const params = initial ? {} : buildParams();
    const res = await adminApi.listCampaigns(params);
    if (!res.success) {
      setError(res.message || t.adminCampaigns?.errors?.listFailed || 'Failed to list campaigns');
      setItems([]);
    } else {
      const data = (res.data as AdminListCampaignsResponse) || { items: [] } as any;
      setItems(Array.isArray((data as any).items) ? (data as any).items : []);
    }
    setLoading(false);
  }, [buildParams, t]);

  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    load(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onApply = useCallback(() => {
    load(false);
  }, [load]);

  const formatDateTime = (s?: string | null) => {
    if (!s) return '';
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return s;
    return d.toLocaleString();
  };

  const openApprove = (c: AdminGetCampaignResponse) => {
    setActionCampaign(c);
    setActionType('approve');
    setActionComment('');
    setActionError(null);
  };

  const openReject = (c: AdminGetCampaignResponse) => {
    setActionCampaign(c);
    setActionType('reject');
    setActionComment('');
    setActionError(null);
  };

  const closeModal = () => {
    setActionCampaign(null);
    setActionType(null);
    setActionComment('');
    setActionError(null);
    setActionSubmitting(false);
  };

  const submitAction = async () => {
    if (!actionCampaign || !actionType) return;
    const id = (typeof actionCampaign.id === 'number' && actionCampaign.id > 0)
      ? actionCampaign.id
      : undefined;
    if (!id) {
      const msg = t.adminCampaigns?.errors?.missingNumericId || 'Campaign numeric id not available';
      setActionError(msg);
      showError(msg);
      return;
    }
    setActionSubmitting(true);
    setActionError(null);
    const resp = actionType === 'approve'
      ? await adminApi.approveCampaign(id, actionComment?.trim() ? actionComment.trim() : undefined)
      : await adminApi.rejectCampaign(id, actionComment.trim());
    setActionSubmitting(false);
    if (!resp.success) {
      const msg = resp.message || (actionType === 'approve' ? (t.adminCampaigns?.errors?.approveFailed || 'Approve failed') : (t.adminCampaigns?.errors?.rejectFailed || 'Reject failed'));
      setActionError(msg);
      showError(msg);
      return;
    }
    // Update local row status
    setItems(prev => prev.map(x => x.uuid === actionCampaign.uuid ? { ...x, status: actionType === 'approve' ? 'approved' : 'rejected' } : x));
    closeModal();
  };

  return (
    <div className="p-4 max-w-[1400px] mx-auto">
      <h1 className="text-2xl font-semibold mb-4">{t.adminCampaigns?.title || 'Admin Campaigns'}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t.adminCampaigns?.filters?.titleLabel || 'Title'}</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder={t.adminCampaigns?.filters?.titlePlaceholder || 'Search by title'}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t.adminCampaigns?.filters?.statusLabel || 'Status'}</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={status || ''}
            onChange={(e) => setStatus((e.target.value || undefined) as any)}
          >
            {statusOptions.map(opt => (
              <option key={opt.label} value={opt.value || ''}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t.adminCampaigns?.filters?.startDateLabel || 'Start Date'}</label>
          <input
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t.adminCampaigns?.filters?.endDateLabel || 'End Date'}</label>
          <input
            type="datetime-local"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      <div className="mb-6">
        <button
          onClick={onApply}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? (t.common?.loading || 'Loading...') : (t.adminCampaigns?.filters?.apply || 'Apply')}
        </button>
      </div>

      {error && (
        <div className="text-red-600 mb-4">{error}</div>
      )}

      <div className="overflow-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="border px-2 py-2">{t.adminCampaigns?.table?.headers?.row || '#'}</th>
              <th className="border px-2 py-2">{t.adminCampaigns?.table?.headers?.uuid || 'UUID'}</th>
              <th className="border px-2 py-2">{t.adminCampaigns?.table?.headers?.status || 'Status'}</th>
              <th className="border px-2 py-2">{t.adminCampaigns?.table?.headers?.createdAt || 'Created At'}</th>
              <th className="border px-2 py-2">{t.adminCampaigns?.table?.headers?.updatedAt || 'Updated At'}</th>
              <th className="border px-2 py-2">{t.adminCampaigns?.table?.headers?.title || 'Title'}</th>
              <th className="border px-2 py-2">{t.adminCampaigns?.table?.headers?.segment || 'Segment'}</th>
              <th className="border px-2 py-2">{t.adminCampaigns?.table?.headers?.subsegment || 'Subsegment'}</th>
              <th className="border px-2 py-2">{t.adminCampaigns?.table?.headers?.sex || 'Sex'}</th>
              <th className="border px-2 py-2">{t.adminCampaigns?.table?.headers?.city || 'City'}</th>
              <th className="border px-2 py-2">{t.adminCampaigns?.table?.headers?.adLink || 'Ad Link'}</th>
              <th className="border px-2 py-2">{t.adminCampaigns?.table?.headers?.content || 'Content'}</th>
              <th className="border px-2 py-2">{t.adminCampaigns?.table?.headers?.scheduleAt || 'Schedule At'}</th>
              <th className="border px-2 py-2">{t.adminCampaigns?.table?.headers?.lineNumber || 'Line Number'}</th>
              <th className="border px-2 py-2">{t.adminCampaigns?.table?.headers?.budget || 'Budget'}</th>
              <th className="border px-2 py-2">{t.adminCampaigns?.table?.headers?.comment || 'Comment'}</th>
              <th className="border px-2 py-2">{t.adminCampaigns?.table?.headers?.actions || 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {!loading && error ? (
              <tr>
                <td colSpan={17} className="text-center py-6 text-red-600">{error}</td>
              </tr>
            ) : items.length === 0 && !loading ? (
              <tr>
                <td colSpan={17} className="text-center py-6">{t.adminCampaigns?.table?.noData || 'No campaigns found'}</td>
              </tr>
            ) : (
              items.map((it, idx) => (
                <tr key={it.uuid} className="odd:bg-white even:bg-gray-50">
                  <td className="border px-2 py-2 text-center">{idx + 1}</td>
                  <td className="border px-2 py-2 font-mono break-all">{it.uuid}</td>
                  <td className="border px-2 py-2">{it.status}</td>
                  <td className="border px-2 py-2">{formatDateTime(it.created_at)}</td>
                  <td className="border px-2 py-2">{formatDateTime(it.updated_at)}</td>
                  <td className="border px-2 py-2">{it.title || ''}</td>
                  <td className="border px-2 py-2">{it.segment || ''}</td>
                  <td className="border px-2 py-2">{Array.isArray(it.subsegment) ? it.subsegment.join(', ') : ''}</td>
                  <td className="border px-2 py-2">{it.sex || ''}</td>
                  <td className="border px-2 py-2">{Array.isArray(it.city) ? it.city.join(', ') : ''}</td>
                  <td className="border px-2 py-2 break-all">{it.adlink || ''}</td>
                  <td className="border px-2 py-2 break-all">{it.content || ''}</td>
                  <td className="border px-2 py-2">{formatDateTime(it.scheduleat)}</td>
                  <td className="border px-2 py-2">{it.line_number || ''}</td>
                  <td className="border px-2 py-2">{typeof it.budget === 'number' ? it.budget.toLocaleString() : ''}</td>
                  <td className="border px-2 py-2">{it.comment || ''}</td>
                  <td className="border px-2 py-2 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 rounded bg-green-600 text-white disabled:opacity-60"
                        onClick={() => openApprove(it)}
                        disabled={actionSubmitting || it.status !== 'waiting_for_approval'}
                      >
                        {t.adminCampaigns?.modal?.approve || 'Approve'}
                      </button>
                      <button
                        className="px-3 py-1 rounded bg-red-600 text-white disabled:opacity-60"
                        onClick={() => openReject(it)}
                        disabled={actionSubmitting || it.status !== 'waiting_for_approval'}
                      >
                        {t.adminCampaigns?.modal?.reject || 'Reject'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {actionType && actionCampaign && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg w-full max-w-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">{actionType === 'approve' ? (t.adminCampaigns?.modal?.approveTitle || 'Approve Campaign') : (t.adminCampaigns?.modal?.rejectTitle || 'Reject Campaign')}</h2>
              <button className="text-gray-500" onClick={closeModal}>✕</button>
            </div>
            <div className="space-y-3">
              <div className="text-sm text-gray-700">
                <div><span className="font-medium">{t.adminCampaigns?.modal?.uuid || 'UUID'}:</span> <span className="font-mono break-all">{actionCampaign.uuid}</span></div>
                <div><span className="font-medium">{t.adminCampaigns?.modal?.title || 'Title'}:</span> {actionCampaign.title || '-'}</div>
                <div><span className="font-medium">{t.adminCampaigns?.modal?.currentStatus || 'Current Status'}:</span> {actionCampaign.status}</div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{actionType === 'reject' ? (t.adminCampaigns?.modal?.commentLabelRequired || 'Comment (required)') : (t.adminCampaigns?.modal?.commentLabelOptional || 'Comment (optional)')}</label>
                <textarea
                  className="w-full border rounded px-3 py-2 min-h-[100px]"
                  value={actionComment}
                  onChange={(e) => setActionComment(e.target.value)}
                  maxLength={1000}
                />
                <div className="text-xs text-gray-500 mt-1">{t.adminCampaigns?.modal?.maxChars || 'Max 1000 chars'}</div>
              </div>
              {actionError && (
                <div className="text-sm text-red-600">{actionError}</div>
              )}
              <div className="flex justify-end gap-3 pt-2">
                <button className="px-4 py-2 rounded border" onClick={closeModal} disabled={actionSubmitting}>{t.common?.cancel || 'Cancel'}</button>
                <button
                  className={`${actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white px-4 py-2 rounded disabled:opacity-60`}
                  onClick={submitAction}
                  disabled={actionSubmitting || (actionType === 'reject' && !actionComment.trim())}
                >
                  {actionSubmitting ? (t.adminCampaigns?.modal?.submitting || 'Submitting…') : (actionType === 'approve' ? (t.adminCampaigns?.modal?.approve || 'Approve') : (t.adminCampaigns?.modal?.reject || 'Reject'))}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCampaignsPage; 