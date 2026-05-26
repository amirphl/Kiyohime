import { SignupFormData } from './types';

export const defaultSignupForm: SignupFormData = {
  accountType: '',
  companyName: '',
  nationalId: '',
  nationalCode: '',
  companyPhone: '',
  companyAddress: '',
  postalCode: '',
  shebaNumber: '',
  representativeFirstName: '',
  representativeLastName: '',
  representativeMobile: '',
  email: '',
  password: '',
  confirmPassword: '',
  referrerAgencyCode: '',
  jobCategory: '',
  job: '',
};

// Convert Persian/Arabic-Indic digits to ASCII English digits
export const toEnglishDigits = (input: string): string => {
  if (!input) return input;
  const persian = '۰۱۲۳۴۵۶۷۸۹';
  const arabic = '٠١٢٣٤٥٦٧٨٩';
  return input
    .replace(/[۰-۹]/g, d => String(persian.indexOf(d)))
    .replace(/[٠-٩]/g, d => String(arabic.indexOf(d)));
};

export const sanitizeSheba = (value: string) => toEnglishDigits(value).replace(/\D/g, '').slice(0, 24);

export const normalizeTextInput = (value: string): string => value.trim();

export const sanitizeNumericInput = (value: string, maxLength?: number): string => {
  const digits = toEnglishDigits(value).replace(/\D/g, '');
  return typeof maxLength === 'number' ? digits.slice(0, maxLength) : digits;
};

export const sanitizePhoneInput = (value: string, maxLength = 11): string =>
  sanitizeNumericInput(value, maxLength);

export const sanitizeEmailInput = (value: string): string =>
  toEnglishDigits(value).trim().toLowerCase();

export const parseCustomerId = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isInteger(value) && value > 0) {
    return value;
  }

  if (typeof value === 'string' && /^\d+$/.test(value)) {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
  }

  return null;
};
