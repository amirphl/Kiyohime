import { ApiResponse } from '../../../services/api';
import { campaignFlowErrorI18n } from './campaignFlowErrorTranslations';

type SupportedLanguage = 'en' | 'fa';

const normalizeErrorCode = (errorCode?: string) =>
  (errorCode || '').trim().toUpperCase();

export const handleCampaignFlowError = (
  response: Pick<ApiResponse<unknown>, 'message' | 'error'> | undefined,
  language: SupportedLanguage
): string => {
  const copy = campaignFlowErrorI18n[language] || campaignFlowErrorI18n.en;
  const rawCode = response?.error?.code || response?.message || '';
  const normalizedCode = normalizeErrorCode(rawCode);

  if (normalizedCode && copy.errorCodes[normalizedCode]) {
    return copy.errorCodes[normalizedCode];
  }

  if (
    normalizedCode.includes('NETWORK') ||
    normalizedCode.includes('TIMEOUT') ||
    normalizedCode.includes('FETCH') ||
    normalizedCode === 'FAILED TO FETCH'
  ) {
    return copy.networkError;
  }

  return copy.unknownError;
};
