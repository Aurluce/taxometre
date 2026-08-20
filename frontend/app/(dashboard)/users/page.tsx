'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  phone: string;
  is_active: boolean;
  is_verified: boolean;
  company_name: string;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await apiClient.getUsers();
      // Handle both paginated and non-paginated responses
      const usersArray = Array.isArray(data) ? data : (data as any).results || [];
      setUsers(usersArray);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (userId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    try {
      await apiClient.deleteUser(userId.toString());
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const handleToggleStatus = async (userId: number, currentStatus: boolean) => {
    try {
      await apiClient.updateUser(userId.toString(), { is_active: !currentStatus });
      setUsers(users.map(u => 
        u.id === userId ? { ...u, is_active: !currentStatus } : u
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const getRoleLabel = (role: string) => {
    const roles: { [key: string]: string } = {
      'owner': 'Propriétaire',
      'admin': 'Administrateur',
      'driver': 'Chauffeur',
      'viewer': 'Visualisateur',
    };
    return roles[role] || role;
  };

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: string } = {
      'owner': 'bg-purple-100 text-purple-800',
      'admin': 'bg-red-100 text-red-800',
      'driver': 'bg-blue-100 text-blue-800',
      'viewer': 'bg-gray-100 text-gray-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8">
      {/* Page Header */}
      <div className="mb-6 lg:mb-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Gestion des utilisateurs</h2>
        <p className="text-sm lg:text-base text-gray-600 mt-1">
          {users.length} utilisateur{users.length > 1 ? 's' : ''} au total
        </p>
      </div>

      {/* Actions */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-auto">
          <p className="text-sm lg:text-base text-gray-600">
            {users.length} utilisateur{users.length > 1 ? 's' : ''} au total
          </p>
        </div>
        <button
          onClick={() => {
            setEditingUser(null);
            setShowForm(true);
          }}
          className="btn-primary w-full sm:w-auto"
        >
          + Nouvel utilisateur
        </button>
      </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm lg:text-base">
            {error}
          </div>
        )}

        {/* User Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {editingUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingUser(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <UserForm
                  user={editingUser}
                  onClose={() => {
                    setShowForm(false);
                    setEditingUser(null);
                  }}
                  onSuccess={() => {
                    fetchUsers();
                    setShowForm(false);
                    setEditingUser(null);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Users List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-gray-600">Chargement...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="card p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun utilisateur</h3>
            <p className="text-gray-600">Commencez par créer un nouvel utilisateur</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {users.map((user) => (
              <div key={user.id} className="card p-4 lg:p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3 lg:mb-4">
                  <div className="flex items-center gap-2 lg:gap-3">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-700 font-bold text-base lg:text-lg">
                        {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm lg:text-base truncate">
                        {user.first_name} {user.last_name}
                      </h3>
                      <p className="text-xs lg:text-sm text-gray-500">@{user.username}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ${getRoleColor(user.role)}`}>
                    {getRoleLabel(user.role)}
                  </span>
                </div>

                <div className="space-y-2 mb-3 lg:mb-4">
                  <div className="flex items-center gap-2 text-xs lg:text-sm">
                    <svg className="w-3 h-3 lg:w-4 lg:h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-600 truncate">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-2 text-xs lg:text-sm">
                      <svg className="w-3 h-3 lg:w-4 lg:h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-gray-600">{user.phone}</span>
                    </div>
                  )}
                  {user.company_name && (
                    <div className="flex items-center gap-2 text-xs lg:text-sm">
                      <svg className="w-3 h-3 lg:w-4 lg:h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="text-gray-600 truncate">{user.company_name}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-3 lg:mb-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.is_active ? 'Actif' : 'Inactif'}
                  </span>
                  {user.is_verified && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      Vérifié
                    </span>
                  )}
                </div>

                {user.role !== 'admin' && (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => {
                        setEditingUser(user);
                        setShowForm(true);
                      }}
                      className="flex-1 btn-secondary text-xs lg:text-sm py-2"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleToggleStatus(user.id, user.is_active)}
                      className={`flex-1 text-xs lg:text-sm px-3 py-2 rounded-lg font-medium ${
                        user.is_active
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {user.is_active ? 'Désactiver' : 'Activer'}
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-xs lg:text-sm"
                    >
                      <svg className="w-4 h-4 mx-auto sm:mx-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
                {user.role === 'admin' && (
                  <div className="text-xs text-gray-500 text-center py-2">
                    Administrateur - Actions restreintes
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
  );
}

// User Form Component
function UserForm({ user, onClose, onSuccess }: { user: User | null; onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    role: user?.role || 'owner',
    phone: user?.phone || '',
    company_name: user?.company_name || '',
    password: '',
    password_confirm: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user && formData.password !== formData.password_confirm) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (!user && !formData.password) {
      setError('Le mot de passe est requis');
      return;
    }

    setIsLoading(true);

    try {
      const dataToSend: any = { 
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        role: formData.role,
        phone: formData.phone,
        company_name: formData.company_name,
      };
      
      if (!formData.password) {
        // Update mode - don't send password
        delete dataToSend.password;
        delete dataToSend.password_confirm;
      } else {
        // Create mode - send password
        dataToSend.password = formData.password;
        dataToSend.password_confirm = formData.password_confirm;
      }

      if (user) {
        await apiClient.updateUser(user.id.toString(), dataToSend);
      } else {
        await apiClient.createUser(dataToSend);
      }

      onSuccess();
    } catch (err: any) {
      // Extract detailed error message from backend response
      let errorMessage = 'Une erreur est survenue';
      
      if (err.message) {
        errorMessage = err.message;
      }
      
      // Log full error for debugging
      console.error('User creation/update error:', err);
      if (err.data) {
        console.error('Error data:', err.data);
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom d'utilisateur *
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
            className="input-primary"
            disabled={!!user}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="input-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prénom
          </label>
          <input
            type="text"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            className="input-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom
          </label>
          <input
            type="text"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            className="input-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rôle *
          </label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            required
            className="input-primary"
          >
            <option value="owner">Propriétaire</option>
            <option value="admin">Administrateur</option>
            <option value="driver">Chauffeur</option>
            <option value="viewer">Visualisateur</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Téléphone
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="input-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Entreprise
        </label>
        <input
          type="text"
          value={formData.company_name}
          onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
          className="input-primary"
        />
      </div>

      {!user && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe *
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="input-primary"
              minLength={8}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmer le mot de passe *
            </label>
            <input
              type="password"
              value={formData.password_confirm}
              onChange={(e) => setFormData({ ...formData, password_confirm: e.target.value })}
              required
              className="input-primary"
              minLength={8}
            />
          </div>
        </>
      )}

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 btn-primary"
        >
          {isLoading ? 'Enregistrement...' : user ? 'Mettre à jour' : 'Créer l\'utilisateur'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 btn-secondary"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}