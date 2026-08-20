'use client';

import { useEffect } from 'react';
import StatsCard from '@/components/dashboard/StatsCard';
import VehicleList from '@/components/dashboard/VehicleList';
import { TruckIcon, MapIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useVehicles, useAlertStats, useTripStats } from '@/hooks/useApi';

export default function DashboardPage() {
  const { data: vehicles, loading: vehiclesLoading } = useVehicles();
  const { data: alertStats } = useAlertStats();
  const { data: tripStats } = useTripStats();

  const recentVehicles = (vehicles || []).slice(0, 4).map((vehicle: any) => ({
    id: vehicle.id.toString(),
    plateNumber: vehicle.registration_number,
    brand: vehicle.brand,
    model: vehicle.model,
    status: vehicle.status as 'active' | 'maintenance' | 'inactive',
    location: vehicle.last_address || 'Non localisé',
  }));

  const stats = [
    {
      title: 'Total Véhicules',
      value: vehicles?.length.toString() || '0',
      icon: TruckIcon,
      trend: { value: 12, isPositive: true },
      color: 'primary' as const,
    },
    {
      title: 'Trajets Aujourd\'hui',
      value: tripStats?.active_trips?.toString() || '0',
      icon: MapIcon,
      trend: { value: 8, isPositive: true },
      color: 'secondary' as const,
    },
    {
      title: 'Alertes Actives',
      value: alertStats?.critical?.toString() || '0',
      icon: ExclamationTriangleIcon,
      trend: { value: 2, isPositive: false },
      color: 'danger' as const,
    },
  ];

  const handleViewDetails = (id: string) => {
    window.location.href = `/vehicles/${id}`;
  };

  if (vehiclesLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Vehicles */}
      <VehicleList vehicles={recentVehicles} onViewDetails={handleViewDetails} />
    </div>
  );
}
