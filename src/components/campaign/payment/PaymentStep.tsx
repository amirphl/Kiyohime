import React, { useEffect } from 'react';
import { Receipt } from 'lucide-react';
import { useCampaign } from '../../../hooks/useCampaign';
import { useLanguage } from '../../../hooks/useLanguage';
import { useAuth } from '../../../hooks/useAuth';
import { apiService } from '../../../services/api';
import StepHeader from '../../ui/StepHeader';
import CostBreakdownCard from './CostBreakdownCard';
import WalletBalanceCard from './WalletBalanceCard';
import { useCostCalculation } from './useCostCalculation';
import { useWalletBalance } from './useWalletBalance';
import { paymentI18n } from './paymentTranslations';

const PaymentStep: React.FC = () => {
  const { campaignData, updatePayment } = useCampaign();
  const { isAuthenticated, accessToken } = useAuth();
  const { language } = useLanguage();
  const t = paymentI18n[language as keyof typeof paymentI18n] || paymentI18n.en;
  const currencyLabel = language === 'en' ? 'Toman' : 'تومان';

  // Ensure API service has token
  useEffect(() => {
    if (accessToken) {
      apiService.setAccessToken(accessToken);
    }
  }, [accessToken]);

  // Custom hooks for business logic
  const {
    total,
    messageCount,
    lastCalculation,
    isLoading: isLoadingCosts,
    error: costError,
    calculateCosts,
  } = useCostCalculation(campaignData, updatePayment);

  const {
    walletBalance,
    isLoading: isLoadingBalance,
    error: balanceError,
    hasEnoughBalance,
    balanceChecked,
    getWalletBalance,
  } = useWalletBalance(campaignData.budget.totalBudget, total, updatePayment);

  // Trigger cost calculation
  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        calculateCosts();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, calculateCosts]);

  // Trigger balance check
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

  const hasRequiredData = !!(
    campaignData.level.level1 &&
    campaignData.content.text &&
    campaignData.budget.totalBudget &&
    campaignData.budget.lineNumber
  );

  return (
    <div className='space-y-8'>
      <StepHeader
        title={t.title}
        subtitle={''}
        icon={<Receipt className='h-6 w-6 text-primary-600' />}
      />

      <div className='space-y-6'>
        {/* Cost Breakdown */}
        <CostBreakdownCard
          total={total}
          messageCount={messageCount}
          lastCalculation={lastCalculation}
          isLoading={isLoadingCosts}
          error={costError}
          hasRequiredData={hasRequiredData}
          onRetry={calculateCosts}
          currencyLabel={currencyLabel}
          title={t.costBreakdown}
          calculatingLabel={t.calculatingCosts}
          totalLabel={t.total}
          estimatedMessagesLabel={t.estimatedMessages}
          messagesLabel={t.messages}
          errorTitle={t.costCalculationError}
          retryLabel={t.retryCalculation}
          calculatingMessage={t.calculatingCostsMessage}
          completeDetailsMessage={t.completeDetailsMessage}
          noteLabel={t.note}
        />

        {/* Wallet Balance Check */}
        <WalletBalanceCard
          walletBalance={walletBalance}
          total={total}
          hasEnoughBalance={hasEnoughBalance}
          error={balanceError}
          onRedirectToWallet={redirectToWallet}
          currencyLabel={currencyLabel}
          title={t.walletBalance}
          availableBalanceLabel={t.availableBalance}
          campaignCostLabel={t.campaignCost}
          sufficientBalanceLabel={t.sufficientBalance}
          insufficientBalanceLabel={t.insufficientBalance}
          insufficientBalanceMessage={t.insufficientBalanceMessage}
          goToWalletLabel={t.goToWallet}
          balanceErrorTitle={t.balanceError}
          balanceErrorHelp={t.balanceErrorHelp}
          balanceNotAvailableLabel={t.balanceNotAvailable}
          helpText={t.balanceHelp}
        />
      </div>
    </div>
  );
};

export default PaymentStep;
