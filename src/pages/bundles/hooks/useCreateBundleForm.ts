import { useCallback, useMemo, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useLanguage } from '../../../hooks/useLanguage';
import apiService from '../../../services/api';
import { getApiErrorMessage } from '../../../utils/errorHandler';
import {
  BundleCreateFormErrors,
  CreateBundleResponse,
  BundleCreateFormValues,
  CreateBundleRequest,
} from '../../../types/bundle';
import bundlesApi from '../api';
import { BundlesCopy } from '../translations';

const INITIAL_VALUES: BundleCreateFormValues = {
  title: '',
  objective: '',
  targetAudiencePersona: '',
  description: '',
  insertLink: false,
  link: '',
  shortLinkDomain: null,
  customerName: '',
  jobCategory: '',
  job: '',
};

interface UseCreateBundleFormOptions {
  copy: BundlesCopy;
}

export const useCreateBundleForm = ({ copy }: UseCreateBundleFormOptions) => {
  const { accessToken } = useAuth();
  const { language } = useLanguage();
  const [values, setValues] = useState<BundleCreateFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<BundleCreateFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const setFieldValue = useCallback(
    <K extends keyof BundleCreateFormValues>(
      key: K,
      value: BundleCreateFormValues[K]
    ) => {
      setValues(prev => ({ ...prev, [key]: value }));
      setErrors(prev => ({ ...prev, [key]: undefined }));
      setSubmitError(null);
    },
    []
  );

  const validate = useCallback((): boolean => {
    const nextErrors: BundleCreateFormErrors = {};

    if (!values.title.trim()) {
      nextErrors.title = copy.createPage.validation.titleRequired;
    }
    if (!values.objective.trim()) {
      nextErrors.objective = copy.createPage.validation.objectiveRequired;
    }
    if (!values.targetAudiencePersona.trim()) {
      nextErrors.targetAudiencePersona =
        copy.createPage.validation.personaRequired;
    }
    if (values.insertLink && !values.link.trim()) {
      nextErrors.link = copy.createPage.validation.linkRequired;
    }
    if (values.description.trim().length > 2000) {
      nextErrors.description = copy.createPage.validation.descriptionTooLong;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [copy.createPage.validation, values]);

  const payload = useMemo<CreateBundleRequest>(
    () => ({
      title: values.title.trim(),
      objective: values.objective.trim(),
      target_audience_persona: values.targetAudiencePersona.trim(),
      adlink:
        values.insertLink && values.link.trim()
          ? values.link.trim()
          : undefined,
      short_link_domain:
        values.shortLinkDomain && values.shortLinkDomain.trim()
          ? values.shortLinkDomain.trim()
          : undefined,
      description: values.description.trim() || undefined,
      target_customer_name: values.customerName.trim() || undefined,
      job_category: values.jobCategory.trim() || undefined,
      job: values.job.trim() || undefined,
    }),
    [values]
  );

  const submit = useCallback(async (): Promise<CreateBundleResponse | null> => {
    if (submitting) return null;
    if (!accessToken) {
      setSubmitError(copy.messages.authRequired);
      return null;
    }
    if (!validate()) return null;

    setSubmitting(true);
    setSubmitError(null);

    try {
      apiService.setAccessToken(accessToken);
      const response = await bundlesApi.create(payload);
      if (!response.success) {
        setSubmitError(
          getApiErrorMessage(response, language, copy.messages.createLoadFailed)
        );
        return null;
      }

      return response.data ?? null;
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : copy.messages.createLoadFailed
      );
      return null;
    } finally {
      setSubmitting(false);
    }
  }, [
    accessToken,
    copy.messages.authRequired,
    copy.messages.createLoadFailed,
    language,
    payload,
    submitting,
    validate,
  ]);

  return {
    values,
    errors,
    submitError,
    submitting,
    setFieldValue,
    submit,
  };
};
