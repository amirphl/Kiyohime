import { SignupFormData } from './types';
import { ApiResponse } from '../../services/api';

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

export const sanitizeSheba = (value: string) =>
  toEnglishDigits(value).replace(/\D/g, '').slice(0, 24);

export const normalizeTextInput = (value: string): string => value.trim();

export const sanitizeNumericInput = (
  value: string,
  maxLength?: number
): string => {
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

export const buildSignupPayload = (formData: SignupFormData) => ({
  account_type: formData.accountType,
  company_name:
    formData.accountType !== 'individual'
      ? normalizeTextInput(formData.companyName)
      : undefined,
  national_id:
    formData.accountType === 'individual'
      ? formData.nationalCode
      : formData.nationalId,
  company_phone:
    formData.accountType !== 'individual' ? formData.companyPhone : undefined,
  company_address:
    formData.accountType !== 'individual'
      ? normalizeTextInput(formData.companyAddress)
      : undefined,
  postal_code:
    formData.accountType !== 'individual' ? formData.postalCode : undefined,
  sheba_number:
    formData.accountType === 'marketing_agency'
      ? `IR${formData.shebaNumber}`
      : undefined,
  representative_first_name: normalizeTextInput(
    formData.representativeFirstName
  ),
  representative_last_name: normalizeTextInput(formData.representativeLastName),
  representative_mobile: formData.representativeMobile,
  email: formData.email,
  password: formData.password,
  confirm_password: formData.confirmPassword,
  referrer_agency_code:
    formData.accountType !== 'marketing_agency' && formData.referrerAgencyCode
      ? normalizeTextInput(formData.referrerAgencyCode)
      : undefined,
  job_category:
    formData.accountType !== 'marketing_agency'
      ? normalizeTextInput(formData.jobCategory)
      : undefined,
  job:
    formData.accountType !== 'marketing_agency'
      ? normalizeTextInput(formData.job)
      : undefined,
});

export const extractApiData = <T>(response: ApiResponse<T>): T | undefined => {
  if (!response.data) {
    return undefined;
  }

  const payload = response.data as T & { data?: T };
  return payload?.data ?? payload;
};
