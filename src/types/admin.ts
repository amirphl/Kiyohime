// Admin-specific types

export interface AdminDTO {
  id: number;
  uuid: string;
  username: string;
  is_active?: boolean | null;
  created_at: string;
}

export interface AdminSessionDTO {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string; // e.g., "Bearer"
  created_at: string;
}

export interface AdminCaptchaInitResponse {
  challenge_id: string;
  master_image_base64: string;
  thumb_image_base64: string;
}

export interface AdminCaptchaVerifyRequest {
  challenge_id: string;
  username: string;
  password: string;
  user_angle: number;
}

export interface AdminLoginResponse {
  admin: AdminDTO;
  session: AdminSessionDTO;
}

// Line Numbers
export interface AdminCreateLineNumberRequest {
  name?: string | null;
  line_number: string;
  price_factor: number;
  priority?: number | null;
  is_active?: boolean | null;
}

export interface AdminLineNumberDTO {
  id: number;
  uuid: string;
  name?: string | null;
  line_number: string;
  price_factor: number;
  priority?: number | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
}

// Batch update
export interface AdminUpdateLineNumberItem {
  id: number;
  priority?: number | null;
  is_active?: boolean | null;
}

export interface AdminUpdateLineNumbersRequest {
  items: AdminUpdateLineNumberItem[];
}

// Report
export interface AdminLineNumberReportItem {
  line_number: string;
  total_sent: number;
  total_parts_sent: number;
  total_arrived_parts_sent: number;
  total_non_arrived_parts_sent: number;
  total_income: number;
  total_cost: number;
}

export interface AdminListCampaignsFilter {
  title?: string;
  status?: 'initiated' | 'in_progress' | 'waiting_for_approval' | 'approved' | 'rejected';
  start_date?: string; // RFC3339 string
  end_date?: string; // RFC3339 string
}

export interface AdminGetCampaignResponse {
  id: number;
  uuid: string;
  status: string;
  created_at: string;
  updated_at?: string | null;
  title?: string | null;
  segment?: string | null;
  subsegment?: string[];
  sex?: string | null;
  city?: string[];
  adlink?: string | null;
  content?: string | null;
  scheduleat?: string | null;
  line_number?: string | null;
  budget?: number | null;
  comment?: string | null;
  segment_price_factor?: number;
  line_number_price_factor?: number;
}

export interface AdminListCampaignsResponse {
  message: string;
  items: AdminGetCampaignResponse[];
}

// Admin approve/reject responses
export interface AdminApproveCampaignResponse {
  message: string;
}

export interface AdminRejectCampaignResponse {
  message: string;
}

// Admin Customer Management - Customers Shares
export interface AdminCustomersSharesRequest {
  start_date?: string; // RFC3339
  end_date?: string;   // RFC3339
}

export interface AdminCustomersSharesItem {
  first_name: string;
  last_name: string;
  full_name: string;
  company_name: string;
  referrer_agency_name: string;
  agency_share_with_tax: number; // uint64
  system_share: number;          // uint64
  tax_share: number;             // uint64
  total_sent: number;            // uint64
  click_rate: number;
  customer_id?: number;          // optional numeric id if available
}

export interface AdminCustomersSharesResponse {
  message: string;
  items: AdminCustomersSharesItem[];
  sum_agency_share_with_tax: number;
  sum_system_share: number;
  sum_tax_share: number;
  sum_total_sent: number;
}

// Admin Customer Details with Campaigns
export interface AdminCustomerDetailDTO {
  id: number;
  uuid: string;
  agency_referer_code: string;
  account_type_id: number;
  account_type_name: string;
  company_name?: string | null;
  national_id?: string | null;
  company_phone?: string | null;
  company_address?: string | null;
  postal_code?: string | null;
  representative_first_name: string;
  representative_last_name: string;
  representative_mobile: string;
  email: string;
  sheba_number?: string | null;
  referrer_agency_id?: number | null;
  is_email_verified?: boolean | null;
  is_mobile_verified?: boolean | null;
  is_active?: boolean | null;
  created_at: string; // ISO
  updated_at?: string | null; // ISO
  email_verified_at?: string | null; // ISO
  mobile_verified_at?: string | null; // ISO
  last_login_at?: string | null; // ISO
}

export interface AdminCustomerCampaignItem {
  title?: string | null;
  created_at: string; // ISO
  schedule_at?: string | null; // ISO
  status: string;
  total_sent: number; // uint64
  total_delivered: number; // uint64
  click_rate: number;
  campaign_id?: number | null;
}

export interface AdminCustomerWithCampaignsResponse {
  message: string;
  customer: AdminCustomerDetailDTO;
  campaigns: AdminCustomerCampaignItem[];
} 