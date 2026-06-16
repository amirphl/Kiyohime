/**
 * Utility for navigating to the reports page with filter presets
 */

interface ReportsFilterParams {
  phase?: 'test' | 'execution';
  bundleId?: number;
}

/**
 * Generates a URL path to the reports page with filter parameters
 * @param params - Filter parameters (phase and/or bundleId)
 * @returns The complete URL path with query parameters
 */
export const getReportsPathWithFilters = (
  params: ReportsFilterParams
): string => {
  const queryParams = new URLSearchParams();

  if (params.phase) {
    queryParams.set('phase', params.phase);
  }

  if (params.bundleId) {
    queryParams.set('bundleId', String(params.bundleId));
  }

  const basePath = '/dashboard/reports';
  const queryString = queryParams.toString();

  return queryString ? `${basePath}?${queryString}` : basePath;
};
