import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../hooks/useLanguage';
import { useCampaign } from '../hooks/useCampaign';
import { useToast } from '../hooks/useToast';
import CampaignSegmentStep from '../components/campaign/CampaignSegmentStep';
import CampaignContentStep from '../components/campaign/CampaignContentStep';
import CampaignBudgetStep from '../components/campaign/CampaignBudgetStep';
import CampaignPaymentStep from '../components/campaign/CampaignPaymentStep';
import ConfirmationModal from '../components/ConfirmationModal';

const CampaignCreationPage: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const {
    currentStep,
    campaignData,
    isLoading,
    error,
    nextStep,
    previousStep,
    goToStep,
    saveStepData,
    finishCampaign,
  } = useCampaign();
  const { showError, showSuccess } = useToast();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Debug logging
  console.log('CampaignCreationPage rendered:', {
    currentStep,
    campaignData,
    isLoading,
    error
  });

  // Show error toast when there's an error
  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error, showError]);

  const handleNextStep = async () => {
    try {
      // Save current step data before proceeding
      await saveStepData(currentStep);
      nextStep();
    } catch (err) {
      // Error is already handled by the context
      console.error('Failed to proceed to next step:', err);
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
      // Going to next step - need to save current step
      await handleNextStep();
    }
    // If step > currentStep + 1, don't allow skipping ahead
  };

  const handleFinish = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmFinish = async () => {
    setShowConfirmModal(false);
    try {
      await finishCampaign();
      showSuccess(t('campaign.success'));
    } catch (err) {
      console.error('Failed to finish campaign:', err);
    }
  };

  const handleCancelFinish = () => {
    setShowConfirmModal(false);
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

  const isStepCompleted = (step: number) => {
    switch (step) {
                        case 1:
                    return campaignData.segment.customerType || 
                           campaignData.segment.ageRange || 
                           campaignData.segment.location || 
                           (campaignData.segment.interests && campaignData.segment.interests.length > 0) ||
                           campaignData.segment.customFilters.length > 0;
      case 2:
        return campaignData.content.messageText.trim().length > 0;
      case 3:
        return campaignData.budget.totalBudget > 0;
      case 4:
        return campaignData.payment.paymentMethod && campaignData.payment.termsAccepted;
      default:
        return false;
    }
  };

  const isStepAccessible = (step: number) => {
    return step <= currentStep || isStepCompleted(step - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => window.location.href = '/dashboard'}
                className={`flex items-center text-gray-600 hover:text-gray-900 transition-colors ${
                  isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
                <span>{t('dashboard.title')}</span>
              </button>
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
          <div className="py-6">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-8">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center">
                    <button
                      onClick={() => handleStepClick(step)}
                      disabled={!isStepAccessible(step)}
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                        step === currentStep
                          ? 'border-primary-600 bg-primary-600 text-white'
                          : isStepCompleted(step)
                          ? 'border-green-500 bg-green-500 text-white'
                          : isStepAccessible(step)
                          ? 'border-gray-300 bg-white text-gray-500 hover:border-primary-400 hover:text-primary-400'
                          : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isStepCompleted(step) ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <span className="text-sm font-medium">{step}</span>
                      )}
                    </button>
                    
                    {step < 4 && (
                      <div
                        className={`w-16 h-0.5 mx-4 ${
                          isStepCompleted(step + 1)
                            ? 'bg-green-500'
                            : step < currentStep
                            ? 'bg-primary-300'
                            : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                {t(`campaign.step${currentStep}`)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Step Content */}
          <div className="p-8">
            {renderCurrentStep()}
          </div>

          {/* Navigation */}
          <div className={`px-8 py-6 border-t border-gray-200 flex ${
            isRTL ? 'flex-row-reverse' : 'flex-row'
          } justify-between items-center`}>
            <div>
              {currentStep > 1 && (
                <button
                  onClick={handlePreviousStep}
                  disabled={isLoading}
                  className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  {t('campaign.previousPage')}
                </button>
              )}
            </div>

            <div>
              {currentStep < 4 ? (
                <button
                  onClick={handleNextStep}
                  disabled={isLoading}
                  className={`inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'
                  }`}
                >
                  {t('campaign.nextPage')}
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleFinish}
                  disabled={isLoading}
                  className="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('campaign.finish')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onConfirm={handleConfirmFinish}
        onCancel={handleCancelFinish}
        title={t('campaign.confirmTitle')}
        message={t('campaign.confirmMessage')}
        confirmText={t('campaign.yes')}
        cancelText={t('campaign.no')}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-lg font-medium text-gray-900 mb-2">
              {t('campaign.creating')}
            </p>
            <p className="text-gray-600">
              {t('campaign.pleaseWait')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignCreationPage; 