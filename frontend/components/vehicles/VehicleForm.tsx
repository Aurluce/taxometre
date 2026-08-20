'use client';

import { useState, useEffect } from 'react';
import { TruckIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import apiClient from '@/lib/api';

interface VehicleFormData {
  // Basic Information
  registration_number: string;
  vehicle_type: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  fuel_type: string;
  capacity: number;
  weight_kg: number;
  
  // Technical Information
  chassis_number: string;
  engine_number: string;
  insurance_policy: string;
  insurance_expiry: string;
  technical_control_expiry: string;
  
  // Status & Configuration
  status: string;
  firmware_version: string;
  battery_level: number;
  signal_strength: number;
  
  // Other
  is_active: boolean;
  owner_id?: number;
}

interface VehicleFormProps {
  initialData?: Partial<VehicleFormData>;
  onSubmit: (data: VehicleFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  showOwnerField?: boolean;
}

export default function VehicleForm({ initialData, onSubmit, onCancel, isLoading, showOwnerField = false }: VehicleFormProps) {
  const [formData, setFormData] = useState<VehicleFormData>({
    registration_number: initialData?.registration_number || '',
    vehicle_type: initialData?.vehicle_type || 'minibus',
    brand: initialData?.brand || '',
    model: initialData?.model || '',
    year: initialData?.year || new Date().getFullYear(),
    color: initialData?.color || '',
    fuel_type: initialData?.fuel_type || 'diesel',
    capacity: initialData?.capacity || 15,
    weight_kg: initialData?.weight_kg || 2000,
    
    chassis_number: initialData?.chassis_number || '',
    engine_number: initialData?.engine_number || '',
    insurance_policy: initialData?.insurance_policy || '',
    insurance_expiry: initialData?.insurance_expiry || '',
    technical_control_expiry: initialData?.technical_control_expiry || '',
    
    status: initialData?.status || 'inactive',
    firmware_version: initialData?.firmware_version || '1.0.0',
    battery_level: initialData?.battery_level || 100,
    signal_strength: initialData?.signal_strength || 0,
    
    is_active: initialData?.is_active ?? true,
    owner_id: initialData?.owner_id,
  });

  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Load users for owner assignment
  useEffect(() => {
    if (showOwnerField) {
      loadUsers();
    }
  }, [showOwnerField]);

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const data = await apiClient.getUsers();
      const usersArray = Array.isArray(data) ? data : (data as any).results || [];
      setUsers(usersArray);
      setFilteredUsers(usersArray);
    } catch (err) {
      console.error('Error loading users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Filter users based on search
  useEffect(() => {
    if (!userSearch.trim()) {
      setFilteredUsers(users);
    } else {
      const searchLower = userSearch.toLowerCase();
      const filtered = users.filter(user => 
        user.username.toLowerCase().includes(searchLower) ||
        user.first_name.toLowerCase().includes(searchLower) ||
        user.last_name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
      setFilteredUsers(filtered);
    }
  }, [userSearch, users]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSubmit = {
      registration_number: formData.registration_number,
      vehicle_type: formData.vehicle_type,
      brand: formData.brand,
      model: formData.model,
      year: formData.year,
      color: formData.color || null,
      fuel_type: formData.fuel_type,
      capacity: formData.capacity,
      weight_kg: formData.weight_kg,
      chassis_number: formData.chassis_number || null,
      engine_number: formData.engine_number || null,
      insurance_policy: formData.insurance_policy || null,
      insurance_expiry: formData.insurance_expiry || null,
      technical_control_expiry: formData.technical_control_expiry || null,
      status: formData.status,
      firmware_version: formData.firmware_version,
      battery_level: formData.battery_level,
      signal_strength: formData.signal_strength,
      is_active: formData.is_active,
      owner: formData.owner_id ? formData.owner_id : null,
    };

    onSubmit(dataToSubmit);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
  } else if (name === 'year' || name === 'capacity' || name === 'weight_kg' || 
             name === 'battery_level' || name === 'signal_strength') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? 0 : Number(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="card p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
          <TruckIcon className="w-7 h-7 text-primary-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {initialData ? 'Modifier le véhicule' : 'Nouveau véhicule'}
          </h2>
          <p className="text-sm text-gray-500">
            {initialData ? 'Modifiez les informations du véhicule' : 'Ajoutez un nouveau véhicule à la flotte'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Informations générales</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="registration_number" className="block text-sm font-medium text-gray-700 mb-2">
                Numéro d'immatriculation *
              </label>
              <input
                type="text"
                id="registration_number"
                name="registration_number"
                value={formData.registration_number}
                onChange={handleChange}
                required
                className="input-primary"
                placeholder="Ex: ABC-1234"
              />
            </div>

            <div>
              <label htmlFor="vehicle_type" className="block text-sm font-medium text-gray-700 mb-2">
                Type de véhicule *
              </label>
              <select
                id="vehicle_type"
                name="vehicle_type"
                value={formData.vehicle_type}
                onChange={handleChange}
                required
                className="input-primary"
              >
                <option value="bus">Bus</option>
                <option value="minibus">Minibus</option>
                <option value="taxi">Taxi</option>
                <option value="truck">Camion</option>
                <option value="van">Fourgon</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
                Marque *
              </label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                className="input-primary"
                placeholder="Ex: Toyota"
              />
            </div>

            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
                Modèle *
              </label>
              <input
                type="text"
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
                className="input-primary"
                placeholder="Ex: Corolla"
              />
            </div>

            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                Année *
              </label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                min="1900"
                max={new Date().getFullYear() + 1}
                className="input-primary"
              />
            </div>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
                Couleur
              </label>
              <input
                type="text"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="input-primary"
                placeholder="Ex: Rouge"
              />
            </div>

            <div>
              <label htmlFor="fuel_type" className="block text-sm font-medium text-gray-700 mb-2">
                Type de carburant *
              </label>
              <select
                id="fuel_type"
                name="fuel_type"
                value={formData.fuel_type}
                onChange={handleChange}
                required
                className="input-primary"
              >
                <option value="diesel">Diesel</option>
                <option value="petrol">Essence</option>
                <option value="electric">Électrique</option>
                <option value="hybrid">Hybride</option>
              </select>
            </div>

            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
                Capacité (passagers) *
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
                min="1"
                className="input-primary"
              />
            </div>
          </div>

        
        </div>

        {/* Technical Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Informations techniques</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="chassis_number" className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de châssis
              </label>
              <input
                type="text"
                id="chassis_number"
                name="chassis_number"
                value={formData.chassis_number}
                onChange={handleChange}
                className="input-primary"
                placeholder="Ex: VF1234567890"
              />
            </div>

            <div>
              <label htmlFor="engine_number" className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de moteur
              </label>
              <input
                type="text"
                id="engine_number"
                name="engine_number"
                value={formData.engine_number}
                onChange={handleChange}
                className="input-primary"
                placeholder="Ex: ENG789012"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="insurance_policy" className="block text-sm font-medium text-gray-700 mb-2">
                Numéro d'assurance
              </label>
              <input
                type="text"
                id="insurance_policy"
                name="insurance_policy"
                value={formData.insurance_policy}
                onChange={handleChange}
                className="input-primary"
                placeholder="Ex: INS-12345"
              />
            </div>

            <div>
              <label htmlFor="insurance_expiry" className="block text-sm font-medium text-gray-700 mb-2">
                Expiration assurance
              </label>
              <input
                type="date"
                id="insurance_expiry"
                name="insurance_expiry"
                value={formData.insurance_expiry}
                onChange={handleChange}
                className="input-primary"
              />
            </div>

            <div>
              <label htmlFor="technical_control_expiry" className="block text-sm font-medium text-gray-700 mb-2">
                Expiration contrôle technique
              </label>
              <input
                type="date"
                id="technical_control_expiry"
                name="technical_control_expiry"
                value={formData.technical_control_expiry}
                onChange={handleChange}
                className="input-primary"
              />
            </div>
          </div>
        </div>

        {/* Status & Configuration */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Statut et configuration</h3>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Statut *
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="input-primary"
            >
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>
        </div>

        {/* Owner Assignment (for admins) */}
        {showOwnerField && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Assignation</h3>
            
            {/* User Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rechercher un utilisateur
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="input-primary pl-10"
                  placeholder="Rechercher par nom, username ou email..."
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Users List */}
            {loadingUsers ? (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                <p className="mt-2 text-sm text-gray-600">Chargement...</p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sélectionner un propriétaire
                </label>
                <select
                  id="owner_id"
                  name="owner_id"
                  value={formData.owner_id || ''}
                  onChange={(e) => setFormData({ ...formData, owner_id: e.target.value ? Number(e.target.value) : undefined })}
                  className="input-primary"
                  size={Math.min(filteredUsers.length + 1, 5)}
                >
                  <option value="">-- Aucun --</option>
                  {filteredUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.first_name} {user.last_name} (@{user.username}) - {user.email}
                    </option>
                  ))}
                </select>
                {filteredUsers.length === 0 && !loadingUsers && (
                  <p className="mt-2 text-sm text-gray-500">Aucun utilisateur trouvé</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 btn-primary"
          >
            {isLoading ? 'Enregistrement...' : initialData ? 'Mettre à jour' : 'Ajouter le véhicule'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 btn-secondary"
            >
              Annuler
            </button>
          )}
        </div>
      </form>
    </div>
  );
}