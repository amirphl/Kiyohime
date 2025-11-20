import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../hooks/useAuth';
import { useCampaign } from '../hooks/useCampaign';
import { useNavigation } from '../contexts/NavigationContext';
import { useToast } from '../hooks/useToast';
import { apiService } from '../services/api';
import { getApiErrorMessage } from '../utils/errorHandler';
import { useCampaignValidation } from '../hooks/useCampaignValidation';
import CampaignSegmentStep from '../components/campaign/CampaignSegmentStep';
import CampaignContentStep from '../components/campaign/CampaignContentStep';
import CampaignBudgetStep from '../components/campaign/CampaignBudgetStep';
import CampaignPaymentStep from '../components/campaign/CampaignPaymentStep';
import Button from '../components/ui/Button';
import Stepper from '../components/ui/Stepper';
import { CampaignStep, CreateCampaignPayload, UpdateSMSCampaignRequest } from '../types/campaign';

const CampaignCreationPage: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL, language } = useLanguage();
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
  const [isFinishing, setIsFinishing] = React.useState(false);

  // Use the validation hook
  const validation = useCampaignValidation(campaignData, currentStep);

  // Campaign data is now retained when navigating away and returning
  // Only reset when campaign is actually finished (see handleFinish function)

  // Log when component mounts to track data persistence
  useEffect(() => {
    console.log('🏗️ CampaignCreationPage mounted');
    console.log('📊 Current campaign data:', campaignData);
    console.log('📍 Current step:', currentStep);

    // Check localStorage for existing data
    const savedData = localStorage.getItem('campaign_creation_data');
    const savedStep = localStorage.getItem('campaign_creation_step');
    console.log('💾 localStorage check:', {
      hasSavedData: !!savedData,
      savedStep: savedStep,
      dataSize: savedData ? savedData.length : 0
    });

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        console.log('🔍 Parsed saved data:', {
          hasUUID: !!parsed.uuid,
          hasSegmentData: !!parsed.segment,
          segmentFields: parsed.segment ? Object.keys(parsed.segment) : [],
          hasContentData: !!parsed.content,
          hasBudgetData: !!parsed.budget,
          hasPaymentData: !!parsed.payment,
        });
      } catch (error) {
        console.error('❌ Failed to parse saved data:', error);
      }
    }

    return () => {
      console.log('🏗️ CampaignCreationPage unmounting - data will be retained');
    };
  }, [campaignData, currentStep]);

  // Scroll to top whenever the step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Campaign UUID will be created when user clicks "next" on the segment page (step 1)

  // Remove the useEffect that automatically calls API on mount
  // This was causing infinite loops and unnecessary API calls

  // Ensure API service has token to avoid race on hard refresh
  useEffect(() => {
    if (accessToken) {
      apiService.setAccessToken(accessToken);
    }
  }, [accessToken]);

  const handleNextStep = async () => {
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch { }
    // Check if we're on step 1 (segment page)
    if (currentStep === 1) {
      // Check if campaign spec exists in localStorage (existing campaign)
      const savedData = localStorage.getItem('campaign_creation_data');
      const hasExistingCampaign = (savedData && (() => {
        try {
          const parsed = JSON.parse(savedData);
          return parsed.uuid && parsed.uuid !== '';
        } catch {
          return false;
        }
      })()) || (!!campaignData.uuid && campaignData.uuid !== '');

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

          // Create payload with segment data
          const payload: CreateCampaignPayload = {
            title: campaignData.segment.campaignTitle || undefined,
            segment: campaignData.segment.segment || undefined,
            subsegment: campaignData.segment.subsegments && campaignData.segment.subsegments.length > 0
              ? campaignData.segment.subsegments
              : undefined,
            sex: campaignData.segment.sex || undefined,
            city: campaignData.segment.city && campaignData.segment.city.length > 0
              ? campaignData.segment.city
              : undefined,
          };

          console.log('Campaign creation payload:', payload);

          // Call the API to create a new SMS campaign with segment data
          const response = await apiService.createCampaign(payload);
          console.log('Create campaign API response:', response);

          if (response.success && response.data && response.data.uuid) {
            console.log('Campaign created successfully with UUID:', response.data.uuid);
            // Store the UUID in campaign context
            setCampaignUuid(response.data.uuid);
            // Proceed to next step
            nextStep();
          } else {
            console.error('Failed to create campaign:', response);
            const errorMessage = getApiErrorMessage(
              response,
              language,
              'Failed to create campaign'
            );
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
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch { }
    previousStep();
  };

  const handleStepClick = async (step: number) => {
    if (step !== currentStep) {
      try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch { }
    }
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
    if (isFinishing) return;
    setIsFinishing(true);
    try {
      console.log('=== FINISH BUTTON CLICKED ===');
      console.log('Current step:', currentStep);
      console.log('Campaign data:', campaignData);
      console.log('Is step 4 completed?', validation.isStepCompleted(4));
      console.log('Handling finish action...');

      // Call API to update campaign
      if (!campaignData.uuid) {
        throw new Error('Campaign UUID not found');
      }

      apiService.setAccessToken(accessToken);
      console.log('🔑 Access token set for API call');

      const updateData: UpdateSMSCampaignRequest = {
        title: campaignData.segment.campaignTitle,
        segment: campaignData.segment.segment,
        subsegment: campaignData.segment.subsegments,
        sex: campaignData.segment.sex,
        city: campaignData.segment.city,
        adlink: campaignData.content.link,
        content: campaignData.content.text,
        scheduleat: campaignData.content.scheduleAt,
        line_number: campaignData.budget.lineNumber,
        budget: campaignData.budget.totalBudget,
        finalize: true,
        tags: campaignData.segment.tags,
      };

      console.log('🔄 Calling update campaign API with data:', updateData);
      const response = await apiService.updateCampaign(campaignData.uuid, updateData);

      if (!response.success) {
        throw new Error(response.message || 'Failed to update campaign');
      }

      console.log('✅ Campaign updated successfully:', response.data);

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

      // Show error message but DO NOT redirect to dashboard
      // This prevents infinite loops and allows user to see the error
      showError(`Failed to complete campaign: ${error instanceof Error ? error.message : 'Unknown error'}`);

      // DO NOT redirect to dashboard on error
      // User stays on payment page to see the error message
      console.log('❌ Campaign update failed, user remains on payment page');
    } finally {
      setIsFinishing(false);
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
                className={`flex items-center text-gray-600 hover:text-gray-900 transition-colors ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'
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
      {/* <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'
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
                className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'
                  }`}
              >
                {t('common.next')}
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleFinish}
                disabled={!validation.canFinishCampaign() || isFinishing}
                className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'
                  }`}
              >
                <Check className="h-4 w-4" />
                {isFinishing ? t('common.loading') : t('common.finish')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignCreationPage; 