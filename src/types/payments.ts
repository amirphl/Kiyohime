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