'use client';

import { TruckIcon, MapPinIcon, CalendarIcon } from '@heroicons/react/24/outline';

interface Vehicle {
  id: string;
  plateNumber: string;
  brand: string;
  model: string;
  year: number;
  status: 'active' | 'maintenance' | 'inactive';
  location?: string;
  lastMaintenance?: string;
  mileage?: number;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

export default function VehicleCard({ vehicle, onEdit, onDelete, onViewDetails }: VehicleCardProps) {
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
    <div className="card p-6 hover:shadow-lg transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <TruckIcon className="w-7 h-7 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {vehicle.brand} {vehicle.model}
            </h3>
            <p className="text-sm text-gray-500 font-mono">{vehicle.plateNumber}</p>
          </div>
        </div>
        {getStatusBadge(vehicle.status)}
      </div>

      {/* Details */}
      <div className="space-y-3 mb-4">
        {vehicle.location && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPinIcon className="w-4 h-4 text-gray-400" />
            <span>{vehicle.location}</span>
          </div>
        )}
        
        {vehicle.lastMaintenance && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CalendarIcon className="w-4 h-4 text-gray-400" />
            <span>Dernière maintenance: {new Date(vehicle.lastMaintenance).toLocaleDateString('fr-FR')}</span>
          </div>
        )}

        {vehicle.mileage !== undefined && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">Kilométrage:</span>
            <span>{vehicle.mileage.toLocaleString('fr-FR')} km</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
        <button
          onClick={() => onViewDetails?.(vehicle.id)}
          className="flex-1 btn-primary text-sm py-2"
        >
          Voir détails
        </button>
        <button
          onClick={() => onEdit?.(vehicle.id)}
          className="flex-1 btn-secondary text-sm py-2"
        >
          Modifier
        </button>
        <button
          onClick={() => onDelete?.(vehicle.id)}
          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}