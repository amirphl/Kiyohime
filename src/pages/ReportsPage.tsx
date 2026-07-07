import React, { useEffect, useState, useRef, useMemo } from 'react';
import { apiService } from '../services/api';
import {
  CampaignPlatform,
  GetCampaignResponse,
  ListSMSCampaignsParams,
} from '../types/campaign';
import { useAuth } from '../hooks/useAuth';
import { useCampaign } from '../hooks/useCampaign';
import { useNavigation } from '../contexts/NavigationContext';
import { useLanguage } from '../hooks/useLanguage';
import FiltersBar, { ReportsOrderBy } from './reports/components/FiltersBar';
import CampaignsTable from './reports/components/CampaignsTable';
import ReportDetailsModal from './reports/components/ReportDetailsModal';
import BulkHideActionBar from './reports/components/BulkHideActionBar';
import BulkUnhideActionBar from './reports/components/BulkUnhideActionBar';
import { useHideCampaigns } from './reports/hooks/useHideCampaigns';
import { useUnhideCampaigns } from './reports/hooks/useUnhideCampaigns';
import { getReportsCopy } from './reports/translations';

type CampaignPhaseFilter = ListSMSCampaignsParams['phase'] | '';

const ReportsPage: React.FC = () => {
  const { accessToken } = useAuth();
  const { language } = useLanguage();
  const copy = useMemo(() => getReportsCopy(language), [language]);
  const {
    updateLevel,
    updateContent,
    updateBudget,
    updatePayment,
    setCampaignUuid,
    setCampaignId,
    goToStep,
  } = useCampaign();
  const { navigate } = useNavigation();
  const [items, setItems] = useState<GetCampaignResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [hasMore, setHasMore] = useState(true);
  const [orderBy, setOrderBy] = useState<ReportsOrderBy>('newest');

  const [campaignTitleInput, setCampaignTitleInput] = useState('');
  const [campaignTitleFilter, setCampaignTitleFilter] = useState('');
  const campaignTitleDebounceRef = useRef<NodeJS.Timeout | null>(null);

  const [bundleIdFilter, setBundleIdFilter] = useState<number | null>(null);
  const [phaseFilter, setPhaseFilter] = useState<CampaignPhaseFilter>('');
  const [platformFilter, setPlatformFilter] = useState<CampaignPlatform | ''>(
    ''
  );
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [bulkHideMode, setBulkHideMode] = useState(false);
  const [bulkUnhideMode, setBulkUnhideMode] = useState(false);
  const [showHiddenCampaigns, setShowHiddenCampaigns] = useState(false);
  const [selectedCampaignIds, setSelectedCampaignIds] = useState<number[]>([]);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<GetCampaignResponse | null>(null);

  // Guards for double-invocation (StrictMode) and concurrent fetches
  const isFetchingRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  const { hideCampaigns, isSubmitting: isHidingCampaigns } = useHideCampaigns({
    copy,
    onHidden: hiddenCampaignIds => {
      const hiddenCampaignIdSet = new Set(hiddenCampaignIds);
      setItems(prevItems =>
        prevItems.filter(
          item => item.id == null || !hiddenCampaignIdSet.has(item.id)
        )
      );
      setSelectedCampaignIds([]);
      setBulkHideMode(false);
    },
  });

  const { unhideCampaigns, isSubmitting: isUnhidingCampaigns } =
    useUnhideCampaigns({
      copy,
      onUnhidden: unhiddenCampaignIds => {
        const unhiddenCampaignIdSet = new Set(unhiddenCampaignIds);
        setItems(prevItems =>
          prevItems.filter(
            item => item.id == null || !unhiddenCampaignIdSet.has(item.id)
          )
        );
        setSelectedCampaignIds([]);
        setBulkUnhideMode(false);
      },
    });

  // Track previous filter values to skip stale-page fetch when filters reset pagination
  const prevFiltersRef = useRef({
    orderBy,
    campaignTitleFilter,
    bundleIdFilter,
    phaseFilter,
    platformFilter,
    startDateFilter,
    endDateFilter,
  });

  // Initialize filters from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const phaseParam = params.get('phase');
    const bundleIdParam = params.get('bundleId');

    if (phaseParam === 'test' || phaseParam === 'execution') {
      setPhaseFilter(phaseParam);
    }

    if (bundleIdParam) {
      const bundleId = Number(bundleIdParam);
      if (Number.isFinite(bundleId) && bundleId > 0) {
        setBundleIdFilter(bundleId);
      }
    }
  }, []);

  // Fetch campaigns whenever page/order/filter change
  useEffect(() => {
    if (!accessToken) return;

    // When filters change while page > 1, skip: the reset effect will set page=1 and re-trigger
    const prev = prevFiltersRef.current;
    const filtersChanged =
      prev.orderBy !== orderBy ||
      prev.campaignTitleFilter !== campaignTitleFilter ||
      prev.bundleIdFilter !== bundleIdFilter ||
      prev.phaseFilter !== phaseFilter ||
      prev.platformFilter !== platformFilter ||
      prev.startDateFilter !== startDateFilter ||
      prev.endDateFilter !== endDateFilter;
    prevFiltersRef.current = {
      orderBy,
      campaignTitleFilter,
      bundleIdFilter,
      phaseFilter,
      platformFilter,
      startDateFilter,
      endDateFilter,
    };
    if (filtersChanged && page > 1) return;

    if (
      startDateFilter &&
      endDateFilter &&
      new Date(startDateFilter).getTime() > new Date(endDateFilter).getTime()
    ) {
      setError(copy.invalidDateRange);
      setLoading(false);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const fetchCampaigns = async () => {
      try {
        isFetchingRef.current = true;
        setLoading(true);
        setError(null);
        apiService.setAccessToken(accessToken);

        const params: ListSMSCampaignsParams = {
          page,
          limit,
          orderby: orderBy,
        };
        if (campaignTitleFilter.trim()) {
          params.campaign_title = campaignTitleFilter.trim();
        }
        if (bundleIdFilter) params.bundle_id = bundleIdFilter;
        if (phaseFilter) params.phase = phaseFilter;
        if (platformFilter) params.platform = platformFilter;
        if (startDateFilter) params.start_date = startDateFilter;
        if (endDateFilter) params.end_date = endDateFilter;

        const res = await apiService.listCampaigns(params, controller.signal);
        if (controller.signal.aborted) return;

        if (res.success && res.data) {
          const newItems = res.data.items || [];
          setItems(prev => (page === 1 ? newItems : [...prev, ...newItems]));
          if (
            res.data.pagination &&
            typeof res.data.pagination.total_pages === 'number'
          ) {
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
        const msg =
          err instanceof Error ? err.message : 'Failed to load campaigns';
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
  }, [
    accessToken,
    page,
    orderBy,
    campaignTitleFilter,
    bundleIdFilter,
    phaseFilter,
    platformFilter,
    startDateFilter,
    endDateFilter,
    copy.invalidDateRange,
  ]);

  useEffect(() => {
    if (!accessToken) return;
    setItems([]);
    setHasMore(true);
    setPage(1);
  }, [
    orderBy,
    campaignTitleFilter,
    bundleIdFilter,
    phaseFilter,
    platformFilter,
    startDateFilter,
    endDateFilter,
    accessToken,
  ]);

  const handleCampaignTitleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val = e.target.value;
    setCampaignTitleInput(val);
    if (campaignTitleDebounceRef.current) {
      clearTimeout(campaignTitleDebounceRef.current);
    }
    campaignTitleDebounceRef.current = setTimeout(() => {
      setCampaignTitleFilter(val);
    }, 1000);
  };

  // Infinite scroll handler
  useEffect(() => {
    const onScroll = () => {
      if (loading || !hasMore || isFetchingRef.current) return;
      const threshold = 200; // px from bottom
      const scrolled =
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - threshold;
      if (scrolled) {
        setPage(prev => prev + 1);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [loading, hasMore]);

  useEffect(
    () => () => {
      if (campaignTitleDebounceRef.current) {
        clearTimeout(campaignTitleDebounceRef.current);
      }
    },
    []
  );

  useEffect(() => {
    if (!bulkHideMode && !bulkUnhideMode && selectedCampaignIds.length > 0) {
      setSelectedCampaignIds([]);
    }
  }, [bulkHideMode, bulkUnhideMode, selectedCampaignIds.length]);

  useEffect(() => {
    const visibleCampaignIds = new Set(
      items
        .map(item => item.id)
        .filter(
          (campaignId): campaignId is number => typeof campaignId === 'number'
        )
    );

    setSelectedCampaignIds(prevSelectedIds => {
      if (prevSelectedIds.length === 0) {
        return prevSelectedIds;
      }

      const nextSelectedIds = prevSelectedIds.filter(campaignId =>
        visibleCampaignIds.has(campaignId)
      );

      return nextSelectedIds.length === prevSelectedIds.length
        ? prevSelectedIds
        : nextSelectedIds;
    });
  }, [items]);

  const openDetails = (c: GetCampaignResponse) => {
    setSelected(c);
    setShowModal(true);
  };

  const handleToggleCampaignSelection = (
    campaignId: number,
    selectedValue: boolean
  ) => {
    setSelectedCampaignIds(prevSelectedIds => {
      if (selectedValue) {
        return prevSelectedIds.includes(campaignId)
          ? prevSelectedIds
          : [...prevSelectedIds, campaignId];
      }

      return prevSelectedIds.filter(id => id !== campaignId);
    });
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
    // Clear id and uuid so step 1 creates a fresh campaign
    setCampaignId(undefined);
    setCampaignUuid('');
    updateLevel({
      campaignTitle: selected.title || '',
      platform: selected.platform ?? 'sms',
      level1: selected.level1 || '',
      level2s: Array.isArray(selected.level2s) ? selected.level2s : [],
      level3s: Array.isArray(selected.level3s) ? selected.level3s : [],
      audienceGrades: Array.isArray(selected.audience_grades)
        ? selected.audience_grades
        : [],
      tags: Array.isArray(selected.tags) ? selected.tags : [],
      bundleId: selected.bundle_id ?? null,
      phase: selected.phase ?? undefined,
    });
    updateContent({
      insertLink: false,
      link: selected.adlink || '',
      text: selected.content || '',
      scheduleAt: selected.scheduleat || undefined,
      lineNumber: selected.line_number || '',
      platformSettingsId: selected.platform_settings_id ?? null,
      mediaUuid: selected.media_uuid ?? null,
    });
    updateBudget({
      totalBudget: selected.budget || 0,
    });
    updatePayment({ termsAccepted: false });
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

  const displayedItems =
    bulkUnhideMode || showHiddenCampaigns
      ? items
      : items.filter(item => !item.hidden);

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <FiltersBar
          language={language === 'fa' ? 'fa' : 'en'}
          campaignTitleInput={campaignTitleInput}
          onCampaignTitleChange={handleCampaignTitleChange}
          orderBy={orderBy}
          onOrderChange={setOrderBy}
          bundleIdFilter={bundleIdFilter}
          onBundleIdChange={setBundleIdFilter}
          phaseFilter={phaseFilter}
          onPhaseChange={setPhaseFilter}
          platformFilter={platformFilter}
          onPlatformChange={setPlatformFilter}
          startDate={startDateFilter}
          onStartDateChange={setStartDateFilter}
          endDate={endDateFilter}
          onEndDateChange={setEndDateFilter}
          bulkHideMode={bulkHideMode}
          onBulkHideModeChange={setBulkHideMode}
          bulkUnhideMode={bulkUnhideMode}
          onBulkUnhideModeChange={setBulkUnhideMode}
          showHiddenCampaigns={showHiddenCampaigns}
          onShowHiddenCampaignsChange={setShowHiddenCampaigns}
          accessToken={accessToken}
          copy={copy}
        />

        {error && (
          <div className='mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-center'>
            {error}
          </div>
        )}

        <CampaignsTable
          items={displayedItems}
          copy={copy}
          formatDateTime={formatReportDateTime}
          onDetails={openDetails}
          truncateText={truncateText}
          bulkHideMode={bulkHideMode}
          bulkUnhideMode={bulkUnhideMode}
          selectedCampaignIds={selectedCampaignIds}
          onToggleCampaignSelection={handleToggleCampaignSelection}
        />

        {bulkHideMode ? (
          <BulkHideActionBar
            copy={copy}
            selectedCount={selectedCampaignIds.length}
            isSubmitting={isHidingCampaigns}
            onSubmit={() => hideCampaigns(selectedCampaignIds)}
          />
        ) : null}

        {bulkUnhideMode ? (
          <BulkUnhideActionBar
            copy={copy}
            selectedCount={selectedCampaignIds.length}
            isSubmitting={isUnhidingCampaigns}
            onSubmit={() => unhideCampaigns(selectedCampaignIds)}
          />
        ) : null}

        {loading && (
          <div className='text-center text-gray-600 mt-4'>{copy.loading}</div>
        )}
        {!hasMore && !loading && items.length > 0 && (
          <div className='text-center text-gray-400 text-sm mt-4'>
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
