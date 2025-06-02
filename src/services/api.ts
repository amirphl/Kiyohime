import { config, getApiUrl } from '../config/environment';

export interface ApiResponse<T = any> {
  Success: boolean;
  Data?: T;
  Message?: string;
  Error?: ErrorDetail;
}

export interface ErrorDetail {
  Code: string;
  Details?: any;
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
        Success: false,
        Error: {
          Code: 'Invalid URL',
          Details: null
        },
      };
    }

    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest', // CSRF protection
    };

    // Add authorization header if token is available
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
          Success: true,
          Data: data,
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
          if (data.Error && data.Error.Code) {
            errorMessage = data.Error.Code;
          } else if (data.Message) {
            errorMessage = data.Message;
          }

          return {
            Success: false,
            Error: {
              Code: errorMessage,
              Details: data.Error?.Details
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
            Success: false,
            Error: {
              Code: 'Unauthorized - Please log in again',
              Details: null
            },
          };
        }
      } else if (!response.ok) {
        // Handle other error responses
        let errorMessage = `HTTP ${response.status}`;

        if (data.Error && data.Error.Code) {
          errorMessage = data.Error.Code;
        } else if (data.Message) {
          errorMessage = data.Message;
        }

        return {
          Success: false,
          Error: {
            Code: errorMessage,
            Details: data.Error?.Details
          },
        };
      } else {
        // Other successful responses
        return {
          Success: true,
          Data: data,
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
        Success: false,
        Error: {
          Code: errorMessage,
          Details: null
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
        Success: false,
        Error: {
          Code: 'Invalid identifier',
          Details: null
        },
      };
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return {
        Success: false,
        Error: {
          Code: 'Invalid password',
          Details: null
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
        Success: false,
        Error: {
          Code: 'Invalid signup data',
          Details: null
        },
      };
    }

    // Validate required fields
    const requiredFields = ['email', 'password', 'representative_mobile'];
    for (const field of requiredFields) {
      if (!signupData[field] || typeof signupData[field] !== 'string') {
        return {
          Success: false,
          Error: {
            Code: `Missing required field: ${field}`,
            Details: null
          },
        };
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupData.email)) {
      return {
        Success: false,
        Error: {
          Code: 'Invalid email format',
          Details: null
        },
      };
    }

    // Validate password strength
    if (signupData.password.length < 8) {
      return {
        Success: false,
        Error: {
          Code: 'Password must be at least 8 characters long',
          Details: null
        },
      };
    }

    // Check for at least 1 uppercase letter and 1 number
    if (!/[A-Z]/.test(signupData.password)) {
      return {
        Success: false,
        Error: {
          Code: 'Password must contain at least 1 uppercase letter',
          Details: null
        },
      };
    }

    if (!/\d/.test(signupData.password)) {
      return {
        Success: false,
        Error: {
          Code: 'Password must contain at least 1 number',
          Details: null
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
        Success: false,
        Error: {
          Code: 'Invalid identifier',
          Details: null
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
