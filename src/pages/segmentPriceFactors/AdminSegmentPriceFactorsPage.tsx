import React, { useMemo } from 'react';
import { ROUTES } from '../../config/routes';
import { useNavigation } from '../../contexts/NavigationContext';
import { useLanguage } from '../../hooks/useLanguage';
import { useToast } from '../../hooks/useToast';
import PagePricesSection from './components/PagePricesSection';
import PlatformBasePricesSection from './components/PlatformBasePricesSection';
import PricingCalculationSection from './components/PricingCalculationSection';
import SegmentPriceFactorForm from './components/SegmentPriceFactorForm';
import SegmentPriceFactorsTable from './components/SegmentPriceFactorsTable';
import { useAdminPagePrices } from './hooks/useAdminPagePrices';
import { useAdminPlatformBasePrices } from './hooks/useAdminPlatformBasePrices';
import { useAdminSegmentPriceFactors } from './hooks/useAdminSegmentPriceFactors';
import { segmentPriceFactorTranslations } from './translations';
import { formatDateTime } from './utils';

const AdminSegmentPriceFactorsPage: React.FC = () => {
  const { language } = useLanguage();
  const { showError, showSuccess } = useToast();
  const { navigate } = useNavigation();
  const isRTL = language === 'fa';

  const copy = useMemo(
    () =>
      segmentPriceFactorTranslations[
        language as keyof typeof segmentPriceFactorTranslations
      ] || segmentPriceFactorTranslations.en,
    [language]
  );

  const segmentFactors = useAdminSegmentPriceFactors({
    copy,
    onError: showError,
    onSuccess: showSuccess,
  });

  const basePrices = useAdminPlatformBasePrices({
    onError: showError,
    onSuccess: showSuccess,
    errors: {
      listFailed: copy.errors.basePriceListFailed,
      updateFailed: copy.errors.basePriceUpdateFailed,
      invalidPrice: copy.errors.basePriceInvalid,
    },
    success: {
      updated: copy.success.basePriceUpdated,
    },
  });

  const pagePrices = useAdminPagePrices({
    onError: showError,
    onSuccess: showSuccess,
    errors: {
      listFailed: copy.errors.pagePriceListFailed,
      updateFailed: copy.errors.pagePriceUpdateFailed,
      invalidPrice: copy.errors.pagePriceInvalid,
      validationFailed: copy.errors.pagePriceValidationFailed,
      platformRequired: copy.errors.pagePricePlatformRequired,
      platformInvalid: copy.errors.pagePricePlatformInvalid,
      priceInvalid: copy.errors.pagePriceInvalid,
      insertFailed: copy.errors.pagePriceInsertFailed,
      unauthorized: copy.errors.unauthorized,
      network: copy.errors.networkError,
      invalidRequest: copy.errors.invalidRequest,
    },
    success: {
      updated: copy.success.pagePriceUpdated,
    },
  });

  const formatAdminDateTime = useMemo(
    () => (value?: string | null) =>
      formatDateTime(value, language, copy.common.emptyValue),
    [copy.common.emptyValue, language]
  );

  return (
    <div className='mx-auto max-w-7xl p-4'>
      <div className='mb-4 flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-semibold'>{copy.title}</h1>
          <p className='mt-1 text-sm text-gray-600'>{copy.subtitle}</p>
        </div>
        <button
          className='rounded bg-gray-200 px-3 py-2 text-gray-800 hover:bg-gray-300'
          onClick={() => navigate(ROUTES.ADMIN_SARDIS.path)}
        >
          {copy.backToSardis}
        </button>
      </div>

      <div className='space-y-6'>
        <SegmentPriceFactorForm
          platform={segmentFactors.platform}
          level3={segmentFactors.level3}
          priceFactor={segmentFactors.priceFactor}
          level3Options={segmentFactors.level3Options}
          loadingOptions={segmentFactors.loadingOptions}
          optionsError={segmentFactors.optionsError}
          loadingFactors={segmentFactors.loadingFactors}
          submitting={segmentFactors.submitting}
          copy={copy}
          onPlatformChange={segmentFactors.changePlatform}
          onLevel3Change={segmentFactors.setLevel3}
          onPriceFactorChange={segmentFactors.setPriceFactor}
          onSubmit={segmentFactors.submit}
          onRefresh={() => {
            segmentFactors.loadLevel3Options(segmentFactors.platform);
            segmentFactors.loadFactors(segmentFactors.platform);
            basePrices.load();
            pagePrices.load();
          }}
        />

        <SegmentPriceFactorsTable
          items={segmentFactors.factors}
          loading={segmentFactors.loadingFactors}
          error={segmentFactors.factorsError}
          copy={copy}
          formatDateTime={formatAdminDateTime}
          isRTL={isRTL}
        />

        <PlatformBasePricesSection
          items={basePrices.items}
          loading={basePrices.loading}
          error={basePrices.error}
          copy={copy}
          getDraftPrice={basePrices.getDraftPrice}
          onChangeDraftPrice={basePrices.setDraftPrice}
          onUpdatePrice={basePrices.updatePrice}
          updatingByPlatform={basePrices.updatingByPlatform}
        />

        <PagePricesSection
          items={pagePrices.items}
          loading={pagePrices.loading}
          error={pagePrices.error}
          copy={copy}
          getDraftPrice={pagePrices.getDraftPrice}
          onChangeDraftPrice={pagePrices.setDraftPrice}
          onUpdatePrice={pagePrices.updatePrice}
          updatingByPlatform={pagePrices.updatingByPlatform}
          formatDateTime={formatAdminDateTime}
        />

        <PricingCalculationSection
          basePriceItems={basePrices.items}
          pagePriceItems={pagePrices.items}
          copy={copy}
        />
      </div>
    </div>
  );
};

export default AdminSegmentPriceFactorsPage;
