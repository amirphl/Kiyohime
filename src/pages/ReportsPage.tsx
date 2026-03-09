import React, { useEffect, useState, useRef, useMemo } from 'react';
import { apiService } from '../services/api';
import { GetSMSCampaignResponse } from '../types/campaign';
import { useAuth } from '../hooks/useAuth';
import { useCampaign } from '../hooks/useCampaign';
import { useNavigation } from '../contexts/NavigationContext';
import { useLanguage } from '../hooks/useLanguage';
import FiltersBar from './reports/components/FiltersBar';
import CampaignsTable from './reports/components/CampaignsTable';
import ReportDetailsModal from './reports/components/ReportDetailsModal';
import { getReportsCopy } from './reports/translations';

const ReportsPage: React.FC = () => {
  const { accessToken } = useAuth();
  const { language } = useLanguage();
  const copy = useMemo(() => getReportsCopy(language), [language]);
  const { updateLevel, updateContent, updateBudget, updatePayment, setCampaignUuid, goToStep, saveCampaignData } = useCampaign();
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
  const isFetchingRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  // Fetch campaigns whenever page/order/filter change
  useEffect(() => {
    if (!accessToken) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const fetchCampaigns = async () => {
      try {
        isFetchingRef.current = true;
        setLoading(true);
        setError(null);
        apiService.setAccessToken(accessToken);

        const params: any = { page, limit, orderby: orderBy };
        if (titleFilter && titleFilter.trim().length > 0) {
          params.title = titleFilter.trim();
        }

        const res = await apiService.listCampaigns(params, controller.signal);
        if (controller.signal.aborted) return;

        if (res.success && res.data) {
          const newItems = res.data.items || [];
          setItems(prev => (page === 1 ? newItems : [...prev, ...newItems]));
          if (res.data.pagination && typeof res.data.pagination.total_pages === 'number') {
            setHasMore(page < res.data.pagination.total_pages);
          } else {
            setHasMore(newItems.length === limit);
          }
        } else {
          const msg = res.message || 'Failed to load campaigns';
          setError(msg);
          setHasMore(false);
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        const msg = err instanceof Error ? err.message : 'Failed to load campaigns';
        setError(msg);
        setHasMore(false);
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    };

    fetchCampaigns();

    return () => {
      controller.abort();
    };
  }, [accessToken, page, orderBy, titleFilter]);

  // Reset pagination when order or title filter changes
  useEffect(() => {
    if (!accessToken) return;
    setItems([]);
    setHasMore(true);
    setPage(1);
  }, [orderBy, titleFilter, accessToken]);

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
        setPage(prev => prev + 1);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [loading, hasMore]);

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
    updateLevel({
      campaignTitle: selected.title || '',
      level1: (selected as any).level1 || (selected as any).segment || '',
      level3s: (selected as any).level3s || (selected as any).subsegment || [],
      tags: (selected as any).tags || [],
    });
    updateContent({
      insertLink: false,
      link: selected.adlink || '',
      text: selected.content || '',
      scheduleAt: selected.scheduleat || undefined,
    });
    updateBudget({
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
        // Use user's local system time (server returns UTC)
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
      // For FA: convert UTC to Tehran time then format in Shamsi
      return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
        timeZone: 'Asia/Tehran',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(jsDate);
    } catch {
      return '-';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FiltersBar
          titleInput={titleInput}
          onTitleChange={handleTitleChange}
          orderBy={orderBy}
          onOrderChange={setOrderBy}
          copy={copy}
        />

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-center">
            {error}
          </div>
        )}

        <CampaignsTable
          items={items}
          copy={copy}
          formatDateTime={formatReportDateTime}
          onDetails={openDetails}
          truncateText={truncateText}
        />

        {loading && (
          <div className="text-center text-gray-600 mt-4">{copy.loading}</div>
        )}
        {!hasMore && !loading && items.length > 0 && (
          <div className="text-center text-gray-400 text-sm mt-4">
            {copy.noMore}
          </div>
        )}
      </div>

      {showModal && selected && (
        <ReportDetailsModal
          campaign={selected}
          onClose={closeModal}
          onFixAndRestart={handleFixAndRestart}
          formatDateTime={formatReportDateTime}
          copy={copy}
        />
      )}
    </div>
  );
};

export default ReportsPage; 
