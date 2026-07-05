import { useCallback, useMemo } from 'react';
import { ApiResponse } from '../../../services/api';
import {
  BundleListItem,
  UpdateBundleRequest,
  UpdateBundleResponse,
} from '../../../types/bundle';
import bundlesApi from '../api';
import { BundlesCopy } from '../translations';
import { buildBundleCreatePayload, mapBundleToFormValues } from '../utils';
import { useBundleForm } from './useBundleForm';

interface UseUpdateBundleFormOptions {
  bundleId: number;
  bundle: BundleListItem;
  copy: BundlesCopy;
}

export const useUpdateBundleForm = ({
  bundleId,
  bundle,
  copy,
}: UseUpdateBundleFormOptions) => {
  const initialValues = useMemo(() => mapBundleToFormValues(bundle), [bundle]);

  const submitRequest = useCallback(
    (payload: UpdateBundleRequest) =>
      bundlesApi.update(bundleId, payload) as Promise<
        ApiResponse<UpdateBundleResponse>
      >,
    [bundleId]
  );

  return useBundleForm({
    copy,
    initialValues,
    fallbackErrorMessage: copy.messages.updateLoadFailed,
    buildPayload: buildBundleCreatePayload,
    submitRequest,
  });
};
