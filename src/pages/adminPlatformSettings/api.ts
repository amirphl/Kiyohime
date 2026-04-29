import { ApiResponse } from '../../services/api';
import adminApi from '../../services/adminApi';
import {
  AdminAddPlatformSettingsMetadataRequest,
  AdminAddPlatformSettingsMetadataResponse,
  AdminChangePlatformSettingsStatusRequest,
  AdminChangePlatformSettingsStatusResponse,
  AdminListPlatformSettingsResponse,
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
  previewMultimedia: (uuid: string) => adminApi.previewMultimediaByAdmin(uuid),
  downloadMultimedia: (uuid: string) => adminApi.downloadMultimediaByAdmin(uuid),
};
