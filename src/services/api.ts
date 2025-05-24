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
    
    // Validate URL to prevent SSRF attacks
    if (!this.isValidUrl(url)) {
      return {
        success: false,
        error: 'Invalid URL',
      };
    }
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest', // CSRF protection
    };

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


      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      // Don't expose internal error details in production
      const isProduction = this.isProduction();
      const errorMessage = isProduction 
        ? 'An error occurred' 
        : (error instanceof Error ? error.message : 'Unknown error');
        
      return {
        success: false,
        error: errorMessage,
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
    if (!identifier || typeof identifier !== 'string' || identifier.length > 255) {
      return {
        success: false,
        error: 'Invalid identifier',
      };
    }
    
    if (!password || typeof password !== 'string' || password.length < 8) {
      return {
        success: false,
        error: 'Invalid password',
      };
    }

    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        identifier: identifier.trim(),
        password,
      }),
    });
  }

  async signup(signupData: any): Promise<ApiResponse> {
    // Input validation
    if (!signupData || typeof signupData !== 'object') {
      return {
        success: false,
        error: 'Invalid signup data',
      };
    }

    // Validate required fields
    const requiredFields = ['email', 'password', 'representative_mobile'];
    for (const field of requiredFields) {
      if (!signupData[field] || typeof signupData[field] !== 'string') {
        return {
          success: false,
          error: `Missing required field: ${field}`,
        };
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupData.email)) {
      return {
        success: false,
        error: 'Invalid email format',
      };
    }

    // Validate password strength
    if (signupData.password.length < 8) {
      return {
        success: false,
        error: 'Password must be at least 8 characters long',
      };
    }

    // Check for at least 1 uppercase letter and 1 number
    if (!/[A-Z]/.test(signupData.password)) {
      return {
        success: false,
        error: 'Password must contain at least 1 uppercase letter',
      };
    }

    if (!/\d/.test(signupData.password)) {
      return {
        success: false,
        error: 'Password must contain at least 1 number',
      };
    }

    // Format phone number to include +98 prefix
    const formattedData = {
      ...signupData,
      representative_mobile: this.formatPhoneNumber(signupData.representative_mobile),
    };

    const response = await this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(formattedData),
    });


    return response;
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
    // Input validation
    if (!identifier || typeof identifier !== 'string' || identifier.length > 255) {
      return {
        success: false,
        error: 'Invalid identifier',
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
    // Input validation
    if (!phoneNumber || typeof phoneNumber !== 'string') {
      return {
        success: false,
        error: 'Invalid phone number',
      };
    }

    if (!message || typeof message !== 'string' || message.length > 160) {
      return {
        success: false,
        error: 'Invalid message (max 160 characters)',
      };
    }

    // Format phone number to include +98 prefix
    const formattedPhoneNumber = this.formatPhoneNumber(phoneNumber);

    return this.request('/sms/send', {
      method: 'POST',
      body: JSON.stringify({
        phone_number: formattedPhoneNumber,
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