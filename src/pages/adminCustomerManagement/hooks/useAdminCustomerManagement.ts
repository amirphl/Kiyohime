import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AdminCustomerDiscountHistoryItem,
  AdminCustomersSharesResponse,
  AdminCustomerWithCampaignsResponse,
  AdminGetCampaignResponse,
  AdminSetCustomerActiveStatusRequest,
} from '../../../types/admin';
import { adminCustomerManagementApi } from '../api';
import { AdminCustomerManagementCopy } from '../translations';

interface UseAdminCustomerManagementOptions {
  copy: AdminCustomerManagementCopy;
  onError: (message: string) => void;
}

type LoadParams = {
  start?: string;
  end?: string;
};

const toIsoIfValid = (value: string): string | undefined => {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

export const useAdminCustomerManagement = ({
  copy,
  onError,
}: UseAdminCustomerManagementOptions) => {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AdminCustomersSharesResponse | null>(null);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [details, setDetails] =
    useState<AdminCustomerWithCampaignsResponse | null>(null);

  const [campaignOpen, setCampaignOpen] = useState(false);
  const [campaignLoading, setCampaignLoading] = useState(false);
  const [campaignError, setCampaignError] = useState<string | null>(null);
  const [campaign, setCampaign] = useState<AdminGetCampaignResponse | null>(
    null
  );

  const [discountsOpen, setDiscountsOpen] = useState(false);
  const [discountsLoading, setDiscountsLoading] = useState(false);
  const [discountsError, setDiscountsError] = useState<string | null>(null);
  const [discountsItems, setDiscountsItems] = useState<
    AdminCustomerDiscountHistoryItem[] | null
  >(null);

  const [toggleLoadingId, setToggleLoadingId] = useState<number | null>(null);

  const mountedRef = useRef(false);
  const didInitRef = useRef(false);
  const onErrorRef = useRef(onError);

  const sharesRequestIdRef = useRef(0);
  const detailsRequestIdRef = useRef(0);
  const campaignRequestIdRef = useRef(0);
  const discountsRequestIdRef = useRef(0);

  const sharesInFlightKeyRef = useRef<string | null>(null);
  const detailsInFlightIdRef = useRef<number | null>(null);
  const campaignInFlightIdRef = useRef<number | null>(null);
  const discountsInFlightIdRef = useRef<number | null>(null);
  const toggleInFlightIdRef = useRef<number | null>(null);

  const detailsCacheRef = useRef<
    Map<number, AdminCustomerWithCampaignsResponse>
  >(new Map());
  const campaignCacheRef = useRef<Map<number, AdminGetCampaignResponse>>(
    new Map()
  );
  const discountsCacheRef = useRef<
    Map<number, AdminCustomerDiscountHistoryItem[]>
  >(new Map());

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  const load = useCallback(
    async (params?: LoadParams) => {
      const startValue = params?.start ?? start;
      const endValue = params?.end ?? end;
      const requestKey = JSON.stringify({
        start: toIsoIfValid(startValue) || null,
        end: toIsoIfValid(endValue) || null,
      });

      if (sharesInFlightKeyRef.current === requestKey) {
        return;
      }

      sharesInFlightKeyRef.current = requestKey;
      const requestId = sharesRequestIdRef.current + 1;
      sharesRequestIdRef.current = requestId;

      if (mountedRef.current) {
        setLoading(true);
        setError(null);
      }

      try {
        const res = await adminCustomerManagementApi.getCustomersShares({
          start_date: toIsoIfValid(startValue),
          end_date: toIsoIfValid(endValue),
        });

        if (!mountedRef.current || requestId !== sharesRequestIdRef.current) {
          return;
        }

        if (!res.success) {
          const message = res.message || copy.table.noData;
          setError(message);
          setData(null);
          onErrorRef.current(message);
          return;
        }

        setData(res.data || null);
      } catch (err) {
        if (!mountedRef.current || requestId !== sharesRequestIdRef.current) {
          return;
        }

        const message =
          err instanceof Error && err.message ? err.message : copy.table.noData;
        setError(message);
        setData(null);
        onErrorRef.current(message);
      } finally {
        if (mountedRef.current && requestId === sharesRequestIdRef.current) {
          setLoading(false);
        }
        if (sharesInFlightKeyRef.current === requestKey) {
          sharesInFlightKeyRef.current = null;
        }
      }
    },
    [copy.table.noData, end, start]
  );

  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    load({ start: '', end: '' });
  }, [load]);

  const openDetails = useCallback(
    async (customerId?: number) => {
      if (!customerId || customerId <= 0) {
        setDetailsError(copy.modals.detailsNoData);
        setDetails(null);
        setDetailsOpen(true);
        return;
      }

      setDetailsOpen(true);
      setDetailsError(null);

      const cached = detailsCacheRef.current.get(customerId);
      if (cached) {
        setDetails(cached);
        setDetailsLoading(false);
        return;
      }

      if (detailsInFlightIdRef.current === customerId) {
        return;
      }

      detailsInFlightIdRef.current = customerId;
      const requestId = detailsRequestIdRef.current + 1;
      detailsRequestIdRef.current = requestId;

      setDetails(null);
      setDetailsLoading(true);

      try {
        const res =
          await adminCustomerManagementApi.getCustomerWithCampaigns(customerId);

        if (!mountedRef.current || requestId !== detailsRequestIdRef.current) {
          return;
        }

        if (!res.success) {
          const message = res.message || copy.modals.detailsNoData;
          setDetailsError(message);
          onErrorRef.current(message);
          return;
        }

        const nextDetails = res.data || null;
        if (nextDetails) {
          detailsCacheRef.current.set(customerId, nextDetails);
        }
        setDetails(nextDetails);
      } catch (err) {
        if (!mountedRef.current || requestId !== detailsRequestIdRef.current) {
          return;
        }

        const message =
          err instanceof Error && err.message
            ? err.message
            : copy.modals.detailsNoData;
        setDetailsError(message);
        onErrorRef.current(message);
      } finally {
        if (mountedRef.current && requestId === detailsRequestIdRef.current) {
          setDetailsLoading(false);
        }
        if (detailsInFlightIdRef.current === customerId) {
          detailsInFlightIdRef.current = null;
        }
      }
    },
    [copy.modals.detailsNoData]
  );

  const openCampaign = useCallback(
    async (campaignId?: number | null) => {
      if (!campaignId || campaignId <= 0) return;

      setCampaignOpen(true);
      setCampaignError(null);

      const cached = campaignCacheRef.current.get(campaignId);
      if (cached) {
        setCampaign(cached);
        setCampaignLoading(false);
        return;
      }

      if (campaignInFlightIdRef.current === campaignId) {
        return;
      }

      campaignInFlightIdRef.current = campaignId;
      const requestId = campaignRequestIdRef.current + 1;
      campaignRequestIdRef.current = requestId;

      setCampaign(null);
      setCampaignLoading(true);

      try {
        const res =
          await adminCustomerManagementApi.getCampaignById(campaignId);

        if (!mountedRef.current || requestId !== campaignRequestIdRef.current) {
          return;
        }

        if (!res.success) {
          const message = res.message || copy.table.noData;
          setCampaignError(message);
          onErrorRef.current(message);
          return;
        }

        const nextCampaign = res.data || null;
        if (nextCampaign) {
          campaignCacheRef.current.set(campaignId, nextCampaign);
        }
        setCampaign(nextCampaign);
      } catch (err) {
        if (!mountedRef.current || requestId !== campaignRequestIdRef.current) {
          return;
        }

        const message =
          err instanceof Error && err.message ? err.message : copy.table.noData;
        setCampaignError(message);
        onErrorRef.current(message);
      } finally {
        if (mountedRef.current && requestId === campaignRequestIdRef.current) {
          setCampaignLoading(false);
        }
        if (campaignInFlightIdRef.current === campaignId) {
          campaignInFlightIdRef.current = null;
        }
      }
    },
    [copy.table.noData]
  );

  const openDiscounts = useCallback(
    async (customerId?: number | null) => {
      if (!customerId || customerId <= 0) {
        setDiscountsItems(null);
        setDiscountsError(copy.discountsTable.noData);
        setDiscountsOpen(true);
        return;
      }

      setDiscountsOpen(true);
      setDiscountsError(null);

      const cached = discountsCacheRef.current.get(customerId);
      if (cached) {
        setDiscountsItems(cached);
        setDiscountsLoading(false);
        return;
      }

      if (discountsInFlightIdRef.current === customerId) {
        return;
      }

      discountsInFlightIdRef.current = customerId;
      const requestId = discountsRequestIdRef.current + 1;
      discountsRequestIdRef.current = requestId;

      setDiscountsItems(null);
      setDiscountsLoading(true);

      try {
        const res =
          await adminCustomerManagementApi.getCustomerDiscountsHistory(
            customerId
          );

        if (
          !mountedRef.current ||
          requestId !== discountsRequestIdRef.current
        ) {
          return;
        }

        if (!res.success) {
          const message = res.message || copy.discountsTable.noData;
          setDiscountsError(message);
          onErrorRef.current(message);
          return;
        }

        const items = res.data?.items || [];
        discountsCacheRef.current.set(customerId, items);
        setDiscountsItems(items);
      } catch (err) {
        if (
          !mountedRef.current ||
          requestId !== discountsRequestIdRef.current
        ) {
          return;
        }

        const message =
          err instanceof Error && err.message
            ? err.message
            : copy.discountsTable.noData;
        setDiscountsError(message);
        onErrorRef.current(message);
      } finally {
        if (mountedRef.current && requestId === discountsRequestIdRef.current) {
          setDiscountsLoading(false);
        }
        if (discountsInFlightIdRef.current === customerId) {
          discountsInFlightIdRef.current = null;
        }
      }
    },
    [copy.discountsTable.noData]
  );

  const handleToggleActive = useCallback(
    async (customerId?: number, current?: boolean | null) => {
      if (!customerId || customerId <= 0) return;
      if (toggleInFlightIdRef.current === customerId) return;

      toggleInFlightIdRef.current = customerId;
      setToggleLoadingId(customerId);

      try {
        const payload: AdminSetCustomerActiveStatusRequest = {
          customer_id: customerId,
          is_active: !Boolean(current),
        };
        const res =
          await adminCustomerManagementApi.setCustomerActiveStatus(payload);

        if (!mountedRef.current) {
          return;
        }

        if (!res.success) {
          const message = res.message || copy.table.noData;
          onErrorRef.current(message);
          return;
        }

        const nextIsActive = res.data?.is_active ?? !current;

        setData(prev => {
          if (!prev) return prev;

          return {
            ...prev,
            items: (prev.items || []).map(item =>
              item.customer_id === customerId
                ? { ...item, is_active: nextIsActive }
                : item
            ),
          };
        });

        const cachedDetails = detailsCacheRef.current.get(customerId);
        if (cachedDetails) {
          detailsCacheRef.current.set(customerId, {
            ...cachedDetails,
            customer: {
              ...cachedDetails.customer,
              is_active: nextIsActive,
            },
          });
        }

        setDetails(prev => {
          if (!prev || prev.customer.id !== customerId) return prev;
          return {
            ...prev,
            customer: {
              ...prev.customer,
              is_active: nextIsActive,
            },
          };
        });
      } catch (err) {
        if (!mountedRef.current) {
          return;
        }

        const message =
          err instanceof Error && err.message ? err.message : copy.table.noData;
        onErrorRef.current(message);
      } finally {
        if (mountedRef.current) {
          setToggleLoadingId(null);
        }
        if (toggleInFlightIdRef.current === customerId) {
          toggleInFlightIdRef.current = null;
        }
      }
    },
    [copy.table.noData]
  );

  return {
    start,
    end,
    loading,
    error,
    data,
    detailsOpen,
    detailsLoading,
    detailsError,
    details,
    campaignOpen,
    campaignLoading,
    campaignError,
    campaign,
    discountsOpen,
    discountsLoading,
    discountsError,
    discountsItems,
    toggleLoadingId,
    setStart,
    setEnd,
    setDetailsOpen,
    setCampaignOpen,
    setDiscountsOpen,
    load,
    openDetails,
    openCampaign,
    openDiscounts,
    handleToggleActive,
  };
};
