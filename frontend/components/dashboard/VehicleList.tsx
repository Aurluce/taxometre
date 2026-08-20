'use client';

import { TruckIcon, MapPinIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';

interface Vehicle {
  id: string;
  plateNumber: string;
  brand: string;
  model: string;
  status: 'active' | 'maintenance' | 'inactive';
  location?: string;
  lastMaintenance?: string;
}

interface VehicleListProps {
  vehicles: Vehicle[];
  onViewDetails?: (id: string) => void;
}

export default function VehicleList({ vehicles, onViewDetails }: VehicleListProps) {
  const getStatusBadge = (status: Vehicle['status']) => {
    const badges = {
      active: 'badge-success',
      maintenance: 'badge-warning',
      inactive: 'badge-danger',
    };
    const labels = {
      active: 'Actif',
      maintenance: 'Maintenance',
      inactive: 'Inactif',
    };
    return <span className={`badge ${badges[status]}`}>{labels[status]}</span>;
  };

  return (
    <div className="card overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Véhicules Récents</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Véhicule
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Immatriculation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Localisation
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <TruckIcon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {vehicle.brand} {vehicle.model}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900 font-mono">{vehicle.plateNumber}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(vehicle.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {vehicle.location ? (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPinIcon className="w-4 h-4" />
                      {vehicle.location}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => onViewDetails?.(vehicle.id)}
                    className="text-primary-600 hover:text-primary-800 font-medium text-sm"
                  >
                    Détails
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}