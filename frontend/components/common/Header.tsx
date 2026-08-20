'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BellIcon, MagnifyingGlassIcon, Bars3Icon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Dropdown from './Dropdown';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export default function Header({ title, subtitle, onMenuClick }: HeaderProps) {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();
  
  const notifications: Notification[] = [
    {
      id: 1,
      title: 'Nouvelle alerte',
      message: 'Véhicule ABC-123 nécessite un entretien',
      time: 'Il y a 5 min',
      read: false
    },
    {
      id: 2,
      title: 'Trajet terminé',
      message: 'Trajet #456 complété avec succès',
      time: 'Il y a 1 heure',
      read: false
    },
    {
      id: 3,
      title: 'Maintenance programmée',
      message: 'Rappel: Maintenance du véhicule XYZ-789',
      time: 'Il y a 3 heures',
      read: true
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Left section */}
        <div className="flex items-center gap-4 flex-1">
          {/* Mobile menu button */}
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <Bars3Icon className="w-6 h-6 text-gray-700" />
          </button>
          
          <div className="min-w-0">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 truncate">{title}</h1>
            {subtitle && (
              <p className="text-xs lg:text-sm text-gray-500 mt-0.5 truncate">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Mobile search toggle */}
          <button 
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MagnifyingGlassIcon className="w-6 h-6 text-gray-700" />
          </button>

          {/* Search - Desktop */}
          <div className="hidden md:flex items-center relative">
            <MagnifyingGlassIcon className="absolute left-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                       w-48 lg:w-64 transition-all duration-200"
            />
          </div>

          {/* Mobile search bar */}
          {showMobileSearch && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 p-4 z-40">
              <div className="flex items-center relative">
                <MagnifyingGlassIcon className="absolute left-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  autoFocus
                  className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                           w-full"
                />
              </div>
            </div>
          )}

          {/* Notifications Dropdown */}
          <Dropdown
            trigger={
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <BellIcon className="w-6 h-6 text-gray-700" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
                    {unreadCount}
                  </span>
                )}
              </button>
            }
          >
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
              <p className="text-xs text-gray-500 mt-0.5">{unreadCount} non lue(s)</p>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      !notification.read ? 'bg-blue-500' : 'bg-gray-300'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                      <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4 py-2 border-t border-gray-200">
              <button className="text-sm text-primary-500 hover:text-primary-600 font-medium w-full text-center">
                Voir toutes les notifications
              </button>
            </div>
          </Dropdown>

          {/* User Dropdown */}
          <Dropdown
            trigger={
              <button className="flex items-center gap-2 lg:gap-3 p-1 lg:p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-xs lg:text-sm">
                    {user?.first_name?.[0]}{user?.last_name?.[0]}
                  </span>
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
                <ChevronDownIcon className="hidden lg:block w-4 h-4 text-gray-500" />
              </button>
            }
          >

            <div className="py-1">
              <a href="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Mon Profil</span>
              </a>
              <a href="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Paramètres</span>
              </a>
              <div className="border-t border-gray-200 my-1"></div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Déconnexion</span>
              </button>
            </div>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}