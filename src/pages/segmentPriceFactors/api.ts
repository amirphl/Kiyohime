import { ApiResponse } from '../../services/api';
import adminApi from '../../services/adminApi';
import {
  AdminCreateSegmentPriceFactorRequest,
  AdminCreateSegmentPriceFactorResponse,
  AdminGetPagePricesResponse,
  AdminListLevel3OptionsResponse,
  AdminListPlatformBasePricesResponse,
  AdminListSegmentPriceFactorsResponse,
  AdminUpdatePagePriceRequest,
  AdminUpdatePagePriceResponse,
  AdminUpdatePlatformBasePriceRequest,
  AdminUpdatePlatformBasePriceResponse,
} from '../../types/admin';

export const adminSegmentPriceFactorsApi = {
  listLevel3Options: (platform?: string) =>
    adminApi.listLevel3Options(platform) as Promise<
      ApiResponse<AdminListLevel3OptionsResponse>
    >,
  listSegmentPriceFactors: (platform?: string) =>
    adminApi.listSegmentPriceFactors(platform) as Promise<
      ApiResponse<AdminListSegmentPriceFactorsResponse>
    >,
  createSegmentPriceFactor: (payload: AdminCreateSegmentPriceFactorRequest) =>
    adminApi.createSegmentPriceFactor(payload) as Promise<
      ApiResponse<AdminCreateSegmentPriceFactorResponse>
    >,
  listBasePrices: () =>
    adminApi.listPlatformBasePricesByAdmin() as Promise<
      ApiResponse<AdminListPlatformBasePricesResponse>
    >,
  updateBasePrice: (payload: AdminUpdatePlatformBasePriceRequest) =>
    adminApi.updatePlatformBasePriceByAdmin(payload) as Promise<
      ApiResponse<AdminUpdatePlatformBasePriceResponse>
    >,
  listPagePrices: () =>
    adminApi.getCampaignPagePricesByAdmin() as Promise<
      ApiResponse<AdminGetPagePricesResponse>
    >,
  updatePagePrice: (payload: AdminUpdatePagePriceRequest) =>
    adminApi.updateCampaignPagePriceByAdmin(payload) as Promise<
      ApiResponse<AdminUpdatePagePriceResponse>
    >,
};
