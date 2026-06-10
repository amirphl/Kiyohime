import { ApiResponse } from '../../services/api';
import adminApi from '../../services/adminApi';
import {
  AdminAddPlatformSettingsMetadataRequest,
  AdminAddPlatformSettingsMetadataResponse,
  AdminChangePlatformSettingsStatusRequest,
  AdminChangePlatformSettingsStatusResponse,
  AdminListPlatformBasePricesResponse,
  AdminListPlatformSettingsResponse,
  AdminUpdatePlatformBasePriceRequest,
  AdminUpdatePlatformBasePriceResponse,
} from '../../types/admin';

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
  previewMultimedia: (uuid: string) => adminApi.previewMultimediaByAdmin(uuid),
  downloadMultimedia: (uuid: string) =>
    adminApi.downloadMultimediaByAdmin(uuid),
};
