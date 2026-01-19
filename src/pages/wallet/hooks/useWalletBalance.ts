import { useEffect, useRef, useState } from 'react';
import apiService from '../../../services/api';

export interface WalletBalances {
  free: number | null;
  locked: number | null;
  reserved: number | null;
  credit: number | null;
  total: number | null;
  spendOnCampaigns: number | null;
  agencyShareWithTax: number | null;
  lastUpdated: string | null;
}

const emptyBalances: WalletBalances = {
  free: null,
  locked: null,
  reserved: null,
  credit: null,
  total: null,
  spendOnCampaigns: null,
  agencyShareWithTax: null,
  lastUpdated: null,
};

export const useWalletBalance = (accessToken?: string | null) => {
  const [balances, setBalances] = useState<WalletBalances>(emptyBalances);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const initialRef = useRef<boolean>(false);

  useEffect(() => {
    if (!accessToken || initialRef.current) return;
    initialRef.current = true;
    apiService.setAccessToken(accessToken);

    const loadBalance = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await apiService.getWalletBalance();
        if (resp.success && resp.data) {
          const {
            free = 0,
            locked = 0,
            frozen = 0,
            total,
            last_updated,
            spent_on_campaigns,
            agency_share_with_tax,
          } = resp.data;
          const credit = (resp.data as any).credit ?? 0;
          setBalances({
            free,
            locked,
            reserved: frozen,
            credit,
            total:
              total !== undefined ? total : Number(free) + Number(locked) + Number(frozen),
            spendOnCampaigns: spent_on_campaigns ?? null,
            agencyShareWithTax: agency_share_with_tax ?? null,
            lastUpdated: last_updated || null,
          });
        } else {
          setError(resp.message || 'Failed to load balance');
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Network error');
      } finally {
        setLoading(false);
      }
    };

    loadBalance();
  }, [accessToken]);

  return { balances, loading, error };
};

export type UseWalletBalanceReturn = ReturnType<typeof useWalletBalance>;
