'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Car,
  MessageSquare,
  TrendingUp,
  Users,
  Plus,
  Search,
  Bell,
  LogOut,
  Menu,
  X,
  Eye,
  Edit,
  Trash2,
  ExternalLink
} from 'lucide-react';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Mock data
  const stats = [
    { title: 'Total Vehicles', value: '47', change: '+3 this week', icon: Car, color: 'bg-blue-500' },
    { title: 'New Inquiries', value: '12', change: '8 unread', icon: MessageSquare, color: 'bg-green-500' },
    { title: 'Page Views', value: '2,847', change: '+15% this month', icon: TrendingUp, color: 'bg-purple-500' },
    { title: 'Active Deals', value: '5', change: '2 expiring soon', icon: Users, color: 'bg-orange-500' },
  ];

  const recentVehicles = [
    { id: 1, make: 'Toyota', model: 'Camry 2022', price: 'KES 3,200,000', status: 'Available', image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=100&h=100&fit=crop' },
    { id: 2, make: 'Mercedes', model: 'C-Class 2023', price: 'KES 7,500,000', status: 'Available', image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=100&h=100&fit=crop' },
    { id: 3, make: 'Nissan', model: 'X-Trail 2021', price: 'KES 2,800,000', status: 'Reserved', image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=100&h=100&fit=crop' },
  ];

  const recentInquiries = [
    { id: 1, customer: 'John Kamau', vehicle: 'Toyota Camry 2022', time: '10 minutes ago', status: 'New' },
    { id: 2, customer: 'Sarah Wanjiku', vehicle: 'Mercedes C-Class', time: '1 hour ago', status: 'New' },
    { id: 3, customer: 'David Omondi', vehicle: 'General Inquiry', time: '3 hours ago', status: 'Contacted' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Badge */}
      {/* <div className="fixed top-4 right-4 bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-semibold shadow-lg z-50">
        🎬 DEMO MODE
      </div> */}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-[#2b404f] text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} z-40`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {sidebarOpen && (
            <div className="flex items-center space-x-2">
              <Image src="/logo-motors.png" alt="Logo" width={40} height={40} />
              <span className="font-bold text-lg">Admin</span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-700 rounded-lg">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center space-x-3 p-3 bg-[#a235c3] rounded-lg">
            <TrendingUp size={20} />
            {sidebarOpen && <span>Dashboard</span>}
          </Link>
          <Link href="/admin/vehicles" className="flex items-center space-x-3 p-3 hover:bg-gray-700 rounded-lg transition-colors">
            <Car size={20} />
            {sidebarOpen && <span>Vehicles</span>}
          </Link>
          <Link href="/admin/inquiries" className="flex items-center space-x-3 p-3 hover:bg-gray-700 rounded-lg transition-colors">
            <MessageSquare size={20} />
            {sidebarOpen && <span>Inquiries</span>}
            {sidebarOpen && <span className="ml-auto bg-red-500 text-xs px-2 py-1 rounded-full">8</span>}
          </Link>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
          <button className="flex items-center space-x-3 p-3 w-full hover:bg-gray-700 rounded-lg transition-colors">
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-sm text-gray-500">Welcome back, Admin</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">3</span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-[#a235c3] rounded-full flex items-center justify-center text-white font-semibold">
                  A
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-gray-800">Admin User</p>
                  <p className="text-gray-500">admin@mikkitrade.com</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="p-6">
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
                        <h3 className="font-semibold text-gray-800">{vehicle.make} {vehicle.model}</h3>
                        <p className="text-sm text-gray-500">{vehicle.price}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        vehicle.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {vehicle.status}
                      </span>
                      <div className="flex space-x-2">
                        <button className="p-2 hover:bg-gray-200 rounded-lg">
                          <Edit size={16} className="text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-200 rounded-lg">
                          <Eye size={16} className="text-gray-600" />
                        </button>
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
        </div>
      </div>
    </div>
  );
}
