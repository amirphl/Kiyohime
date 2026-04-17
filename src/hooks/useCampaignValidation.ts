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
    const { level } = campaignData;
    return !!(
      level.campaignTitle &&
      level.platform &&
      level.level1 &&
      level.level3s &&
      level.level3s.length > 0 &&
      level.capacityTooLow !== true &&
      (!isAgency || (level.jobCategory && level.job))
    );
  }, [campaignData, isAgency]);

  const step2Valid = useMemo(() => {
    const { content, level } = campaignData;
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
    const { budget, content, level } = campaignData;
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
          errors.push(
            'Please configure campaign title and select audience criteria'
          );
          if (!campaignData.level.platform) {
            errors.push('Please select a platform');
          }
          if (isAgency && !campaignData.level.jobCategory) {
            errors.push('Please select a category');
          }
          if (isAgency && !campaignData.level.job) {
            errors.push('Please select a job');
          }
        }
        break;
      case 2:
        if (!step2Valid) {
          const { content } = campaignData;
          const validation = validateCampaignContent(
            content,
            campaignData.level.platform
          );
          if (!validation.isValid && validation.error) {
            errors.push(validation.error);
          }
          if (campaignData.level.platform === 'sms') {
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
          if (campaignData.level.platform === 'sms') {
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
