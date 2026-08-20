'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api';

export function useApi<T>(
  fetchFn: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchFn();
        if (mounted) {
          setData(result);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, dependencies);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
}

// Specific hooks for common data
export function useVehicles(params?: { status?: string }) {
  return useApi(
    () => apiClient.getVehicles(params).then((data: any) => {
      // Handle paginated response
      if (Array.isArray(data)) {
        return data;
      }
      // If paginated, return results array
      return data?.results || data?.data || [];
    }),
    [params?.status]
  );
}

export function useAlerts(params?: { status?: string; is_read?: boolean }) {
  return useApi(
    () => apiClient.getAlerts(params).then((data: any) => {
      // Handle paginated response
      if (Array.isArray(data)) {
        return data;
      }
      // If paginated, return results array
      return data?.results || data?.data || [];
    }),
    [params?.status, params?.is_read]
  );
}

export function useTrips(params?: { status?: string; vehicle?: string }) {
  return useApi(
    () => apiClient.getTrips(params).then((data: any) => {
      // Handle paginated response
      if (Array.isArray(data)) {
        return data;
      }
      // If paginated, return results array
      return data?.results || data?.data || [];
    }),
    [params?.status, params?.vehicle]
  );
}

export function useAlertStats() {
  return useApi(() => apiClient.getAlertStats(), []);
}

export function useTripStats() {
  return useApi(() => apiClient.getTripStats(), []);
}