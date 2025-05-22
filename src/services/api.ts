import { config, getApiUrl } from '../config/environment';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  error: string;
  message: string;
  details?: Record<string, string>;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.apiUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = getApiUrl(endpoint);
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Auth endpoints
  async login(identifier: string, password: string): Promise<ApiResponse> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        identifier,
        password,
      }),
    });
  }

  async signup(signupData: any): Promise<ApiResponse> {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(signupData),
    });
  }

  async verifyOtp(customerId: number, otpCode: string, otpType: string = 'mobile'): Promise<ApiResponse> {
    return this.request('/auth/verify', {
      method: 'POST',
      body: JSON.stringify({
        customer_id: customerId,
        otp_code: otpCode,
        otp_type: otpType,
      }),
    });
  }

  async resendOtp(customerId: number): Promise<ApiResponse> {
    return this.request(`/auth/resend-otp/${customerId}`, {
      method: 'POST',
    });
  }

  async forgotPassword(identifier: string): Promise<ApiResponse> {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({
        identifier,
      }),
    });
  }

  async resetPassword(customerId: number, newPassword: string, confirmPassword: string, otpCode: string): Promise<ApiResponse> {
    return this.request('/auth/reset', {
      method: 'POST',
      body: JSON.stringify({
        customer_id: customerId,
        new_password: newPassword,
        confirm_password: confirmPassword,
        otp_code: otpCode,
      }),
    });
  }

  // Campaign endpoints
  async getCampaigns(): Promise<ApiResponse> {
    return this.request(config.endpoints.campaigns.list, {
      method: 'GET',
    });
  }

  async createCampaign(campaignData: any): Promise<ApiResponse> {
    return this.request(config.endpoints.campaigns.create, {
      method: 'POST',
      body: JSON.stringify(campaignData),
    });
  }

  async updateCampaign(id: string, campaignData: any): Promise<ApiResponse> {
    const endpoint = config.endpoints.campaigns.update.replace(':id', id);
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(campaignData),
    });
  }

  async deleteCampaign(id: string): Promise<ApiResponse> {
    const endpoint = config.endpoints.campaigns.delete.replace(':id', id);
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // Analytics endpoints
  async getDashboardData(): Promise<ApiResponse> {
    return this.request(config.endpoints.analytics.dashboard, {
      method: 'GET',
    });
  }

  async getReports(): Promise<ApiResponse> {
    return this.request(config.endpoints.analytics.reports, {
      method: 'GET',
    });
  }

  // SMS methods (handled by backend)
  async sendSms(phoneNumber: string, message: string): Promise<ApiResponse> {
    return this.request('/sms/send', {
      method: 'POST',
      body: JSON.stringify({
        phone_number: phoneNumber,
        message,
      }),
    });
  }

  // Utility methods
  getConfig() {
    return config;
  }

  isProduction() {
    return config.domain !== 'yamata-no-orochi.com';
  }

  isDevelopment() {
    return config.domain === 'yamata-no-orochi.com';
  }

  isStaging() {
    return false; // No staging environment in current setup
  }
}

export const apiService = new ApiService();
export default apiService; 