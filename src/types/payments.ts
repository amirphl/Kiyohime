export interface TransactionHistoryItem {
  uuid: string;
  status: string;
  amount: number;
  customer_credit: number;
  agency_share_with_tax: number;
  currency: string;
  operation: string;
  source: string;
  datetime: string; // ISO string from backend
  external_ref?: string | null;
  customer_invoice_uuid?: string | null;
  balance_before: Record<string, number>;
  balance_after: Record<string, number>;
  metadata?: Record<string, any>;
}

export interface TransactionHistoryPaginationInfo {
  current_page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface TransactionHistoryResponse {
  items: TransactionHistoryItem[];
  pagination: TransactionHistoryPaginationInfo;
}

export interface GetTransactionHistoryParams {
  page?: number;
  page_size?: number;
  start_date?: string; // RFC3339
  end_date?: string; // RFC3339
  type?: string;
  status?: string;
}

// Deposit receipt upload
export interface SubmitDepositReceiptRequest {
  amount: number;
  lang?: 'FA' | 'EN';
  file_name: string;
  content_type: string;
  file_size: number;
  file_base64: string;
}

export interface SubmitDepositReceiptResponse {
  success: boolean;
  message: string;
  receipt_uuid: string;
  status: string;
}

export interface DepositReceiptItem {
  uuid: string;
  customer_id: number;
  amount: number;
  currency: string;
  status: string;
  status_reason?: string;
  rejection_note?: string | null;
  lang: string;
  file_name: string;
  content_type: string;
  file_size: number;
  preview_base64?: string;
  preview_type?: string;
  created_at: string; // ISO string
}

export interface ListDepositReceiptsResponse {
  items: DepositReceiptItem[];
}

export interface ProformaPreviewResponse {
  success: boolean;
  data: Record<string, any>;
}

export interface UpdateDepositReceiptFileRequest {
  file_name: string;
  content_type: string;
  file_size: number;
  file_base64: string;
}

export interface AdminUpdateDepositReceiptStatusRequest {
  receipt_uuid: string;
  action: 'approve' | 'reject';
  customer_invoice_uuid?: string;
  reason?: string;
}

export interface AdminListDepositReceiptsParams {
  status?: string;
  lang?: string;
  customer_id?: number;
  limit?: number;
  offset?: number;
  order?: string;
}

export interface AdminTransactionItem {
  uuid: string;
  customer_id: number;
  customer: AdminTransactionCustomerInfo;
  status: string;
  amount: number;
  customer_credit: number;
  agency_share_with_tax: number;
  currency: string;
  operation: string;
  source: string;
  datetime: string;
  external_ref?: string | null;
  customer_invoice_uuid?: string | null;
  balance_before: Record<string, number>;
  balance_after: Record<string, number>;
  metadata?: Record<string, any>;
}

export interface AdminTransactionCustomerInfo {
  representative_first_name: string;
  representative_last_name: string;
  full_name: string;
  representative_mobile: string;
  email: string;
  company_name?: string | null;
  company_phone?: string | null;
  national_id?: string | null;
  account_type: string;
}

export interface AdminTransactionsPagination {
  current_page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface AdminListTransactionsResponse {
  items: AdminTransactionItem[];
  pagination: AdminTransactionsPagination;
}

export interface AdminListTransactionsParams {
  page?: number;
  page_size?: number;
  start_date?: string;
  end_date?: string;
  customer_id?: number;
}

export interface AdminAddInvoiceToTransactionRequest {
  transaction_uuid: string;
  customer_invoice_uuid: string;
}

export interface NotifyInvoiceIssueRequest {
  transaction_uuid: string;
}

export interface NotifyInvoiceIssueResponse {
  success: boolean;
  message: string;
}
