
"use client";

import { useEffect, useState } from "react";
import {
  TruckIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

import apiClient from "@/lib/api";

/**
 * Données utilisées par le formulaire.
 */
interface VehicleFormData {
  registration_number: string;
  vehicle_type: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  fuel_type: string;
  capacity: number;
  weight_kg: number;

  chassis_number: string;
  engine_number: string;
  insurance_policy: string;
  insurance_expiry: string;
  technical_control_expiry: string;

  status: string;
  firmware_version: string;
  battery_level: number;
  signal_strength: number;

  is_active: boolean;
  owner_id?: number;
}

/**
 * Données réellement envoyées à l'API Django.
 */
interface VehicleSubmitData {
  registration_number: string;
  vehicle_type: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  fuel_type: string;
  capacity: number;
  weight_kg: number;

  chassis_number: string | null;
  engine_number: string | null;
  insurance_policy: string | null;
  insurance_expiry: string | null;
  technical_control_expiry: string | null;

  status: string;
  firmware_version: string;
  battery_level: number;
  signal_strength: number;

  is_active: boolean;
  owner: number | null;
}

interface VehicleFormProps {
  initialData?: Partial<VehicleFormData>;
  onSubmit: (data: VehicleSubmitData) => void | Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  showOwnerField?: boolean;
}

interface User {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
}

export default function VehicleForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  showOwnerField = false,
}: VehicleFormProps) {
  const [formData, setFormData] = useState<VehicleFormData>({
    registration_number: initialData?.registration_number ?? "",
    vehicle_type: initialData?.vehicle_type ?? "minibus",
    brand: initialData?.brand ?? "",
    model: initialData?.model ?? "",
    year: initialData?.year ?? new Date().getFullYear(),
    color: initialData?.color ?? "",
    fuel_type: initialData?.fuel_type ?? "diesel",
    capacity: initialData?.capacity ?? 15,
    weight_kg: initialData?.weight_kg ?? 2000,

    chassis_number: initialData?.chassis_number ?? "",
    engine_number: initialData?.engine_number ?? "",
    insurance_policy: initialData?.insurance_policy ?? "",
    insurance_expiry: initialData?.insurance_expiry ?? "",
    technical_control_expiry:
      initialData?.technical_control_expiry ?? "",

    status: initialData?.status ?? "inactive",
    firmware_version: initialData?.firmware_version ?? "1.0.0",
    battery_level: initialData?.battery_level ?? 100,
    signal_strength: initialData?.signal_strength ?? 0,

    is_active: initialData?.is_active ?? true,
    owner_id: initialData?.owner_id,
  });

  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);

  /**
   * Charge les utilisateurs lorsqu'on doit afficher
   * le champ propriétaire.
   */
  useEffect(() => {
    if (showOwnerField) {
      void loadUsers();
    }
  }, [showOwnerField]);

  /**
   * Charge la liste des utilisateurs.
   */
  const loadUsers = async () => {
    try {
      setLoadingUsers(true);

      const data = await apiClient.getUsers();

      const usersArray: User[] = Array.isArray(data)
        ? data
        : Array.isArray((data as { results?: User[] })?.results)
          ? (data as { results: User[] }).results
          : [];

      setUsers(usersArray);
      setFilteredUsers(usersArray);
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs :", error);

      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  /**
   * Filtre les utilisateurs.
   */
  useEffect(() => {
    const search = userSearch.trim().toLowerCase();

    if (!search) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter((user) => {
      const username = user.username?.toLowerCase() ?? "";
      const firstName = user.first_name?.toLowerCase() ?? "";
      const lastName = user.last_name?.toLowerCase() ?? "";
      const email = user.email?.toLowerCase() ?? "";

      return (
        username.includes(search) ||
        firstName.includes(search) ||
        lastName.includes(search) ||
        email.includes(search)
      );
    });

    setFilteredUsers(filtered);
  }, [userSearch, users]);

  /**
   * Soumission du formulaire.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dataToSubmit: VehicleSubmitData = {
      registration_number: formData.registration_number.trim(),
      vehicle_type: formData.vehicle_type,
      brand: formData.brand.trim(),
      model: formData.model.trim(),
      year: formData.year,
      color: formData.color.trim(),

      fuel_type: formData.fuel_type,
      capacity: formData.capacity,
      weight_kg: formData.weight_kg,

      chassis_number: formData.chassis_number.trim() || null,
      engine_number: formData.engine_number.trim() || null,
      insurance_policy: formData.insurance_policy.trim() || null,
      insurance_expiry: formData.insurance_expiry || null,
      technical_control_expiry:
        formData.technical_control_expiry || null,

      status: formData.status,
      firmware_version: formData.firmware_version.trim(),
      battery_level: formData.battery_level,
      signal_strength: formData.signal_strength,

      is_active: formData.is_active,

      owner: formData.owner_id ?? null,
    };

    await onSubmit(dataToSubmit);
  };

  /**
   * Gestion générique des champs.
   */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;

      setFormData((previous) => ({
        ...previous,
        [name]: checked,
      }));

      return;
    }

    if (
      name === "year" ||
      name === "capacity" ||
      name === "weight_kg" ||
      name === "battery_level" ||
      name === "signal_strength"
    ) {
      setFormData((previous) => ({
        ...previous,
        [name]: value === "" ? 0 : Number(value),
      }));

      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /**
   * Change le propriétaire.
   */
  const handleOwnerChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;

    setFormData((previous) => ({
      ...previous,
      owner_id: value ? Number(value) : undefined,
    }));
  };

  return (
    <div className="card mx-auto w-full max-w-4xl p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-100 sm:h-12 sm:w-12">
          <TruckIcon className="h-6 w-6 text-primary-600 sm:h-7 sm:w-7" />
        </div>

        <div className="min-w-0">
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
            {initialData
              ? "Modifier le véhicule"
              : "Nouveau véhicule"}
          </h2>

          <p className="text-sm text-gray-500">
            {initialData
              ? "Modifiez les informations du véhicule"
              : "Ajoutez un nouveau véhicule à la flotte"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations générales */}
        <div className="space-y-4">
          <h3 className="border-b pb-2 text-lg font-semibold text-gray-900">
            Informations générales
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Immatriculation */}
            <div>
              <label
                htmlFor="registration_number"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Numéro d'immatriculation *
              </label>

              <input
                type="text"
                id="registration_number"
                name="registration_number"
                value={formData.registration_number}
                onChange={handleChange}
                required
                className="input-primary w-full"
                placeholder="Ex : ABC-1234"
              />
            </div>

            {/* Type */}
            <div>
              <label
                htmlFor="vehicle_type"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Type de véhicule *
              </label>

              <select
                id="vehicle_type"
                name="vehicle_type"
                value={formData.vehicle_type}
                onChange={handleChange}
                required
                className="input-primary w-full"
              >
                <option value="bus">Bus</option>
                <option value="minibus">Minibus</option>
                <option value="taxi">Taxi</option>
                <option value="truck">Camion</option>
                <option value="van">Fourgon</option>
              </select>
            </div>
          </div>

          {/* Marque / modèle / année */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label
                htmlFor="brand"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Marque *
              </label>

              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                className="input-primary w-full"
                placeholder="Ex : Toyota"
              />
            </div>

            <div>
              <label
                htmlFor="model"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Modèle *
              </label>

              <input
                type="text"
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
                className="input-primary w-full"
                placeholder="Ex : Corolla"
              />
            </div>

            <div>
              <label
                htmlFor="year"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Année *
              </label>

              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                min={1900}
                max={new Date().getFullYear() + 1}
                className="input-primary w-full"
              />
            </div>
          </div>

          {/* Couleur / carburant / capacité */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label
                htmlFor="color"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Couleur
              </label>

              <input
                type="text"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="input-primary w-full"
                placeholder="Ex : Rouge"
              />
            </div>

            <div>
              <label
                htmlFor="fuel_type"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Type de carburant *
              </label>

              <select
                id="fuel_type"
                name="fuel_type"
                value={formData.fuel_type}
                onChange={handleChange}
                required
                className="input-primary w-full"
              >
                <option value="diesel">Diesel</option>
                <option value="petrol">Essence</option>
                <option value="electric">Électrique</option>
                <option value="hybrid">Hybride</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="capacity"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Capacité (passagers) *
              </label>

              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
                min={1}
                className="input-primary w-full"
              />
            </div>
          </div>

          {/* Poids */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="weight_kg"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Poids (kg) *
              </label>

              <input
                type="number"
                id="weight_kg"
                name="weight_kg"
                value={formData.weight_kg}
                onChange={handleChange}
                required
                min={0}
                className="input-primary w-full"
                placeholder="Ex : 2000"
              />
            </div>
          </div>
        </div>

        {/* Informations techniques */}
        <div className="space-y-4">
          <h3 className="border-b pb-2 text-lg font-semibold text-gray-900">
            Informations techniques
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="chassis_number"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Numéro de châssis
              </label>

              <input
                type="text"
                id="chassis_number"
                name="chassis_number"
                value={formData.chassis_number}
                onChange={handleChange}
                className="input-primary w-full"
                placeholder="Ex : VF1234567890"
              />
            </div>

            <div>
              <label
                htmlFor="engine_number"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Numéro de moteur
              </label>

              <input
                type="text"
                id="engine_number"
                name="engine_number"
                value={formData.engine_number}
                onChange={handleChange}
                className="input-primary w-full"
                placeholder="Ex : ENG789012"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label
                htmlFor="insurance_policy"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Numéro d'assurance
              </label>

              <input
                type="text"
                id="insurance_policy"
                name="insurance_policy"
                value={formData.insurance_policy}
                onChange={handleChange}
                className="input-primary w-full"
                placeholder="Ex : INS-12345"
              />
            </div>

            <div>
              <label
                htmlFor="insurance_expiry"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Expiration assurance
              </label>

              <input
                type="date"
                id="insurance_expiry"
                name="insurance_expiry"
                value={formData.insurance_expiry}
                onChange={handleChange}
                className="input-primary w-full"
              />
            </div>

            <div>
              <label
                htmlFor="technical_control_expiry"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Expiration contrôle technique
              </label>

              <input
                type="date"
                id="technical_control_expiry"
                name="technical_control_expiry"
                value={formData.technical_control_expiry}
                onChange={handleChange}
                className="input-primary w-full"
              />
            </div>
          </div>
        </div>

        {/* Statut */}
        <div className="space-y-4">
          <h3 className="border-b pb-2 text-lg font-semibold text-gray-900">
            Statut et configuration
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="status"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Statut *
              </label>

              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="input-primary w-full"
              >
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="firmware_version"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Version firmware
              </label>

              <input
                type="text"
                id="firmware_version"
                name="firmware_version"
                value={formData.firmware_version}
                onChange={handleChange}
                className="input-primary w-full"
                placeholder="Ex : 1.0.0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="battery_level"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Niveau batterie (%)
              </label>

              <input
                type="number"
                id="battery_level"
                name="battery_level"
                value={formData.battery_level}
                onChange={handleChange}
                min={0}
                max={100}
                className="input-primary w-full"
              />
            </div>

            <div>
              <label
                htmlFor="signal_strength"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Force du signal
              </label>

              <input
                type="number"
                id="signal_strength"
                name="signal_strength"
                value={formData.signal_strength}
                onChange={handleChange}
                min={0}
                className="input-primary w-full"
              />
            </div>
          </div>

          {/* Véhicule actif */}
          <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-4">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />

            <label
              htmlFor="is_active"
              className="text-sm font-medium text-gray-700"
            >
              Véhicule actif
            </label>
          </div>
        </div>

        {/* Assignation */}
        {showOwnerField && (
          <div className="space-y-4">
            <h3 className="border-b pb-2 text-lg font-semibold text-gray-900">
              Assignation
            </h3>

            {/* Recherche utilisateur */}
            <div>
              <label
                htmlFor="user_search"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Rechercher un utilisateur
              </label>

              <div className="relative">
                <input
                  type="text"
                  id="user_search"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="input-primary w-full pl-10"
                  placeholder="Rechercher par nom, username ou email..."
                />

                <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Liste utilisateurs */}
            {loadingUsers ? (
              <div className="py-4 text-center">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-b-2 border-primary-600" />

                <p className="mt-2 text-sm text-gray-600">
                  Chargement...
                </p>
              </div>
            ) : (
              <div>
                <label
                  htmlFor="owner_id"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Sélectionner un propriétaire
                </label>

                <select
                  id="owner_id"
                  name="owner_id"
                  value={formData.owner_id ?? ""}
                  onChange={handleOwnerChange}
                  className="input-primary w-full"
                  size={Math.min(
                    Math.max(filteredUsers.length + 1, 2),
                    5
                  )}
                >
                  <option value="">-- Aucun --</option>

                  {filteredUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.first_name ?? ""}{" "}
                      {user.last_name ?? ""}
                      {user.username
                        ? ` (@${user.username})`
                        : ""}
                      {user.email ? ` - ${user.email}` : ""}
                    </option>
                  ))}
                </select>

                {filteredUsers.length === 0 && (
                  <p className="mt-2 text-sm text-gray-500">
                    Aucun utilisateur trouvé
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-4 sm:flex-row">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 btn-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading
              ? "Enregistrement..."
              : initialData
                ? "Mettre à jour"
                : "Ajouter le véhicule"}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 btn-secondary disabled:cursor-not-allowed disabled:opacity-50"
            >
              Annuler
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
