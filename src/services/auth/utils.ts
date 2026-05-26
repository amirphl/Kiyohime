const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+\d]+$/;

export const normalizeIdentifierInput = (value: string): string => value.trim();

export const isPhoneLikeIdentifier = (value: string): boolean =>
  PHONE_REGEX.test(normalizeIdentifierInput(value));

export const isValidEmailIdentifier = (value: string): boolean =>
  EMAIL_REGEX.test(normalizeIdentifierInput(value));

export const sanitizeOtpIdentifierInput = (value: string): string =>
  value.replace(/[^\d+]/g, '');

export const isValidOtpIdentifier = (value: string): boolean => {
  const normalized = normalizeIdentifierInput(value);
  return normalized.length > 0 && isPhoneLikeIdentifier(normalized);
};

export const parsePositiveInteger = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isInteger(value) && value > 0) {
    return value;
  }

  if (typeof value === 'string' && /^\d+$/.test(value)) {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
  }

  return null;
};
