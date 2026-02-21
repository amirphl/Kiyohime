export type AccountType = 'individual' | 'independent_company' | 'marketing_agency' | '';

export interface SignupFormData {
  accountType: AccountType;
  companyName: string;
  nationalId: string;
  companyPhone: string;
  companyAddress: string;
  postalCode: string;
  shebaNumber: string;
  representativeFirstName: string;
  representativeLastName: string;
  representativeMobile: string;
  email: string;
  password: string;
  confirmPassword: string;
  referrerAgencyCode: string;
  jobCategory: string;
  job: string;
}

export type FormErrors = Partial<Record<keyof SignupFormData | 'accountType', string>>;
