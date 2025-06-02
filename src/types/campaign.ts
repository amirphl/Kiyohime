// Campaign Types and Interfaces

export interface CustomerSegment {
	campaignTitle: string;
	segment: string;
	subsegments: string[];
	sex: string;
	city: string[];
	capacityTooLow?: boolean;
	capacity?: number; // Persist last calculated capacity
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
}

export interface CampaignBudget {
	lineNumber: string;
	totalBudget: number;
	estimatedMessages?: number; // Populated by backend, not stored in localStorage
}

export interface CampaignPayment {
	paymentMethod: string;
	termsAccepted: boolean;
	hasEnoughBalance?: boolean; // Track if user has sufficient wallet balance
	finalCost?: number; // Populated by API, not stored in localStorage
	tax?: number; // Populated by API, not stored in localStorage
	total?: number; // Populated by API, not stored in localStorage
}

export interface CampaignData {
	uuid: string;
	segment: CustomerSegment;
	content: CampaignContent;
	budget: CampaignBudget;
	payment: CampaignPayment;
}

// API payload interface matching Go backend structure
export interface CreateCampaignPayload {
	title?: string;
	segment?: string;
	subsegment?: string[];
	sex?: string;
	city?: string[];
	adlink?: string;
	content?: string;
	scheduleat?: string;
	line_number?: string;
	budget?: number;
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
	segment?: string;
	subsegment?: string[];
	sex?: string;
	city?: string[];
	adlink?: string;
	content?: string;
	scheduleat?: string;
	line_number?: string;
	budget?: number;
}

// Campaign capacity calculation response interface
export interface CalculateCampaignCapacityResponse {
	message: string;
	capacity: number;
}

// Campaign cost calculation request interface
export interface CalculateCampaignCostRequest {
	title?: string;
	segment?: string;
	subsegment?: string[];
	sex?: string;
	city?: string[];
	adlink?: string;
	content?: string;
	scheduleat?: string;
	line_number?: string;
	budget?: number;
}

// Campaign cost calculation response interface
export interface CalculateCampaignCostResponse {
	message: string;
	sub_total: number;
	tax: number;
	total: number;
	msg_target: number;
	max_msg_target?: number;
}

// Wallet balance response interface
export interface GetWalletBalanceResponse {
	message: string;
	free: number;
	locked: number;
	frozen: number;
	total: number;
	currency: string;
	last_updated: string;
	pending_transactions: number;
	minimum_balance: number;
	credit_limit: number;
	balance_status: string;
}

// Update campaign request interface
export interface UpdateSMSCampaignRequest {
	title?: string;
	segment?: string;
	subsegment?: string[];
	sex?: string;
	city?: string[];
	adlink?: string;
	content?: string;
	scheduleat?: string;
	line_number?: string;
	budget?: number;
}

// Update campaign response interface
export interface UpdateSMSCampaignResponse {
	message: string;
}

export interface CampaignStep {
	id: number;
	title: string;
	subtitle: string;
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
	uuid: string;
	status: string;
	created_at: string;
	updated_at?: string;
	title?: string;
	segment?: string;
	subsegment?: string[];
	sex?: string;
	city?: string[];
	adlink?: string;
	content?: string;
	scheduleat?: string;
	line_number?: string;
	budget?: number;
	total?: number;
	comment?: string;
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