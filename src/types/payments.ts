export interface TransactionHistoryItem {
  uuid: string;
  status: string;
  amount: number;
  currency: string;
  operation: string;
  datetime: string; // ISO string from backend
  external_ref?: string | null;
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
  end_date?: string;   // RFC3339
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
