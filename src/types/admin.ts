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
  status?: 'initiated' | 'in-progress' | 'waiting-for-approval' | 'approved' | 'rejected' | 'running' | 'executed';
  start_date?: string; // RFC3339 string
  end_date?: string; // RFC3339 string
}

export interface AdminGetCampaignResponse {
  id: number;
  uuid: string;
  status: string;
  platform?: string | null;
  mediaUuid?: string | null;
  platformSettingsId?: number | null;
  created_at: string;
  updated_at?: string | null;
  title?: string | null;
  level1?: string | null;
  level2s?: string[];
  level3s?: string[];
  tags?: string[];
  sex?: string | null;
  city?: string[];
  adlink?: string | null;
  content?: string | null;
  short_link_domain?: string | null;
  job_category?: string | null;
  job?: string | null;
  scheduleat?: string | null;
  line_number?: string | null;
  budget?: number | null;
  comment?: string | null;
  segment_price_factor?: number;
  line_number_price_factor?: number;
  statistics?: Record<string, any>;
  total_clicks?: number | null;
  click_rate?: number | null;
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

export interface AdminCancelCampaignRequest {
  campaign_id: number;
  comment: string;
}

export interface AdminCancelCampaignResponse {
  message: string;
}

// Admin Segment Price Factors
export interface AdminCreateSegmentPriceFactorRequest {
  platform: AdminPlatformKey;
  level3: string;
  price_factor: number;
}

export interface AdminCreateSegmentPriceFactorResponse {
  message: string;
}

export interface AdminSegmentPriceFactorItem {
  platform: AdminPlatformKey;
  level3: string;
  price_factor: number;
  created_at: string;
}

export interface AdminListSegmentPriceFactorsResponse {
  message: string;
  items: AdminSegmentPriceFactorItem[];
}

export interface AdminListLevel3OptionsResponse {
  message: string;
  items: string[];
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
  account_type_name: string;
  is_active?: boolean | null;
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
  line_number?: string | null;
  level3s?: string[] | null;
  num_audience?: number | null;
}

export interface AdminCustomerWithCampaignsResponse {
  message: string;
  customer: AdminCustomerDetailDTO;
  campaigns: AdminCustomerCampaignItem[];
}

// Ticket Management
export interface TicketItem {
  id: number;
  title: string;
  content: string;
  created_at: string;
  replied_by_admin?: boolean | null;
  // Admin-only fields (populated in admin listings only)
  customer_first_name?: string;
  customer_last_name?: string;
  company_name?: string;
  phone_number?: string;
  agency_name?: string;
}

export interface TicketGroup {
  correlation_id: string;
  items: TicketItem[];
}

export interface ListTicketsResponse {
  message: string;
  groups: TicketGroup[];
}

export interface AdminCreateResponseTicketRequest {
  ticket_id: number;
  content: string;
  file?: File;
}

export interface AdminCreateResponseTicketResponse {
  message: string;
  id: number;
  uuid: string;
  correlation_id: string;
  created_at: string;
}

// Admin Customer Discounts History
export interface AdminCustomerDiscountHistoryItem {
  discount_rate: number;
  created_at: string;
  expires_at?: string | null;
  total_sent: number;
  agency_share_with_tax: number;
}

export interface AdminCustomerDiscountHistoryResponse {
  message: string;
  items: AdminCustomerDiscountHistoryItem[];
}

// Admin Set Customer Active Status
export interface AdminSetCustomerActiveStatusRequest {
  customer_id: number;
  is_active: boolean;
}

export interface AdminSetCustomerActiveStatusResponse {
  message: string;
  is_active: boolean;
}

// Admin Platform Settings
export type AdminPlatformKey = 'rubika' | 'bale' | 'splus' | 'sms' | string;
export type AdminPlatformSettingsStatus =
  | 'initialized'
  | 'in-progress'
  | 'active'
  | 'inactive'
  | string;

export interface AdminPlatformSettingsItem {
  id: number;
  uuid: string;
  customer_id: number;
  platform: AdminPlatformKey;
  name?: string | null;
  description?: string | null;
  multimedia_uuid?: string | null;
  metadata?: Record<string, any> | null;
  status: AdminPlatformSettingsStatus;
  created_at: string;
  updated_at: string;
}

export interface AdminListPlatformSettingsResponse {
  message: string;
  items: AdminPlatformSettingsItem[];
}

export interface AdminChangePlatformSettingsStatusRequest {
  id: number;
  status: 'in-progress' | 'active' | 'inactive';
}

export interface AdminChangePlatformSettingsStatusResponse {
  message: string;
  id: number;
  status: 'in-progress' | 'active' | 'inactive';
}

export interface AdminAddPlatformSettingsMetadataRequest {
  id: number;
  key: string;
  value: string;
}

export interface AdminAddPlatformSettingsMetadataResponse {
  message: string;
  id: number;
  metadata: Record<string, any>;
}
