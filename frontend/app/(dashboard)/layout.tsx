'use client';

import { useState } from 'react';
import Sidebar from '@/components/common/Sidebar';
import Header from '@/components/common/Header';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white border-r border-gray-200 
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col overflow-hidden w-full">
          <Header 
            title="Tableau de bord" 
            subtitle="Gestion de votre flotte"
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          />
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
