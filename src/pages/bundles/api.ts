import apiService, { ApiResponse } from '../../services/api';
import {
  CreateBundleRequest,
  CreateBundleResponse,
  GetBundlePayload,
  ListBundlesParams,
  ListBundlesResponse,
} from '../../types/bundle';

export const bundlesApi = {
  list: (params: ListBundlesParams, signal?: AbortSignal) =>
    apiService.listBundles(params, signal) as Promise<
      ApiResponse<ListBundlesResponse>
    >,
  get: (id: number, signal?: AbortSignal) =>
    apiService.getBundle(id, signal) as Promise<ApiResponse<GetBundlePayload>>,
  create: (payload: CreateBundleRequest) =>
    apiService.createBundle(payload) as Promise<
      ApiResponse<CreateBundleResponse>
    >,
};

export default bundlesApi;
