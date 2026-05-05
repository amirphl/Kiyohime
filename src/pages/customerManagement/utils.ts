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
