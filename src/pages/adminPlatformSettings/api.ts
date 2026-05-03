import { ApiResponse } from '../../services/api';
import adminApi from '../../services/adminApi';
import {
  AdminAddPlatformSettingsMetadataRequest,
  AdminAddPlatformSettingsMetadataResponse,
  AdminChangePlatformSettingsStatusRequest,
  AdminChangePlatformSettingsStatusResponse,
  AdminListPlatformBasePricesResponse,
  AdminGetPagePricesResponse,
  AdminUpdatePagePriceRequest,
  AdminUpdatePagePriceResponse,
  AdminListPlatformSettingsResponse,
  AdminUpdatePlatformBasePriceRequest,
  AdminUpdatePlatformBasePriceResponse,
} from '../../types/admin';

type AdminMultimediaResponse = {
  success: boolean;
  message: string;
  blob?: Blob;
  filename?: string;
};

export const adminPlatformSettingsApi = {
  list: () =>
    adminApi.listPlatformSettingsByAdmin() as Promise<
      ApiResponse<AdminListPlatformSettingsResponse>
    >,
  changeStatus: (payload: AdminChangePlatformSettingsStatusRequest) =>
    adminApi.changePlatformSettingsStatusByAdmin(payload) as Promise<
      ApiResponse<AdminChangePlatformSettingsStatusResponse>
    >,
  addMetadata: (payload: AdminAddPlatformSettingsMetadataRequest) =>
    adminApi.addPlatformSettingsMetadataByAdmin(payload) as Promise<
      ApiResponse<AdminAddPlatformSettingsMetadataResponse>
    >,
  listBasePrices: () =>
    adminApi.listPlatformBasePricesByAdmin() as Promise<
      ApiResponse<AdminListPlatformBasePricesResponse>
    >,
  updateBasePrice: (payload: AdminUpdatePlatformBasePriceRequest) =>
    adminApi.updatePlatformBasePriceByAdmin(payload) as Promise<
      ApiResponse<AdminUpdatePlatformBasePriceResponse>
    >,
  listPagePrices: () =>
    adminApi.getCampaignPagePricesByAdmin() as Promise<
      ApiResponse<AdminGetPagePricesResponse>
    >,
  updatePagePrice: (payload: AdminUpdatePagePriceRequest) =>
    adminApi.updateCampaignPagePriceByAdmin(payload) as Promise<
      ApiResponse<AdminUpdatePagePriceResponse>
    >,
  previewMultimedia: (uuid: string) =>
    adminApi.previewMultimediaByAdmin(uuid) as Promise<AdminMultimediaResponse>,
  downloadMultimedia: (uuid: string) =>
    adminApi.downloadMultimediaByAdmin(
      uuid
    ) as Promise<AdminMultimediaResponse>,
};
