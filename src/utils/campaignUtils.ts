import { CampaignData, UpdateSMSCampaignRequest } from '../types/campaign';

/**
 * Campaign utility functions for character counting, validation, and calculations
 */

/**
 * Counts characters after applying the same link substitution rules as backend.
 */
export const LINK_PLACEHOLDER = '{YOUR_LINK}';
export const DEFAULT_SHORT_LINK_DOMAIN = 'jo1n.ir';

export const normalizeLinkPlaceholder = (text: string): string =>
  text
    .replace(/\{YOUR_LINK\}/gi, LINK_PLACEHOLDER)
    .replace(/\u{1F517}/gu, LINK_PLACEHOLDER)
    .replace(/jo1n\.ir\/xxxxxx/gi, LINK_PLACEHOLDER);

export const hasLinkPlaceholder = (text: string): boolean =>
  normalizeLinkPlaceholder(text).includes(LINK_PLACEHOLDER);

export const getShortLinkDomainOrDefault = (
  shortLinkDomain?: string | null
): string =>
  shortLinkDomain && shortLinkDomain.trim()
    ? shortLinkDomain.trim()
    : DEFAULT_SHORT_LINK_DOMAIN;

export const countCharacters = (
  text: string,
  adLink?: string | null,
  shortLinkDomain?: string | null,
  platform: 'sms' | 'rubika' | 'bale' | 'splus' = 'sms'
): number => {
  if (!text) {
    return platform === 'sms' ? 6 : 0;
  }

  let textToCount = text;
  const hasAdLink = Boolean(adLink?.trim());
  const hasShortLinkDomain = Boolean(shortLinkDomain?.trim());

  if (hasAdLink && hasShortLinkDomain) {
    const shortLinkText = `${shortLinkDomain!.trim()}/123456`;
    textToCount = textToCount.replace(/\{YOUR_LINK\}/g, shortLinkText);
  } else if (hasAdLink) {
    let resolvedAdLink = adLink!.trim();
    if (resolvedAdLink.includes('{uid}')) {
      resolvedAdLink = resolvedAdLink.replace(/\{uid\}/g, '123456');
    }
    textToCount = textToCount.replace(/\{YOUR_LINK\}/g, resolvedAdLink);
  }

  let count = 0;
  for (let i = 0; i < textToCount.length; i++) {
    const char = textToCount.charCodeAt(i);
    // Check if character is English (ASCII range 32-126)
    if (char >= 32 && char <= 126) {
      count += 1; // English character
    } else {
      // Non-English character (Farsi, Arabic, etc.)
      // count += 2;

      // New requirement: Count Arabic and Farsi numerals as 1 character
      count += 1;
    }
  }

  if (platform === 'sms') {
    count += 6;
  }

  return count;
};

/**
 * Calculates the total character count including backend additions
 * @param userText - The user's input text
 * @param insertLink - Whether link insertion is enabled
 * @returns Object with total count, start count, and max characters
 */
export const calculateTotalCharacterCount = (
  userText: string,
  insertLink: boolean,
  adLink?: string | null,
  shortLinkDomain?: string | null,
  platform: 'sms' | 'rubika' | 'bale' | 'splus' = 'sms'
) => {
  const maxCharacters = 330; // Maximum total characters allowed

  const normalizedText = normalizeLinkPlaceholder(userText || '');
  const effectiveAdLink = insertLink ? adLink : null;
  const effectiveShortLinkDomain = insertLink ? shortLinkDomain : null;
  const totalCharacterCount = countCharacters(
    normalizedText,
    effectiveAdLink,
    effectiveShortLinkDomain,
    platform
  );
  const baseCharacterCount = countCharacters('', null, null, platform);
  const startCount = Math.min(baseCharacterCount, totalCharacterCount);
  const characterCount = Math.max(totalCharacterCount - startCount, 0);
  const isOverLimit = totalCharacterCount > maxCharacters;

  return {
    characterCount,
    startCount,
    totalCharacterCount,
    maxCharacters,
    isOverLimit,
    availableForUser: maxCharacters - startCount,
  };
};

/**
 * Calculates the number of SMS parts based on character count
 * @param charCount - Total character count
 * @returns Number of SMS parts needed
 */
export const calculateSMSParts = (charCount: number): number => {
  if (charCount <= 70) return 1;
  if (charCount <= 132) return 2;
  if (charCount <= 198) return 3;
  if (charCount <= 264) return 4;
  if (charCount <= 330) return 5;
  return 6; // More than 330 characters
};

/**
 * Validates campaign content step
 * @param content - Campaign content data
 * @returns Validation result
 */
