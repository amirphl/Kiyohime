import { useCallback, useMemo, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useLanguage } from '../../../hooks/useLanguage';
import apiService, { ApiResponse } from '../../../services/api';
import {
  BundleCreateFormErrors,
  BundleCreateFormValues,
} from '../../../types/bundle';
import {
  getApiErrorMessage,
  getErrorMessage,
} from '../../../utils/errorHandler';
import { BundlesCopy } from '../translations';
import { INITIAL_BUNDLE_FORM_VALUES } from '../utils';

interface UseBundleFormOptions<TPayload, TResponse> {
  copy: BundlesCopy;
  initialValues?: BundleCreateFormValues;
  fallbackErrorMessage: string;
  buildPayload: (values: BundleCreateFormValues) => TPayload;
  submitRequest: (payload: TPayload) => Promise<ApiResponse<TResponse>>;
}

export const useBundleForm = <TPayload, TResponse>({
  copy,
  initialValues = INITIAL_BUNDLE_FORM_VALUES,
  fallbackErrorMessage,
  buildPayload,
  submitRequest,
}: UseBundleFormOptions<TPayload, TResponse>) => {
  const { accessToken } = useAuth();
  const { language } = useLanguage();
  const [values, setValues] = useState<BundleCreateFormValues>(initialValues);
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

  const payload = useMemo(() => buildPayload(values), [buildPayload, values]);

  const submit = useCallback(async (): Promise<TResponse | null> => {
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
      const response = await submitRequest(payload);
      if (!response.success) {
        setSubmitError(
          getApiErrorMessage(response, language, fallbackErrorMessage)
        );
        return null;
      }

      return response.data ?? null;
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? getErrorMessage(error.message, language, fallbackErrorMessage)
          : fallbackErrorMessage
      );
      return null;
    } finally {
      setSubmitting(false);
    }
  }, [
    accessToken,
    copy.messages.authRequired,
    fallbackErrorMessage,
    language,
    payload,
    submitRequest,
    submitting,
    validate,
  ]);

  return {
    values,
    errors,
    submitError,
    submitting,
    setFieldValue,
    setValues,
    submit,
  };
};
