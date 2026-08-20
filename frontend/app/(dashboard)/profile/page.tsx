'use client';

import { useState, useEffect } from 'react';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  ShieldCheckIcon,
  CogIcon,
  CameraIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/lib/api';
import ErrorMessage from '@/components/common/ErrorMessage';

interface ProfileData {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: string;
  date_joined?: string;
  email_notifications?: boolean;
  sms_notifications?: boolean;
  push_notifications?: boolean;
}

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profile, setProfile] = useState<ProfileData>({
    id: 0,
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    role: '',
  });

  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    new_password_confirm: '',
  });

  const [preferences, setPreferences] = useState({
    email_notifications: true,
    sms_notifications: false,
    push_notifications: true,
  });

  // Charger les données du profil depuis l'API
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        setError(null);

        const userId = user?.id?.toString();
        if (!userId) {
          setProfile({
            id: 0,
            username: user?.username ?? '',
            email: user?.email ?? '',
            first_name: user?.first_name ?? '',
            last_name: user?.last_name ?? '',
            phone: user?.phone ?? '',
            role: user?.role ?? '',
            date_joined: user?.date_joined,
          });
          return;
        }

        const userData = await apiClient.getUser(userId);
        setProfile({
          id: userData.id ?? user.id,
          username: userData.username ?? user.username,
          email: userData.email ?? user.email,
          first_name: userData.first_name ?? '',
          last_name: userData.last_name ?? '',
          phone: userData.phone ?? '',
          role: userData.role ?? user.role ?? '',
          date_joined: userData.date_joined ?? user.date_joined,
          email_notifications: userData.email_notifications,
          sms_notifications: userData.sms_notifications,
          push_notifications: userData.push_notifications,
        });

        setPreferences({
          email_notifications: userData.email_notifications ?? true,
          sms_notifications: userData.sms_notifications ?? false,
          push_notifications: userData.push_notifications ?? true,
        });
      } catch (err) {
        setProfile({
          id: user.id,
          username: user.username,
          email: user.email,
          first_name: user.first_name ?? '',
          last_name: user.last_name ?? '',
          phone: user.phone ?? '',
          role: user.role ?? '',
          date_joined: user.date_joined,
        });
        setPreferences({
          email_notifications: true,
          sms_notifications: false,
          push_notifications: true,
        });
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const userId = profile.id?.toString();
      if (!userId) {
        throw new Error('Aucun identifiant utilisateur disponible');
      }
      
      const updatedUser = await apiClient.updateUser(userId, {
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        phone: profile.phone,
      });

      setProfile(updatedUser);
      updateUser(updatedUser);
      setIsEditing(false);
      setSuccess('Profil mis à jour avec succès');
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Erreur lors de la mise à jour du profil');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (passwordData.new_password !== passwordData.new_password_confirm) {
        setError('Les mots de passe ne correspondent pas');
        return;
      }

      await apiClient.changePassword(passwordData);
      
      setPasswordData({
        old_password: '',
        new_password: '',
        new_password_confirm: '',
      });
      
      setIsChangingPassword(false);
      setSuccess('Mot de passe modifié avec succès');
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du changement de mot de passe');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const userId = profile.id?.toString();
      if (!userId) {
        throw new Error('Aucun identifiant utilisateur disponible');
      }
      
      const updatedUser = await apiClient.updateUser(userId, {
        email_notifications: preferences.email_notifications,
        sms_notifications: preferences.sms_notifications,
        push_notifications: preferences.push_notifications,
      });

      setProfile(updatedUser);
      setSuccess('Préférences mises à jour avec succès');
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de la mise à jour des préférences';
      setError(errorMessage);
      console.error('Preferences update error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleDisplay = (role: string) => {
    const roles: { [key: string]: string } = {
      'owner': 'Propriétaire',
      'admin': 'Administrateur',
      'driver': 'Chauffeur',
      'viewer': 'Visualisateur',
    };
    return roles[role] || role;
  };

  if (isLoading && !profile.id) {
    return (
      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="card mb-6 p-6 lg:p-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Chargement...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8">
      <div className="mx-auto max-w-4xl">
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-800">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Fermer
            </button>
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-4 text-green-800">
            {success}
          </div>
        )}

        {/* Profile Header Card */}
        <div className="card mb-6 p-6 lg:p-8">
          <div className="flex items-start gap-6">
            <div className="relative flex-shrink-0">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-500 lg:h-24 lg:w-24">
                <span className="text-2xl font-bold text-white lg:text-3xl">
                  {(profile.first_name?.charAt(0) || profile.username?.charAt(0) || 'U').toUpperCase()}
                  {(profile.last_name?.charAt(0) || '').toUpperCase()}
                </span>
              </div>
              <button className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-gray-200 bg-white transition-colors hover:bg-gray-50 lg:h-8 lg:w-8">
                <CameraIcon className="h-3 w-3 text-gray-600 lg:h-4 lg:w-4" />
              </button>
            </div>

              <div className="min-w-0 flex-1">
               <h2 className="mb-1 text-xl font-bold text-gray-900 lg:text-2xl">
                 {profile.first_name} {profile.last_name}
               </h2>
               <p className="mb-3 text-sm text-gray-600 lg:mb-4 lg:text-base">{getRoleDisplay(profile.role)}</p>
               <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                 <span className="badge badge-info w-fit">{profile.username}</span>
                 <span className="text-xs text-gray-500 lg:text-sm">
                   Membre depuis {profile.date_joined ? new Date(profile.date_joined).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : 'N/A'}
                 </span>
               </div>
             </div>

            <div className="flex flex-shrink-0 items-center gap-2 lg:gap-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-primary flex w-full items-center justify-center gap-2 sm:w-auto"
                >
                  <CogIcon className="h-4 w-4 lg:h-5 lg:w-5" />
                  <span className="text-sm lg:text-base">Modifier</span>
                </button>
              ) : (
                <div className="flex w-full items-center gap-2 sm:w-auto">
                  <button 
                    onClick={handleSaveProfile} 
                    disabled={isLoading}
                    className="btn-primary flex-1 sm:flex-initial disabled:opacity-50"
                  >
                    {isLoading ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setError(null);
                    }}
                    disabled={isLoading}
                    className="btn-secondary flex-1 sm:flex-initial disabled:opacity-50"
                  >
                    Annuler
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
          {/* Personal Information */}
          <div className="card p-4 lg:col-span-2 lg:p-6">
            <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900 lg:mb-6 lg:text-lg">
              <UserIcon className="h-4 w-4 text-primary-600 lg:h-5 lg:w-5" />
              Informations Personnelles
            </h3>

            <div className="space-y-3 lg:space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700 lg:mb-2 lg:text-sm">
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={profile.first_name}
                    onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                    disabled={!isEditing}
                    className="input-primary text-sm lg:text-base disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700 lg:mb-2 lg:text-sm">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={profile.last_name}
                    onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                    disabled={!isEditing}
                    className="input-primary text-sm lg:text-base disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700 lg:mb-2 lg:text-sm">
                  <EnvelopeIcon className="mr-1 inline h-3 w-3 lg:mr-2 lg:h-4 lg:w-4" />
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  disabled
                  className="input-primary text-sm lg:text-base disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700 lg:mb-2 lg:text-sm">
                  <PhoneIcon className="mr-1 inline h-3 w-3 lg:mr-2 lg:h-4 lg:w-4" />
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={profile.phone || ''}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  disabled={!isEditing}
                  className="input-primary text-sm lg:text-base disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700 lg:mb-2 lg:text-sm">
                  Nom d'utilisateur
                </label>
                <input
                  type="text"
                  value={profile.username}
                  disabled
                  className="input-primary text-sm lg:text-base bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="space-y-4 lg:space-y-6">
            <div className="card p-4 lg:p-6">
              <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-900 lg:mb-4 lg:text-lg">
                <ShieldCheckIcon className="h-4 w-4 text-primary-600 lg:h-5 lg:w-5" />
                Sécurité
              </h3>
              <div className="space-y-2 lg:space-y-3">
                <button
                  onClick={() => setIsChangingPassword(!isChangingPassword)}
                  className="btn-secondary flex w-full items-center justify-between text-left text-sm lg:text-base"
                >
                  <span>Changer le mot de passe</span>
                  <span className="text-gray-400">→</span>
                </button>
              </div>
            </div>

            {/* Change Password Form */}
            {isChangingPassword && (
              <div className="card p-4 lg:p-6">
                <h3 className="mb-4 text-base font-semibold text-gray-900 lg:text-lg">
                  Nouveau mot de passe
                </h3>
                <div className="space-y-3 lg:space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700 lg:mb-2 lg:text-sm">
                      Ancien mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type={showOldPassword ? 'text' : 'password'}
                        value={passwordData.old_password}
                        onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                        className="input-primary text-sm lg:text-base pr-10"
                        placeholder="Ancien mot de passe"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                      >
                        {showOldPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700 lg:mb-2 lg:text-sm">
                      Nouveau mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordData.new_password}
                        onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                        className="input-primary text-sm lg:text-base pr-10"
                        placeholder="Nouveau mot de passe"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                      >
                        {showNewPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700 lg:mb-2 lg:text-sm">
                      Confirmer le mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwordData.new_password_confirm}
                        onChange={(e) => setPasswordData({ ...passwordData, new_password_confirm: e.target.value })}
                        className="input-primary text-sm lg:text-base pr-10"
                        placeholder="Confirmer le mot de passe"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                      >
                        {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleChangePassword}
                      disabled={isLoading}
                      className="btn-primary flex-1 disabled:opacity-50"
                    >
                      {isLoading ? 'Modification...' : 'Modifier'}
                    </button>
                    <button
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordData({
                          old_password: '',
                          new_password: '',
                          new_password_confirm: '',
                        });
                        setError(null);
                      }}
                      disabled={isLoading}
                      className="btn-secondary flex-1 disabled:opacity-50"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences */}
            <div className="card p-4 lg:p-6">
              <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-900 lg:mb-4 lg:text-lg">
                <CogIcon className="h-4 w-4 text-primary-600 lg:h-5 lg:w-5" />
                Préférences
              </h3>
              <div className="space-y-3 lg:space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-700 lg:text-sm">Notifications</span>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input 
                      type="checkbox" 
                      checked={preferences.push_notifications}
                      onChange={(e) => setPreferences({ ...preferences, push_notifications: e.target.checked })}
                      className="peer sr-only" 
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-600 peer-checked:after:translate-x-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-700 lg:text-sm">Emails</span>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input 
                      type="checkbox" 
                      checked={preferences.email_notifications}
                      onChange={(e) => setPreferences({ ...preferences, email_notifications: e.target.checked })}
                      className="peer sr-only" 
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-600 peer-checked:after:translate-x-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-700 lg:text-sm">SMS</span>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input 
                      type="checkbox" 
                      checked={preferences.sms_notifications}
                      onChange={(e) => setPreferences({ ...preferences, sms_notifications: e.target.checked })}
                      className="peer sr-only" 
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-600 peer-checked:after:translate-x-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300"></div>
                  </label>
                </div>
              </div>
              <button
                onClick={handleSavePreferences}
                disabled={isLoading}
                className="btn-primary mt-4 w-full disabled:opacity-50"
              >
                {isLoading ? 'Enregistrement...' : 'Enregistrer les préférences'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}