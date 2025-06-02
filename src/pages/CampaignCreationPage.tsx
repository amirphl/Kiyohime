import React, { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../hooks/useAuth';
import { useCampaign } from '../hooks/useCampaign';
import { useNavigation } from '../contexts/NavigationContext';
import { useToast } from '../hooks/useToast';
import { apiService } from '../services/api';
import { useCampaignValidation } from '../hooks/useCampaignValidation';
import CampaignSegmentStep from '../components/campaign/CampaignSegmentStep';
import CampaignContentStep from '../components/campaign/CampaignContentStep';
import CampaignBudgetStep from '../components/campaign/CampaignBudgetStep';
import CampaignPaymentStep from '../components/campaign/CampaignPaymentStep';
import Button from '../components/ui/Button';
import Stepper from '../components/ui/Stepper';
import { CampaignStep } from '../types/campaign';

const CampaignCreationPage: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { accessToken } = useAuth();
  const {
    currentStep,
    campaignData,
    error,
    nextStep,
    previousStep,
    goToStep,
    setCampaignUuid,
    resetCampaign,
  } = useCampaign();
  const { showError, showSuccess } = useToast();
  const { navigate } = useNavigation();

  // Use the validation hook
  const validation = useCampaignValidation(campaignData, currentStep);

  // Reset campaign when component unmounts to ensure fresh state on next visit
  const isUnmountingRef = useRef(false);

  useEffect(() => {
    return () => {
      // This cleanup function runs when component unmounts
      // Reset campaign to ensure fresh UUID on next "targeted send" click
      if (!isUnmountingRef.current) {
        isUnmountingRef.current = true;
        resetCampaign();
      }
    };
  }, [resetCampaign]); // Include resetCampaign in dependencies

  // Campaign UUID will be created when user clicks "next" on the segment page (step 1)

  // Remove the useEffect that automatically calls API on mount
  // This was causing infinite loops and unnecessary API calls

  const handleNextStep = async () => {
    // Check if we're on step 1 (segment page)
    if (currentStep === 1) {
      // Check if campaign spec exists in localStorage (existing campaign)
      const savedData = localStorage.getItem('campaign_creation_data');
      const hasExistingCampaign = savedData && (() => {
        try {
          const parsed = JSON.parse(savedData);
          return parsed.uuid && parsed.uuid !== '';
        } catch {
          return false;
        }
      })();

      if (hasExistingCampaign) {
        // User has existing campaign - DO NOT call API, just proceed
        console.log('🔄 Existing campaign detected, proceeding to next step without API call');
        console.log('Campaign UUID:', campaignData.uuid);
        nextStep();
      } else {
        // New user - create campaign API call
        try {
          console.log('=== CREATING NEW CAMPAIGN ON SEGMENT PAGE NEXT ===');
          console.log('Current step:', currentStep);
          console.log('Campaign data:', campaignData);
          
          // Set the access token for the API call
          apiService.setAccessToken(accessToken);
          console.log('Access token set, calling createCampaign API...');
          
          // Call the API to create a new SMS campaign with empty body
          const response = await apiService.createCampaign({});
          console.log('Create campaign API response:', response);
          
          if (response.success && response.data && response.data.uuid) {
            console.log('Campaign created successfully with UUID:', response.data.uuid);
            // Store the UUID in campaign context
            setCampaignUuid(response.data.uuid);
            // Proceed to next step
            nextStep();
          } else {
            console.error('Failed to create campaign:', response);
            const errorMessage = response.error?.code || 'Failed to create campaign';
            showError(errorMessage);
            // Stay on current step if campaign creation fails
            return;
          }
        } catch (error) {
          console.error('Error creating campaign:', error);
          showError('Network error - please try again');
          return;
        }
      }
    } else {
      // Simply proceed to next step if we're not on step 1
      nextStep();
    }
  };

  const handlePreviousStep = () => {
    previousStep();
  };

  const handleStepClick = async (step: number) => {
    if (step < currentStep) {
      // Going back to previous step - no need to save
      goToStep(step);
    } else if (step === currentStep + 1) {
      // Going to next step - no need to save
      nextStep();
    }
    // If step > currentStep + 1, don't allow skipping ahead
  };

  const handleFinish = async () => {
    try {
      console.log('=== FINISH BUTTON CLICKED ===');
      console.log('Current step:', currentStep);
      console.log('Campaign data:', campaignData);
      console.log('Is step 4 completed?', validation.isStepCompleted(4));
      console.log('Handling finish action...');
      
      // TODO: Call API to finalize campaign (ignored for now as requested)
      // const response = await apiService.finalizeCampaign(campaignData.uuid);
      // if (!response.Success) {
      //   throw new Error(response.Error?.Code || 'Failed to finalize campaign');
      // }
      
      console.log('🎯 Campaign finalized successfully, cleaning up localStorage...');
      
      // Clear campaign data from localStorage completely
      localStorage.removeItem('campaign_creation_data');
      localStorage.removeItem('campaign_creation_step');
      
      console.log('🗑️ Campaign specification completely deleted from localStorage');
      console.log('🆕 User will start fresh like a new user for next campaign');
      
      // Reset campaign state in React context as well
      resetCampaign();
      console.log('🔄 Campaign state reset in React context');
      
      // Show success message and navigate to dashboard
      showSuccess('Campaign completed successfully!');
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Error finishing campaign:', error);
      showError('Failed to complete campaign. Please try again.');
      // Even on unexpected errors, redirect to dashboard
      navigate('/dashboard');
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <CampaignSegmentStep />;
      case 2:
        return <CampaignContentStep />;
      case 3:
        return <CampaignBudgetStep />;
      case 4:
        return <CampaignPaymentStep />;
      default:
        return <CampaignSegmentStep />;
    }
  };

  // Create step configuration for the stepper
  const steps: CampaignStep[] = [
    {
      id: 1,
      title: t('campaign.steps.segment.title'),
      subtitle: t('campaign.steps.segment.subtitle'),
      isCompleted: validation.isStepCompleted(1),
      isAccessible: validation.isStepAccessible(1),
    },
    {
      id: 2,
      title: t('campaign.steps.content.title'),
      subtitle: t('campaign.steps.content.subtitle'),
      isCompleted: validation.isStepCompleted(2),
      isAccessible: validation.isStepAccessible(2),
    },
    {
      id: 3,
      title: t('campaign.steps.budget.title'),
      subtitle: t('campaign.steps.budget.subtitle'),
      isCompleted: validation.isStepCompleted(3),
      isAccessible: validation.isStepAccessible(3),
    },
    {
      id: 4,
      title: t('campaign.steps.payment.title'),
      subtitle: t('campaign.steps.payment.subtitle'),
      isCompleted: validation.isStepCompleted(4),
      isAccessible: validation.isStepAccessible(4),
    },
  ];

  // Debug logging
  console.log('CampaignCreationPage rendered:', {
    currentStep,
    campaignData,
    error,
    'step1Completed': validation.isStepCompleted(1),
    'step2Completed': validation.isStepCompleted(2),
    'step3Completed': validation.isStepCompleted(3),
    'step4Completed': validation.isStepCompleted(4),
    'canShowFinishButton': currentStep === 4 && validation.isStepCompleted(4),
    'accessTokenAvailable': !!accessToken,
    'apiCalledOnMount': true
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => window.location.href = '/dashboard'}
                className={`flex items-center text-gray-600 hover:text-gray-900 transition-colors ${
                  isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
                <span>{t('dashboard.title')}</span>
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                {t('campaign.title')}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Stepper
            steps={steps}
            currentStep={currentStep}
            onStepClick={handleStepClick}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Step Content */}
        <div className="mb-8">
          {renderCurrentStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handlePreviousStep}
                className={`flex items-center ${
                  isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
                {t('common.previous')}
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {currentStep < 4 ? (
              <Button
                onClick={handleNextStep}
                disabled={!validation.canProceedToNextStep(currentStep)}
                className={`flex items-center ${
                  isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'
                }`}
              >
                {t('common.next')}
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleFinish}
                disabled={!validation.canFinishCampaign()}
                className={`flex items-center ${
                  isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'
                }`}
              >
                <Check className="h-4 w-4" />
                {t('common.finish')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignCreationPage; 