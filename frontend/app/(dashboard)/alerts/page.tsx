'use client';

import { useState } from 'react';
import { 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { useAlerts, useAlertStats } from '@/hooks/useApi';
import apiClient from '@/lib/api';

interface Alert {
  id: number;
  type: string;
  severity: string;
  status: string;
  title: string;
  message: string;
  vehicle_registration: string;
  vehicle_brand: string;
  vehicle_model: string;
  detected_at: string;
  is_read: boolean;
}

export default function AlertsPage() {
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');
  const { data: alerts, loading, error, refetch } = useAlerts();
  const { data: alertStats } = useAlertStats();

  const getAlertIcon = (severity: string) => {
    const icons = {
      critical: XCircleIcon,
      high: ExclamationTriangleIcon,
      medium: ExclamationTriangleIcon,
      low: InformationCircleIcon,
    };
    const colors = {
      critical: 'text-red-600 bg-red-100',
      high: 'text-orange-600 bg-orange-100',
      medium: 'text-yellow-600 bg-yellow-100',
      low: 'text-blue-600 bg-blue-100',
    };
    const Icon = icons[severity as keyof typeof icons] || InformationCircleIcon;
    return <Icon className={`w-6 h-6 ${colors[severity as keyof typeof colors] || colors.low}`} />;
  };

  const getAlertBorder = (severity: string) => {
    const borders = {
      critical: 'border-l-red-500',
      high: 'border-l-orange-500',
      medium: 'border-l-yellow-500',
      low: 'border-l-blue-500',
    };
    return borders[severity as keyof typeof borders] || 'border-l-gray-500';
  };

  const filteredAlerts = (alerts || []).filter((alert: any) => {
    if (filter === 'unread') return !alert.is_read;
    if (filter === 'critical') return alert.severity === 'critical';
    return true;
  });

  const unreadCount = (alerts || []).filter((a: any) => !a.is_read).length;
  const criticalCount = (alerts || []).filter((a: any) => a.severity === 'critical').length;

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Il y a moins d\'une heure';
    if (hours < 24) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleAcknowledge = async (id: number) => {
    try {
      await apiClient.acknowledgeAlert(id.toString());
      refetch();
    } catch (err) {
      console.error('Error acknowledging alert:', err);
    }
  };

  const handleResolve = async (id: number) => {
    try {
      await apiClient.resolveAlert(id.toString());
      refetch();
    } catch (err) {
      console.error('Error resolving alert:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Chargement des alertes...</div>
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
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Alertes</h2>
        <p className="text-sm lg:text-base text-gray-600 mt-1">
          {unreadCount} alerte{unreadCount > 1 ? 's' : ''} non lue{unreadCount > 1 ? 's' : ''}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto ${
            filter === 'all'
              ? 'bg-primary-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Toutes ({alerts?.length || 0})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto ${
            filter === 'unread'
              ? 'bg-primary-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Non lues ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('critical')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto ${
            filter === 'critical'
              ? 'bg-primary-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Critiques ({criticalCount})
        </button>
      </div>

      {/* Alerts List */}
      <div className="space-y-3 lg:space-y-4">
        {filteredAlerts.map((alert: any) => (
          <div
            key={alert.id}
            className={`card p-4 lg:p-6 border-l-4 ${getAlertBorder(alert.severity)} ${
              !alert.is_read ? 'bg-blue-50/30' : ''
            } hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                {getAlertIcon(alert.severity)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                      {alert.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {alert.message}
                    </p>
                    {alert.vehicle_registration && (
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Véhicule:</span> {alert.vehicle_brand} {alert.vehicle_model} - {alert.vehicle_registration}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      {formatTimestamp(alert.detected_at)}
                    </p>
                  </div>
                  
                   <div className="flex items-center gap-2 flex-shrink-0">
                     {!alert.is_read && (
                       <button 
                         onClick={() => handleAcknowledge(alert.id)}
                         className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                         title="Marquer comme lu"
                       >
                         <CheckCircleIcon className="w-5 h-5" />
                       </button>
                     )}
                     {alert.status !== 'resolved' && (
                       <button
                         onClick={() => handleResolve(alert.id)}
                         className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                         title="Résoudre"
                       >
                         <CheckCircleIcon className="w-5 h-5" />
                       </button>
                     )}
                   </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="text-center py-12">
          <InformationCircleIcon className="w-12 h-12 lg:w-16 lg:h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aucune alerte à afficher</p>
        </div>
      )}
    </div>
  );
}