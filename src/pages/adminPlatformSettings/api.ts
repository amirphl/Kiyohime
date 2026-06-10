import { ApiResponse } from '../../services/api';
import adminApi from '../../services/adminApi';
import {
  AdminAddPlatformSettingsMetadataRequest,
  AdminAddPlatformSettingsMetadataResponse,
  AdminChangePlatformSettingsStatusRequest,
  AdminChangePlatformSettingsStatusResponse,
  AdminListPlatformSettingsResponse,
} from '../../types/admin';

type AdminMultimediaResponse = {
  success: boolean;
  message: string;
  blob?: Blob;
  filename?: string;
  notFound?: boolean;
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
  previewMultimedia: (uuid: string) =>
    adminApi.previewMultimediaByAdmin(uuid) as Promise<AdminMultimediaResponse>,
  downloadMultimedia: (uuid: string) =>
    adminApi.downloadMultimediaByAdmin(
      uuid
    ) as Promise<AdminMultimediaResponse>,
};
