'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/dashboard');
      return;
    }

    if (!authLoading) {
      router.replace('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center p-4">
        <div className="text-white text-center">
          <div className="text-2xl mb-4">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-36 h-16 bg-transparent rounded-xl shadow-lg mb-4">
            <img src="/images/logo.png" alt="TaxoMètre Logo" className="w-40 h-30" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Inscription fermée</h1>
          <p className="text-primary-100">La création de compte n’est pas disponible actuellement.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <p className="text-gray-700 mb-5">Vous allez être redirigé vers la page de connexion.</p>
          <Link href="/login" className="inline-flex items-center justify-center w-full btn-primary py-3">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
