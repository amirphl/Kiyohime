import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { apiService } from '../services/api';
import { GetSMSCampaignResponse } from '../types/campaign';
import { useAuth } from '../hooks/useAuth';
import { useCampaign } from '../hooks/useCampaign';
import { useNavigation } from '../contexts/NavigationContext';
import { useLanguage } from '../hooks/useLanguage';
import DateObject from 'react-date-object';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';

const ReportsPage: React.FC = () => {
  const { t } = useTranslation();
  const { accessToken } = useAuth();
  const { language } = useLanguage();
  const { updateSegment, updateContent, updateBudget, updatePayment, setCampaignUuid, goToStep, saveCampaignData } = useCampaign();
  const { navigate } = useNavigation();
  const [items, setItems] = useState<GetSMSCampaignResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [hasMore, setHasMore] = useState(true);
  const [orderBy, setOrderBy] = useState<'newest' | 'oldest'>('newest');

  // Title filter state with debounce
  const [titleInput, setTitleInput] = useState('');
  const [titleFilter, setTitleFilter] = useState('');
  const titleDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<GetSMSCampaignResponse | null>(null);

  // Guards for double-invocation (StrictMode) and concurrent fetches
  const initialLoadRef = useRef(false);
  const isFetchingRef = useRef(false);
  const orderInitRef = useRef(true);
  const titleInitRef = useRef(true);

  const fetchPage = useCallback(async (pageNum: number) => {
    if (!accessToken) return;
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    apiService.setAccessToken(accessToken);
    setLoading(true);
    setError(null);
    const params: any = { page: pageNum, limit, orderby: orderBy };
    if (titleFilter && titleFilter.trim().length > 0) {
      params.title = titleFilter.trim();
    }
    const res = await apiService.listCampaigns(params);
    if (res.success && res.data) {
      const newItems = res.data.items || [];
      setItems(prev => (pageNum === 1 ? newItems : [...prev, ...newItems]));
      if (res.data.pagination && typeof res.data.pagination.total_pages === 'number') {
        setHasMore(pageNum < res.data.pagination.total_pages);
      } else {
        setHasMore(newItems.length === limit);
      }
    } else {
      setError(res.message || 'Failed to load campaigns');
      setHasMore(false);
    }
    setLoading(false);
    isFetchingRef.current = false;
  }, [accessToken, orderBy, titleFilter]);

  // Initial load or when token available
  useEffect(() => {
    if (!accessToken) return;
    if (initialLoadRef.current) return;
    initialLoadRef.current = true;
    setPage(1);
    fetchPage(1);
  }, [accessToken, fetchPage]);

  // Re-fetch when order changes (skip first render)
  useEffect(() => {
    if (!accessToken) return;
    if (orderInitRef.current) {
      orderInitRef.current = false;
      return;
    }
    setItems([]);
    setHasMore(true);
    setPage(1);
    fetchPage(1);
  }, [orderBy, accessToken, fetchPage]);

  // Re-fetch when title filter changes (debounced and skip first render)
  useEffect(() => {
    if (!accessToken) return;
    if (titleInitRef.current) {
      titleInitRef.current = false;
      return;
    }
    setItems([]);
    setHasMore(true);
    setPage(1);
    fetchPage(1);
  }, [titleFilter, accessToken, fetchPage]);

  // Debounce title input
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitleInput(val);
    if (titleDebounceRef.current) {
      clearTimeout(titleDebounceRef.current);
    }
    titleDebounceRef.current = setTimeout(() => {
      setTitleFilter(val);
    }, 1000);
  };

  // Infinite scroll handler
  useEffect(() => {
    const onScroll = () => {
      if (loading || !hasMore || isFetchingRef.current) return;
      const threshold = 200; // px from bottom
      const scrolled = window.innerHeight + window.scrollY >= document.body.offsetHeight - threshold;
      if (scrolled) {
        const next = page + 1;
        setPage(next);
        fetchPage(next);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [loading, hasMore, page, fetchPage]);

  const openDetails = (c: GetSMSCampaignResponse) => {
    setSelected(c);
    setShowModal(true);
  };

  const truncateText = (text: string, max = 30) => {
    if (!text) return '-';
    const t = text.trim();
    return t.length <= max ? t : `${t.slice(0, max)}…`;
  };

  const closeModal = () => {
    setShowModal(false);
    setSelected(null);
  };

  const handleFixAndRestart = () => {
    if (!selected) return;
    // Prefill campaign creation data from selected campaign, but clear UUID to create a new one later
    setCampaignUuid('');
    updateSegment({
      campaignTitle: selected.title || '',
      segment: selected.segment || '',
      subsegments: selected.subsegment || [],
      sex: selected.sex || '',
      city: selected.city || [],
    });
    updateContent({
      insertLink: false,
      link: selected.adlink || '',
      text: selected.content || '',
      scheduleAt: selected.scheduleat || undefined,
    });
    updateBudget({
      lineNumber: selected.line_number || '',
      totalBudget: selected.budget || 0,
    });
    updatePayment({ termsAccepted: false });
    saveCampaignData();
    goToStep(1);
    navigate('/campaign-creation');
    closeModal();
  };

  const formatReportDateTime = (iso?: string) => {
    if (!iso) return '-';
    try {
      const jsDate = new Date(iso);
      if (language === 'en') {
        // Use user's local system time
        return jsDate.toLocaleString(undefined, {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });
      }
      // For FA: convert to Tehran local then format in Shamsi
      const tehranMs = jsDate.getTime() + 3.5 * 60 * 60 * 1000;
      const tehranDate = new Date(tehranMs);
      const dobj = new DateObject({ date: tehranDate, calendar: persian, locale: persian_fa });
      return dobj.format('YYYY/MM/DD HH:mm:ss');
    } catch {
      return '-';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.reports')}</h1>
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <input
                type="text"
                value={titleInput}
                onChange={handleTitleChange}
                placeholder={t('dashboard.filterTitlePlaceholder') || 'Filter by title...'}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-primary-500"
              />
            </div>
            <span className="text-sm text-gray-600">{t('dashboard.sortBy') || 'Sort by'}:</span>
            <div className="inline-flex rounded-md shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => setOrderBy('newest')}
                className={`px-3 py-1 text-sm ${orderBy === 'newest' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                {t('dashboard.sortNewest') || 'Newest'}
              </button>
              <button
                onClick={() => setOrderBy('oldest')}
                className={`px-3 py-1 text-sm border-l border-gray-200 ${orderBy === 'oldest' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                {t('dashboard.sortOldest') || 'Oldest'}
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            {error && <div className="text-center text-red-600 mb-4">{error}</div>}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.reportsTable.row')}</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.reportsTable.title')}</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.reportsTable.text')}</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.reportsTable.lineNumber')}</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.reportsTable.segment')}</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.reportsTable.sent')}</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.reportsTable.status')}</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.reportsTable.total')}</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.reportsTable.createdAt')}</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard.reportsTable.scheduleAt')}</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((c, idx) => (
                    <tr key={c.uuid}>
                      <td className="px-4 py-2 text-sm text-gray-900 text-center">{idx + 1}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{truncateText(c.title || '')}</td>
                      <td className="px-4 py-2 text-sm text-gray-700 max-w-xs">{truncateText(c.content || '')}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-center">{c.line_number || '-'}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-center">{c.segment || '-'}</td>
                      <td className="px-4 py-2 text-sm text-gray-500 text-center">-</td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-center">{t(`dashboard.reportsStatus.${c.status}`) || c.status}</td>
                      <td className="px-4 py-2 text-sm text-gray-500 text-center">-</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{formatReportDateTime(c.created_at)}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{formatReportDateTime(c.scheduleat)}</td>
                      <td className="px-4 py-2 text-right">
                        <button onClick={() => openDetails(c)} className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">{t('dashboard.reportsTable.details')}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {loading && <div className="text-center text-gray-600 mt-4">Loading...</div>}
            {!hasMore && !loading && items.length > 0 && (
              <div className="text-center text-gray-400 text-sm mt-4">No more campaigns</div>
            )}
          </div>
        </div>
      </div>

      {showModal && selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.reportsTable.details')}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">×</button>
            </div>

            <div className="p-4 space-y-4">
              {selected.status === 'rejected' && selected.comment && (
                <div className="p-3 rounded bg-red-50 text-red-700 border border-red-200">
                  <div className="font-medium mb-1">{t('dashboard.reportsStatus.rejected')}</div>
                  <div className="text-sm whitespace-pre-wrap break-words">{selected.comment}</div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500">{t('dashboard.reportsTable.status')}</div>
                  <div className="text-sm text-gray-900">{t(`dashboard.reportsStatus.${selected.status}`) || selected.status}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">{t('dashboard.reportsTable.title')}</div>
                  <div className="text-sm text-gray-900 break-words">{selected.title || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">{t('dashboard.reportsTable.lineNumber')}</div>
                  <div className="text-sm text-gray-900 break-words">{selected.line_number || '-'}</div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-xs text-gray-500">{t('dashboard.reportsTable.text')}</div>
                  <div className="text-sm text-gray-900 whitespace-pre-wrap break-words">{selected.content || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">{t('dashboard.reportsTable.segment')}</div>
                  <div className="text-sm text-gray-900 break-words">{selected.segment || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">{t('dashboard.reportsTable.subsegments')}</div>
                  <div className="text-sm text-gray-900 break-words">{selected.subsegment && selected.subsegment.length ? selected.subsegment.join(', ') : '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">{t('dashboard.reportsTable.sex')}</div>
                  <div className="text-sm text-gray-900">{selected.sex || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">{t('dashboard.reportsTable.cities')}</div>
                  <div className="text-sm text-gray-900 break-words">{selected.city && selected.city.length ? selected.city.join(', ') : '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">{t('dashboard.reportsTable.adlink')}</div>
                  <div className="text-sm text-blue-700 break-words">{selected.adlink || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">{t('dashboard.reportsTable.scheduleAt')}</div>
                  <div className="text-sm text-gray-900">{formatReportDateTime(selected.scheduleat)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">{t('dashboard.reportsTable.total')}</div>
                  <div className="text-sm text-gray-900">{typeof selected.total === 'number' ? selected.total : '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">{t('dashboard.reportsTable.createdAt')}</div>
                  <div className="text-sm text-gray-900">{formatReportDateTime(selected.created_at)}</div>
                </div>
                {selected.updated_at && (
                  <div>
                    <div className="text-xs text-gray-500">{t('dashboard.reportsTable.updatedAt')}</div>
                    <div className="text-sm text-gray-900">{formatReportDateTime(selected.updated_at)}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
              <button onClick={closeModal} className="px-4 py-2 text-sm rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">{t('common.close') || 'Close'}</button>
              {selected.status === 'rejected' && (
                <button onClick={handleFixAndRestart} className="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700">{t('dashboard.fixAndRestart') || 'Fix and restart the campaign?'}</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage; 