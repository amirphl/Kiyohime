import { ApiResponse } from '../../services/api';
import adminApi from '../../services/adminApi';
import {
  AdminChargeWalletRequest,
  AdminChargeWalletResponse,
  AdminListCustomersResponse,
} from '../../types/admin';
import {
  AdminListDepositReceiptsParams,
  AdminUpdateDepositReceiptStatusRequest,
  ListDepositReceiptsResponse,
} from '../../types/payments';

export const adminPaymentsApi = {
  listCustomers: () =>
    adminApi.listCustomersByAdmin() as Promise<
      ApiResponse<AdminListCustomersResponse>
    >,
  chargeWallet: (payload: AdminChargeWalletRequest) =>
    adminApi.chargeWallet(payload) as Promise<
      ApiResponse<AdminChargeWalletResponse>
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
    adminApi.updateDepositReceiptStatus(payload) as Promise<ApiResponse<any>>,
};
