import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Wallet, CheckCircle, Calculator, Receipt, AlertCircle } from 'lucide-react';
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
  const { isAuthenticated, accessToken } = useAuth();
  const { language } = useLanguage();
  const currencyLabel = language === 'en' ? 'Toman' : 'تومان';
  
  // Ensure API service has token to avoid race on hard refresh
  useEffect(() => {
    if (accessToken) {
      apiService.setAccessToken(accessToken);
    }
  }, [accessToken]);
  
  // State for cost calculation
  const [total, setTotal] = useState<number | undefined>(undefined);
  const [messageCount, setMessageCount] = useState<number | undefined>(undefined);
  const [lastCostCalculation, setLastCostCalculation] = useState<number>(0);
  const [isLoadingCosts, setIsLoadingCosts] = useState(false);
  const [costError, setCostError] = useState<string | null>(null);

  // Guards to avoid duplicate API calls (Strict Mode and rerenders)
  const costRequestInFlightRef = useRef(false);
  const costTriggeredKeyRef = useRef<string | null>(null);

  // State for wallet balance
  const [walletBalance, setWalletBalance] = useState<number | undefined>(undefined);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [hasEnoughBalance, setHasEnoughBalance] = useState<boolean | undefined>(undefined);
  const [balanceChecked, setBalanceChecked] = useState(false);

  // API call for cost calculation
  const calculateCosts = useCallback(async () => {
    const title = campaignData.segment.campaignTitle;
    const segment = campaignData.segment.segment;
    const subsegment = campaignData.segment.subsegments || [];
    const tags = campaignData.segment.tags || [];
    const sex = campaignData.segment.sex;
    const city = campaignData.segment.city || [];
    const adlink = campaignData.content.link;
    const content = campaignData.content.text;
    const scheduleat = campaignData.content.scheduleAt;
    const line_number = campaignData.budget.lineNumber;
    const budget = campaignData.budget.totalBudget;

    if (!title || !segment || !content || !budget || !line_number) {
      return;
    }

    // Build selection key to avoid duplicates for the same inputs
    const selectionKey = [
      title,
      segment,
      [...subsegment].sort().join(','),
      [...tags].sort().join(','),
      sex || '',
      [...city].sort().join(','),
      adlink || '',
      content,
      scheduleat || '',
      line_number,
      String(budget),
    ].join('|');

    if (costRequestInFlightRef.current || costTriggeredKeyRef.current === selectionKey) {
      return;
    }
    costRequestInFlightRef.current = true;

    setIsLoadingCosts(true);
    setCostError(null);
    
    try {
      const response = await apiService.calculateCampaignCost({
        title,
        segment,
        subsegment,
        sex,
        city,
        adlink,
        content,
        scheduleat,
        line_number,
        budget,
        tags,
      });
      
      if (response.success && response.data) {
        setTotal(response.data.total_cost);
        setMessageCount(response.data.msg_target);
        setLastCostCalculation(Date.now());
        updatePayment({ total: response.data.total_cost, finalCost: response.data.total_cost });
        costTriggeredKeyRef.current = selectionKey; // mark as done for this selection
      } else {
        setCostError(response.message || 'Failed to calculate costs.');
      }
      
    } catch (error) {
      setCostError('Failed to calculate costs due to an unexpected error.');
    } finally {
      setIsLoadingCosts(false);
      costRequestInFlightRef.current = false;
    }
  }, [campaignData, updatePayment]);

  // API call for wallet balance - CALLED ONLY ONCE
  const getWalletBalance = useCallback(async () => {
    if (balanceChecked) {
      return;
    }

    setIsLoadingBalance(true);
    setBalanceError(null);

    try {
      const response = await apiService.getWalletBalance();

      if (response.success && response.data) {
        const free = Number(response.data.free || 0);
        const credit = Number((response.data as any).credit || 0);
        const balance = free + credit;
        setWalletBalance(balance);
        if (campaignData.budget.totalBudget > 0) {
          const hasEnough = balance >= campaignData.budget.totalBudget;
          setHasEnoughBalance(hasEnough);
          updatePayment({ hasEnoughBalance: hasEnough });
        }
        setBalanceChecked(true);
      } else {
        const errorMessage = response.message || 'Failed to get wallet balance';
        setBalanceError(errorMessage);
        setWalletBalance(undefined);
        setHasEnoughBalance(undefined);
        updatePayment({ hasEnoughBalance: false });
        setBalanceChecked(true);
      }
    } catch (error) {
      const errorMessage = 'Network error while getting wallet balance';
      setBalanceError(errorMessage);
      setWalletBalance(undefined);
      setHasEnoughBalance(undefined);
      updatePayment({ hasEnoughBalance: false });
      setBalanceChecked(true);
    } finally {
      setIsLoadingBalance(false);
    }
  }, [balanceChecked, campaignData.budget.totalBudget, updatePayment]);

  // Recompute sufficiency when total cost or wallet balance changes
  useEffect(() => {
    if (walletBalance !== undefined && total !== undefined) {
      const hasEnough = walletBalance >= total;
      setHasEnoughBalance(hasEnough);
      updatePayment({ hasEnoughBalance: hasEnough });
    }
  }, [walletBalance, total, updatePayment]);

  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        calculateCosts();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, calculateCosts]);

  useEffect(() => {
    if (isAuthenticated && !balanceChecked) {
      const timer = setTimeout(() => {
        getWalletBalance();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, balanceChecked, getWalletBalance]);

  const redirectToWallet = () => {
    window.location.href = '/dashboard/wallet';
  };

  const isFinishDisabled = () => {
    if (costError) return true;
    if (balanceError) return true;
    if (hasEnoughBalance === false) return true;
    if (isLoadingCosts || isLoadingBalance) return true;
    if (!total || !messageCount) return true;
    return false;
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} ${currencyLabel}`;
  };

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
              ) : total !== undefined ? (
                <>
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
        
      </div>
    </div>
  );
};

export default CampaignPaymentStep; 