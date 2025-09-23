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
  uuid: string;
  // Optional numeric ID if provided by backend for admin actions
  id?: number | null;
  status: string;
  created_at: string; // ISO/RFC3339
  updated_at?: string | null; // ISO/RFC3339 or null
  title?: string | null;
  segment?: string | null;
  subsegment?: string[];
  sex?: string | null;
  city?: string[];
  adlink?: string | null;
  content?: string | null;
  scheduleat?: string | null; // ISO/RFC3339 or null
  line_number?: string | null;
  budget?: number | null;
  comment?: string | null;
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