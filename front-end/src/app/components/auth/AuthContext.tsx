"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import authService from '../../../../service/authService';

interface User {
  id: number;
  email: string;
  firstname: string;
  surname: string;
  role: 'member' | 'employee' | 'admin';
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, userType: 'member' | 'employee') => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => { return {} as User },
  logout: () => {},
  isAuthenticated: false,
  isAdmin: false,
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state on component mount
  useEffect(() => {
    const initAuth = () => {
      try {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error initializing auth state:', error);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for storage events (for multi-tab logout)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' && !e.newValue) {
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Login function
  const login = async (email: string, password: string, userType: 'member' | 'employee' = 'member') => {
    setLoading(true);
    try {
      // authService.login now returns the user data directly
      const userData = await authService.login(email, password, userType);
      
      if (!userData) {
        throw new Error('Failed to get user data');
      }
      
      // Update the user state with the returned user data
      setUser(userData);
      
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
    router.push('/');
  };

  // Auth state
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};