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
    totalPages: null,
  });

  const mountedRef = useRef(false);
  const requestVersionRef = useRef(0);
  const replaceRequestRef = useRef(false);
  const appendRequestRef = useRef(false);
  const filtersRef = useRef<AdminListCampaignsFilter>({});
  const limitRef = useRef(DEFAULT_LIMIT);
  const hasMoreRef = useRef(true);
  const pageRef = useRef(0);
  hasMoreRef.current = state.hasMore;
  pageRef.current = state.page;

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
      if (mode === 'replace') {
        if (replaceRequestRef.current) return false;
        replaceRequestRef.current = true;
      } else {
        if (appendRequestRef.current || replaceRequestRef.current) return false;
        appendRequestRef.current = true;
      }

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
        const limit = filters.limit || limitRef.current;
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

        limitRef.current = pagination.limit;

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
        if (mode === 'replace') {
          replaceRequestRef.current = false;
        } else {
          appendRequestRef.current = false;
        }
      }
    },
    [copy.errors.listFailed, showError]
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
    if (appendRequestRef.current || replaceRequestRef.current) return false;
    if (!hasMoreRef.current) return false;

    const nextPage = Math.max(DEFAULT_PAGE, pageRef.current + 1);
    const filters = {
      ...filtersRef.current,
      limit: filtersRef.current.limit || limitRef.current,
    };

    return runRequest(filters, nextPage, 'append');
  }, [runRequest]);

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
