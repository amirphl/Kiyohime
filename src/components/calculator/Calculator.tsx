import React, { useMemo, useState } from 'react';
import {
  CalculatorTranslations,
  calculatorTranslations,
} from './calculatorTranslations';

export interface CalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  translations?: CalculatorTranslations;
  dir?: 'rtl' | 'ltr';
  initialAmount?: number;
  initialPercent?: number;
  onApply?: (percent: number) => void;
}

const formatNumber = (n: number, dir: 'rtl' | 'ltr') => {
  const locale = dir === 'rtl' ? 'fa-IR' : 'en-US';
  return new Intl.NumberFormat(locale).format(Math.round(n));
};

const AgencyCalculatorModal: React.FC<CalculatorProps> = ({
  isOpen,
  onClose,
  translations = calculatorTranslations.en,
  dir = 'ltr',
  initialAmount = 300000000,
  initialPercent = 80,
  onApply,
}) => {
  const [amount, setAmount] = useState<number>(initialAmount);
  const [giftPercent, setGiftPercent] = useState<number>(initialPercent);

  const clamp = (v: number, min: number, max: number) =>
    Math.max(min, Math.min(max, v));

  const calculations = useMemo(() => {
    const P = Math.max(0, Number(amount || 0));
    const E = clamp(Number(giftPercent || 0), 0, 100);
    const e = E / 100;
    const d = (2 * e) / (1 + e);
    const gift = P * e;
    const yourRevenue = P - P / (2 - d);
    const baselineAgency = P * 0.5;
    const reduction = Math.max(0, baselineAgency - yourRevenue);
    const totalCharge = P + gift;
    return { P, E, gift, yourRevenue, reduction, totalCharge };
  }, [amount, giftPercent]);

  const percentChips = [0, 20, 40, 60, 80, 90, 100];
  const amountChips = [20000000, 60000000, 140000000, 300000000];

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-[9999] flex items-center justify-center p-4'>
      <div className='absolute inset-0 bg-black/40' onClick={onClose} />
      <div
        className='relative bg-white rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl border border-gray-200'
        dir={dir}
      >
        <style>{`
          .calc-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px; }
          .calc-row { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
          .calc-chip, .calc-chip-amt { cursor: pointer; background: #fff; border: 1px solid #e2e8f0; padding: 6px 10px; border-radius: 999px; font-size: 12px; color: #64748b; }
          .calc-chip.active, .calc-chip:hover, .calc-chip-amt.active, .calc-chip-amt:hover { color: #1e293b; border-color: #2563eb; background: #eef2ff; }
          .calc-divider { height: 1px; background: #e2e8f0; margin: 18px 0; }
          .calc-table { width: 100%; border-collapse: collapse; font-size: 13px; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
          .calc-table th, .calc-table td { padding: 12px 10px; border-bottom: 1px solid #e2e8f0; text-align: ${dir === 'rtl' ? 'right' : 'left'}; }
          .calc-table th { color: #64748b; font-weight: 700; background: #f1f5ff; }
          .calc-val { font-variant-numeric: tabular-nums; }
          .calc-good { color: #16a34a; }
          .calc-warn { color: #f97316; }
          .calc-footer { display: flex; justify-content: flex-end; align-items: center; margin-top: 12px; color: #64748b; font-size: 12px; gap: 10px; flex-wrap: wrap; }
          .calc-btn { cursor: pointer; border: 1px solid #e2e8f0; background: #fff; color: #0f172a; padding: 8px 12px; border-radius: 10px; font-size: 13px; }
          .calc-btn:hover { border-color: #2563eb; background: #f1f5ff; }
          .calc-hint { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; border-radius: 50%; border: 1px solid #2563eb; color: #2563eb; font-size: 12px; cursor: help; margin-${dir === 'rtl' ? 'left' : 'right'}: 6px; position: relative; }
          .calc-hint::after { content: attr(data-tip); position: absolute; ${dir === 'rtl' ? 'left' : 'right'}: 100%; top: 50%; transform: translateY(-50%); background: #0b1d4d; color: #fff; padding: 8px 10px; border-radius: 8px; white-space: normal; min-width: 220px; max-width: 360px; opacity: 0; pointer-events: none; transition: .15s; box-shadow: 0 6px 20px rgba(2,6,23,.25); }
          .calc-hint:hover::after { opacity: 1; ${dir === 'rtl' ? 'left' : 'right'}: calc(100% + 8px); }
          .calc-row-sep td { border-top: 2px solid #2563eb !important; background: #f8fbff; }
          .calc-rule td { background: #eef2ff; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; }
        `}</style>

        <div className='p-6 space-y-4'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-semibold text-gray-900'>
              {translations.title}
            </h3>
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-gray-600 text-xl leading-none'
            >
              ×
            </button>
          </div>

          <div className='calc-grid'>
            <div>
              <div className='flex items-center justify-between mb-2 flex-wrap gap-2'>
                <label className='text-sm text-gray-600'>
                  {translations.amountLabel}
                </label>
                <div className='text-xs text-gray-500'>
                  {translations.amountPreview}{' '}
                  {formatNumber(calculations.P, dir)} تومان
                </div>
              </div>
              <div className='calc-row'>
                <input
                  type='number'
                  min={0}
                  step={1000}
                  value={amount}
                  onChange={e =>
                    setAmount(Math.max(0, Number(e.target.value || 0)))
                  }
                  placeholder={translations.amountPlaceholder}
                  className='w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500'
                />
                {amountChips.map((amt, idx) => (
                  <button
                    key={amt}
                    className={`calc-chip-amt ${amount === amt ? 'active' : ''}`}
                    onClick={() => setAmount(amt)}
                    type='button'
                  >
                    {translations.amountChips[idx] || formatNumber(amt, dir)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className='flex items-center justify-between mb-2 flex-wrap gap-2'>
                <label className='text-sm text-gray-600'>
                  {translations.percentLabel}
                </label>
                <div className='text-xs text-gray-500'>
                  {translations.percentHint}
                </div>
              </div>
              <div className='calc-row'>
                <input
                  type='number'
                  min={0}
                  max={100}
                  step={1}
                  value={giftPercent}
                  onChange={e =>
                    setGiftPercent(clamp(Number(e.target.value || 0), 0, 100))
                  }
                  className='w-24 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500'
                />
                {percentChips.map((pct, idx) => (
                  <button
                    key={pct}
                    className={`calc-chip ${calculations.E === pct ? 'active' : ''}`}
                    onClick={() => setGiftPercent(pct)}
                    type='button'
                    data-e={pct}
                  >
                    {translations.percentChips[idx] || `${pct}%`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className='calc-divider' />

          <div className='overflow-x-auto'>
            <table className='calc-table' dir={dir}>
              <thead>
                <tr>
                  <th>{translations.tableHeadDesc}</th>
                  <th>{translations.tableHeadValue}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {translations.reductionLabel}{' '}
                    <span
                      className='calc-hint'
                      data-tip={translations.reductionTip}
                    >
                      ?
                    </span>
                  </td>
                  <td className='calc-val calc-warn'>
                    {formatNumber(calculations.reduction, dir)}
                  </td>
                </tr>
                <tr>
                  <td>
                    {translations.giftLabel}{' '}
                    <span className='calc-hint' data-tip={translations.giftTip}>
                      ?
                    </span>
                  </td>
                  <td className='calc-val calc-good'>
                    {formatNumber(calculations.gift, dir)}
                  </td>
                </tr>
                <tr className='calc-rule'>
                  <td colSpan={2}>
                    <strong>{translations.ruleFixed}</strong>{' '}
                    <span className='font-semibold text-gray-900'>
                      {formatNumber(calculations.gift, dir)} ={' '}
                      {dir === 'rtl' ? '۲' : '2'} ×{' '}
                      {formatNumber(calculations.reduction, dir)}
                    </span>{' '}
                    <span
                      style={{ color: '#16a34a', marginInlineStart: '8px' }}
                    >
                      ✔
                    </span>
                  </td>
                </tr>
                <tr className='calc-row-sep'>
                  <td>
                    <strong>{translations.yourRevenueLabel}</strong>
                  </td>
                  <td className='calc-val'>
                    {formatNumber(calculations.yourRevenue, dir)}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>{translations.totalChargeLabel}</strong>
                  </td>
                  <td className='calc-val'>
                    {formatNumber(calculations.totalCharge, dir)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className='calc-footer'>
            {onApply && (
              <button
                className='calc-btn'
                type='button'
                onClick={() => {
                  onApply(giftPercent);
                  onClose();
                }}
              >
                {translations.apply}
              </button>
            )}
            <button
              className='calc-btn'
              type='button'
              onClick={() => {
                setAmount(initialAmount);
                setGiftPercent(initialPercent);
              }}
            >
              {translations.reset}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyCalculatorModal;
export { calculatorTranslations };
