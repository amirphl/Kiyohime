import { ApiResponse } from '../../services/api';
import adminApi from '../../services/adminApi';
import {
  AdminChargeWalletRequest,
  AdminChargeWalletResponse,
  AdminListCustomersResponse,
  AdminPreviewWalletChargeImpactRequest,
  AdminPreviewWalletChargeImpactResponse,
} from '../../types/admin';
import {
  AdminListDepositReceiptsParams,
  AdminListTransactionsParams,
  AdminListTransactionsResponse,
  AdminAddInvoiceToTransactionRequest,
  AdminUpdateDepositReceiptStatusRequest,
  ListDepositReceiptsResponse,
} from '../../types/payments';
import { UploadMultimediaResponse } from '../../types/campaign';

type AdminMutationResponse = { success: boolean; message: string };

export const adminPaymentsApi = {
  listCustomers: () =>
    adminApi.listCustomersByAdmin() as Promise<
      ApiResponse<AdminListCustomersResponse>
    >,
  chargeWallet: (payload: AdminChargeWalletRequest) =>
    adminApi.chargeWallet(payload) as Promise<
      ApiResponse<AdminChargeWalletResponse>
    >,
  previewWalletChargeImpact: (payload: AdminPreviewWalletChargeImpactRequest) =>
    adminApi.previewWalletChargeImpact(payload) as Promise<
      ApiResponse<AdminPreviewWalletChargeImpactResponse>
    >,
  listDepositReceipts: (params: AdminListDepositReceiptsParams) =>
    adminApi.listDepositReceipts(params) as Promise<
      ApiResponse<ListDepositReceiptsResponse>
    >,
  downloadDepositReceiptFile: (uuid: string) =>
    adminApi.downloadDepositReceiptFile(uuid),
  updateDepositReceiptStatus: (
    payload: AdminUpdateDepositReceiptStatusRequest
  ) =>
    adminApi.updateDepositReceiptStatus(payload) as Promise<
      ApiResponse<AdminMutationResponse>
    >,
  listTransactions: (params: AdminListTransactionsParams) =>
    adminApi.listTransactions(params) as Promise<
      ApiResponse<AdminListTransactionsResponse>
    >,
  uploadMultimediaByAdmin: (customerId: number, file: File) =>
    adminApi.uploadMultimediaByAdmin(customerId, file) as Promise<
      ApiResponse<UploadMultimediaResponse>
    >,
  addInvoiceToTransaction: (payload: AdminAddInvoiceToTransactionRequest) =>
    adminApi.addInvoiceToTransaction(payload) as Promise<
      ApiResponse<AdminMutationResponse>
    >,
};
