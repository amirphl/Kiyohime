export type PlatformKey = 'rubika' | 'bale' | 'splus';
export type PlatformStatus = 'initialized' | 'in-progress' | 'active' | 'inactive';

export interface CreatePlatformSettingsRequest {
  name?: string;
  description?: string;
  multimedia_uuid?: string;
  platform: PlatformKey;
  status?: PlatformStatus;
}

export interface CreatePlatformSettingsResponse {
  message: string;
  id: number;
  platform: PlatformKey;
  name?: string;
  description?: string;
  multimedia_uuid?: string;
  status: PlatformStatus;
  created_at: string;
}

export interface PlatformSettingsItem {
  id: number;
  platform: PlatformKey;
  name?: string;
  description?: string;
  multimedia_uuid?: string;
  status: PlatformStatus;
  created_at: string;
  updated_at: string;
}

export interface ListPlatformSettingsResponse {
  message: string;
  items: PlatformSettingsItem[];
}
