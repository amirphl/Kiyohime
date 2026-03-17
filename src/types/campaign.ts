// Campaign Types and Interfaces

export interface CustomerLevel {
	campaignTitle: string;
	level1: string;       // Level 1 selection (single)
	level2s: string[];    // Level 2 selections (multiple)
	level3s: string[];    // Level 3 selections (multiple)
	tags?: string[];      // Union of tags from selected level3s
	capacityTooLow?: boolean;
	capacity?: number;    // Total audience capacity
	jobCategory?: string;
	job?: string;
}

export interface CustomFilter {
	field: string;
	operator: string;
	value: string;
}

export interface CampaignContent {
	insertLink: boolean;
	link: string;
	text: string;
	scheduleAt?: string; // ISO string for datetime
	shortLinkDomain?: string;
	lineNumber?: string;
}

export interface CampaignBudget {
	totalBudget: number;
	estimatedMessages?: number; // Populated by backend, not stored in localStorage
}

export interface CampaignPayment {
	paymentMethod: string;
	termsAccepted: boolean;
	hasEnoughBalance?: boolean; // Track if user has sufficient wallet balance
	finalCost?: number; // Populated by API, not stored in localStorage
	total?: number; // Populated by API, not stored in localStorage
}

export interface CampaignData {
	uuid: string;
	level: CustomerLevel;
	content: CampaignContent;
	budget: CampaignBudget;
	payment: CampaignPayment;
}

// API payload interface matching Go backend structure
export interface CreateCampaignPayload {
	title?: string;
	level1?: string;      // Level 1 selection (single)
	level2s?: string[];   // Level 2 selections (multiple)
	level3s?: string[];   // Level 3 selections (multiple)
	tags?: string[];      // Union of tags from selected level3s
	adlink?: string;
	content?: string;
	scheduleat?: string;
	line_number?: string;
	budget?: number;
	short_link_domain?: string;
	job_category?: string;
	job?: string;
}

// API response interface matching Go backend structure
export interface CreateSMSCampaignResponse {
	message: string;
	uuid: string;
	status: string;
	created_at: string;
}

// API response wrapper matching Go backend structure
export interface CreateCampaignResponse {
	success: boolean;
	message: string;
	data?: CreateSMSCampaignResponse;
	error?: any;
}

// Campaign capacity calculation request interface
export interface CalculateCampaignCapacityRequest {
	title?: string;
	level1?: string;      // Level 1 selection (single)
	level2s?: string[];   // Level 2 selections (multiple)
	level3s?: string[];   // Level 3 selections (multiple)
	tags?: string[];      // Union of tags from selected level3s
	adlink?: string;
	content?: string;
	scheduleat?: string;
	line_number?: string;
	budget?: number;
	short_link_domain?: string;
	job_category?: string;
	job?: string;
}

// Campaign capacity calculation response interface
export interface CalculateCampaignCapacityResponse {
	message: string;
	capacity: number;
}

// Campaign cost calculation request interface
export interface CalculateCampaignCostRequest {
	title?: string;
	level1?: string;      // Level 1 selection (single)
	level2s?: string[];   // Level 2 selections (multiple)
	level3s?: string[];   // Level 3 selections (multiple)
	tags?: string[];      // Union of tags from selected level3s
	adlink?: string;
	content?: string;
	scheduleat?: string;
	line_number?: string;
	budget?: number;
	short_link_domain?: string;
	job_category?: string;
	job?: string;
}

// Campaign cost calculation response interface
export interface CalculateCampaignCostResponse {
	message: string;
	total_cost: number;
	msg_target: number;
	max_msg_target?: number;
}

// Wallet balance response interface
export interface GetWalletBalanceResponse {
	message: string;
	free: number;
	locked: number;
	frozen: number;
	credit?: number;
	spent_on_campaigns?: number;
	agency_share_with_tax?: number;
	total: number;
	currency: string;
	last_updated: string;
}

// Update campaign request interface
export interface UpdateSMSCampaignRequest {
	title?: string;
	level1?: string;      // Level 1 selection (single)
	level2s?: string[];   // Level 2 selections (multiple)
	level3s?: string[];   // Level 3 selections (multiple)
	tags?: string[];      // Union of tags from selected level3s
	adlink?: string;
	content?: string;
	scheduleat?: string;
	line_number?: string;
	budget?: number;
	finalize?: boolean;
	short_link_domain?: string;
	job_category?: string;
	job?: string;
}

// Update campaign response interface
export interface UpdateSMSCampaignResponse {
	message: string;
}

export interface CampaignStep {
	id: number;
	title: string;
	isCompleted: boolean;
	isAccessible: boolean;
}

export interface FormField {
	id: string;
	label: string;
	type: 'text' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'datetime-local';
	placeholder?: string;
	required?: boolean;
	options?: Array<{ value: string; label: string }>;
	validation?: {
		min?: number;
		max?: number;
		step?: number;
		pattern?: string;
		message?: string;
	};
}

export interface StepConfig {
	id: number;
	title: string;
	subtitle: string;
	component: React.ComponentType;
	validation: (data: CampaignData) => boolean;
	fields: FormField[];
}

export interface GetSMSCampaignResponse {
	id?: number;
	uuid: string;
	status: string;
	created_at: string;
	updated_at?: string;
	title?: string;
	level1?: string;
	level2s?: string[];
	level3s?: string[];
	tags?: string[];
	sex?: string;
	city?: string[];
	adlink?: string;
	content?: string;
	short_link_domain?: string;
	job_category?: string;
	job?: string;
	scheduleat?: string;
	line_number?: string;
	line_price_factor?: number;
	budget?: number;
	num_audience?: number;
	comment?: string;
	statistics?: Record<string, any>;
	click_rate?: number;
	total_clicks?: number;
}

export interface PaginationInfo {
	page: number;
	limit: number;
	total_items: number;
	total_pages: number;
}

export interface ListSMSCampaignsResponse {
	message: string;
	items: GetSMSCampaignResponse[];
	pagination: PaginationInfo;
}

export interface ListSMSCampaignsParams {
	page: number;
	limit: number;
	orderby?: 'newest' | 'oldest';
	title?: string;
	status?: 'initiated' | 'in-progress' | 'waiting-for-approval' | 'approved' | 'rejected';
}

// Audience Spec types
export interface AudienceSpecItem {
	tags: string[];
	available_audience: number;
}

export interface AudienceSpecLevel2 {
	metadata: Record<string, any>;
	items: Record<string, AudienceSpecItem>;
}

// Now three levels: level1 -> level2 -> level3 -> AudienceSpecItem
export type AudienceSpec = Record<string, Record<string, AudienceSpecLevel2>>;

export interface ListAudienceSpecResponse {
	message: string;
	spec: AudienceSpec;
}

// Active line numbers
export interface ActiveLineNumberItem {
	line_number: string;
}

export interface ListActiveLineNumbersResponse {
	message: string;
	items: ActiveLineNumberItem[];
}

// Segment price factors (latest per level3)
export interface SegmentPriceFactorItem {
	level3: string;
	price_factor: number;
	created_at: string;
}

export interface ListLatestSegmentPriceFactorsResponse {
	message: string;
	items: SegmentPriceFactorItem[];
}
