import { ApiResponse } from '../../services/api';
import adminApi from '../../services/adminApi';
import {
  AdminChargeWalletByAdminRequest,
  AdminChargeWalletByAdminResponse,
  AdminListCustomersResponse,
} from '../../types/admin';

export const adminPaymentsApi = {
  listCustomers: () =>
    adminApi.listCustomersByAdmin() as Promise<ApiResponse<AdminListCustomersResponse>>,
  chargeWalletByAdmin: (payload: AdminChargeWalletByAdminRequest) =>
    adminApi.chargeWalletByAdmin(payload) as Promise<ApiResponse<AdminChargeWalletByAdminResponse>>,
};
