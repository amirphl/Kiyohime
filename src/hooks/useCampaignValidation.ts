import { useMemo } from 'react';
import { CampaignData } from '../types/campaign';
import { validateCampaignContent } from '../utils/campaignUtils';

export const useCampaignValidation = (campaignData: CampaignData, currentStep: number) => {
  const stepValidation = useMemo(() => ({
    step1: (): boolean => {
      const { segment } = campaignData;
      
      return !!(
        segment.campaignTitle && 
        segment.segment && 
        segment.subsegments && segment.subsegments.length > 0 &&
        // sex and city are optional for now
        segment.capacityTooLow !== true
      );
    },
    
    step2: (): boolean => {
      const { content } = campaignData;
      
      // Use centralized validation function
      const validation = validateCampaignContent(content);
      return validation.isValid;
    },
    
    step3: (): boolean => {
      return !!campaignData.budget.lineNumber && campaignData.budget.totalBudget > 0;
    },
    
    step4: (): boolean => {
      return campaignData.payment.hasEnoughBalance === true;
    },
  }), [campaignData]);

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
        if (!stepValidation.step1()) {
          errors.push('Please configure at least one segment criteria');
        }
        break;
      case 2:
        if (!stepValidation.step2()) {
          const { content } = campaignData;
          
          // Use centralized validation for consistent error messages
          const validation = validateCampaignContent(content);
          if (!validation.isValid && validation.error) {
            errors.push(validation.error);
          }
        }
        break;
      case 3:
        if (!stepValidation.step3()) {
          if (!campaignData.budget.lineNumber) {
            errors.push('Please select a line number');
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