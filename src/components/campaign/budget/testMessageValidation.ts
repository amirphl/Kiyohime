import { CampaignData } from '../../../types/campaign';
import { PlatformSettingsItem } from '../../../types/platformSettings';

export type TestMessageValidationErrorCode =
  | 'MISSING_CAMPAIGN_UUID'
  | 'MISSING_CONTENT'
  | 'MISSING_ADLINK'
  | 'MISSING_PLATFORM_SETTINGS'
  | 'MISSING_LINE_NUMBER';

export interface TestMessageChecks {
  hasCampaignUuid: boolean;
  hasContent: boolean;
  hasAdlinkWhenEnabled: boolean;
  hasActivePlatformSettingsForNonSms: boolean;
  hasLineNumberForSms: boolean;
}

export const getTestMessageChecks = (
  campaignData: CampaignData,
  activePlatformSettings: PlatformSettingsItem[]
): TestMessageChecks => {
  const platform = campaignData.segment.platform || 'sms';
  const hasCampaignUuid = Boolean(campaignData.uuid?.trim());
  const hasContent = Boolean(campaignData.content.text?.trim());
  const hasAdlinkWhenEnabled = campaignData.content.insertLink
    ? Boolean(campaignData.content.link?.trim())
    : true;
  const hasLineNumberForSms =
    platform === 'sms'
      ? Boolean(campaignData.content.lineNumber?.trim())
      : true;
  const selectedPlatformSettingsId = campaignData.content.platformSettingsId;
  const hasActivePlatformSettingsForNonSms =
    platform !== 'sms'
      ? Boolean(
          selectedPlatformSettingsId &&
          activePlatformSettings.some(
            item =>
              item.id === selectedPlatformSettingsId && item.status === 'active'
          )
        )
      : true;

  return {
    hasCampaignUuid,
    hasContent,
    hasAdlinkWhenEnabled,
    hasActivePlatformSettingsForNonSms,
    hasLineNumberForSms,
  };
};

export const getTestMessageValidationErrorCode = (
  checks: TestMessageChecks
): TestMessageValidationErrorCode | null => {
  if (!checks.hasCampaignUuid) return 'MISSING_CAMPAIGN_UUID';
  if (!checks.hasContent) return 'MISSING_CONTENT';
  if (!checks.hasAdlinkWhenEnabled) return 'MISSING_ADLINK';
  if (!checks.hasActivePlatformSettingsForNonSms) {
    return 'MISSING_PLATFORM_SETTINGS';
  }
  if (!checks.hasLineNumberForSms) return 'MISSING_LINE_NUMBER';
  return null;
};
