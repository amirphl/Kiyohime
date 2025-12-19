import React, { useEffect, useState, useMemo } from 'react';
import Card from '../../ui/Card';
import { useLanguage } from '../../../hooks/useLanguage';
import { budgetI18n } from './budgetTranslations';
import { apiService } from '../../../services/api';
import { useToast } from '../../../hooks/useToast';

interface BudgetSelectorProps {
  accessToken?: string | null;
  initialPercent?: number;
  onChange?: (percent: number, amount: number) => void;
}

const BudgetSelector: React.FC<BudgetSelectorProps> = ({
  accessToken,
  initialPercent = 10,
  onChange,
}) => {
  const { language } = useLanguage();
  const t = budgetI18n[language as keyof typeof budgetI18n] || budgetI18n.en;
  const { showToast } = useToast();

  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [percent, setPercent] = useState<number>(initialPercent);

  const MIN_BUDGET = 1000;
  const MAX_BUDGET = 160000000;

  const didFetchRef = React.useRef(false);
  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;

    let cancelled = false;
    const fetchBalance = async () => {
      setLoading(true);
      setError(null);
      try {
        if (accessToken) {
          apiService.setAccessToken(accessToken);
        }
        const resp = await apiService.getWalletBalance();
        if (cancelled) return;
        if (resp.success && resp.data) {
          // API returns `free` for available balance
          const freeBalance = (resp.data as any).free ?? 0;
          setBalance(freeBalance);
        } else {
          const msg =
            (t as any).balanceError || 'Failed to check wallet balance';
          setError(msg);
          showToast('error', msg);
        }
      } catch (e) {
        const msg = (t as any).balanceError || 'Failed to check wallet balance';
        setError(msg);
        showToast('error', msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchBalance();
    return () => {
      cancelled = true;
    };
    // Run only once on mount; guard prevents repeated fetches on re-renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const availableMax = useMemo(() => {
    if (balance === null) return 0;
    return Math.max(0, balance);
  }, [balance]);

  const rawAmount = useMemo(() => {
    // Round down to nearest 1000 to satisfy step requirement
    const computed = Math.floor((availableMax * percent) / 100);
    return Math.floor(computed / 1000) * 1000;
  }, [availableMax, percent]);

  // Hide selector if user has zero or negative balance
  if (balance !== null && balance <= 0) {
    return null;
  }

  const computeAmount = (pct: number) => {
    const computed = Math.floor((availableMax * pct) / 100);
    const rounded = Math.floor(computed / 1000) * 1000;
    if (rounded <= 0) return 0;
    const capped = Math.min(availableMax, rounded);
    const effectiveMin = Math.min(MIN_BUDGET, availableMax);
    return Math.max(effectiveMin, capped);
  };

  const propagateChange = (nextPercent: number) => {
    if (availableMax <= 0) return;
    const nextAmount = computeAmount(nextPercent);
    if (onChange) onChange(nextPercent, nextAmount);
  };

  const formatNumber = (n: number | null) => {
    if (n === null) return '-';
    try {
      return language === 'fa'
        ? n.toLocaleString('fa-IR')
        : n.toLocaleString('en-US');
    } catch {
      return String(n);
    }
  };

  return (
    <Card>
      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <h3 className='text-sm font-medium text-gray-900'>
            {t.selectBudgetPercentTitle || 'Use Wallet Balance'}
          </h3>
        </div>

        <div>
          <input
            type='range'
            min={1}
            max={100}
            value={percent}
            onChange={e => {
              const next = Number(e.target.value);
              setPercent(next);
              propagateChange(next);
            }}
            className='w-full'
          />
          <div className='flex justify-between text-xs text-gray-500 mt-1'>
            <span>1%</span>
            <span>{percent}%</span>
            <span>100%</span>
          </div>
        </div>

        <div className='text-sm text-gray-700'>
          {t.budgetFromBalance || 'Budget from balance'}:{' '}
          <strong>{formatNumber(rawAmount)}</strong>
        </div>

        {rawAmount > 0 &&
          (rawAmount < MIN_BUDGET || rawAmount > MAX_BUDGET) && (
            <div className='mt-2 text-sm text-red-500'>
              {rawAmount < MIN_BUDGET
                ? t.budgetTooLow?.replace('{min}', formatNumber(MIN_BUDGET))
                : t.budgetTooHigh?.replace('{max}', formatNumber(MAX_BUDGET))}
            </div>
          )}

        {error && <p className='text-sm text-red-600'>{error}</p>}
      </div>
    </Card>
  );
};

export default BudgetSelector;
