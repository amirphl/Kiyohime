import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useLanguage } from '../../../hooks/useLanguage';
import apiService from '../../../services/api';
import { getApiErrorMessage } from '../../../utils/errorHandler';
import { BundleListItem, BundlePagination } from '../../../types/bundle';
import bundlesApi from '../api';
import { BundlesCopy } from '../translations';
import { getBundleTargetCustomerName } from '../utils';

interface UseBundlesOptions {
  copy: BundlesCopy;
}

const DEFAULT_PAGINATION: BundlePagination = {
  page: 1,
  limit: 10,
  total_items: 0,
  total_pages: 1,
};

const toSafeNumber = (value: unknown, fallback: number) => {
  const numericValue = typeof value === 'number' ? value : Number(value);

  return Number.isFinite(numericValue) ? numericValue : fallback;
};

const normalizePagination = (
  pagination?: Partial<BundlePagination> | null
): BundlePagination => {
  const totalItems = toSafeNumber(
    pagination?.total_items ?? pagination?.total,
    DEFAULT_PAGINATION.total_items ?? 0
  );

  return {
    page: Math.max(toSafeNumber(pagination?.page, DEFAULT_PAGINATION.page), 1),
    limit: Math.max(
      toSafeNumber(pagination?.limit, DEFAULT_PAGINATION.limit),
      1
    ),
    total_items: Math.max(totalItems, 0),
    total_pages: Math.max(
      toSafeNumber(pagination?.total_pages, DEFAULT_PAGINATION.total_pages),
      1
    ),
  };
};

export const useBundles = ({ copy }: UseBundlesOptions) => {
  const { accessToken } = useAuth();
  const { language } = useLanguage();
  const [items, setItems] = useState<BundleListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [titleFilter, setTitleFilter] = useState('');
  const [debouncedTitleFilter, setDebouncedTitleFilter] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [pagination, setPagination] =
    useState<BundlePagination>(DEFAULT_PAGINATION);
  const requestIdRef = useRef(0);

  const fetchBundles = useCallback(async () => {
    if (!accessToken) {
      setItems([]);
      setError(null);
      return;
    }
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    setLoading(true);
    setError(null);

    try {
      apiService.setAccessToken(accessToken);

      const response = await bundlesApi.list({
        page,
        limit,
        title: debouncedTitleFilter.trim() || undefined,
        target_audience_persona: undefined,
      });

      if (requestId !== requestIdRef.current) {
        return;
      }

      if (!response.success || !response.data) {
        setItems([]);
        setPagination(DEFAULT_PAGINATION);
        setError(
          getApiErrorMessage(response, language, copy.messages.listLoadFailed)
        );
        return;
      }

      setItems(response.data.items || []);
      setPagination(normalizePagination(response.data.pagination));
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      setItems([]);
      setPagination(DEFAULT_PAGINATION);
      setError(
        err instanceof Error ? err.message : copy.messages.listLoadFailed
      );
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [
    accessToken,
    copy.messages.listLoadFailed,
    debouncedTitleFilter,
    language,
    limit,
    page,
  ]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedTitleFilter(titleFilter);
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [titleFilter]);

  useEffect(() => {
    fetchBundles();
  }, [fetchBundles]);

  const filteredItems = useMemo(() => {
    const normalizedCustomerFilter = customerFilter.trim().toLowerCase();
    if (!normalizedCustomerFilter) return items;
    return items.filter(bundle => {
      const customerName = getBundleTargetCustomerName(bundle).toLowerCase();
      return customerName === normalizedCustomerFilter;
    });
  }, [customerFilter, items]);

  const customerOptions = useMemo(() => {
    const values = new Map<string, string>();
    items.forEach(bundle => {
      const name = getBundleTargetCustomerName(bundle);
      const normalizedName = name.toLowerCase();
      if (name && !values.has(normalizedName)) {
        values.set(normalizedName, name);
      }
    });
    return Array.from(values.values());
  }, [items]);

  const clearFilters = useCallback(() => {
    setTitleFilter('');
    setCustomerFilter('');
    setPage(1);
  }, []);

  const totalItems = customerFilter
    ? filteredItems.length
    : (pagination.total_items ?? 0);
  const totalPages = customerFilter
    ? 1
    : Math.max(pagination.total_pages || 1, 1);
  const currentPage = customerFilter ? 1 : page;

  return {
    items: filteredItems,
    loading,
    error,
    page: currentPage,
    limit,
    titleFilter,
    customerFilter,
    customerOptions,
    totalItems,
    totalPages,
    setPage,
    setLimit,
    setTitleFilter,
    setCustomerFilter,
    clearFilters,
    retry: fetchBundles,
  };
};
