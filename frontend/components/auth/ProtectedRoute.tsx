'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, checkSession } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      if (!isAuthenticated) {
        const isValid = await checkSession();
        if (!isValid) {
          router.push('/login');
        }
      }
    };

    verifyAuth();
  }, [isAuthenticated, checkSession, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-gray-500">Vérification de la session...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}