'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Car,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function VehiclesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock vehicle data
  const vehicles = [
    { id: 1, make: 'Toyota', model: 'Camry', year: 2022, price: 3200000, status: 'available', views: 245, inquiries: 12, image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=100&h=100&fit=crop' },
    { id: 2, make: 'Mercedes', model: 'C-Class', year: 2023, price: 7500000, status: 'available', views: 389, inquiries: 28, image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=100&h=100&fit=crop' },
    { id: 3, make: 'Nissan', model: 'X-Trail', year: 2021, price: 2800000, status: 'reserved', views: 156, inquiries: 8, image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=100&h=100&fit=crop' },
    { id: 4, make: 'BMW', model: 'X5', year: 2023, price: 9500000, status: 'available', views: 512, inquiries: 35, image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=100&h=100&fit=crop' },
    { id: 5, make: 'Honda', model: 'CR-V', year: 2022, price: 3500000, status: 'sold', views: 178, inquiries: 6, image: 'https://images.unsplash.com/photo-1580414057228-ba2cd5940524?w=100&h=100&fit=crop' },
    { id: 6, make: 'Audi', model: 'A4', year: 2023, price: 6800000, status: 'available', views: 298, inquiries: 19, image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=100&h=100&fit=crop' },
    { id: 7, make: 'Subaru', model: 'Outback', year: 2022, price: 4200000, status: 'coming_soon', views: 89, inquiries: 3, image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=100&h=100&fit=crop' },
    { id: 8, make: 'Mazda', model: 'CX-5', year: 2021, price: 3100000, status: 'available', views: 234, inquiries: 15, image: 'https://images.unsplash.com/photo-1607603750916-71c8d58c5cd1?w=100&h=100&fit=crop' },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      available: 'bg-green-100 text-green-800',
      sold: 'bg-gray-100 text-gray-800',
      reserved: 'bg-orange-100 text-orange-800',
      coming_soon: 'bg-blue-100 text-blue-800',
    };
    return styles[status as keyof typeof styles] || styles.available;
  };

  const formatPrice = (price: number) => {
    return `KES ${(price / 1000000).toFixed(1)}M`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Badge */}
      {/* <div className="fixed top-4 right-4 bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-semibold shadow-lg z-50">
        🎬 DEMO MODE
      </div> */}

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <Car className="mr-3" size={28} />
                Vehicle Management
              </h1>
              <p className="text-sm text-gray-500 mt-1">Manage your vehicle inventory</p>
            </div>
            <Link
              href="/admin/vehicles/new"
              className="bg-gradient-to-r from-[#a235c3] to-[#2b404f] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add New Vehicle</span>
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by make, model, or year..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a235c3] focus:border-transparent text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a235c3] focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
                <option value="coming_soon">Coming Soon</option>
              </select>
              <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                <Filter size={20} />
                <span>More Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Total Vehicles</p>
            <p className="text-2xl font-bold text-gray-800">47</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Available</p>
            <p className="text-2xl font-bold text-green-600">38</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Reserved</p>
            <p className="text-2xl font-bold text-orange-600">4</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Sold</p>
            <p className="text-2xl font-bold text-gray-600">5</p>
          </div>
        </div>
      </div>

      {/* Vehicle Table */}
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Vehicle</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Year</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Views</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Inquiries</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <Image
                        src={vehicle.image}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        width={60}
                        height={60}
                        className="rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">{vehicle.make} {vehicle.model}</p>
                        <p className="text-sm text-gray-500">ID: #{vehicle.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{vehicle.year}</td>
                  <td className="px-6 py-4 font-semibold text-gray-800">{formatPrice(vehicle.price)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadge(vehicle.status)}`}>
                      {vehicle.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{vehicle.views}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                      {vehicle.inquiries}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                        <Eye size={16} className="text-blue-600" />
                      </button>
                      <button className="p-2 hover:bg-purple-50 rounded-lg transition-colors" title="Edit">
                        <Edit size={16} className="text-purple-600" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">Showing 1 to 8 of 47 vehicles</p>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                <ChevronLeft size={16} />
                <span>Previous</span>
              </button>
              <button className="px-4 py-2 bg-[#a235c3] text-white rounded-lg">1</button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">2</button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">3</button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="mt-6">
          <Link href="/admin/dashboard" className="text-[#a235c3] hover:text-[#8b2da3] font-semibold flex items-center space-x-2">
            <ChevronLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
