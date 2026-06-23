import { CpaFieldId, CpaFieldValues } from './types';

const FIELD_IDS: CpaFieldId[] = [
  'delivered',
  'conversions',
  'conversionRate',
  'sendCost',
  'mainClicks',
  'clickRate',
  'suppDelivered',
  'suppConversions',
  'suppRate',
  'suppSendCost',
  'capacity',
  'offerPrice',
  'breakEven',
  'possibleConversions',
  'revenue',
  'totalCost',
  'profit',
  'profitPercent',
];

export const createDefaultCpaValues = (): CpaFieldValues =>
  FIELD_IDS.reduce(
    (acc, id) => ({ ...acc, [id]: '0' }),
    {} as CpaFieldValues
  );

export const normalizeDigits = (value: string) => {
  const fa = '۰۱۲۳۴۵۶۷۸۹';
  const ar = '٠١٢٣٤٥٦٧٨٩';
  return String(value ?? '')
    .replace(/[۰-۹]/g, digit => String(fa.indexOf(digit)))
    .replace(/[٠-٩]/g, digit => String(ar.indexOf(digit)))
    .replace(/٬|،|,/g, '')
    .replace(/\s/g, '')
    .replace(/[^\d.-]/g, '');
};

const parseValue = (values: CpaFieldValues, id: CpaFieldId) => {
  const raw = normalizeDigits(values[id]);
  if (raw === '' || raw === '-' || raw === '.') return Number.NaN;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
};

const formatNumber = (value: number, type: 'number' | 'percent' | 'money') => {
  if (!Number.isFinite(value)) return '';
  let maxFractionDigits = 0;
  if (type === 'percent') maxFractionDigits = 4;
  if (type === 'money') maxFractionDigits = 2;
  if (Math.abs(value) !== 0 && Math.abs(value) < 1) maxFractionDigits = 4;
  return value.toLocaleString('en-US', {
    maximumFractionDigits: maxFractionDigits,
    minimumFractionDigits: 0,
  });
};

const pct = (value: number) => (Number.isFinite(value) ? value / 100 : Number.NaN);

type NumericValues = Record<CpaFieldId, number>;

const readNumericValues = (values: CpaFieldValues): NumericValues =>
  FIELD_IDS.reduce(
    (acc, id) => ({ ...acc, [id]: parseValue(values, id) }),
    {} as NumericValues
  );

const cloneValues = (values: CpaFieldValues): CpaFieldValues => ({ ...values });

const setNumericValue = (
  nextValues: CpaFieldValues,
  id: CpaFieldId,
  value: number
) => {
  if (!Number.isFinite(value)) return;
  const type =
    id.toLowerCase().includes('rate') || id === 'profitPercent'
      ? 'percent'
      : id.toLowerCase().includes('cost') ||
          id === 'offerPrice' ||
          id === 'breakEven' ||
          id === 'revenue' ||
          id === 'totalCost' ||
          id === 'profit'
        ? 'money'
        : 'number';
  nextValues[id] = formatNumber(value, type);
};

const updatePrimaryConversion = (
  numeric: NumericValues,
  nextValues: CpaFieldValues,
  activeId: CpaFieldId | null
) => {
  if (activeId === 'conversionRate' && Number.isFinite(numeric.delivered)) {
    numeric.conversions = numeric.delivered * pct(numeric.conversionRate);
    setNumericValue(nextValues, 'conversions', numeric.conversions);
  } else if (
    activeId === 'conversions' &&
    Number.isFinite(numeric.delivered) &&
    numeric.delivered !== 0
  ) {
    numeric.conversionRate = (numeric.conversions / numeric.delivered) * 100;
    setNumericValue(nextValues, 'conversionRate', numeric.conversionRate);
  } else if (activeId === 'delivered') {
    if (Number.isFinite(numeric.conversionRate)) {
      numeric.conversions = numeric.delivered * pct(numeric.conversionRate);
      setNumericValue(nextValues, 'conversions', numeric.conversions);
    } else if (
      Number.isFinite(numeric.conversions) &&
      numeric.delivered !== 0
    ) {
      numeric.conversionRate = (numeric.conversions / numeric.delivered) * 100;
      setNumericValue(nextValues, 'conversionRate', numeric.conversionRate);
    }
  } else {
    if (
      Number.isFinite(numeric.delivered) &&
      Number.isFinite(numeric.conversions) &&
      numeric.delivered !== 0
    ) {
      numeric.conversionRate = (numeric.conversions / numeric.delivered) * 100;
      setNumericValue(nextValues, 'conversionRate', numeric.conversionRate);
    } else if (
      Number.isFinite(numeric.delivered) &&
      Number.isFinite(numeric.conversionRate)
    ) {
      numeric.conversions = numeric.delivered * pct(numeric.conversionRate);
      setNumericValue(nextValues, 'conversions', numeric.conversions);
    } else if (
      Number.isFinite(numeric.conversions) &&
      Number.isFinite(numeric.conversionRate) &&
      numeric.conversionRate !== 0
    ) {
      numeric.delivered = numeric.conversions / pct(numeric.conversionRate);
      setNumericValue(nextValues, 'delivered', numeric.delivered);
    }
  }
};

