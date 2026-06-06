import { ApiResponse } from '../../services/api';
import adminApi from '../../services/adminApi';
import {
  AdminCreateLineNumberRequest,
  AdminLineNumberDTO,
  AdminLineNumberReportItem,
} from '../../types/admin';
import { AdminLineNumberReorderItem } from './types';

const createUnauthorizedResponse = <T>(): ApiResponse<T> => ({
  success: false,
  message: 'Unauthorized',
  error: {
    code: 'MISSING_ACCESS_TOKEN',
    details: null,
  },
});

const createUnexpectedErrorResponse = <T>(): ApiResponse<T> => ({
  success: false,
  message: 'An error occurred',
  error: {
    code: 'NETWORK_ERROR',
    details: null,
  },
});

const withAdminAccessToken = async <T>(
  request: () => Promise<ApiResponse<T>>
): Promise<ApiResponse<T>> => {
  if (!adminApi.getAccessToken()) {
    return createUnauthorizedResponse<T>();
  }

  try {
    return await request();
  } catch {
    return createUnexpectedErrorResponse<T>();
  }
};

export const adminLineNumbersApi = {
  list: () =>
    withAdminAccessToken<AdminLineNumberDTO[]>(() =>
      adminApi.listLineNumbers()
    ),
  create: (payload: AdminCreateLineNumberRequest) =>
    withAdminAccessToken<AdminLineNumberDTO>(() =>
      adminApi.createLineNumber(payload)
    ),
  reorder: (items: AdminLineNumberReorderItem[]) =>
    withAdminAccessToken<{ updated: boolean }>(() =>
      adminApi.updateLineNumbersBatch({ items })
    ),
  report: () =>
    withAdminAccessToken<AdminLineNumberReportItem[]>(() =>
      adminApi.getLineNumbersReport()
    ),
};
