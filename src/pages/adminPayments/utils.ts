import { Language } from '../../hooks/useLanguage';

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

const getUserTimeZone = (): string | undefined => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return undefined;
  }
};

export const formatAdminPaymentsDateTime = (
  value: string | null | undefined,
  language: Language
): string => {
  if (!value) return '-';

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '-';

  if (language === 'fa') {
    return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      timeZone: 'Asia/Tehran',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(parsed);
  }

  const userTimeZone = getUserTimeZone();

  return parsed.toLocaleString(
    undefined,
    userTimeZone
      ? {
          timeZone: userTimeZone,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }
      : undefined
  );
};

export const normalizeAdminPaymentsDigits = (value: string): string => {
  if (!value) return '';

  return value
    .replace(/[۰-۹]/g, digit => String(PERSIAN_DIGITS.indexOf(digit)))
    .replace(/[٠-٩]/g, digit => String(ARABIC_DIGITS.indexOf(digit)));
};

export const sanitizeAdminPaymentsAmountInput = (
  value: string,
  maxLength?: number
): string => {
  const digits = normalizeAdminPaymentsDigits(value).replace(/\D/g, '');
  return typeof maxLength === 'number' ? digits.slice(0, maxLength) : digits;
};

export const formatAdminPaymentsAmountInput = (
  value: string,
  language: Language
): string => {
  if (!value) return '';

  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return value;

  return numericValue.toLocaleString(language === 'fa' ? 'fa-IR' : 'en-US');
};
