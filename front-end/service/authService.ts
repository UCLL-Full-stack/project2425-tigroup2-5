import apiClient from "./apiClient";

const AUTH_TOKEN_KEY = 'token';
const USER_DATA_KEY = 'user';

/**
 * Helper to parse JWT token payload
 */
const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

/**
 * Get CSRF token for requests that need it
 */
const getCsrfToken = async (): Promise<string | null> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/csrf-token`, {
      method: 'GET',
      credentials: 'include',
    });
    
    if (!response.ok) return null;
    
    // Get token from response body instead of headers to avoid CORS issues
    const data = await response.json();
    return data.csrfToken || null;
  } catch (error) {
    console.error('Failed to get CSRF token:', error);
    return null;
  }
};

/**
 * Handle login for members and employees
 */
const login = async (email: string, password: string, userType: 'member' | 'employee' = 'member') => {
  try {
    console.log(`Attempting login for ${email} as ${userType}`);
    console.log(`API URL: ${process.env.NEXT_PUBLIC_API_URL}`);
    
    // Get CSRF token first
    const csrfToken = await getCsrfToken();
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
      },
      body: JSON.stringify({ email, password, userType }),
      credentials: 'include', // Include cookies if your API uses them
    });
    
    if (!response.ok) {
      console.error(`Login failed with status ${response.status}: ${response.statusText}`);
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.error('Error data:', errorData);
      throw new Error(errorData.message || `Login failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Validate response structure before saving
    if (!data.token || !data.user) {
      console.error('Invalid response format from login endpoint:', data);
      throw new Error('Invalid response from server');
    }
    
    // Log successful authentication info (remove in production)
    console.log(`Login successful for ${userType}:`, {
      id: data.user.id,
      email: data.user.email,
      role: data.user.role
    });
    
    // Save the authentication data
    saveUserData(data);
    
    // Return the user data
    return data.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Save authentication data to local storage
 */
const saveUserData = (data: { token: string; user: any }) => {
  try {
    if (!data || !data.token || !data.user) {
      console.error('Invalid authentication data provided');
      return;
    }
    
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(data.user));
  } catch (e) {
    console.error('Error saving user data to localStorage', e);
  }
};

/**
 * Check if user is authenticated
 */
const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;
  
  // Check if token is expired
  try {
    const payload = parseJwt(token);
    if (!payload) return false;
    
    // Token expiration is in seconds
    const isExpired = payload.exp * 1000 < Date.now();
    return !isExpired;
  } catch (e) {
    return false;
  }
};

/**
 * Get current user data
 */
const getCurrentUser = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const userData = localStorage.getItem(USER_DATA_KEY);
    
    // Make sure userData is not null or undefined before parsing
    if (!userData) return null;
    
    const parsedUser = JSON.parse(userData);
    
    // Validate that the user object has the expected structure
    if (
      parsedUser && 
      typeof parsedUser === 'object' &&
      'id' in parsedUser &&
      'email' in parsedUser &&
      'firstname' in parsedUser &&
      'surname' in parsedUser &&
      'role' in parsedUser
    ) {
      return parsedUser;
    }
    
    // If missing required fields, return null
    console.error('User data in localStorage is missing required fields');
    return null;
  } catch (e) {
    console.error('Error parsing user data from localStorage', e);
    localStorage.removeItem(USER_DATA_KEY); // Clean up invalid data
    return null;
  }
};

/**
 * Get authentication token
 */
const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * Register a new user
 */
const register = async (userData: any) => {
  // Get CSRF token first
  const csrfToken = await getCsrfToken();
  
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
    },
    body: JSON.stringify(userData),
    credentials: 'include',
  });
};

/**
 * Verify JWT token with the server
 */
const verifyToken = async (token: string) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(res => {
    if (!res.ok) throw new Error('Invalid token');
    return res.json();
  });
};

/**
 * Log out the current user
 */
const logout = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
  
  // Dispatch an event for any listeners (useful in case of multiple tabs)
  const logoutEvent = new StorageEvent('storage', {
    key: AUTH_TOKEN_KEY,
    newValue: null
  });
  window.dispatchEvent(logoutEvent);
};

/**
 * Request a password reset
 */
const requestPasswordReset = async (email: string, userType: 'member' | 'employee' = 'member') => {
  // Get CSRF token first
  const csrfToken = await getCsrfToken();
  
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
    },
    body: JSON.stringify({ email, userType }),
    credentials: 'include',
  }).then(res => {
    if (!res.ok) {
      throw new Error('Failed to request password reset');
    }
    return res.json();
  });
};

/**
 * Reset password with token
 */
const resetPassword = async (token: string, password: string) => {
  // Get CSRF token first
  const csrfToken = await getCsrfToken();
  
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
    },
    body: JSON.stringify({ token, password }),
    credentials: 'include',
  }).then(res => {
    if (!res.ok) {
      return res.json().then(data => {
        throw new Error(data.message || 'Failed to reset password');
      });
    }
    return res.json();
  });
};

export default {
  login,
  saveUserData,
  isAuthenticated,
  getCurrentUser,
  getToken,
  register,
  verifyToken,
  logout,
  requestPasswordReset,
  resetPassword
};