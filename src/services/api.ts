import {
  CreateCampaignPayload, CreateSMSCampaignResponse,
  CalculateCampaignCapacityRequest, CalculateCampaignCapacityResponse,
  CalculateCampaignCostResponse, GetWalletBalanceResponse,
  CalculateCampaignCostRequest, UpdateSMSCampaignRequest, UpdateSMSCampaignResponse,
  ListSMSCampaignsParams, ListSMSCampaignsResponse,
} from '../types/campaign';
import { config, getApiUrl } from '../config/environment';

// Updated to match Go backend response structure
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: ErrorDetail;
}

export interface ErrorDetail {
  code: string;
  details?: any;
}

// Global 401 handler type
export type UnauthorizedHandler = () => void;

class ApiService {
  private baseUrl: string;
  private accessToken: string | null = null;
  private unauthorizedHandler: UnauthorizedHandler | null = null;

  constructor() {
    this.baseUrl = config.apiUrl;
  }

  // Method to set the global 401 handler
  setUnauthorizedHandler(handler: UnauthorizedHandler) {
    this.unauthorizedHandler = handler;
    console.log('Unauthorized handler set successfully');
  }

  // Method to check if unauthorized handler is configured
  isUnauthorizedHandlerConfigured(): boolean {
    return !!this.unauthorizedHandler;
  }

  // Test method to verify 401 handling (for debugging)
  testUnauthorizedHandler() {
    console.log('Testing unauthorized handler...');
    if (this.unauthorizedHandler) {
      console.log('Triggering test unauthorized handler...');
      this.unauthorizedHandler();
    } else {
      console.warn('No unauthorized handler available for testing');
    }
  }

  // Method to set access token for authenticated requests
  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = getApiUrl(endpoint);

