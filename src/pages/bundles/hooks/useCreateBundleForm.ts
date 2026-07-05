import { useCallback } from 'react';
import bundlesApi from '../api';
import { BundlesCopy } from '../translations';
import { buildBundleCreatePayload, INITIAL_BUNDLE_FORM_VALUES } from '../utils';
import { useBundleForm } from './useBundleForm';
import { CreateBundleRequest } from '../../../types/bundle';

interface UseCreateBundleFormOptions {
  copy: BundlesCopy;
}

export const useCreateBundleForm = ({ copy }: UseCreateBundleFormOptions) => {
  const submitRequest = useCallback(
    (payload: CreateBundleRequest) => bundlesApi.create(payload),
    []
  );

  return useBundleForm({
    copy,
    initialValues: INITIAL_BUNDLE_FORM_VALUES,
    fallbackErrorMessage: copy.messages.createLoadFailed,
    buildPayload: buildBundleCreatePayload,
    submitRequest,
  });
};
