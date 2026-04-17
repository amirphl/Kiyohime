import { CampaignData, UpdateSMSCampaignRequest } from '../types/campaign';

/**
 * Campaign utility functions for character counting, validation, and calculations
 */

/**
 * Counts characters in text with proper weighting for different character types
 * English characters and numbers = 1, others (Farsi, Arabic, etc.) = 2
 * Excludes the link placeholder character (🔗) from counting
 */
const normalizeLinkPlaceholder = (text: string): string =>
  text
    // Replace displayed placeholder with single marker so downstream logic stays consistent
    .replace(/jo1n\.ir\/xxxxxx/gi, '🔗');

export const countCharacters = (text: string): number => {
  if (!text) return 0;

  // Remove the link character (🔗) before counting
  const textWithoutLinkChar = normalizeLinkPlaceholder(text).replace(/🔗/g, '');

  let count = 0;
  for (let i = 0; i < textWithoutLinkChar.length; i++) {
    const char = textWithoutLinkChar.charCodeAt(i);
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
  insertLink: boolean
) => {
  const backendAppendChars = 6; // Backend appends 6 characters
  const shortenedLinkChars = 14; // Shortened link takes 14 characters
  const maxCharacters = 330; // Maximum total characters allowed

  const normalizedText = normalizeLinkPlaceholder(userText || '');
  const characterCount = countCharacters(normalizedText);
  let startCount: number;

  if (insertLink) {
    // Check if link character is present in text
    if (normalizedText && normalizedText.includes('🔗')) {
      // Link character will be replaced by shortened link (14 chars) + backend append (6 chars)
      startCount = shortenedLinkChars + backendAppendChars; // 20 chars
    } else {
      // No link character, backend will append shortened link (14 chars) + backend append (6 chars)
      startCount = shortenedLinkChars + backendAppendChars; // 20 chars
    }
  } else {
    // No link insertion, only backend append
    startCount = backendAppendChars; // 6 chars
  }

  const totalCharacterCount = startCount + characterCount;
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

  // If link insertion is enabled, require link character presence
  if (content.insertLink && !content.text.includes('🔗')) {
    return {
      isValid: false,
      error: 'Please insert the link marker (🔗) in your text',
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
    content.insertLink
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
  const platform = campaignData.level.platform || 'sms';
  const payload: UpdateSMSCampaignRequest = {
    title: campaignData.level.campaignTitle || undefined,
    level1: campaignData.level.level1 || undefined,
    level2s:
      campaignData.level.level2s && campaignData.level.level2s.length > 0
        ? campaignData.level.level2s
        : undefined,
    level3s:
      campaignData.level.level3s && campaignData.level.level3s.length > 0
        ? campaignData.level.level3s
        : undefined,
    tags:
      campaignData.level.tags && campaignData.level.tags.length > 0
        ? campaignData.level.tags
        : undefined,
    line_number:
      platform === 'sms'
        ? campaignData.content.lineNumber
          ? campaignData.content.lineNumber
          : null
        : null,
    short_link_domain: campaignData.content.shortLinkDomain || 'jo1n.ir',
    job_category: campaignData.level.jobCategory || undefined,
    job: campaignData.level.job || undefined,
    platform,
    platform_settings_id:
      platform === 'sms'
        ? null
        : (campaignData.content.platformSettingsId ?? null),
    media_uuid:
      platform === 'sms' ? null : (campaignData.content.mediaUuid ?? null),
  };

  if (options?.includeContent) {
    payload.adlink = campaignData.content.link;
    payload.content = campaignData.content.text;
    payload.scheduleat = campaignData.content.scheduleAt;
  }

  if (options?.includeBudget) {
    payload.budget = campaignData.budget.totalBudget;
  }

  if (options?.finalize !== undefined) {
    payload.finalize = options.finalize;
  }

  return payload;
};
