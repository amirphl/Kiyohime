import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AdminGetCampaignResponse,
  AdminListCampaignsFilter,
  AdminListCampaignsResponse,
  AdminPaginationInfo,
} from '../../../types/admin';
import { adminCampaignManagementApi } from '../api';
import { AdminCampaignManagementCopy } from '../translations';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

interface UseCampaignListOptions {
  copy: AdminCampaignManagementCopy;
  showError: (message: string) => void;
}

interface CampaignListState {
  items: AdminGetCampaignResponse[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
  limit: number;
  totalPages: number | null;
}

const normalizePagination = (
  pagination: AdminPaginationInfo | undefined,
  page: number,
  limit: number,
  receivedCount: number
) => {
  if (pagination && typeof pagination.total_pages === 'number') {
    return {
      page: pagination.page || page,
      limit: pagination.limit || limit,
      totalPages: pagination.total_pages,
      hasMore: (pagination.page || page) < pagination.total_pages,
    };
  }

  return {
    page,
    limit,
    totalPages: null,
    hasMore: receivedCount >= limit,
  };
};

const mergeItems = (
  current: AdminGetCampaignResponse[],
  incoming: AdminGetCampaignResponse[]
) => {
  const byUuid = new Map<string, AdminGetCampaignResponse>();

  for (const item of current) {
    byUuid.set(item.uuid, item);
  }

  for (const item of incoming) {
    byUuid.set(item.uuid, item);
  }

  return Array.from(byUuid.values());
};

export const useCampaignList = ({
  copy,
  showError,
}: UseCampaignListOptions) => {
  const [state, setState] = useState<CampaignListState>({
    items: [],
    loading: false,
    loadingMore: false,
    error: null,
    hasMore: true,
    page: 0,
    limit: DEFAULT_LIMIT,
    totalPages: null,
  });

  const mountedRef = useRef(false);
  const requestVersionRef = useRef(0);
  const activeRequestRef = useRef(false);
  const filtersRef = useRef<AdminListCampaignsFilter>({});

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const runRequest = useCallback(
    async (
      filters: AdminListCampaignsFilter,
      page: number,
      mode: 'replace' | 'append'
    ) => {
      if (activeRequestRef.current) return false;

      activeRequestRef.current = true;
      const requestVersion = requestVersionRef.current + 1;
      requestVersionRef.current = requestVersion;

      if (mountedRef.current) {
        setState(current => ({
          ...current,
          loading: mode === 'replace',
          loadingMore: mode === 'append',
          error: null,
          ...(mode === 'replace'
            ? { hasMore: true, totalPages: null, page: 0, items: [] }
            : {}),
        }));
      }

      try {
        const limit = filters.limit || state.limit || DEFAULT_LIMIT;
        const response = await adminCampaignManagementApi.listCampaigns({
          ...filters,
          page,
          limit,
        });

        if (
          !mountedRef.current ||
          requestVersion !== requestVersionRef.current
        ) {
          return false;
        }

        if (!response.success) {
          const message = response.message || copy.errors.listFailed;
          setState(current => ({
            ...current,
            loading: false,
            loadingMore: false,
            error: message,
            ...(mode === 'replace' ? { items: [], hasMore: false } : {}),
          }));
          showError(message);
          return false;
        }

        const data = (response.data || {
          items: [],
        }) as AdminListCampaignsResponse;
        const incomingItems = Array.isArray(data.items) ? data.items : [];
        const pagination = normalizePagination(
          data.pagination,
          page,
          limit,
          incomingItems.length
        );

        setState(current => {
          const nextItems =
            mode === 'append'
              ? mergeItems(current.items, incomingItems)
              : incomingItems;
          const noProgress =
            mode === 'append' && nextItems.length === current.items.length;

          return {
            ...current,
            items: nextItems,
            loading: false,
            loadingMore: false,
            error: null,
            hasMore: noProgress ? false : pagination.hasMore,
            page: pagination.page,
            limit: pagination.limit,
            totalPages: pagination.totalPages,
          };
        });

        return true;
      } catch (err) {
        if (
          !mountedRef.current ||
          requestVersion !== requestVersionRef.current
        ) {
          return false;
        }

        const fallbackMessage = copy.errors.listFailed;
        const message =
          err instanceof Error && err.message ? err.message : fallbackMessage;

        setState(current => ({
          ...current,
          loading: false,
          loadingMore: false,
          error: message,
          ...(mode === 'replace' ? { items: [], hasMore: false } : {}),
        }));
        showError(message);
        return false;
      } finally {
        activeRequestRef.current = false;
      }
    },
    [copy.errors.listFailed, showError, state.limit]
  );

  const replaceCampaigns = useCallback(
    async (filters: AdminListCampaignsFilter = {}) => {
      filtersRef.current = {
        ...filters,
        page: DEFAULT_PAGE,
        limit: filters.limit || DEFAULT_LIMIT,
      };

      return runRequest(filtersRef.current, DEFAULT_PAGE, 'replace');
    },
    [runRequest]
  );

  const loadNextPage = useCallback(async () => {
    if (activeRequestRef.current) return false;
    if (!state.hasMore) return false;

    const nextPage = Math.max(DEFAULT_PAGE, state.page + 1);
    const filters = {
      ...filtersRef.current,
      limit: filtersRef.current.limit || state.limit || DEFAULT_LIMIT,
    };

    return runRequest(filters, nextPage, 'append');
  }, [runRequest, state.hasMore, state.limit, state.page]);

  const updateCampaign = useCallback(
    (
      campaignUuid: string,
      updater: (campaign: AdminGetCampaignResponse) => AdminGetCampaignResponse
    ) => {
      setState(current => ({
        ...current,
        items: current.items.map(item =>
          item.uuid === campaignUuid ? updater(item) : item
        ),
      }));
    },
    []
  );

  return {
    items: state.items,
    loading: state.loading,
    loadingMore: state.loadingMore,
    error: state.error,
    hasMore: state.hasMore,
    replaceCampaigns,
    loadNextPage,
    updateCampaign,
  };
};
