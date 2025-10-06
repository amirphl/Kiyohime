import { ApiResponse } from './api';
import { getApiUrl } from '../config/environment';
import { AdminCaptchaInitResponse, AdminCaptchaVerifyRequest, AdminLoginResponse, AdminCreateLineNumberRequest, AdminLineNumberDTO, AdminUpdateLineNumbersRequest, AdminLineNumberReportItem, AdminListCampaignsFilter, AdminListCampaignsResponse, AdminApproveCampaignResponse, AdminRejectCampaignResponse } from '../types/admin';

// Separate storage keys to avoid clash with normal user tokens
const ADMIN_ACCESS_TOKEN_KEY = 'admin_access_token';
const ADMIN_REFRESH_TOKEN_KEY = 'admin_refresh_token';

class AdminApiService {
  private accessToken: string | null = null;

  constructor() {
    this.accessToken = localStorage.getItem(ADMIN_ACCESS_TOKEN_KEY);
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
    if (token) localStorage.setItem(ADMIN_ACCESS_TOKEN_KEY, token);
    else localStorage.removeItem(ADMIN_ACCESS_TOKEN_KEY);
  }

  setRefreshToken(token: string | null) {
    if (token) localStorage.setItem(ADMIN_REFRESH_TOKEN_KEY, token);
    else localStorage.removeItem(ADMIN_REFRESH_TOKEN_KEY);
  }

  getAccessToken(): string | null {
    return this.accessToken || localStorage.getItem(ADMIN_ACCESS_TOKEN_KEY);
  }

  private handleUnauthorized() {
    // Clear tokens and broadcast a global event so UI can react (e.g., show blocking modal + redirect)
    this.setAccessToken(null);
    this.setRefreshToken(null);
    try {
      window.dispatchEvent(new CustomEvent('admin-session-expired'));
    } catch {
      // no-op if window not available
    }
  }

