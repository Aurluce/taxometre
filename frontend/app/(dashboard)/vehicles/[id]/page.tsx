'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeftIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import VehicleForm from '@/components/vehicles/VehicleForm';

interface Vehicle {
  id: string;
  uuid: string;
  plateNumber: string;
  brand: string;
  model: string;
  year: number;
  status: 'active' | 'maintenance' | 'inactive' | 'offline' | 'out_of_service';
  location?: string;
  lastMaintenance?: string;
  mileage?: number;
  vehicleType?: string;
  color?: string;
  fuelType?: string;
  capacity?: number;
  chassisNumber?: string;
  engineNumber?: string;
  insurancePolicy?: string;
  insuranceExpiry?: string;
  technicalControlExpiry?: string;
  firmwareVersion?: string;
  batteryLevel?: number;
  signalStrength?: number;
}

export default function VehicleDetailPage() {
  const params = useParams();
  const [showEditForm, setShowEditForm] = useState(false);
  const [vehicle] = useState<Vehicle>({
    id: params.id as string,
    uuid: '550e8400-e29b-41d4-a716-446655440000',
    plateNumber: 'ABC-1234',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2022,
    status: 'active',
    location: 'Douala, Cameroun',
    lastMaintenance: '2024-12-15',
    mileage: 45000,
    vehicleType: 'minibus',
    color: 'Blanc',
    fuelType: 'diesel',
    capacity: 15,
    chassisNumber: 'VF1234567890',
    engineNumber: 'ENG789012',
    insurancePolicy: 'INS-12345',
    insuranceExpiry: '2025-06-15',
    technicalControlExpiry: '2025-03-20',
    firmwareVersion: '1.0.0',
    batteryLevel: 100,
    signalStrength: 4,
  });

  const handleEdit = () => {
    setShowEditForm(true);
  };

  const handleDelete = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ? Cette action est irréversible.')) {
      console.log('Delete vehicle:', vehicle.id);
      // TODO: Implement delete with API call
      window.location.href = '/vehicles';
    }
  };

  const handleUpdateVehicle = (data: any) => {
    console.log('Update vehicle:', data);
    setShowEditForm(false);
    // TODO: Appel API pour mettre à jour le véhicule
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'badge-success';
      case 'maintenance':
        return 'badge-warning';
      case 'offline':
      case 'out_of_service':
        return 'badge-danger';
      default:
        return 'badge-danger';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'maintenance':
        return 'En maintenance';
      case 'offline':
        return 'Hors ligne';
      case 'out_of_service':
        return 'Hors service';
      default:
        return 'Inactif';
    }
  };

  const getVehicleTypeLabel = (type: string) => {
    switch (type) {
      case 'minibus':
        return 'Minibus';
      case 'bus':
        return 'Bus';
      case 'truck':
        return 'Camion';
      case 'van':
        return 'Fourgon';
      case 'taxi':
        return 'Taxi';
      default:
        return type || 'Non spécifié';
    }
  };

  const getFuelTypeLabel = (type: string) => {
    switch (type) {
      case 'diesel':
        return 'Diesel';
      case 'petrol':
        return 'Essence';
      case 'electric':
        return 'Électrique';
      case 'hybrid':
        return 'Hybride';
      default:
        return type || 'Non spécifié';
    }
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
        {/* Page Header */}
        <div className="mb-6 lg:mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Détails du Véhicule</h2>
          <p className="text-sm lg:text-base text-gray-600 mt-1">
            {vehicle.brand} {vehicle.model} - {vehicle.plateNumber}
          </p>
        </div>

        {/* Back Button */}
        <a
          href="/vehicles"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 lg:mb-6"
        >
          <ArrowLeftIcon className="w-4 h-4 lg:w-5 lg:h-5" />
          <span className="text-sm lg:text-base">Retour à la liste</span>
        </a>

        {/* Vehicle Info Card */}
        <div className="card p-4 lg:p-8 mb-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 lg:w-12 lg:h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl lg:text-3xl font-bold text-gray-900">
                  {vehicle.brand} {vehicle.model}
                </h2>
                <p className="text-sm lg:text-lg text-gray-500 font-mono mt-1">{vehicle.plateNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <button
                onClick={handleEdit}
                className="btn-secondary flex items-center justify-center gap-2 flex-1 lg:flex-initial text-sm lg:text-base"
              >
                <PencilIcon className="w-4 h-4 lg:w-5 lg:h-5" />
                <span>Modifier</span>
              </button>
              <button
                onClick={handleDelete}
                className="px-3 lg:px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2 flex-1 lg:flex-initial text-sm lg:text-base"
              >
                <TrashIcon className="w-4 h-4 lg:w-5 lg:h-5" />
                <span>Supprimer</span>
              </button>
            </div>
          </div>

          {/* UUID for ESP32 Programming */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-900 mb-2">Numéro unique d'enregistrement (UUID)</p>
            <p className="text-base font-mono text-blue-700 break-all">{vehicle.uuid}</p>
            <p className="text-xs text-blue-600 mt-2">Utilisez ce numéro pour la programmation de l'ESP32</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
            <div className="p-3 lg:p-4 bg-gray-50 rounded-lg">
              <p className="text-xs lg:text-sm text-gray-600 mb-1">Année</p>
              <p className="text-base lg:text-lg font-semibold text-gray-900">{vehicle.year}</p>
            </div>
            <div className="p-3 lg:p-4 bg-gray-50 rounded-lg">
              <p className="text-xs lg:text-sm text-gray-600 mb-1">Statut</p>
              <span className={`badge text-xs lg:text-sm ${getStatusBadgeClass(vehicle.status)}`}>
                {getStatusLabel(vehicle.status)}
              </span>
            </div>
            <div className="p-3 lg:p-4 bg-gray-50 rounded-lg">
              <p className="text-xs lg:text-sm text-gray-600 mb-1">Localisation</p>
              <p className="text-base lg:text-lg font-semibold text-gray-900">{vehicle.location || 'Non spécifiée'}</p>
            </div>
            <div className="p-3 lg:p-4 bg-gray-50 rounded-lg">
              <p className="text-xs lg:text-sm text-gray-600 mb-1">Kilométrage</p>
              <p className="text-base lg:text-lg font-semibold text-gray-900">
                {vehicle.mileage?.toLocaleString('fr-FR') || '0'} km
              </p>
            </div>
            <div className="p-3 lg:p-4 bg-gray-50 rounded-lg">
              <p className="text-xs lg:text-sm text-gray-600 mb-1">Dernière maintenance</p>
              <p className="text-base lg:text-lg font-semibold text-gray-900">
                {vehicle.lastMaintenance ? new Date(vehicle.lastMaintenance).toLocaleDateString('fr-FR') : 'Non spécifiée'}
              </p>
            </div>
            <div className="p-3 lg:p-4 bg-gray-50 rounded-lg">
              <p className="text-xs lg:text-sm text-gray-600 mb-1">Type de véhicule</p>
              <p className="text-base lg:text-lg font-semibold text-gray-900">
                {getVehicleTypeLabel(vehicle.vehicleType || '')}
              </p>
            </div>
            <div className="p-3 lg:p-4 bg-gray-50 rounded-lg">
              <p className="text-xs lg:text-sm text-gray-600 mb-1">Couleur</p>
              <p className="text-base lg:text-lg font-semibold text-gray-900">{vehicle.color || 'Non spécifiée'}</p>
            </div>
            <div className="p-3 lg:p-4 bg-gray-50 rounded-lg">
              <p className="text-xs lg:text-sm text-gray-600 mb-1">Type de carburant</p>
              <p className="text-base lg:text-lg font-semibold text-gray-900">
                {getFuelTypeLabel(vehicle.fuelType || '')}
              </p>
            </div>
            <div className="p-3 lg:p-4 bg-gray-50 rounded-lg">
              <p className="text-xs lg:text-sm text-gray-600 mb-1">Capacité</p>
              <p className="text-base lg:text-lg font-semibold text-gray-900">{vehicle.capacity || 0} passagers</p>
            </div>
            <div className="p-3 lg:p-4 bg-gray-50 rounded-lg">
              <p className="text-xs lg:text-sm text-gray-600 mb-1">Numéro de châssis</p>
              <p className="text-base lg:text-lg font-semibold text-gray-900 font-mono">{vehicle.chassisNumber || 'Non spécifié'}</p>
            </div>
            <div className="p-3 lg:p-4 bg-gray-50 rounded-lg">
              <p className="text-xs lg:text-sm text-gray-600 mb-1">Numéro de moteur</p>
              <p className="text-base lg:text-lg font-semibold text-gray-900 font-mono">{vehicle.engineNumber || 'Non spécifié'}</p>
            </div>
            <div className="p-3 lg:p-4 bg-gray-50 rounded-lg">
              <p className="text-xs lg:text-sm text-gray-600 mb-1">Numéro d'assurance</p>
              <p className="text-base lg:text-lg font-semibold text-gray-900 font-mono">{vehicle.insurancePolicy || 'Non spécifié'}</p>
            </div>
            <div className="p-3 lg:p-4 bg-gray-50 rounded-lg">
              <p className="text-xs lg:text-sm text-gray-600 mb-1">Expiration assurance</p>
              <p className="text-base lg:text-lg font-semibold text-gray-900">
                {vehicle.insuranceExpiry ? new Date(vehicle.insuranceExpiry).toLocaleDateString('fr-FR') : 'Non spécifiée'}
              </p>
            </div>
            <div className="p-3 lg:p-4 bg-gray-50 rounded-lg">
              <p className="text-xs lg:text-sm text-gray-600 mb-1">Expiration contrôle technique</p>
              <p className="text-base lg:text-lg font-semibold text-gray-900">
                {vehicle.technicalControlExpiry ? new Date(vehicle.technicalControlExpiry).toLocaleDateString('fr-FR') : 'Non spécifié'}
              </p>
            </div>
            <div className="p-3 lg:p-4 bg-gray-50 rounded-lg">
              <p className="text-xs lg:text-sm text-gray-600 mb-1">Version firmware</p>
              <p className="text-base lg:text-lg font-semibold text-gray-900 font-mono">{vehicle.firmwareVersion || 'Non spécifiée'}</p>
            </div>
            <div className="p-3 lg:p-4 bg-gray-50 rounded-lg">
              <p className="text-xs lg:text-sm text-gray-600 mb-1">Niveau batterie</p>
              <p className="text-base lg:text-lg font-semibold text-gray-900">{vehicle.batteryLevel || 0}%</p>
            </div>
            <div className="p-3 lg:p-4 bg-gray-50 rounded-lg">
              <p className="text-xs lg:text-sm text-gray-600 mb-1">Force du signal</p>
              <p className="text-base lg:text-lg font-semibold text-gray-900">{vehicle.signalStrength || 0}/5</p>
            </div>
          </div>
        </div>

        {/* Additional sections can be added here */}
        {/* Recent trips, maintenance history, etc. */}
      </div>

      {/* Edit Form Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full my-8">
            <div className="flex items-center justify-between p-4 lg:p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Modifier le véhicule</h3>
              <button
                onClick={() => setShowEditForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 lg:p-6">
              <VehicleForm
                initialData={{
                  registration_number: vehicle.plateNumber,
                  vehicle_type: vehicle.vehicleType || 'minibus',
                  brand: vehicle.brand,
                  model: vehicle.model,
                  year: vehicle.year,
                  color: vehicle.color || '',
                  fuel_type: vehicle.fuelType || 'diesel',
                  capacity: vehicle.capacity || 15,
                  weight_kg: 2000,
                  chassis_number: vehicle.chassisNumber || '',
                  engine_number: vehicle.engineNumber || '',
                  insurance_policy: vehicle.insurancePolicy || '',
                  insurance_expiry: vehicle.insuranceExpiry || '',
                  technical_control_expiry: vehicle.technicalControlExpiry || '',
                  status: vehicle.status === 'active' ? 'active' : 'inactive',
                  firmware_version: vehicle.firmwareVersion || '1.0.0',
                  battery_level: vehicle.batteryLevel || 100,
                  signal_strength: vehicle.signalStrength || 0,
                  is_active: true,
                }}
                onSubmit={handleUpdateVehicle}
                onCancel={() => setShowEditForm(false)}
                isLoading={false}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}