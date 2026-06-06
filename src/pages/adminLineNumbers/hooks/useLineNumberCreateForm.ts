import { useCallback, useEffect, useRef, useState } from 'react';
import { adminLineNumbersApi } from '../api';
import { AdminLineNumberFormValues } from '../types';
import { AdminLineNumbersCopy } from '../translations';
import {
  buildCreatePayload,
  createInitialLineNumberForm,
  mapCreateError,
  validateCreatePayload,
} from '../utils';

interface UseLineNumberCreateFormOptions {
  copy: AdminLineNumbersCopy;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
  onCreated: () => Promise<void> | void;
}

export const useLineNumberCreateForm = ({
  copy,
  onError,
  onSuccess,
  onCreated,
}: UseLineNumberCreateFormOptions) => {
  const isMountedRef = useRef(true);

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [values, setValues] = useState<AdminLineNumberFormValues>(
    createInitialLineNumberForm()
  );

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const resetForm = useCallback(() => {
    setValues(createInitialLineNumberForm());
    setFormError(null);
    setConfirmModalOpen(false);
    setSubmitting(false);
  }, []);

  const openCreateModal = useCallback(() => {
    setCreateModalOpen(true);
  }, []);

  const closeCreateModal = useCallback(() => {
    if (isSubmitting) {
      return;
    }

    setCreateModalOpen(false);
    resetForm();
  }, [isSubmitting, resetForm]);

  const closeConfirmModal = useCallback(() => {
    if (isSubmitting) {
      return;
    }

    setConfirmModalOpen(false);
  }, [isSubmitting]);

  const updateValue = useCallback(
    <TKey extends keyof AdminLineNumberFormValues>(
      key: TKey,
      value: AdminLineNumberFormValues[TKey]
    ) => {
      setValues(currentValues => ({
        ...currentValues,
        [key]: value,
      }));
      setFormError(null);
    },
    []
  );

  const submitForConfirmation = useCallback(() => {
    const validationMessage = validateCreatePayload(values, copy);
    if (validationMessage) {
      setFormError(validationMessage);
      onError(validationMessage);
      return;
    }

    setFormError(null);
    setConfirmModalOpen(true);
  }, [copy, onError, values]);

  const confirmCreate = useCallback(async () => {
    const validationMessage = validateCreatePayload(values, copy);
    if (validationMessage) {
      setFormError(validationMessage);
      onError(validationMessage);
      return;
    }

    setSubmitting(true);

    try {
      const response = await adminLineNumbersApi.create(
        buildCreatePayload(values)
      );
      if (!isMountedRef.current) {
        return;
      }

      if (!response.success) {
        const message = mapCreateError(
          response.error?.code,
          response.message || copy.errors.createFailed,
          copy
        );
        setFormError(message);
        setConfirmModalOpen(false);
        onError(message);
        return;
      }

      try {
        await Promise.resolve(onCreated());
      } catch {
        if (!isMountedRef.current) {
          return;
        }

        const message = copy.errors.loadListFailed;
        setFormError(message);
        setConfirmModalOpen(false);
        onError(message);
        return;
      }

      if (!isMountedRef.current) {
        return;
      }

      setConfirmModalOpen(false);
      setCreateModalOpen(false);
      resetForm();
      onSuccess(copy.success.created);
    } catch {
      if (!isMountedRef.current) {
        return;
      }

      const message = copy.errors.createFailed;
      setFormError(message);
      setConfirmModalOpen(false);
      onError(message);
    } finally {
      if (isMountedRef.current) {
        setSubmitting(false);
      }
    }
  }, [copy, onCreated, onError, onSuccess, resetForm, values]);

  return {
    values,
    formError,
    isCreateModalOpen,
    isConfirmModalOpen,
    isSubmitting,
    openCreateModal,
    closeCreateModal,
    closeConfirmModal,
    updateValue,
    submitForConfirmation,
    confirmCreate,
  };
};
