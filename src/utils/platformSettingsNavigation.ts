import { CampaignPlatform } from '../types/campaign';
import { PlatformKey } from '../types/platformSettings';

const SETTINGS_PLATFORM_INTENT_KEY = 'settings_platform_intent';

const isPlatformKey = (value: string): value is PlatformKey => {
  return value === 'rubika' || value === 'bale' || value === 'splus';
};

export const toPlatformKey = (
  platform: CampaignPlatform
): PlatformKey | null => {
  if (platform === 'sms') return null;
  return platform;
};

export const storeSettingsPlatformIntent = (
  platform: CampaignPlatform
): void => {
  if (typeof window === 'undefined') return;
  const key = toPlatformKey(platform);
  if (!key) return;
  window.sessionStorage.setItem(SETTINGS_PLATFORM_INTENT_KEY, key);
};

export const consumeSettingsPlatformIntent = (): PlatformKey | null => {
  if (typeof window === 'undefined') return null;
  const raw = window.sessionStorage.getItem(SETTINGS_PLATFORM_INTENT_KEY);
  window.sessionStorage.removeItem(SETTINGS_PLATFORM_INTENT_KEY);
  if (!raw || !isPlatformKey(raw)) return null;
  return raw;
};
