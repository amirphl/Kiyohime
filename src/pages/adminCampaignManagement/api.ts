import adminApi from '../../services/adminApi';
import apiService, { ApiResponse } from '../../services/api';
import {
  AdminApproveCampaignResponse,
  AdminCancelCampaignRequest,
  AdminCancelCampaignResponse,
  AdminListCampaignsFilter,
  AdminListCampaignsResponse,
  AdminRejectCampaignResponse,
} from '../../types/admin';
import {
  SubmitDepositReceiptRequest,
  SubmitDepositReceiptResponse,
  ListDepositReceiptsResponse,
  UpdateDepositReceiptFileRequest,
} from '../../types/payments';

export const adminCampaignManagementApi = {
  listCampaigns: (filter: AdminListCampaignsFilter = {}) =>
    adminApi.listCampaigns(filter) as Promise<ApiResponse<AdminListCampaignsResponse>>,
  approveCampaign: (campaignId: number, comment?: string | null) =>
    adminApi.approveCampaign(campaignId, comment) as Promise<ApiResponse<AdminApproveCampaignResponse>>,
  rejectCampaign: (campaignId: number, comment: string) =>
    adminApi.rejectCampaign(campaignId, comment) as Promise<ApiResponse<AdminRejectCampaignResponse>>,
  cancelCampaign: (payload: AdminCancelCampaignRequest) =>
    adminApi.cancelCampaign(payload) as Promise<ApiResponse<AdminCancelCampaignResponse>>,
  submitDepositReceipt: (payload: SubmitDepositReceiptRequest) =>
    apiService.submitDepositReceipt(payload) as Promise<ApiResponse<SubmitDepositReceiptResponse>>,
  listDepositReceipts: (lang?: string) =>
    apiService.listDepositReceipts(lang) as Promise<ApiResponse<ListDepositReceiptsResponse>>,
  downloadDepositReceiptFile: (receiptUuid: string) =>
    apiService.downloadDepositReceiptFile(receiptUuid),
  updateDepositReceiptFile: (
    receiptUuid: string,
    payload: UpdateDepositReceiptFileRequest
  ) => apiService.updateDepositReceiptFile(receiptUuid, payload),
  deleteDepositReceiptFile: (receiptUuid: string) =>
    apiService.deleteDepositReceiptFile(receiptUuid),
};

export default adminCampaignManagementApi;
