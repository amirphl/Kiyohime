export type PlatformKey = 'rubika' | 'bale' | 'splus' | 'sms';
export type PlatformStatus =
  | 'initialized'
  | 'in-progress'
  | 'active'
  | 'inactive';

export interface CreatePlatformSettingsRequest {
  name?: string;
  description?: string;
  website?: string;
  multimedia_uuid?: string;
  business_license_uuid?: string;
  platform: PlatformKey;
  status?: PlatformStatus;
}

export interface CreatePlatformSettingsResponse {
  message: string;
  id: number;
  platform: PlatformKey;
  name?: string;
  description?: string;
  website?: string;
  multimedia_uuid?: string;
  business_license_uuid?: string;
  status: PlatformStatus;
  created_at: string;
}

export interface PlatformSettingsItem {
  id: number;
  platform: PlatformKey;
  name?: string;
  description?: string;
  website?: string;
  multimedia_uuid?: string;
  business_license_uuid?: string;
  status: PlatformStatus;
  created_at: string;
  updated_at: string;
}

export interface ListPlatformSettingsResponse {
  message: string;
  items: PlatformSettingsItem[];
}
