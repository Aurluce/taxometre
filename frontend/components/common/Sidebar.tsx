'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Squares2X2Icon,
  TruckIcon,
  PlusCircleIcon,
  ChartBarIcon,
  BellIcon,
  UserIcon,
  UserGroupIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  onClose?: () => void;
}

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Squares2X2Icon },
  { href: '/vehicles', label: 'Véhicules', icon: TruckIcon },
  { href: '/vehicles-new', label: 'Nouveau Véhicule', icon: PlusCircleIcon },
  { href: '/users', label: 'Utilisateurs', icon: UserGroupIcon },
  { href: '/statistics', label: 'Statistiques', icon: ChartBarIcon },
  { href: '/alerts', label: 'Alertes', icon: BellIcon },
  { href: '/profile', label: 'Profil', icon: UserIcon },
];

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const getRoleDisplay = (role: string) => {
    const roles: { [key: string]: string } = {
      'owner': 'Propriétaire',
      'admin': 'Administrateur',
      'driver': 'Chauffeur',
      'viewer': 'Visualisateur',
    };
    return roles[role] || role;
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <TruckIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary-500">TaxoMètre</h1>
              <p className="text-xs text-gray-500">Gestion de flotte</p>
            </div>
          </Link>
          {/* Mobile close button */}
          <button 
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      {user && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-sm">
                {user.first_name?.[0]}{user.last_name?.[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {getRoleDisplay(user.role)}
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      )}
    </aside>
  );
}
