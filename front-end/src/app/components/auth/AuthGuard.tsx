"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import authService from '../../../../service/authService';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: ('member' | 'employee' | 'admin')[];
}

/**
 * A component that guards routes and only allows access if the user is authenticated
 * and has the required roles (if specified)
 */
export default function AuthGuard({ children, requiredRoles }: AuthGuardProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const currentUser = authService.getCurrentUser();
      
      // If no user is logged in
      if (!currentUser) {
        router.push('/pages/login');
        return;
      }
      
      // If roles are required, check if user has the required role
      if (requiredRoles && requiredRoles.length > 0) {
        const userRole = currentUser.role;
        if (!requiredRoles.includes(userRole)) {
          // User doesn't have the required role
          router.push('/');
          return;
        }
      }

      // User is authenticated and has required roles
      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router, requiredRoles]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-primary">Authenticating...</div>
      </div>
    );
  }

  // Render children only if authorized
  return isAuthorized ? <>{children}</> : null;
}