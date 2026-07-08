import { useCallback, useRef, useState } from 'react';
import { apiService } from '../../../services/api';
import { useAuth } from '../../../hooks/useAuth';
import { useToast } from '../../../hooks/useToast';
import { ReportsCopy } from '../translations';
import { downloadBlob } from '../../wallet/utils/download';

const CLICK_REPORT_FILENAME_PREFIX = 'campaign_click_report';

const getClickReportErrorMessage = (
  code: string | undefined,
  copy: ReportsCopy
): string => {
  const normalized = (code || '').trim().toUpperCase();

  switch (normalized) {
    case 'MISSING_ACCESS_TOKEN':
    case 'UNAUTHORIZED':
      return copy.modal.exportUnauthorized;
    case 'FORBIDDEN':
      return copy.modal.exportForbidden;
    case 'MISSING_CAMPAIGN_UUID':
    case 'CAMPAIGN_UUID_REQUIRED':
      return copy.modal.exportMissingCampaignUuid;
    case 'INVALID_CAMPAIGN_UUID':
    case 'CAMPAIGN_UUID_INVALID':
      return copy.modal.exportInvalidCampaignUuid;
    case 'AUDIENCE_REPORT_NOT_AVAILABLE':
    case 'CAMPAIGN_NOT_FOUND':
    case 'NOT_FOUND':
      return copy.modal.clickReportNotFound;
    case 'TIMEOUT_ERROR':
      return copy.modal.clickReportTimeout;
    case 'NETWORK_ERROR':
      return copy.modal.clickReportNetworkError;
    case 'INVALID_RESPONSE':
      return copy.modal.clickReportInvalidResponse;
    default:
      return copy.modal.clickReportError;
  }
};

interface UseCampaignClickReportExportParams {
  copy: ReportsCopy;
}

export const useCampaignClickReportExport = ({
  copy,
}: UseCampaignClickReportExportParams) => {
  const { accessToken } = useAuth();
  const { showError } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const isExportingRef = useRef(false);

  const exportClickReport = useCallback(
    async (campaignUuid?: string | null) => {
      if (isExportingRef.current) return;

      if (!accessToken) {
        showError(copy.modal.exportUnauthorized);
        return;
      }

      if (!campaignUuid?.trim()) {
        showError(copy.modal.exportMissingCampaignUuid);
        return;
      }

      isExportingRef.current = true;
      setIsExporting(true);
      try {
        apiService.setAccessToken(accessToken);
        const response = await apiService.exportCampaignClickReport(
          campaignUuid.trim()
        );

        if (!response.success || !response.blob) {
          showError(getClickReportErrorMessage(response.message, copy));
          return;
        }

        downloadBlob(
          response.blob,
          response.filename ||
            `${CLICK_REPORT_FILENAME_PREFIX}_${campaignUuid.trim()}.csv`
        );
      } catch {
        showError(copy.modal.clickReportError);
      } finally {
        isExportingRef.current = false;
        setIsExporting(false);
      }
    },
    [accessToken, copy, showError]
  );

  return {
    exportClickReport,
    isExporting,
  };
};
