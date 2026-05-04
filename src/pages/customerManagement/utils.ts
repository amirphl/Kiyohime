import DateObject from 'react-date-object';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';

export const formatDatetime = (iso: string, language: string) => {
  try {
    const jsDate = new Date(iso);
    if (Number.isNaN(jsDate.getTime())) return iso;
    if (language === 'fa') {
      const dobj = new DateObject({
        date: jsDate,
        calendar: persian,
        locale: persian_fa,
      });
      return dobj.format('YYYY/MM/DD HH:mm:ss');
    }
    return jsDate.toLocaleString(undefined, { hour12: false });
  } catch {
    return iso;
  }
};

export const formatNormalizedDiscountRate = (
  rate: number,
  options?: { decimals?: number; includePercentSign?: boolean }
) => {
  const decimals = options?.decimals ?? 2;
  const includePercentSign = options?.includePercentSign ?? false;
  if (!Number.isFinite(rate) || rate < 0 || rate >= 1) return '-';

  // Backend stores rates as E / (E + 100); convert back to user-facing E.
  const value = (100 * rate) / (1 - rate);
  const text = value.toFixed(decimals);
  return includePercentSign ? `${text}%` : text;
};

interface CustomerDisplayInput {
  representative_first_name?: string | null;
  representative_last_name?: string | null;
  company_name?: string | null;
}

const safeDisplayPart = (value?: string | null) => {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : '-';
};

export const formatCustomerDisplay = (customer: CustomerDisplayInput) =>
  [
    safeDisplayPart(customer.representative_first_name),
    safeDisplayPart(customer.representative_last_name),
    safeDisplayPart(customer.company_name),
  ].join(' - ');

export const normalizeCustomerId = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  return undefined;
};
