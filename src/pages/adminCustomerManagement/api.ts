import adminApi from '../../services/adminApi';
import {
  AdminCustomersSharesResponse,
  AdminCustomerWithCampaignsResponse,
  AdminGetCampaignResponse,
  AdminCustomerDiscountHistoryItem,
  AdminSetCustomerActiveStatusRequest,
} from '../../types/admin';
import { ApiResponse } from '../../services/api';

export const adminCustomerManagementApi = {
  getCustomersShares: (params: { start_date?: string; end_date?: string } = {}) =>
    adminApi.getCustomersShares(params) as Promise<ApiResponse<AdminCustomersSharesResponse>>,
  getCustomerWithCampaigns: (customerId: number) =>
    adminApi.getCustomerWithCampaigns(customerId) as Promise<ApiResponse<AdminCustomerWithCampaignsResponse>>,
  getCampaignById: (campaignId: number) =>
    adminApi.getCampaignById(campaignId) as Promise<ApiResponse<AdminGetCampaignResponse>>,
  getCustomerDiscountsHistory: (customerId: number) =>
    adminApi.getCustomerDiscountsHistory(customerId) as Promise<ApiResponse<{ items: AdminCustomerDiscountHistoryItem[] }>>,
  setCustomerActiveStatus: (payload: AdminSetCustomerActiveStatusRequest) =>
    adminApi.setCustomerActiveStatus(payload) as Promise<ApiResponse<{ is_active: boolean }>>,
};
