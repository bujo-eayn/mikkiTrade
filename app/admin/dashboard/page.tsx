'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  CarFront,
  MessageSquare,
  TrendingUp,
  Users,
  Plus,
  Eye,
  Edit,
  ExternalLink
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useVehicles, useDealsVehicles } from '@/lib/hooks/useVehicles';
import { useDashboardStats } from '@/lib/hooks/useDashboardStats';
import { formatNumber } from '@/lib/utils/formatNumber';

export default function AdminDashboard() {
  // Fetch vehicles from database (include drafts for admin)
  const { vehicles: allVehicles, loading: vehiclesLoading } = useVehicles({
    pagination: { page: 1, limit: 3 },
    sorting: { sortBy: 'created_at', sortOrder: 'desc' },
    includeDrafts: true, // Admin can see drafts
  });

  const { vehicles: dealVehicles } = useDealsVehicles(10);
  const { stats: dashboardStats, loading: statsLoading } = useDashboardStats();

  // Calculate stats from real data
  const stats = [
    {
      title: 'Total Vehicles',
      value: statsLoading ? '...' : formatNumber(dashboardStats?.totalVehicles || 0),
      change: statsLoading ? '...' : `+${dashboardStats?.addedThisWeek || 0} this week`,
      icon: CarFront,
      color: 'bg-blue-500'
    },
    {
      title: 'New Inquiries',
      value: '12',
      change: '8 unread',
      icon: MessageSquare,
      color: 'bg-green-500'
    },
    {
      title: 'Page Views',
      value: formatNumber(2847),
      change: '+15% this month',
      icon: TrendingUp,
      color: 'bg-purple-500'
    },
    {
      title: 'Active Deals',
      value: statsLoading ? '...' : formatNumber(dashboardStats?.dealsCount || 0),
      change: '2 expiring soon',
      icon: Users,
      color: 'bg-orange-500'
    },
  ];

  // Map recent vehicles from database
  const recentVehicles = allVehicles.map(v => ({
    id: v.id,
    make: v.make,
    model: `${v.model} ${v.year}`,
    price: `KES ${v.price.toLocaleString()}`,
    status: v.status === 'available' ? 'Available' : v.status === 'reserved' ? 'Reserved' : v.status === 'sold' ? 'Sold' : 'Coming Soon',
    isPublished: v.is_published || false,
    image: v.vehicle_images && v.vehicle_images.length > 0
      ? (v.vehicle_images.find(img => img.is_primary)?.url || v.vehicle_images[0]?.url)
      : 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=100&h=100&fit=crop',
  }));

  // Mock inquiries (will be replaced when inquiries API is ready)
  const recentInquiries = [
    { id: 1, customer: 'John Kamau', vehicle: 'Toyota Camry 2022', time: '10 minutes ago', status: 'New' },
    { id: 2, customer: 'Sarah Wanjiku', vehicle: 'Mercedes C-Class', time: '1 hour ago', status: 'New' },
    { id: 3, customer: 'David Omondi', vehicle: 'General Inquiry', time: '3 hours ago', status: 'Contacted' },
  ];

  return (
    <AdminLayout title="Dashboard" subtitle="Welcome back, Admin">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <stat.icon className="text-white" size={24} />
                  </div>
                </div>
                <h3 className="text-gray-500 text-sm mb-1">{stat.title}</h3>
                <p className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.change}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-[#a235c3] to-[#2b404f] rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-white">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/admin/vehicles/new" className="bg-white rounded-xl p-6 flex items-center space-x-4 hover:shadow-lg transform hover:scale-105 transition-all group">
                <div className="bg-gradient-to-r from-[#a235c3] to-[#2b404f] p-3 rounded-lg">
                  <Plus className="text-white" size={24} />
                </div>
                <span className="font-semibold text-gray-800 group-hover:text-[#a235c3] transition-colors">Add New Vehicle</span>
              </Link>
              <Link href="/admin/inquiries" className="bg-white rounded-xl p-6 flex items-center space-x-4 hover:shadow-lg transform hover:scale-105 transition-all group">
                <div className="bg-gradient-to-r from-[#a235c3] to-[#2b404f] p-3 rounded-lg">
                  <MessageSquare className="text-white" size={24} />
                </div>
                <span className="font-semibold text-gray-800 group-hover:text-[#a235c3] transition-colors">View Inquiries</span>
              </Link>
              <a href="/mikki-trade-motors" target="_blank" className="bg-white rounded-xl p-6 flex items-center space-x-4 hover:shadow-lg transform hover:scale-105 transition-all group">
                <div className="bg-gradient-to-r from-[#a235c3] to-[#2b404f] p-3 rounded-lg">
                  <ExternalLink className="text-white" size={24} />
                </div>
                <span className="font-semibold text-gray-800 group-hover:text-[#a235c3] transition-colors">View Public Site</span>
              </a>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Vehicles */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-800">Recent Vehicles</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {recentVehicles.map((vehicle) => (
                  <div key={vehicle.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <Image
                        src={vehicle.image}
                        alt={vehicle.model}
                        width={60}
                        height={60}
                        className="rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-800">{vehicle.make} {vehicle.model}</h3>
                          {vehicle.isPublished ? (
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                              Published
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                              Draft
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{vehicle.price}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        vehicle.status === 'Available' ? 'bg-blue-100 text-blue-800' :
                        vehicle.status === 'Reserved' ? 'bg-orange-100 text-orange-800' :
                        vehicle.status === 'Sold' ? 'bg-gray-100 text-gray-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {vehicle.status}
                      </span>
                      <div className="flex space-x-2">
                        <button type="button" className="p-2 hover:bg-gray-200 rounded-lg" title="Edit vehicle">
                          <Edit size={16} className="text-gray-600" />
                        </button>
                        <Link href={`/admin/vehicles/preview/${vehicle.id}`} className="p-2 hover:bg-gray-200 rounded-lg" title="Preview vehicle">
                          <Eye size={16} className="text-gray-600" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-gray-200">
                <Link href="/admin/vehicles" className="text-[#a235c3] hover:text-[#8b2da3] font-semibold text-sm">
                  View All Vehicles →
                </Link>
              </div>
            </div>

            {/* Recent Inquiries */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-800">Recent Inquiries</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {recentInquiries.map((inquiry) => (
                  <div key={inquiry.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{inquiry.customer}</h3>
                        <p className="text-sm text-gray-600 mt-1">{inquiry.vehicle}</p>
                        <p className="text-xs text-gray-400 mt-1">{inquiry.time}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        inquiry.status === 'New' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {inquiry.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-gray-200">
                <Link href="/admin/inquiries" className="text-[#a235c3] hover:text-[#8b2da3] font-semibold text-sm">
                  View All Inquiries →
                </Link>
              </div>
            </div>
          </div>
    </AdminLayout>
  );
}
