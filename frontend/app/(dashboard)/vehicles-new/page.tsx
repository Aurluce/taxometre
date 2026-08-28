'use client';

import { useState } from 'react';
import VehicleForm from '@/components/vehicles/VehicleForm';
import apiClient from '@/lib/api';

export default function NewVehiclePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [createdVehicle, setCreatedVehicle] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Informations d\'authentification non fournies. Veuillez vous reconnecter.');
      }

      const vehicle = await apiClient.createVehicle(data);
      setCreatedVehicle(vehicle);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    window.location.href = '/vehicles';
  };

  const handleAddAnother = () => {
    setCreatedVehicle(null);
    window.location.reload();
  };

  // Display success message with UUID after vehicle creation
  if (createdVehicle) {
    return (
      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="max-w-2xl mx-auto">
          {/* Page Header */}
          <div className="mb-6 lg:mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Véhicule créé avec succès</h2>
            <p className="text-sm lg:text-base text-gray-600 mt-1">Le véhicule a été ajouté à votre flotte</p>
          </div>

          <div className="card p-6 lg:p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                Véhicule enregistré !
              </h3>
              <p className="text-sm lg:text-base text-gray-600">
                Utilisez le numéro unique ci-dessous pour configurer l'ESP32
              </p>
            </div>

            <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-4 lg:p-6 mb-6">
              <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">
                Numéro unique du véhicule (UUID)
              </label>
              <div className="bg-white border border-gray-300 rounded-lg p-4">
                <code className="text-base lg:text-lg font-mono font-bold text-primary-700 break-all">
                  {createdVehicle.uuid}
                </code>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Ce UUID sera utilisé par l'ESP32 pour s'identifier et envoyer les données
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-900 mb-2 text-sm lg:text-base">Informations du véhicule</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs lg:text-sm">
                <div>
                  <span className="text-gray-600">Immatriculation:</span>
                  <span className="font-medium ml-2">{createdVehicle.registration_number}</span>
                </div>
                <div>
                  <span className="text-gray-600">Marque/Modèle:</span>
                  <span className="font-medium ml-2">{createdVehicle.brand} {createdVehicle.model}</span>
                </div>
                <div>
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium ml-2">{createdVehicle.vehicle_type}</span>
                </div>
                <div>
                  <span className="text-gray-600">Année:</span>
                  <span className="font-medium ml-2">{createdVehicle.year}</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2 text-sm lg:text-base">
                <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd" />
                </svg>
                Configuration ESP32
              </h4>
              <p className="text-xs lg:text-sm text-yellow-800">
                Copiez ce UUID et configurez-le dans le fichier de configuration de l'ESP32. 
                L'ESP32 utilisera ce UUID pour s'authentifier auprès du serveur.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigator.clipboard.writeText(createdVehicle.uuid)}
                className="flex-1 btn-secondary text-sm lg:text-base"
              >
                Copier le UUID
              </button>
              <button
                onClick={handleAddAnother}
                className="flex-1 btn-primary text-sm lg:text-base"
              >
                Ajouter un autre véhicule
              </button>
              <button
                onClick={() => window.location.href = '/vehicles'}
                className="flex-1 btn-secondary text-sm lg:text-base"
              >
                Voir la liste
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Display error if any
  if (error) {
    return (
      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="max-w-2xl mx-auto">
          {/* Page Header */}
          <div className="mb-6 lg:mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Erreur</h2>
            <p className="text-sm lg:text-base text-gray-600 mt-1">Une erreur est survenue lors de la création</p>
          </div>

          <div className="card p-6 lg:p-8">
            <div className="text-center mb-6">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 lg:w-8 lg:h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                Erreur
              </h3>
              <p className="text-sm lg:text-base text-gray-600">{error}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => window.location.href = '/vehicles-new'}
                className="flex-1 btn-primary text-sm lg:text-base"
              >
                Réessayer
              </button>
              <button
                onClick={() => window.location.href = '/vehicles'}
                className="flex-1 btn-secondary text-sm lg:text-base"
              >
                Retour à la liste
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Display form
  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8">
      {/* Page Header */}
      <div className="mb-6 lg:mb-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Nouveau Véhicule</h2>
        <p className="text-sm lg:text-base text-gray-600 mt-1">Ajoutez un nouveau véhicule à votre flotte</p>
      </div>

      <VehicleForm 
        onSubmit={handleSubmit} 
        onCancel={handleCancel}
        isLoading={isLoading}
        showOwnerField={true}
      />
    </div>
  );
}