const updateClickRate = (
  numeric: NumericValues,
  nextValues: CpaFieldValues,
  activeId: CpaFieldId | null,
  supplementActive: boolean
) => {
  if (!supplementActive) return;
  if (activeId === 'clickRate' && Number.isFinite(numeric.delivered)) {
    numeric.mainClicks = numeric.delivered * pct(numeric.clickRate);
    setNumericValue(nextValues, 'mainClicks', numeric.mainClicks);
  } else if (
    activeId === 'mainClicks' &&
    Number.isFinite(numeric.delivered) &&
    numeric.delivered !== 0
  ) {
    numeric.clickRate = (numeric.mainClicks / numeric.delivered) * 100;
    setNumericValue(nextValues, 'clickRate', numeric.clickRate);
  } else if (activeId === 'delivered') {
    if (Number.isFinite(numeric.clickRate)) {
      numeric.mainClicks = numeric.delivered * pct(numeric.clickRate);
      setNumericValue(nextValues, 'mainClicks', numeric.mainClicks);
    } else if (
      Number.isFinite(numeric.mainClicks) &&
      numeric.delivered !== 0
    ) {
      numeric.clickRate = (numeric.mainClicks / numeric.delivered) * 100;
      setNumericValue(nextValues, 'clickRate', numeric.clickRate);
    }
  } else {
    if (
      Number.isFinite(numeric.delivered) &&
      Number.isFinite(numeric.mainClicks) &&
      numeric.delivered !== 0
    ) {
      numeric.clickRate = (numeric.mainClicks / numeric.delivered) * 100;
      setNumericValue(nextValues, 'clickRate', numeric.clickRate);
    } else if (
      Number.isFinite(numeric.delivered) &&
      Number.isFinite(numeric.clickRate)
    ) {
      numeric.mainClicks = numeric.delivered * pct(numeric.clickRate);
      setNumericValue(nextValues, 'mainClicks', numeric.mainClicks);
    } else if (
      Number.isFinite(numeric.mainClicks) &&
      Number.isFinite(numeric.clickRate) &&
      numeric.clickRate !== 0
    ) {
      numeric.delivered = numeric.mainClicks / pct(numeric.clickRate);
      setNumericValue(nextValues, 'delivered', numeric.delivered);
    }
  }
};

const updateSupplementConversion = (
  numeric: NumericValues,
  nextValues: CpaFieldValues,
  activeId: CpaFieldId | null,
  supplementActive: boolean
) => {
  if (!supplementActive) return;
  if (activeId === 'suppRate' && Number.isFinite(numeric.suppDelivered)) {
    numeric.suppConversions = numeric.suppDelivered * pct(numeric.suppRate);
    setNumericValue(nextValues, 'suppConversions', numeric.suppConversions);
  } else if (
    activeId === 'suppConversions' &&
    Number.isFinite(numeric.suppDelivered) &&
    numeric.suppDelivered !== 0
  ) {
    numeric.suppRate = (numeric.suppConversions / numeric.suppDelivered) * 100;
    setNumericValue(nextValues, 'suppRate', numeric.suppRate);
  } else if (activeId === 'suppDelivered') {
    if (Number.isFinite(numeric.suppRate)) {
      numeric.suppConversions = numeric.suppDelivered * pct(numeric.suppRate);
      setNumericValue(nextValues, 'suppConversions', numeric.suppConversions);
    } else if (
      Number.isFinite(numeric.suppConversions) &&
      numeric.suppDelivered !== 0
    ) {
      numeric.suppRate =
        (numeric.suppConversions / numeric.suppDelivered) * 100;
      setNumericValue(nextValues, 'suppRate', numeric.suppRate);
    }
  } else {
    if (
      Number.isFinite(numeric.suppDelivered) &&
      Number.isFinite(numeric.suppConversions) &&
      numeric.suppDelivered !== 0
    ) {
      numeric.suppRate =
        (numeric.suppConversions / numeric.suppDelivered) * 100;
      setNumericValue(nextValues, 'suppRate', numeric.suppRate);
    } else if (
      Number.isFinite(numeric.suppDelivered) &&
      Number.isFinite(numeric.suppRate)
    ) {
      numeric.suppConversions = numeric.suppDelivered * pct(numeric.suppRate);
      setNumericValue(nextValues, 'suppConversions', numeric.suppConversions);
    } else if (
      Number.isFinite(numeric.suppConversions) &&
      Number.isFinite(numeric.suppRate) &&
      numeric.suppRate !== 0
    ) {
      numeric.suppDelivered = numeric.suppConversions / pct(numeric.suppRate);
      setNumericValue(nextValues, 'suppDelivered', numeric.suppDelivered);
    }
  }
};

