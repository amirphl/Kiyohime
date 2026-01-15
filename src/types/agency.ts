export interface AgencyCustomerReportItem {
	representative_first_name: string;
	representative_last_name: string;
	company_name: string;
	total_sent: number;
	total_agency_share_with_tax: number;
}

export interface AgencyCustomerReportResponse {
	message: string;
	items: AgencyCustomerReportItem[];
	sum_total_agency_share_with_tax: number;
	sum_total_sent: number;
}

export interface AgencyActiveDiscountItem {
	customer_id: number;
	representative_first_name: string;
	representative_last_name: string;
	company_name?: string | null;
	discount_rate: number;
	created_at: string; // ISO string
}

export interface ListAgencyActiveDiscountsResponse {
	message: string;
	items: AgencyActiveDiscountItem[];
}

export interface AgencyCustomerDiscountItem {
	discount_rate: number;
	created_at: string;
	expires_at?: string | null;
	total_sent: number;
	agency_share_with_tax: number;
}

export interface ListAgencyCustomerDiscountsResponse {
	message: string;
	items: AgencyCustomerDiscountItem[];
}

export interface AgencyCustomerListItem {
	customer_id: number;
	representative_first_name: string;
	representative_last_name: string;
	company_name?: string | null;
	created_at: string;
	is_active?: boolean | null;
}

export interface ListAgencyCustomersResponse {
	message: string;
	items: AgencyCustomerListItem[];
} 