    // Validate URL to prevent SSRF attacks
    if (!this.isValidUrl(url)) {
      console.log('URL validation failed');
      return {
        success: false,
        message: 'Invalid URL',
        error: {
          code: 'Invalid URL',
          details: null
        },
      };
    }

    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest', // CSRF protection
    };

    if (this.accessToken) {
      defaultHeaders['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(30000), // 30 seconds timeout
    };

    try {
      const response = await fetch(url, config);

      // Validate response content type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response content type');
      }

      const data = await response.json();

      // Check for specific status codes
      if (response.status === 201) {
        return {
          success: true,
          message: data.message || 'Created successfully',
          data: data.data,
        };
      } else if (response.status === 401) {
        // Unauthorized - check if this is an auth endpoint
        const isAuthEndpoint = endpoint.includes('/auth/login') ||
                              endpoint.includes('/auth/signup') ||
                              endpoint.includes('/auth/verify') ||
                              endpoint.includes('/auth/resend-otp') ||
                              endpoint.includes('/auth/forgot-password') ||
                              endpoint.includes('/auth/reset');

        if (isAuthEndpoint) {
          // Extract error message from the response data
          let errorMessage = 'Authentication failed';
          if (data.error && data.error.code) {
            errorMessage = data.error.code;
          } else if (data.message) {
            errorMessage = data.message;
          }

          return {
            success: false,
            message: errorMessage,
            error: {
              code: errorMessage,
              details: data.error?.details
            },
          };
        } else {
          // For non-auth endpoints, trigger logout and redirect
          if (this.unauthorizedHandler) {
            this.unauthorizedHandler();
          } else {
            console.warn('No unauthorized handler set - cannot handle 401 automatically');
          }

          return {
            success: false,
            message: 'Unauthorized - Please log in again',
            error: {
              code: 'Unauthorized - Please log in again',
              details: null
            },
          };
        }
      } else if (!response.ok) {
        // Handle other error responses
        let errorMessage = `HTTP ${response.status}`;

        if (data.error && data.error.code) {
          errorMessage = data.error.code;
        } else if (data.message) {
          errorMessage = data.message;
        }

        return {
          success: false,
          message: errorMessage,
          error: {
            code: errorMessage,
            details: data.error?.details
          },
        };
      } else {
        // Other successful responses
        return {
          success: true,
          message: data.message || 'Success',
          data: data.data,
        };
      }
    } catch (error) {
      // Don't expose internal error details in production
      const isProduction = this.isProduction();
      const errorMessage = isProduction
        ? 'An error occurred'
        : error instanceof Error
          ? error.message
          : 'Unknown error';

      return {
        success: false,
        message: errorMessage,
        error: {
          code: errorMessage,
          details: null
        },
      };
    }
  }

  // Validate URL to prevent SSRF attacks
  private isValidUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      // Only allow HTTPS in production
      if (this.isProduction() && urlObj.protocol !== 'https:') {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  // Format phone number to include +98 prefix
  private formatPhoneNumber(phoneNumber: string): string {
    // Remove any existing +98 prefix and leading zeros
    let cleaned = phoneNumber.replace(/^\+98/, '').replace(/^0+/, '');

    // If it starts with 9 (Iranian mobile numbers), add +98
    if (cleaned.startsWith('9')) {
      return `+98${cleaned}`;
    }

    // If it's already in international format, return as is
    if (cleaned.startsWith('98')) {
      return `+${cleaned}`;
    }

    // Default: add +98 prefix
    return `+98${cleaned}`;
  }

  // Auth endpoints
  async login(identifier: string, password: string): Promise<ApiResponse> {
    // Input validation
    if (
      !identifier ||
      typeof identifier !== 'string' ||
      identifier.length > 255
    ) {
      return {
        success: false,
        message: 'Invalid identifier',
        error: {
          code: 'Invalid identifier',
          details: null
        },
      };
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return {
        success: false,
        message: 'Invalid password',
        error: {
          code: 'Invalid password',
          details: null
        },
      };
    }

    // Check if identifier looks like a phone number (contains only digits and +)
    const phoneRegex = /^[\d+]+$/;
    let formattedIdentifier = identifier.trim();

    if (phoneRegex.test(formattedIdentifier)) {
      // Format phone number to include +98 prefix
      formattedIdentifier = this.formatPhoneNumber(formattedIdentifier);
    }

    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        identifier: formattedIdentifier,
        password,
      }),
    });
  }

  async signup(signupData: any): Promise<ApiResponse> {
    // Input validation
    if (!signupData || typeof signupData !== 'object') {
      return {
        success: false,
        message: 'Invalid signup data',
        error: {
          code: 'Invalid signup data',
          details: null
        },
      };
    }

    // Validate required fields
    const requiredFields = ['email', 'password', 'representative_mobile'];
    for (const field of requiredFields) {
      if (!signupData[field] || typeof signupData[field] !== 'string') {
        return {
          success: false,
          message: `Missing required field: ${field}`,
          error: {
            code: `Missing required field: ${field}`,
            details: null
          },
        };
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupData.email)) {
      return {
        success: false,
        message: 'Invalid email format',
        error: {
          code: 'Invalid email format',
          details: null
        },
      };
    }

    // Validate password strength
    if (signupData.password.length < 8) {
      return {
        success: false,
        message: 'Password must be at least 8 characters long',
        error: {
          code: 'Password must be at least 8 characters long',
          details: null
        },
      };
    }

    // Check for at least 1 uppercase letter and 1 number
    if (!/[A-Z]/.test(signupData.password)) {
      return {
        success: false,
        message: 'Password must contain at least 1 uppercase letter',
        error: {
          code: 'Password must contain at least 1 uppercase letter',
          details: null
        },
      };
    }

    if (!/\d/.test(signupData.password)) {
      return {
        success: false,
        message: 'Password must contain at least 1 number',
        error: {
          code: 'Password must contain at least 1 number',
          details: null
        },
      };
    }

    // Format phone numbers to include +98 prefix
    const formattedData = {
      ...signupData,
      representative_mobile: this.formatPhoneNumber(
        signupData.representative_mobile
      ),
      company_phone: signupData.company_phone
        ? this.formatPhoneNumber(signupData.company_phone)
        : undefined,
    };

    const response = await this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(formattedData),
    });

    return response;
  }

  async verifyOtp(
    customerId: number,
    otpCode: string,
    otpType: string = 'mobile'
  ): Promise<ApiResponse> {
    return this.request('/auth/verify', {
      method: 'POST',
      body: JSON.stringify({
        customer_id: customerId,
        otp_code: otpCode,
        otp_type: otpType,
      }),
    });
  }

  async resendOtp(
    customerId: number,
    otpType: string = 'mobile'
  ): Promise<ApiResponse> {
    return this.request('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({
        customer_id: customerId,
        otp_type: otpType,
      }),
    });
  }

  async forgotPassword(identifier: string): Promise<ApiResponse> {
    // Input validation
    if (
      !identifier ||
      typeof identifier !== 'string' ||
      identifier.length > 255
    ) {
      return {
        success: false,
        message: 'Invalid identifier',
        error: {
          code: 'Invalid identifier',
          details: null
        },
      };
    }

    // Check if identifier looks like a phone number (contains only digits and +)
    const phoneRegex = /^[\d+]+$/;
    if (phoneRegex.test(identifier)) {
      // Format phone number to include +98 prefix
      const formattedIdentifier = this.formatPhoneNumber(identifier);
      return this.request('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({
          identifier: formattedIdentifier,
        }),
      });
    }

    // If it's not a phone number (likely email), send as is
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({
        identifier: identifier.trim(),
      }),
    });
  }

  async resetPassword(
    customerId: number,
    newPassword: string,
    confirmPassword: string,
    otpCode: string
  ): Promise<ApiResponse> {
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
  async listCampaigns(params: ListSMSCampaignsParams): Promise<ApiResponse<ListSMSCampaignsResponse>> {
    const query = new URLSearchParams();
    query.set('page', String(params.page));
    query.set('limit', String(params.limit));
    if (params.orderby) query.set('orderby', params.orderby);
    if (params.title) query.set('title', params.title);
    if (params.status) query.set('status', params.status);
    const endpoint = `${config.endpoints.campaigns.list}?${query.toString()}`;
    return this.request<ListSMSCampaignsResponse>(endpoint, {
      method: 'GET',
    });
  }

  async getCampaigns(): Promise<ApiResponse> {
    return this.request(config.endpoints.campaigns.list, {
      method: 'GET',
    });
  }

  async createCampaign(campaignData: CreateCampaignPayload): Promise<ApiResponse<CreateSMSCampaignResponse>> {
    return this.request<CreateSMSCampaignResponse>(config.endpoints.campaigns.create, {
      method: 'POST',
      body: JSON.stringify(campaignData),
    });
  }

  async calculateCampaignCapacity(capacityData: CalculateCampaignCapacityRequest): Promise<ApiResponse<CalculateCampaignCapacityResponse>> {
    return this.request<CalculateCampaignCapacityResponse>(config.endpoints.campaigns.calculateCapacity, {
      method: 'POST',
      body: JSON.stringify(capacityData),
    });
  }

  // New campaign cost calculation endpoint for message count
  async calculateCampaignCost(costData: {
    title?: string;
    segment?: string;
    subsegment?: string[];
    sex?: string;
    city?: string[];
    adlink?: string;
    content?: string;
    scheduleat?: string;
    line_number?: string;
    budget?: number;
  }): Promise<ApiResponse<CalculateCampaignCostResponse>> {
    return this.request<CalculateCampaignCostResponse>(config.endpoints.campaigns.calculateCost, {
      method: 'POST',
      body: JSON.stringify(costData),
    });
  }

  // Wallet balance endpoint
  async getWalletBalance(): Promise<ApiResponse<GetWalletBalanceResponse>> {
    return this.request<GetWalletBalanceResponse>(config.endpoints.wallet.balance, {
      method: 'GET',
    });
  }

  // Update campaign endpoint
  async updateCampaign(uuid: string, campaignData: UpdateSMSCampaignRequest): Promise<ApiResponse<UpdateSMSCampaignResponse>> {
    const url = config.endpoints.campaigns.update.replace(':uuid', uuid);
    return this.request<UpdateSMSCampaignResponse>(url, {
      method: 'PUT',
      body: JSON.stringify(campaignData),
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
