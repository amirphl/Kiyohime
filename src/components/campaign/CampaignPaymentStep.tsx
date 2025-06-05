import React, { useState, useEffect, useCallback } from 'react';
import { Wallet, CheckCircle, FileText, Calculator, Receipt, AlertCircle } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useCampaign } from '../../hooks/useCampaign';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../hooks/useAuth';
import { apiService } from '../../services/api';
import StepHeader from '../ui/StepHeader';
import Card from '../ui/Card';
import Button from '../ui/Button';

const CampaignPaymentStep: React.FC = () => {
  const { t } = useTranslation();
  const { campaignData, updatePayment } = useCampaign();
  const { isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const currencyLabel = language === 'en' ? 'Toman' : 'تومان';
  
  // State for cost calculation
  const [finalCost, setFinalCost] = useState<number | undefined>(undefined);
  const [tax, setTax] = useState<number | undefined>(undefined);
  const [total, setTotal] = useState<number | undefined>(undefined);
  const [messageCount, setMessageCount] = useState<number | undefined>(undefined);
  const [lastCostCalculation, setLastCostCalculation] = useState<number>(0);
  const [isLoadingCosts, setIsLoadingCosts] = useState(false);
  const [costError, setCostError] = useState<string | null>(null);

  // State for wallet balance
  const [walletBalance, setWalletBalance] = useState<number | undefined>(undefined);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [hasEnoughBalance, setHasEnoughBalance] = useState<boolean | undefined>(undefined);
  const [balanceChecked, setBalanceChecked] = useState(false);

  // API call for cost calculation
  const calculateCosts = useCallback(async () => {
    // Check if we have all required data
    if (!campaignData.segment.campaignTitle || 
        !campaignData.segment.segment || 
        !campaignData.content.text || 
        !campaignData.budget.totalBudget || 
        !campaignData.budget.lineNumber) {
      console.log('⚠️ Missing required campaign data for cost calculation');
      return;
    }

    console.log('🔄 Starting cost calculation...');
    setIsLoadingCosts(true);
    setCostError(null); // Clear previous errors
    
    try {
      // Call backend API for cost calculation
      console.log('🔄 Calling backend API for cost calculation:', {
        segment: campaignData.segment.segment,
        textLength: campaignData.content.text.length,
        budget: campaignData.budget.totalBudget,
        lineNumber: campaignData.budget.lineNumber
      });
      
      const response = await apiService.calculateCampaignCost({
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
      });
      
      if (response.success && response.data) {
        setFinalCost(response.data.sub_total);
        setTax(response.data.tax);
        setTotal(response.data.total);
        setMessageCount(response.data.msg_target);
        setLastCostCalculation(Date.now());
        console.log('✅ Cost calculation successful:', response.data);
      } else {
        console.error('❌ Failed to calculate costs:', response.message);
        setCostError(response.message || 'Failed to calculate costs.');
      }
      
      setIsLoadingCosts(false);
      
    } catch (error) {
      console.error('❌ Error calculating costs:', error);
      setCostError('Failed to calculate costs due to an unexpected error.');
      setIsLoadingCosts(false);
    }
  }, [campaignData]);

  // API call for wallet balance - CALLED ONLY ONCE
  const getWalletBalance = useCallback(async () => {
    // Only call once
    if (balanceChecked) {
      return;
    }

    console.log('💰 Getting wallet balance...');
    setIsLoadingBalance(true);
    setBalanceError(null);

    try {
      const response = await apiService.getWalletBalance();

      if (response.success && response.data) {
        const balance = response.data.free;
        setWalletBalance(balance);
        
        // Check if user has enough balance for the campaign
        if (campaignData.budget.totalBudget > 0) {
          const hasEnough = balance >= campaignData.budget.totalBudget;
          setHasEnoughBalance(hasEnough);
          
          // Update campaign data with balance status for validation
          updatePayment({ hasEnoughBalance: hasEnough });
          
          console.log('💰 Wallet balance:', balance, 'Campaign cost:', campaignData.budget.totalBudget, 'Has enough:', hasEnough);
        }
        setBalanceChecked(true);
      } else {
        const errorMessage = response.message || 'Failed to get wallet balance';
        setBalanceError(errorMessage);
        setWalletBalance(undefined);
        setHasEnoughBalance(undefined);
        
        // Update campaign data with balance status for validation
        updatePayment({ hasEnoughBalance: false });
        
        setBalanceChecked(true);
        console.error('❌ Wallet balance error:', errorMessage);
      }
    } catch (error) {
      console.error('❌ Error getting wallet balance:', error);
      const errorMessage = 'Network error while getting wallet balance';
      setBalanceError(errorMessage);
      setWalletBalance(undefined);
      setHasEnoughBalance(undefined);
      
      // Update campaign data with balance status for validation
      updatePayment({ hasEnoughBalance: false });
      
      setBalanceChecked(true);
    } finally {
      setIsLoadingBalance(false);
    }
  }, [balanceChecked, campaignData.budget.totalBudget, updatePayment]);

  // Effect to trigger cost calculation when campaign data changes
  useEffect(() => {
    if (isAuthenticated) {
      // Add a small delay to ensure API service is ready
      const timer = setTimeout(() => {
        calculateCosts();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, calculateCosts]);

  // Effect to get wallet balance ONCE when component mounts
  useEffect(() => {
    if (isAuthenticated && !balanceChecked) {
      // Add a small delay to ensure API service is ready
      const timer = setTimeout(() => {
        getWalletBalance();
      }, 1500); // Slightly longer delay than cost calculation
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, balanceChecked, getWalletBalance]);

  // Redirect to wallet section
  const redirectToWallet = () => {
    // Navigate to dashboard and scroll to wallet section
    window.location.href = '/dashboard/wallet';
  };

  // Check if finish button should be disabled
  const isFinishDisabled = () => {
    // Disable if cost calculation failed
    if (costError) return true;
    
    // Disable if wallet balance check failed
    if (balanceError) return true;
    
    // Disable if insufficient balance
    if (hasEnoughBalance === false) return true;
    
    // Disable if still loading
    if (isLoadingCosts || isLoadingBalance) return true;
    
    // Disable if missing required data
    if (!finalCost || !total || !messageCount) return true;
    
    return false;
  };

  // Terms and conditions removed

  // Format currency with label per language
  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} ${currencyLabel}`;
  };

  // Get campaign summary data
  const getCampaignSummary = () => {
    const summary = {
      title: campaignData.segment.campaignTitle || 'Not set',
      segment: campaignData.segment.segment || 'Not set',
      subsegments: campaignData.segment.subsegments?.length || 0,
      sex: campaignData.segment.sex || 'Not set',
      cities: campaignData.segment.city?.length || 0,
      textLength: campaignData.content.text?.length || 0,
      insertLink: campaignData.content.insertLink,
      budget: campaignData.budget.totalBudget || 0,
      lineNumber: campaignData.budget.lineNumber || 'Not set'
    };
    
    return summary;
  };

  const campaignSummary = getCampaignSummary();

  return (
    <div className="space-y-8">
      <StepHeader
        title={t('campaign.payment.title')}
        subtitle={t('campaign.payment.subtitle')}
        icon={<Receipt className="h-6 w-6 text-primary-600" />}
      />

      <div className="space-y-6">
        {/* Campaign Summary */}
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary-600" />
              {t('campaign.payment.campaignSummary')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('campaign.payment.campaignTitle')}</span>
                  <span className="text-gray-900 font-medium">{campaignSummary.title}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('campaign.payment.segment')}</span>
                  <span className="text-gray-900 font-medium">{campaignSummary.segment}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('campaign.payment.subsegments')}</span>
                  <span className="text-gray-900 font-medium">{t('campaign.payment.subsegmentsSelected', { count: campaignSummary.subsegments })}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('campaign.payment.sex')}</span>
                  <span className="text-gray-900 font-medium">{campaignSummary.sex}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('campaign.payment.cities')}</span>
                  <span className="text-gray-900 font-medium">{t('campaign.payment.citiesSelected', { count: campaignSummary.cities })}</span>
                </div>
              </div>
              
              {/* Right Column */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('campaign.payment.messageLength')}</span>
                  <span className="text-gray-900 font-medium">{campaignSummary.textLength} {t('campaign.payment.characters')}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('campaign.payment.linkInsertion')}</span>
                  <span className="text-gray-900 font-medium">
                    {campaignSummary.insertLink ? t('campaign.payment.enabled') : t('campaign.payment.disabled')}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('campaign.payment.budget')}</span>
                  <span className="text-gray-900 font-medium">
                    {formatCurrency(campaignSummary.budget)}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('campaign.payment.lineNumber')}</span>
                  <span className="text-gray-900 font-medium">{campaignSummary.lineNumber}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Cost Breakdown */}
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Calculator className="h-5 w-5 mr-2 text-primary-600" />
              {t('campaign.payment.costBreakdown')}
            </h3>
            
            <div className="space-y-4">
              {isLoadingCosts ? (
                <div className="flex items-center justify-center space-x-2 text-gray-600 py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                  <span>{t('campaign.payment.calculatingCosts')}</span>
                </div>
              ) : finalCost !== undefined && tax !== undefined && total !== undefined ? (
                <>
                  {/* Final Cost */}
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700 font-medium">{t('campaign.payment.finalCost')}</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {formatCurrency(finalCost)}
                    </span>
                  </div>
                  
                  {/* Tax */}
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700 font-medium">{t('campaign.payment.tax')}</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {formatCurrency(tax)}
                    </span>
                  </div>
                  
                  {/* Total */}
                  <div className="flex justify-between items-center p-4 bg-primary-50 rounded-lg border border-primary-200">
                    <span className="text-primary-800 font-bold text-lg">{t('campaign.payment.total')}:</span>
                    <span className="text-2xl font-bold text-primary-900">
                      {formatCurrency(total)}
                    </span>
                  </div>
                  
                  {/* Message Count */}
                  {messageCount !== undefined && (
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <span className="text-blue-700 font-medium">{t('campaign.payment.estimatedMessages')}</span>
                      <span className="text-lg font-semibold text-blue-900">
                        {messageCount.toLocaleString()} {t('campaign.payment.messages')}
                      </span>
                    </div>
                  )}
                  
                  {lastCostCalculation > 0 && (
                    <div className="text-xs text-gray-500 text-center">
                      {t('campaign.payment.lastCalculated', { time: new Date(lastCostCalculation).toLocaleTimeString() })}
                    </div>
                  )}
                </>
              ) : costError ? (
                <div className="text-center text-red-600 py-8">
                  <div className="text-lg font-medium mb-2">{t('campaign.payment.costCalculationError')}</div>
                  <div className="text-sm">{costError}</div>
                  <button 
                    onClick={calculateCosts}
                    className="mt-3 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    {t('campaign.payment.retryCalculation')}
                  </button>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  {campaignData.segment.segment && campaignData.content.text && campaignData.budget.totalBudget && campaignData.budget.lineNumber
                    ? t('campaign.payment.calculatingCostsMessage')
                    : t('campaign.payment.completeDetailsMessage')
                  }
                </div>
              )}
            </div>
            
            <div className="text-sm text-gray-500">
              {t('campaign.payment.costsHelp')}
              <br />
              <span className="font-medium">{t('campaign.payment.note')}</span> {t('campaign.payment.costsNotStored')}
            </div>
          </div>
        </Card>

        {/* Wallet Balance Check */}
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Wallet className="h-5 w-5 mr-2 text-primary-600" />
              {t('campaign.payment.walletBalance')}
            </h3>
            
            <div className="space-y-4">
              {isLoadingBalance ? (
                <div className="flex items-center justify-center space-x-2 text-gray-600 py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                  <span>{t('campaign.payment.checkingBalance')}</span>
                </div>
              ) : walletBalance !== undefined ? (
                <div className="space-y-3">
                  {/* Available Balance */}
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700 font-medium">{t('campaign.payment.availableBalance')}</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {walletBalance.toLocaleString()} {currencyLabel}
                    </span>
                  </div>
                  
                  {/* Campaign Cost */}
                  {total !== undefined && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700 font-medium">{t('campaign.payment.campaignCost')}</span>
                      <span className="text-lg font-semibold text-gray-900">
                        {total.toLocaleString()} {currencyLabel}
                      </span>
                    </div>
                  )}
                  
                  {/* Balance Status */}
                  {hasEnoughBalance !== undefined && (
                    <div className={`p-4 rounded-lg border ${
                      hasEnoughBalance 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-center space-x-2 mb-2">
                        {hasEnoughBalance ? (
                          <>
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-sm font-medium text-green-800">
                              {t('campaign.payment.sufficientBalance')}
                            </span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            <span className="text-sm font-medium text-red-800">
                              {t('campaign.payment.insufficientBalance')}
                            </span>
                          </>
                        )}
                      </div>
                      
                      {!hasEnoughBalance && (
                        <div className="space-y-3">
                          <p className="text-sm text-red-700">
                            {t('campaign.payment.insufficientBalanceMessage')}
                          </p>
                          <Button
                            onClick={redirectToWallet}
                            variant="primary"
                            className="w-full"
                          >
                            <Wallet className="w-4 h-4 mr-2" />
                            {t('campaign.payment.goToWallet')}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : balanceError ? (
                <div className="text-center text-red-600 py-8">
                  <div className="text-lg font-medium mb-2">{t('campaign.payment.balanceError')}</div>
                  <div className="text-sm">{balanceError}</div>
                  <p className="text-xs text-gray-500 mt-2">
                    {t('campaign.payment.balanceErrorHelp')}
                  </p>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  {t('campaign.payment.balanceNotAvailable')}
                </div>
              )}
            </div>
            
            <div className="text-sm text-gray-500">
              {t('campaign.payment.balanceHelp')}
            </div>
          </div>
        </Card>

        {/* Terms and Conditions removed */}

        {/* Final Summary */}
        {total !== undefined && (
          <Card>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Receipt className="h-5 w-5 mr-2 text-primary-600" />
                {t('campaign.payment.finalSummary')}
              </h3>
              
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-center space-y-2">
                  <div className="text-sm text-green-800">
                    {t('campaign.payment.readyForPayment')}
                  </div>
                  <div className="text-2xl font-bold text-green-900">
                    {t('campaign.payment.totalLabel')} {formatCurrency(total)}
                  </div>
                  <div className="text-xs text-green-700">
                    {t('campaign.payment.clickFinish')}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CampaignPaymentStep; 