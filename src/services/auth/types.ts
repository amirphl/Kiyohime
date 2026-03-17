export interface AuthErrorDetail {
  code: string;
  details?: any;
}

export interface AuthApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: AuthErrorDetail;
}

export interface LoginSuccessPayload {
  customer: any;
  access_token: string;
  refresh_token: string;
}

export interface LoginOtpRequestPayload {
  customer_id?: number;
  customerId?: number;
  otp_sent?: boolean;
}
