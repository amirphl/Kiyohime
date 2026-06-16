export interface BundleStatistics {
  aggregatedTotalRecords?: number | string | null;
  aggregatedTotalSent?: number | string | null;
  aggregatedTotalClicks?: number | string | null;
  totalCampaigns?: number | string | null;
  totalCampaignsPhaseTest?: number | string | null;
  totalCampaignsPhaseExecution?: number | string | null;
  [key: string]: unknown;
}

export interface BundleListItem {
  id: number;
  title: string;
  objective: string;
  target_audience_persona: string;
  adlink?: string | null;
  description?: string | null;
  short_link_domain?: string | null;
  target_customer_name?: string | null;
  job_category?: string | null;
  job?: string | null;
  metadata?: Record<string, unknown> | null;
  statistics?: BundleStatistics | null;
  customer_id: number;
  created_at: string;
  updated_at: string;
}

export interface BundlePagination {
  page: number;
  limit: number;
  total_items?: number;
  total?: number;
  total_pages: number;
}

export interface ListBundlesResponse {
  message?: string;
  items: BundleListItem[];
  pagination: BundlePagination;
}

export interface ListBundlesParams {
  page: number;
  limit: number;
  title?: string;
  target_audience_persona?: string;
}

export interface CreateBundleRequest {
  title: string;
  objective: string;
  target_audience_persona: string;
  adlink?: string;
  short_link_domain?: string;
  description?: string;
  target_customer_name?: string;
  job_category?: string;
  job?: string;
}

export interface CreateBundleResponse {
  message?: string;
  id?: number;
  bundle_id?: number;
  uuid?: string;
  title?: string;
  [key: string]: unknown;
}

export interface GetBundlePayload {
  message?: string;
  item?: BundleListItem | null;
}

export interface BundleCreateFormValues {
  title: string;
  objective: string;
  targetAudiencePersona: string;
  description: string;
  insertLink: boolean;
  link: string;
  shortLinkDomain: string | null;
  customerName: string;
  jobCategory: string;
  job: string;
}

export interface BundleCreateFormErrors {
  title?: string;
  objective?: string;
  targetAudiencePersona?: string;
  description?: string;
  link?: string;
}
