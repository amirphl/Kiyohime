import React, { useEffect, useMemo, useRef } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useNavigation } from '../contexts/NavigationContext';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../config/routes';
import {
  createCampaignCreationDraft,
  prepareCampaignCreationDraft,
} from '../utils/campaignCreationDraft';
import { getBundlesCopy } from './bundles/translations';
import BundleFormHeader from './bundles/components/BundleFormHeader';
import BundleInfoSection from './bundles/components/BundleInfoSection';
import BundleFormActions from './bundles/components/BundleFormActions';
import BundleTestCustomerSection from './bundles/components/BundleTestCustomerSection';
import { useCreateBundleForm } from './bundles/hooks/useCreateBundleForm';
import { useUrlValidation } from '../components/campaign/content/useUrlValidation';
import { contentI18n } from '../components/campaign/content/contentTranslations';
import { CreateBundleResponse } from '../types/bundle';
import { BUNDLE_TOAST_DURATION_MS } from './bundles/utils';
import { resetBundlesCache } from '../components/campaign/content/useBundles';

const CreateBundlePage: React.FC = () => {
  const { language } = useLanguage();
  const { navigate } = useNavigation();
  const { user } = useAuth();
  const { showError, showSuccess } = useToast();
  const lastShownSubmitErrorRef = useRef<string | null>(null);
  const copy = useMemo(() => getBundlesCopy(language), [language]);
  const contentCopy =
    contentI18n[language as keyof typeof contentI18n] || contentI18n.en;
  const isAgency = user?.account_type === 'marketing_agency';

  const { values, errors, submitError, submitting, setFieldValue, submit } =
    useCreateBundleForm({
      copy,
    });

  const { linkError, handleLinkChange, clearError, validateUrl } =
    useUrlValidation(
      values.link,
      values.insertLink,
      contentCopy.linkInvalidUrl
    );

  useEffect(() => {
    if (submitError && lastShownSubmitErrorRef.current !== submitError) {
      lastShownSubmitErrorRef.current = submitError;
      showError(submitError, BUNDLE_TOAST_DURATION_MS);
    }
  }, [showError, submitError]);

  const handleBack = () => navigate('/dashboard/bundles');

  const validateLinkBeforeSubmit = () => {
    if (
      values.insertLink &&
      (!values.link.trim() || !validateUrl(values.link))
    ) {
      showError(
        linkError || contentCopy.linkInvalidUrl,
        BUNDLE_TOAST_DURATION_MS
      );
      return false;
    }

    return true;
  };

  const getCreatedBundleId = (bundle: CreateBundleResponse): number | null => {
    const bundleId = bundle.bundle_id ?? bundle.id;
    return typeof bundleId === 'number' && bundleId > 0 ? bundleId : null;
  };

  const buildCampaignDraft = (bundleId: number) =>
    createCampaignCreationDraft({
      segment: {
        campaignTitle: '',
        level1: '',
        level2s: [],
        level3s: [],
        platform: 'sms',
        bundleId,
        jobCategory:
          isAgency && values.jobCategory.trim()
            ? values.jobCategory.trim()
            : '',
        job: isAgency && values.job.trim() ? values.job.trim() : '',
      },
      content: {
        insertLink: values.insertLink,
        link: values.insertLink ? values.link.trim() : '',
        shortLinkDomain:
          values.insertLink && values.shortLinkDomain?.trim()
            ? values.shortLinkDomain.trim()
            : null,
        text: '',
      },
    });

  const handleSaveAndCreateCampaign = async () => {
    lastShownSubmitErrorRef.current = null;
    if (!validateLinkBeforeSubmit()) {
      return;
    }

    const createdBundle = await submit();
    if (!createdBundle) {
      return;
    }

    const bundleId = getCreatedBundleId(createdBundle);
    if (!bundleId) {
      showError(copy.messages.missingBundleId, BUNDLE_TOAST_DURATION_MS);
      return;
    }

    resetBundlesCache();
    prepareCampaignCreationDraft(buildCampaignDraft(bundleId));
    window.location.href = ROUTES.CAMPAIGN_CREATION.path;
  };

  const handleSave = async () => {
    lastShownSubmitErrorRef.current = null;
    if (!validateLinkBeforeSubmit()) {
      return;
    }
    const createdBundle = await submit();
    if (!createdBundle) {
      return;
    }
    resetBundlesCache();
    showSuccess(copy.messages.createSuccess, BUNDLE_TOAST_DURATION_MS);
    navigate('/dashboard/bundles');
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8'>
        <BundleFormHeader copy={copy} onBack={handleBack} />

        <BundleInfoSection
          copy={copy}
          values={values}
          errors={errors}
          linkError={linkError}
          onTitleChange={value => setFieldValue('title', value)}
          onObjectiveChange={value => setFieldValue('objective', value)}
          onPersonaChange={value =>
            setFieldValue('targetAudiencePersona', value)
          }
          onDescriptionChange={value => setFieldValue('description', value)}
          onInsertLinkChange={value => {
            setFieldValue('insertLink', value);
            if (!value) {
              setFieldValue('link', '');
              setFieldValue('shortLinkDomain', null);
            }
            clearError();
          }}
          onLinkChange={value =>
            handleLinkChange(value, nextValue =>
              setFieldValue('link', nextValue)
            )
          }
          onShortLinkDomainChange={value =>
            setFieldValue('shortLinkDomain', value)
          }
        />

        {isAgency && (
          <BundleTestCustomerSection
            copy={copy}
            values={values}
            onCustomerNameChange={value => setFieldValue('customerName', value)}
            onJobCategoryChange={value => {
              setFieldValue('jobCategory', value);
              setFieldValue('job', '');
            }}
            onJobChange={value => setFieldValue('job', value)}
          />
        )}

        <BundleFormActions
          copy={copy}
          mode='create'
          submitting={submitting}
          onCancel={handleBack}
          onPrimaryAction={handleSave}
          onSecondaryAction={handleSaveAndCreateCampaign}
        />
      </div>
    </div>
  );
};

export default CreateBundlePage;
