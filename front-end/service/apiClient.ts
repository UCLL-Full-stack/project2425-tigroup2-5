import authService from './authService';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface RequestOptions extends RequestInit {
  requireAuth?: boolean;
}

/**
 * Generic API client for making authenticated requests
 */
const apiClient = {
  /**
   * Make a GET request
   */
  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>('GET', endpoint, null, options);
  },

  /**
   * Make a POST request
   */
  async post<T>(endpoint: string, data: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>('POST', endpoint, data, options);
  },

  /**
   * Make a PUT request
   */
  async put<T>(endpoint: string, data: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>('PUT', endpoint, data, options);
  },

  /**
   * Make a DELETE request
   */
  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>('DELETE', endpoint, null, options);
  },

  /**
   * Make a generic request
   */
  async request<T>(
    method: string,
    endpoint: string,
    data: any = null,
    { requireAuth = true, ...customConfig }: RequestOptions = {}
  ): Promise<T> {
    const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    // Create a mutable headers object
    const headersInit: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(customConfig.headers as Record<string, string> || {})
    };

    // Add auth token if authenticated request
    if (requireAuth) {
      const token = authService.getToken();
      if (token) {
        headersInit.Authorization = `Bearer ${token}`;
      } else if (typeof window !== 'undefined') {
        // If we need auth but don't have a token, redirect to login
        window.location.href = '/pages/login';
        throw new Error('Authentication required');
      }
    }

    const config: RequestInit = {
      method,
      ...customConfig,
      headers: headersInit,
      credentials: 'include', // Include credentials in all requests
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);
      
      // Handle authentication errors
      if (response.status === 401) {
        authService.logout();
        if (typeof window !== 'undefined') {
          window.location.href = '/pages/login';
        }
        throw new Error('Session expired. Please log in again.');
      }
      
      // Handle other errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API error: ${response.status}`);
      }
      
      // Parse JSON response if any
      if (response.headers.get('content-type')?.includes('application/json')) {
        return response.json();
      }
      
      return response as any;
    } catch (error) {
      // Re-throw with more context
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      }
      throw error;
    }
  },
};

export default apiClient;