import adminApi from '../../services/adminApi';
import { ApiResponse } from '../../services/api';
import {
  AdminApproveCampaignResponse,
  AdminCancelCampaignRequest,
  AdminCancelCampaignResponse,
  AdminListCampaignsFilter,
  AdminListCampaignsResponse,
  AdminRejectCampaignResponse,
} from '../../types/admin';

export const adminCampaignManagementApi = {
  listCampaigns: (filter: AdminListCampaignsFilter = {}) =>
    adminApi.listCampaigns(filter) as Promise<ApiResponse<AdminListCampaignsResponse>>,
  approveCampaign: (campaignId: number, comment?: string | null) =>
    adminApi.approveCampaign(campaignId, comment) as Promise<ApiResponse<AdminApproveCampaignResponse>>,
  rejectCampaign: (campaignId: number, comment: string) =>
    adminApi.rejectCampaign(campaignId, comment) as Promise<ApiResponse<AdminRejectCampaignResponse>>,
  cancelCampaign: (payload: AdminCancelCampaignRequest) =>
    adminApi.cancelCampaign(payload) as Promise<ApiResponse<AdminCancelCampaignResponse>>,
};
