'use client';

import { useState } from 'react';
import VehicleCard from '@/components/vehicles/VehicleCard';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { useVehicles } from '@/hooks/useApi';
import apiClient from '@/lib/api';

export default function VehiclesPage() {
  const { data: vehicles, loading, error, refetch } = useVehicles();
  const [filter, setFilter] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);

  const handleViewDetails = (id: string) => {
    window.location.href = `/vehicles/${id}`;
  };

  const handleEdit = (id: string) => {
    console.log('Edit vehicle:', id);
  };

  const handleDeleteClick = (id: string) => {
    setVehicleToDelete(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (!vehicleToDelete) return;

    try {
      setDeletingId(vehicleToDelete);
      await apiClient.deleteVehicle(vehicleToDelete);
      await refetch();
      setShowConfirmModal(false);
      setVehicleToDelete(null);
    } catch (err) {
      console.error('Error deleting vehicle:', err);
      alert(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    } finally {
      setDeletingId(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setVehicleToDelete(null);
  };

  const filteredVehicles = (vehicles || []).filter((vehicle: any) => {
    if (filter === 'all') return true;
    return vehicle.status === filter;
  });

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Chargement des véhicules...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Erreur: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8">
      {/* Page Header */}
      <div className="mb-6 lg:mb-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Véhicules</h2>
        <p className="text-sm lg:text-base text-gray-600 mt-1">Gestion de votre flotte automobile</p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-primary flex-1 sm:flex-initial"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="maintenance">En maintenance</option>
            <option value="inactive">Inactif</option>
          </select>
        </div>

        <a
          href="/vehicles-new"
          className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <PlusIcon className="w-5 h-5" />
          Nouveau Véhicule
        </a>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {filteredVehicles.map((vehicle: any) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={{
              id: vehicle.id.toString(),
              plateNumber: vehicle.registration_number,
              brand: vehicle.brand,
              model: vehicle.model,
              year: vehicle.year,
              status: vehicle.status as 'active' | 'maintenance' | 'inactive',
              location: vehicle.last_address,
              lastMaintenance: vehicle.last_maintenance_date,
              mileage: vehicle.total_distance,
            }}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucun véhicule trouvé</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirmer la suppression</h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer ce véhicule ? Cette action est irréversible.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={confirmDelete}
                disabled={deletingId === vehicleToDelete}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {deletingId === vehicleToDelete ? 'Suppression...' : 'Supprimer'}
              </button>
              <button
                onClick={cancelDelete}
                disabled={deletingId === vehicleToDelete}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
