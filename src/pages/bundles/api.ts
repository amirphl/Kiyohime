import apiService, { ApiResponse } from '../../services/api';
import {
  CreateBundleRequest,
  CreateBundleResponse,
  GetBundlePayload,
  ListBundlesParams,
  ListBundlesResponse,
  UpdateBundleRequest,
  UpdateBundleResponse,
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
  update: (id: number, payload: UpdateBundleRequest) =>
    apiService.updateBundle(id, payload) as Promise<
      ApiResponse<UpdateBundleResponse>
    >,
};

export default bundlesApi;
