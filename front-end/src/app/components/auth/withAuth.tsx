"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import authService from '../../../../service/authService';

interface WithAuthProps {
  requiredRoles?: ('member' | 'employee' | 'admin')[];
  redirectTo?: string;
}

/**
 * Higher-order component that wraps components requiring authentication
 * Can be used on page components or individual components that need auth
 */
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  { requiredRoles, redirectTo = '/pages/login' }: WithAuthProps = {}
) {
  return function WithAuth(props: P) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const token = authService.getToken();
          if (!token) {
            router.push(redirectTo);
            return;
          }

          const user = authService.getCurrentUser();
          
          if (!user) {
            router.push(redirectTo);
            return;
          }
          
          // Check for required roles if specified
          if (requiredRoles && requiredRoles.length > 0) {
            const hasRole = requiredRoles.includes(user.role);
            if (!hasRole) {
              router.push('/');
              return;
            }
          }
          
          // Verify token on the server
          try {
            await authService.verifyToken(token);
          } catch {
            // Invalid token, redirect to login
            authService.logout();
            router.push(redirectTo);
            return;
          }
          
          setIsAuthorized(true);
        } catch (error) {
          console.error('Auth check error:', error);
          router.push(redirectTo);
        } finally {
          setIsLoading(false);
        }
      };

      checkAuth();
    }, [router]); // redirectTo is not needed as a dependency

    if (isLoading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-pulse text-primary">Authenticating...</div>
        </div>
      );
    }

    return isAuthorized ? <WrappedComponent {...props} /> : null;
  };
}