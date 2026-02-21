import { SignupFormData } from './types';

export const defaultSignupForm: SignupFormData = {
  accountType: '',
  companyName: '',
  nationalId: '',
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
