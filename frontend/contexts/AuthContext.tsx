'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: string;
  date_joined?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  checkSession: () => Promise<boolean>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkSession = async (): Promise<boolean> => {
    const storedToken = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');

    if (!storedToken || !storedUser) {
      return false;
    }

    try {
      // Verify token is still valid by calling verify-session endpoint
      apiClient.setToken(storedToken);
      const response = await apiClient.verifySession();
      
      if (response.valid && response.user) {
        setToken(storedToken);
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
        return true;
      } else {
        // Token invalid or user not found
        logout();
        return false;
      }
    } catch (error) {
      // Token expired or invalid
      logout();
      return false;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      await checkSession();
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await apiClient.login(username, password);
      setToken(response.access);
      
      // User data is now returned directly from login
      if (response.user) {
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    apiClient.logout();
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    router.push('/login');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user && !!token,
    checkSession,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}