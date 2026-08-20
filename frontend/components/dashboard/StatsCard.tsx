'use client';

import { type ComponentType } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend,
  color = 'primary' 
}: StatsCardProps) {
  const colorClasses = {
    primary: 'bg-primary-500 text-white',
    secondary: 'bg-secondary-500 text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
    danger: 'bg-red-500 text-white',
  };

  return (
    <div className="card p-6 hover:scale-105 transition-transform duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-sm text-gray-500">vs mois dernier</span>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 rounded-xl ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
}