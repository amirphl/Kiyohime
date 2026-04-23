import { useMemo } from 'react';
import { CampaignData } from '../types/campaign';
import { validateCampaignContent } from '../utils/campaignUtils';

export const useCampaignValidation = (
  campaignData: CampaignData,
  currentStep: number
) => {
  const accountType =
    typeof window !== 'undefined' ? localStorage.getItem('account_type') : null;
  const isAgency = accountType === 'marketing_agency';
  const MIN_BUDGET = 100000;
  const MAX_BUDGET = 160000000;
  // Precompute step validation booleans with memoization
  const step1Valid = useMemo(() => {
    const { segment } = campaignData;
    const isTargetAudienceExcelFileMode =
      segment.targetAudienceExcelFileUuid != null;
    const excelFileUploaded =
      typeof segment.targetAudienceExcelFileUuid === 'string' &&
      segment.targetAudienceExcelFileUuid.trim().length > 0;
    const hasValidLevelSelection =
      !!segment.level1 && !!segment.level3s && segment.level3s.length > 0;
    return !!(
      segment.campaignTitle &&
      segment.platform &&
      (!isTargetAudienceExcelFileMode || excelFileUploaded) &&
      (isTargetAudienceExcelFileMode || hasValidLevelSelection) &&
      (isTargetAudienceExcelFileMode || segment.capacityTooLow !== true) &&
      (!isAgency || (segment.jobCategory && segment.job))
    );
  }, [campaignData, isAgency]);

  const step2Valid = useMemo(() => {
    const { content, segment: level } = campaignData;
    const contentValid = validateCampaignContent(
      content,
      level.platform
    ).isValid;
    if (level.platform === 'sms') {
      return contentValid && !!content.lineNumber;
    }
    return contentValid && !!content.platformSettingsId;
  }, [campaignData]);

  const step3Valid = useMemo(() => {
    const { budget, content, segment: level } = campaignData;
    return (
      (level.platform === 'sms'
        ? !!content.lineNumber
        : !!content.platformSettingsId) &&
      budget.totalBudget >= MIN_BUDGET &&
      budget.totalBudget <= MAX_BUDGET
    );
  }, [campaignData]);

  const step4Valid = useMemo(() => {
    const { payment } = campaignData;
    return payment.hasEnoughBalance === true;
  }, [campaignData]);

  const stepValidation = useMemo(
    () => ({
      step1: (): boolean => step1Valid,
      step2: (): boolean => step2Valid,
      step3: (): boolean => step3Valid,
      step4: (): boolean => step4Valid,
    }),
    [step1Valid, step2Valid, step3Valid, step4Valid]
  );

  const isStepCompleted = (step: number): boolean => {
    switch (step) {
      case 1:
        return stepValidation.step1();
      case 2:
        return stepValidation.step2();
      case 3:
        return stepValidation.step3();
      case 4:
        return stepValidation.step4();
      default:
        return false;
    }
  };

  const isStepAccessible = (step: number): boolean => {
    return step === 1 || isStepCompleted(step - 1);
  };

  const canProceedToNextStep = (currentStep: number): boolean => {
    return isStepCompleted(currentStep);
  };

  const canFinishCampaign = (): boolean => {
    return currentStep === 4 && isStepCompleted(4);
  };

  const getStepErrors = (step: number): string[] => {
    const errors: string[] = [];

    switch (step) {
      case 1:
        if (!step1Valid) {
          errors.push('Please configure campaign title and audience criteria');
          if (!campaignData.segment.campaignTitle) {
            errors.push('Please enter a campaign title');
          }
          if (!campaignData.segment.platform) {
            errors.push('Please select a platform');
          }
          if (
            campaignData.segment.targetAudienceExcelFileUuid == null &&
            (!campaignData.segment.level1 ||
              !campaignData.segment.level3s ||
              campaignData.segment.level3s.length === 0)
          ) {
            errors.push('Please select audience levels');
          }
          if (
            campaignData.segment.targetAudienceExcelFileUuid == null &&
            campaignData.segment.capacityTooLow === true
          ) {
            errors.push('Audience capacity is too low');
          }
          if (isAgency && !campaignData.segment.jobCategory) {
            errors.push('Please select a category');
          }
          if (isAgency && !campaignData.segment.job) {
            errors.push('Please select a job');
          }
          if (
            campaignData.segment.targetAudienceExcelFileUuid != null &&
            (!campaignData.segment.targetAudienceExcelFileUuid ||
              !campaignData.segment.targetAudienceExcelFileUuid.trim())
          ) {
            errors.push('Please upload your Excel file');
          }
        }
        break;
      case 2:
        if (!step2Valid) {
          const { content } = campaignData;
          const validation = validateCampaignContent(
            content,
            campaignData.segment.platform
          );
          if (!validation.isValid && validation.error) {
            errors.push(validation.error);
          }
          if (campaignData.segment.platform === 'sms') {
            if (!campaignData.content.lineNumber) {
              errors.push('Please select a line number');
            }
          } else if (!campaignData.content.platformSettingsId) {
            errors.push('Please select an active service');
          }
        }
        break;
      case 3:
        if (!step3Valid) {
          if (campaignData.segment.platform === 'sms') {
            if (!campaignData.content.lineNumber) {
              errors.push('Please select a line number');
            }
          } else if (!campaignData.content.platformSettingsId) {
            errors.push('Please select an active service');
          } else if (campaignData.budget.totalBudget <= 0) {
            errors.push('Please set a total budget greater than 0');
          }
        }
        break;
      case 4:
        if (campaignData.payment.hasEnoughBalance === false) {
          errors.push('Insufficient wallet balance for campaign');
        }
        break;
    }

    return errors;
  };

  return {
    stepValidation,
    isStepCompleted,
    isStepAccessible,
    canProceedToNextStep,
    canFinishCampaign,
    getStepErrors,
  };
};