  async initCaptcha(): Promise<ApiResponse<AdminCaptchaInitResponse>> {
    const url = getApiUrl('/admin/auth/captcha/init');
    try {
      const resp = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(15000),
      });
      if (resp.status === 401) {
        this.handleUnauthorized();
        return { success: false, message: 'Unauthorized', error: { code: 'UNAUTHORIZED', details: null } } as any;
      }
      const data = await resp.json();
      if (!resp.ok) {
        return { success: false, message: data?.message || 'Captcha init failed', error: data?.error };
      }
      return { success: true, message: data?.message || 'OK', data: data?.data };
    } catch (e) {
      return { success: false, message: 'An error occurred', error: { code: 'NETWORK_ERROR', details: null } };
    }
  }

  async verifyLogin(payload: AdminCaptchaVerifyRequest): Promise<ApiResponse<AdminLoginResponse>> {
    const url = getApiUrl('/admin/auth/login');
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(20000),
      });
      const data = await resp.json();
      if (!resp.ok) {
        return { success: false, message: data?.message || 'Login failed', error: data?.error };
      }
      const d = data?.data || {};
      const sessionFromResponse = d?.session;
      const accessToken = sessionFromResponse?.access_token ?? d?.access_token;
      const refreshToken = sessionFromResponse?.refresh_token ?? d?.refresh_token;
      if (accessToken) this.setAccessToken(accessToken);
      if (refreshToken) this.setRefreshToken(refreshToken);
      const responseData: AdminLoginResponse = sessionFromResponse
        ? (d as AdminLoginResponse)
        : {
            admin: d?.admin,
            session: {
              access_token: accessToken || '',
              refresh_token: refreshToken || '',
              expires_in: d?.expires_in ?? 0,
              token_type: d?.token_type ?? 'Bearer',
              created_at: new Date().toISOString(),
            },
          };
      return { success: true, message: data?.message || 'OK', data: responseData };
    } catch (e) {
      return { success: false, message: 'An error occurred', error: { code: 'NETWORK_ERROR', details: null } };
    }
  }

  async listLineNumbers(): Promise<ApiResponse<AdminLineNumberDTO[]>> {
    const url = getApiUrl('/admin/line-numbers');
    try {
      const resp = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          ...(this.getAccessToken() ? { Authorization: `Bearer ${this.getAccessToken()}` } : {}),
        },
        signal: AbortSignal.timeout(20000),
      });
      if (resp.status === 401) {
        this.handleUnauthorized();
        return { success: false, message: 'Unauthorized', error: { code: 'UNAUTHORIZED', details: null } } as any;
      }
      if (resp.status === 204) {
        return { success: true, message: 'OK', data: [] };
      }
      let data: any = null;
      try {
        data = await resp.json();
      } catch (e) {
        if (resp.ok) {
          return { success: true, message: 'OK', data: [] };
        }
        return { success: false, message: 'An error occurred', error: { code: 'NETWORK_ERROR', details: null } };
      }
      if (!resp.ok) {
        return { success: false, message: data?.message || 'List line numbers failed', error: data?.error };
      }
      return { success: true, message: data?.message || 'OK', data: (data?.data || []) as AdminLineNumberDTO[] };
    } catch (e) {
      return { success: false, message: 'An error occurred', error: { code: 'NETWORK_ERROR', details: null } };
    }
  }

  async createLineNumber(payload: AdminCreateLineNumberRequest): Promise<ApiResponse<AdminLineNumberDTO>> {
    const url = getApiUrl('/admin/line-numbers/');
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(this.getAccessToken() ? { Authorization: `Bearer ${this.getAccessToken()}` } : {}),
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(20000),
      });
      if (resp.status === 401) {
        this.handleUnauthorized();
        return { success: false, message: 'Unauthorized', error: { code: 'UNAUTHORIZED', details: null } } as any;
      }
      const data = await resp.json();
      if (!resp.ok) {
        return { success: false, message: data?.message || 'Create line number failed', error: data?.error };
      }
      return { success: true, message: data?.message || 'OK', data: data?.data as AdminLineNumberDTO };
    } catch (e) {
      return { success: false, message: 'An error occurred', error: { code: 'NETWORK_ERROR', details: null } };
    }
  }

  async updateLineNumbersBatch(payload: AdminUpdateLineNumbersRequest): Promise<ApiResponse<{ updated: boolean }>> {
    const url = getApiUrl('/admin/line-numbers/');
    try {
      const resp = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(this.getAccessToken() ? { Authorization: `Bearer ${this.getAccessToken()}` } : {}),
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(20000),
      });
      if (resp.status === 401) {
        this.handleUnauthorized();
        return { success: false, message: 'Unauthorized', error: { code: 'UNAUTHORIZED', details: null } } as any;
      }
      const data = await resp.json();
      if (!resp.ok) {
        return { success: false, message: data?.message || 'Batch update failed', error: data?.error };
      }
      return { success: true, message: data?.message || 'OK', data: data?.data as { updated: boolean } };
    } catch (e) {
      return { success: false, message: 'An error occurred', error: { code: 'NETWORK_ERROR', details: null } };
    }
  }

  async getLineNumbersReport(): Promise<ApiResponse<AdminLineNumberReportItem[]>> {
    const url = getApiUrl('/admin/line-numbers/report');
    try {
      const resp = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          ...(this.getAccessToken() ? { Authorization: `Bearer ${this.getAccessToken()}` } : {}),
        },
        signal: AbortSignal.timeout(20000),
      });
      if (resp.status === 401) {
        this.handleUnauthorized();
        return { success: false, message: 'Unauthorized', error: { code: 'UNAUTHORIZED', details: null } } as any;
      }
      if (resp.status === 204) {
        return { success: true, message: 'OK', data: [] };
      }
      let data: any = null;
      try {
        data = await resp.json();
      } catch (e) {
        if (resp.ok) {
          return { success: true, message: 'OK', data: [] };
        }
        return { success: false, message: 'An error occurred', error: { code: 'NETWORK_ERROR', details: null } };
      }
      if (!resp.ok) {
        return { success: false, message: data?.message || 'Report fetch failed', error: data?.error };
      }
      return { success: true, message: data?.message || 'OK', data: (data?.data || []) as AdminLineNumberReportItem[] };
    } catch (e) {
      return { success: false, message: 'An error occurred', error: { code: 'NETWORK_ERROR', details: null } };
    }
  }

  async listCampaigns(filter: AdminListCampaignsFilter = {}): Promise<ApiResponse<AdminListCampaignsResponse>> {
    const qs = new URLSearchParams();
    if (filter.title) qs.set('title', filter.title);
    if (filter.status) qs.set('status', filter.status);
    if (filter.start_date) qs.set('start_date', filter.start_date);
    if (filter.end_date) qs.set('end_date', filter.end_date);
    const url = getApiUrl(`/admin/campaigns${qs.toString() ? `?${qs.toString()}` : ''}`);
    try {
      const resp = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          ...(this.getAccessToken() ? { Authorization: `Bearer ${this.getAccessToken()}` } : {}),
        },
        signal: AbortSignal.timeout(20000),
      });
      if (resp.status === 401) {
        this.handleUnauthorized();
        return { success: false, message: 'Unauthorized', error: { code: 'UNAUTHORIZED', details: null } } as any;
      }
      const data = await resp.json();
      if (!resp.ok) {
        return { success: false, message: data?.message || 'List campaigns failed', error: data?.error };
      }
      return { success: true, message: data?.message || 'OK', data: (data?.data || { items: [] }) as AdminListCampaignsResponse };
    } catch (e) {
      return { success: false, message: 'An error occurred', error: { code: 'NETWORK_ERROR', details: null } };
    }
  }

  async approveCampaign(campaignId: number, comment?: string | null): Promise<ApiResponse<AdminApproveCampaignResponse>> {
    const url = getApiUrl('/admin/campaigns/approve');
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(this.getAccessToken() ? { Authorization: `Bearer ${this.getAccessToken()}` } : {}),
        },
        body: JSON.stringify({ campaign_id: campaignId, comment: comment ?? undefined }),
        signal: AbortSignal.timeout(20000),
      });
      if (resp.status === 401) {
        this.handleUnauthorized();
        return { success: false, message: 'Unauthorized', error: { code: 'UNAUTHORIZED', details: null } } as any;
      }
      const data = await resp.json();
      if (!resp.ok) {
        return { success: false, message: data?.message || 'Approve failed', error: data?.error };
      }
      return { success: true, message: data?.message || 'OK', data: data?.data as AdminApproveCampaignResponse };
    } catch (e) {
      return { success: false, message: 'An error occurred', error: { code: 'NETWORK_ERROR', details: null } };
    }
  }

  async rejectCampaign(campaignId: number, comment: string): Promise<ApiResponse<AdminRejectCampaignResponse>> {
    const url = getApiUrl('/admin/campaigns/reject');
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(this.getAccessToken() ? { Authorization: `Bearer ${this.getAccessToken()}` } : {}),
        },
        body: JSON.stringify({ campaign_id: campaignId, comment }),
        signal: AbortSignal.timeout(20000),
      });
      if (resp.status === 401) {
        this.handleUnauthorized();
        return { success: false, message: 'Unauthorized', error: { code: 'UNAUTHORIZED', details: null } } as any;
      }
      const data = await resp.json();
      if (!resp.ok) {
        return { success: false, message: data?.message || 'Reject failed', error: data?.error };
      }
      return { success: true, message: data?.message || 'OK', data: data?.data as AdminRejectCampaignResponse };
    } catch (e) {
      return { success: false, message: 'An error occurred', error: { code: 'NETWORK_ERROR', details: null } };
    }
  }

  async getCustomersShares(params: { start_date?: string; end_date?: string } = {}): Promise<ApiResponse<import('../types/admin').AdminCustomersSharesResponse>> {
    const qs = new URLSearchParams();
    if (params.start_date) qs.set('start_date', params.start_date);
    if (params.end_date) qs.set('end_date', params.end_date);
    const url = getApiUrl(`/admin/customer-management/shares${qs.toString() ? `?${qs.toString()}` : ''}`);
    try {
      const resp = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          ...(this.getAccessToken() ? { Authorization: `Bearer ${this.getAccessToken()}` } : {}),
        },
        signal: AbortSignal.timeout(20000),
      });
      if (resp.status === 401) {
        this.handleUnauthorized();
        return { success: false, message: 'Unauthorized', error: { code: 'UNAUTHORIZED', details: null } } as any;
      }
      const data = await resp.json();
      if (!resp.ok) {
        return { success: false, message: data?.message || 'Failed to retrieve customers shares', error: data?.error };
      }
      return { success: true, message: data?.message || 'OK', data: (data?.data || {}) as import('../types/admin').AdminCustomersSharesResponse };
    } catch (e) {
      return { success: false, message: 'An error occurred', error: { code: 'NETWORK_ERROR', details: null } };
    }
  }

  async getCustomerWithCampaigns(customerId: number): Promise<ApiResponse<import('../types/admin').AdminCustomerWithCampaignsResponse>> {
    const url = getApiUrl(`/admin/customer-management/${customerId}`);
    try {
      const resp = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          ...(this.getAccessToken() ? { Authorization: `Bearer ${this.getAccessToken()}` } : {}),
        },
        signal: AbortSignal.timeout(20000),
      });
      if (resp.status === 401) {
        this.handleUnauthorized();
        return { success: false, message: 'Unauthorized', error: { code: 'UNAUTHORIZED', details: null } } as any;
      }
      const data = await resp.json();
      if (!resp.ok) {
        return { success: false, message: data?.message || 'Failed to retrieve customer details', error: data?.error };
      }
      return { success: true, message: data?.message || 'OK', data: (data?.data || {}) as import('../types/admin').AdminCustomerWithCampaignsResponse };
    } catch (e) {
      return { success: false, message: 'An error occurred', error: { code: 'NETWORK_ERROR', details: null } };
    }
  }

  async getCampaignById(id: number): Promise<ApiResponse<import('../types/admin').AdminGetCampaignResponse>> {
    const url = getApiUrl(`/admin/campaigns/${id}`);
    try {
      const resp = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          ...(this.getAccessToken() ? { Authorization: `Bearer ${this.getAccessToken()}` } : {}),
        },
        signal: AbortSignal.timeout(20000),
      });
      if (resp.status === 401) {
        this.handleUnauthorized();
        return { success: false, message: 'Unauthorized', error: { code: 'UNAUTHORIZED', details: null } } as any;
      }
      const data = await resp.json();
      if (!resp.ok) {
        return { success: false, message: data?.message || 'Failed to get campaign', error: data?.error };
      }
      return { success: true, message: data?.message || 'OK', data: (data?.data || {}) as import('../types/admin').AdminGetCampaignResponse };
    } catch (e) {
      return { success: false, message: 'An error occurred', error: { code: 'NETWORK_ERROR', details: null } };
    }
  }
}

export const adminApiService = new AdminApiService();
export default adminApiService; 