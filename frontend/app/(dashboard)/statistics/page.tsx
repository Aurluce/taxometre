'use client';

import { 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  ClockIcon,
  MapIcon
} from '@heroicons/react/24/outline';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Mock data for charts
const monthlyData = [
  { month: 'Jan', trips: 65, revenue: 4500, fuel: 1200 },
  { month: 'Fév', trips: 78, revenue: 5200, fuel: 1400 },
  { month: 'Mar', trips: 90, revenue: 6100, fuel: 1600 },
  { month: 'Avr', trips: 81, revenue: 5800, fuel: 1500 },
  { month: 'Mai', trips: 95, revenue: 6800, fuel: 1700 },
  { month: 'Juin', trips: 110, revenue: 7500, fuel: 1900 },
];

const vehicleUsageData = [
  { name: 'Toyota Corolla', value: 35, color: '#0f3b5c' },
  { name: 'Honda Civic', value: 25, color: '#4a7c9c' },
  { name: 'Nissan Sentra', value: 20, color: '#75a5c3' },
  { name: 'Hyundai Elantra', value: 20, color: '#a3c3d7' },
];

const stats = [
  {
    title: 'Revenu Total',
    value: '45,250€',
    icon: CurrencyDollarIcon,
    trend: { value: 15, isPositive: true },
    color: 'success' as const,
  },
  {
    title: 'Trajets ce Mois',
    value: '156',
    icon: MapIcon,
    trend: { value: 8, isPositive: true },
    color: 'primary' as const,
  },
  {
    title: 'Temps Moyen',
    value: '2.5h',
    icon: ClockIcon,
    trend: { value: 5, isPositive: false },
    color: 'warning' as const,
  },
  {
    title: 'Efficacité',
    value: '87%',
    icon: ChartBarIcon,
    trend: { value: 3, isPositive: true },
    color: 'secondary' as const,
  },
];

export default function StatisticsPage() {
  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8">
      {/* Page Header */}
      <div className="mb-6 lg:mb-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Statistiques</h2>
        <p className="text-sm lg:text-base text-gray-600 mt-1">Analyse des performances de votre flotte</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="card p-6 hover:scale-105 transition-transform duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                {stat.trend && (
                  <div className="flex items-center gap-1 mt-2">
                    <span
                      className={`text-sm font-medium ${
                        stat.trend.isPositive ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {stat.trend.isPositive ? '↑' : '↓'} {Math.abs(stat.trend.value)}%
                    </span>
                    <span className="text-sm text-gray-500">vs mois dernier</span>
                  </div>
                )}
              </div>
              <div className={`w-14 h-14 rounded-xl ${
                stat.color === 'success' ? 'bg-green-500 text-white' :
                stat.color === 'primary' ? 'bg-primary-500 text-white' :
                stat.color === 'warning' ? 'bg-yellow-500 text-white' :
                'bg-secondary-500 text-white'
              } flex items-center justify-center`}>
                <stat.icon className="w-8 h-8" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {/* Revenue & Trips Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Évolution des Revenus et Trajets
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#0f3b5c" 
                strokeWidth={2}
                name="Revenus (€)"
              />
              <Line 
                type="monotone" 
                dataKey="trips" 
                stroke="#4a7c9c" 
                strokeWidth={2}
                name="Trajets"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Consommation Moyenne */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Consommation Moyenne
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="fuel" fill="#0f3b5c" name="Consommation de carburant" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Vehicle Usage Distribution */}
      <div className="card p-4 lg:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Répartition d'Utilisation des Véhicules
        </h3>
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={vehicleUsageData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {vehicleUsageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 space-y-3">
            {vehicleUsageData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-gray-900">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-700">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
