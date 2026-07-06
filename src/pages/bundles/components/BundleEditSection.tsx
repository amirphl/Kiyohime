import React, { useCallback, useEffect, useRef } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useToast } from '../../../hooks/useToast';
import { BundleListItem } from '../../../types/bundle';
import { contentI18n } from '../../../components/campaign/content/contentTranslations';
import { useUrlValidation } from '../../../components/campaign/content/useUrlValidation';
import { resetBundlesCache } from '../../../components/campaign/content/useBundles';
import { BUNDLE_TOAST_DURATION_MS } from '../utils';
import { BundlesCopy } from '../translations';
import { useLanguage } from '../../../hooks/useLanguage';
import { useUpdateBundleForm } from '../hooks/useUpdateBundleForm';
import BundleFormActions from './BundleFormActions';
import BundleInfoSection from './BundleInfoSection';
import BundleTestCustomerSection from './BundleTestCustomerSection';

interface BundleEditSectionProps {
  bundle: BundleListItem;
  copy: BundlesCopy;
  onCancel: () => void;
  onUpdated: () => void;
}

const BundleEditSection: React.FC<BundleEditSectionProps> = ({
  bundle,
  copy,
  onCancel,
  onUpdated,
}) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { showError, showWarning } = useToast();
  const isAgency = user?.account_type === 'marketing_agency';
  const lastShownSubmitErrorRef = useRef<string | null>(null);
  const contentCopy =
    contentI18n[language as keyof typeof contentI18n] || contentI18n.en;
  const { values, errors, submitError, submitting, setFieldValue, submit } =
    useUpdateBundleForm({
      bundleId: bundle.id,
      bundle,
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

  const validateLinkBeforeSubmit = useCallback(() => {
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
  }, [contentCopy.linkInvalidUrl, linkError, showError, validateUrl, values]);

  const handleUpdate = async () => {
    lastShownSubmitErrorRef.current = null;
    if (!validateLinkBeforeSubmit()) {
      return;
    }

    const updated = await submit();
    if (!updated) {
      return;
    }

    resetBundlesCache();
    showWarning(copy.messages.updateSuccessWarning, BUNDLE_TOAST_DURATION_MS);
    onUpdated();
  };

  return (
    <>
      <BundleInfoSection
        copy={copy}
        values={values}
        errors={errors}
        linkError={linkError}
        onTitleChange={value => setFieldValue('title', value)}
        onObjectiveChange={value => setFieldValue('objective', value)}
        onPersonaChange={value => setFieldValue('targetAudiencePersona', value)}
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
          handleLinkChange(value, nextValue => setFieldValue('link', nextValue))
        }
        onShortLinkDomainChange={value =>
          setFieldValue('shortLinkDomain', value)
        }
      />

      {isAgency ? (
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
      ) : null}

      <BundleFormActions
        copy={copy}
        mode='update'
        submitting={submitting}
        onCancel={onCancel}
        onPrimaryAction={handleUpdate}
      />
    </>
  );
};

export default BundleEditSection;