export const validateCampaignContent = (
  content: {
    text: string;
    insertLink: boolean;
    link?: string;
    shortLinkDomain?: string | null;
    scheduleAt?: string;
  },
  platform: 'sms' | 'rubika' | 'bale' | 'splus' = 'sms'
) => {
  // Check if text exists
  if (!content.text?.trim()) {
    return { isValid: false, error: 'Please enter text content' };
  }

  if (platform !== 'sms') {
    const charCount = (content.text || '').length;
    if (charCount > 1000) {
      return {
        isValid: false,
        error: 'Text exceeds maximum length (1000 characters)',
      };
    }
    return { isValid: true, error: null };
  }

  // Check if link is provided when link insertion is enabled
  if (content.insertLink && !content.link?.trim()) {
    return {
      isValid: false,
      error: 'Please provide a link when link insertion is enabled',
    };
  }

  // If link insertion is enabled, require link placeholder presence
  if (
    content.insertLink &&
    !normalizeLinkPlaceholder(content.text).includes(LINK_PLACEHOLDER)
  ) {
    return {
      isValid: false,
      error: 'Please insert the link placeholder ({YOUR_LINK}) in your text',
    };
  }

  // Scheduling is optional. If provided, require at least 20 minutes in the future
  const nowMs = Date.now();
  const minScheduleMs = nowMs + 20 * 60 * 1000;
  if (content.scheduleAt) {
    const scheduledMs = new Date(content.scheduleAt).getTime();
    if (Number.isNaN(scheduledMs) || scheduledMs < minScheduleMs) {
      return {
        isValid: false,
        error: 'Please select a schedule at least 20 minutes from now',
      };
    }
  }

  // Check character limit
  const charCount = calculateTotalCharacterCount(
    content.text,
    content.insertLink,
    content.link,
    content.shortLinkDomain,
    platform
  );

  if (charCount.isOverLimit) {
    return {
      isValid: false,
      error: `Text exceeds maximum length. Available: ${charCount.availableForUser} characters`,
    };
  }

  return { isValid: true, error: null };
};

export const serializeCampaignPayload = (
  campaignData: CampaignData,
  options?: {
    includeContent?: boolean;
    includeBudget?: boolean;
    finalize?: boolean;
  }
) => {
  const platform = campaignData.segment.platform || 'sms';
  const targetAudienceExcelFileUuid =
    campaignData.segment.targetAudienceExcelFileUuid;

  const normalizedTargetAudienceExcelFileUuid =
    typeof targetAudienceExcelFileUuid === 'string' &&
    targetAudienceExcelFileUuid.trim()
      ? targetAudienceExcelFileUuid.trim()
      : null;
  const normalizedAdlink =
    campaignData.content.insertLink && campaignData.content.link?.trim()
      ? campaignData.content.link.trim()
      : undefined;

  const payload: UpdateSMSCampaignRequest = {
    title: campaignData.segment.campaignTitle || undefined,
    level1: campaignData.segment.level1 || undefined,
    level2s:
      campaignData.segment.level2s && campaignData.segment.level2s.length > 0
        ? campaignData.segment.level2s
        : undefined,
    level3s:
      campaignData.segment.level3s && campaignData.segment.level3s.length > 0
        ? campaignData.segment.level3s
        : undefined,
    target_audience_excel_file_uuid: normalizedTargetAudienceExcelFileUuid,
    tags:
      campaignData.segment.tags && campaignData.segment.tags.length > 0
        ? campaignData.segment.tags
        : undefined,
    line_number:
      platform === 'sms'
        ? campaignData.content.lineNumber
          ? campaignData.content.lineNumber
          : null
        : null,
    short_link_domain:
      campaignData.content.insertLink &&
      campaignData.content.shortLinkDomain?.trim()
        ? campaignData.content.shortLinkDomain.trim()
        : undefined,
    job_category: campaignData.segment.jobCategory || undefined,
    job: campaignData.segment.job || undefined,
    platform,
    platform_settings_id:
      platform === 'sms'
        ? null
        : (campaignData.content.platformSettingsId ?? null),
    media_uuid:
      platform === 'sms' ? null : (campaignData.content.mediaUuid ?? null),
    bundle_id: campaignData.segment.bundleId ?? null,
    phase: campaignData.segment.phase || undefined,
  };

  if (options?.includeContent) {
    payload.adlink = normalizedAdlink;
    payload.content = normalizeLinkPlaceholder(campaignData.content.text);
    payload.scheduleat = campaignData.content.scheduleAt;
  }

  if (options?.includeBudget) {
    payload.budget = campaignData.budget.totalBudget;
  }

  if (options?.finalize !== undefined) {
    payload.finalize = options.finalize;
  }

  payload.audience_grades =
    campaignData.segment.audienceGrades &&
    campaignData.segment.audienceGrades.length > 0
      ? campaignData.segment.audienceGrades
      : [];

  return payload;
};
