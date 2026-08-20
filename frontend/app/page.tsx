'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard after a brief moment
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 100);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          TaxoMètre
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Système de Gestion de Flotte
        </p>
        <div className="animate-pulse">
          <div className="inline-block h-2 w-2 bg-indigo-600 rounded-full mr-1"></div>
          <div className="inline-block h-2 w-2 bg-indigo-600 rounded-full mr-1 animation-delay-200"></div>
          <div className="inline-block h-2 w-2 bg-indigo-600 rounded-full animation-delay-400"></div>
        </div>
        <p className="text-sm text-gray-500 mt-4">Redirection vers le tableau de bord...</p>
      </div>
    </div>
  );
}