export const calculateCpaValues = (
  values: CpaFieldValues,
  activeId: CpaFieldId | null,
  supplementActive: boolean
) => {
  const nextValues = cloneValues(values);
  let numeric = readNumericValues(nextValues);

  updatePrimaryConversion(numeric, nextValues, activeId);
  numeric = readNumericValues(nextValues);

  updateClickRate(numeric, nextValues, activeId, supplementActive);
  numeric = readNumericValues(nextValues);

  updateSupplementConversion(numeric, nextValues, activeId, supplementActive);
  numeric = readNumericValues(nextValues);

  let stage1 = Number.NaN;
  let supplementMessagesAtScale = 0;
  let stage2 = 0;

  if (Number.isFinite(numeric.capacity) && Number.isFinite(numeric.conversionRate)) {
    stage1 = numeric.capacity * pct(numeric.conversionRate);
  }

  if (
    supplementActive &&
    Number.isFinite(numeric.capacity) &&
    Number.isFinite(numeric.clickRate)
  ) {
    supplementMessagesAtScale = numeric.capacity * pct(numeric.clickRate);
  }

  if (
    supplementActive &&
    Number.isFinite(supplementMessagesAtScale) &&
    Number.isFinite(numeric.suppRate)
  ) {
    stage2 = supplementMessagesAtScale * pct(numeric.suppRate);
  }

  if (Number.isFinite(stage1) && activeId !== 'possibleConversions') {
    numeric.possibleConversions = stage1 + stage2;
    setNumericValue(nextValues, 'possibleConversions', numeric.possibleConversions);
  }

  if (
    !supplementActive &&
    activeId === 'possibleConversions' &&
    Number.isFinite(numeric.possibleConversions) &&
    Number.isFinite(numeric.capacity) &&
    numeric.capacity !== 0
  ) {
    numeric.conversionRate = (numeric.possibleConversions / numeric.capacity) * 100;
    setNumericValue(nextValues, 'conversionRate', numeric.conversionRate);
    numeric = readNumericValues(nextValues);
  }

  if (
    activeId === 'revenue' &&
    Number.isFinite(numeric.revenue) &&
    Number.isFinite(numeric.possibleConversions) &&
    numeric.possibleConversions !== 0
  ) {
    numeric.offerPrice = numeric.revenue / numeric.possibleConversions;
    setNumericValue(nextValues, 'offerPrice', numeric.offerPrice);
  } else if (
    Number.isFinite(numeric.possibleConversions) &&
    Number.isFinite(numeric.offerPrice)
  ) {
    numeric.revenue = numeric.possibleConversions * numeric.offerPrice;
    if (activeId !== 'revenue') {
      setNumericValue(nextValues, 'revenue', numeric.revenue);
    }
  }

  numeric = readNumericValues(nextValues);

  let computedTotalCost = Number.NaN;
  if (Number.isFinite(numeric.capacity) && Number.isFinite(numeric.sendCost)) {
    const mainCost = numeric.capacity * numeric.sendCost;
    const supplementCost =
      supplementActive &&
      Number.isFinite(supplementMessagesAtScale) &&
      Number.isFinite(numeric.suppSendCost)
        ? supplementMessagesAtScale * numeric.suppSendCost
        : 0;
    computedTotalCost = mainCost + supplementCost;
  }

  if (
    activeId === 'profit' &&
    Number.isFinite(numeric.profit) &&
    Number.isFinite(numeric.totalCost) &&
    Number.isFinite(numeric.possibleConversions) &&
    numeric.possibleConversions !== 0
  ) {
    numeric.revenue = numeric.totalCost + numeric.profit;
    numeric.offerPrice = numeric.revenue / numeric.possibleConversions;
    numeric.profitPercent =
      numeric.totalCost !== 0 ? (numeric.profit / numeric.totalCost) * 100 : Number.NaN;
    setNumericValue(nextValues, 'revenue', numeric.revenue);
    setNumericValue(nextValues, 'offerPrice', numeric.offerPrice);
    setNumericValue(nextValues, 'profitPercent', numeric.profitPercent);
  } else if (
    activeId === 'profitPercent' &&
    Number.isFinite(numeric.profitPercent) &&
    Number.isFinite(numeric.totalCost) &&
    Number.isFinite(numeric.possibleConversions) &&
    numeric.possibleConversions !== 0
  ) {
    numeric.profit = numeric.totalCost * pct(numeric.profitPercent);
    numeric.revenue = numeric.totalCost + numeric.profit;
    numeric.offerPrice = numeric.revenue / numeric.possibleConversions;
    setNumericValue(nextValues, 'profit', numeric.profit);
    setNumericValue(nextValues, 'revenue', numeric.revenue);
    setNumericValue(nextValues, 'offerPrice', numeric.offerPrice);
  } else if (
    activeId === 'breakEven' &&
    Number.isFinite(numeric.breakEven) &&
    Number.isFinite(numeric.possibleConversions)
  ) {
    numeric.totalCost = numeric.breakEven * numeric.possibleConversions;
    numeric.profit = Number.isFinite(numeric.revenue)
      ? numeric.revenue - numeric.totalCost
      : Number.NaN;
    numeric.profitPercent =
      numeric.totalCost !== 0 && Number.isFinite(numeric.profit)
        ? (numeric.profit / numeric.totalCost) * 100
        : Number.NaN;
    setNumericValue(nextValues, 'totalCost', numeric.totalCost);
    setNumericValue(nextValues, 'profit', numeric.profit);
    setNumericValue(nextValues, 'profitPercent', numeric.profitPercent);
  } else if (
    activeId === 'totalCost' &&
    Number.isFinite(numeric.totalCost) &&
    Number.isFinite(numeric.possibleConversions) &&
    numeric.possibleConversions !== 0
  ) {
    numeric.breakEven = numeric.totalCost / numeric.possibleConversions;
    numeric.profit = Number.isFinite(numeric.revenue)
      ? numeric.revenue - numeric.totalCost
      : Number.NaN;
    numeric.profitPercent =
      numeric.totalCost !== 0 && Number.isFinite(numeric.profit)
        ? (numeric.profit / numeric.totalCost) * 100
        : Number.NaN;
    setNumericValue(nextValues, 'breakEven', numeric.breakEven);
    setNumericValue(nextValues, 'profit', numeric.profit);
    setNumericValue(nextValues, 'profitPercent', numeric.profitPercent);
  } else {
    if (Number.isFinite(computedTotalCost)) {
      numeric.totalCost = computedTotalCost;
      setNumericValue(nextValues, 'totalCost', numeric.totalCost);
    }
    if (
      Number.isFinite(numeric.totalCost) &&
      Number.isFinite(numeric.possibleConversions) &&
      numeric.possibleConversions !== 0 &&
      activeId !== 'breakEven'
    ) {
      numeric.breakEven = numeric.totalCost / numeric.possibleConversions;
      setNumericValue(nextValues, 'breakEven', numeric.breakEven);
    }
    if (Number.isFinite(numeric.revenue) && Number.isFinite(numeric.totalCost)) {
      numeric.profit = numeric.revenue - numeric.totalCost;
      if (activeId !== 'profit') {
        setNumericValue(nextValues, 'profit', numeric.profit);
      }
      numeric.profitPercent =
        numeric.totalCost !== 0 ? (numeric.profit / numeric.totalCost) * 100 : Number.NaN;
      if (activeId !== 'profitPercent') {
        setNumericValue(nextValues, 'profitPercent', numeric.profitPercent);
      }
    }
  }

  return nextValues;
};
