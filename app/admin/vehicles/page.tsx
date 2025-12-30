'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  CarFront,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useVehicles } from '@/lib/hooks/useVehicles';

export default function VehiclesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPublished, setFilterPublished] = useState('all'); // 'all' | 'published' | 'draft'
  const [currentPage, setCurrentPage] = useState(1);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  // Build filters
  const filters = useMemo(() => {
    const f: any = {};
    if (searchTerm) f.search = searchTerm;
    // Only add status filter if not "all"
    if (filterStatus && filterStatus !== 'all') {
      f.status = filterStatus;
    }
    return f;
  }, [searchTerm, filterStatus]);

  // Fetch vehicles from database (include drafts for admin)
  const { vehicles: dbVehicles, loading, error, pagination, mutate } = useVehicles({
    filters,
    sorting: { sortBy: 'created_at', sortOrder: 'desc' },
    pagination: { page: currentPage, limit: 10 },
    includeDrafts: true, // Admin can see drafts
  });

  // Filter vehicles locally by published status after fetching
  const filteredByPublished = useMemo(() => {
    if (filterPublished === 'all') return dbVehicles;
    if (filterPublished === 'published') return dbVehicles.filter(v => v.is_published);
    if (filterPublished === 'draft') return dbVehicles.filter(v => !v.is_published);
    return dbVehicles;
  }, [dbVehicles, filterPublished]);

  // Calculate stats from filtered vehicles
  const totalVehicles = filteredByPublished.length;
  const availableCount = filteredByPublished.filter(v => v.status === 'available').length;
  const reservedCount = filteredByPublished.filter(v => v.status === 'reserved').length;
  const soldCount = filteredByPublished.filter(v => v.status === 'sold').length;
  const publishedCount = dbVehicles.filter(v => v.is_published).length;
  const draftCount = dbVehicles.filter(v => !v.is_published).length;

  // Map database vehicles to display format
  const vehicles = filteredByPublished.map(v => ({
    id: v.id,
    make: v.make || 'Unknown',
    model: v.model || 'Unknown',
    year: v.year || 2020,
    price: v.price || 0,
    status: v.status || 'available',
    views: v.views || 0,
    inquiries: v.inquiries || 0,
    isPublished: v.is_published || false,
    image: v.vehicle_images && v.vehicle_images.length > 0
      ? (v.vehicle_images.find(img => img.is_primary)?.url || v.vehicle_images[0]?.url)
      : 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=100&h=100&fit=crop',
  }));

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

  const handleQuickPublish = async (vehicleId: string, currentStatus: boolean) => {
    setPublishingId(vehicleId);
    try {
      const response = await fetch(`/api/vehicles/${vehicleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_published: !currentStatus,
        }),
      });

      if (!response.ok) throw new Error('Failed to update vehicle');

      // Refresh the vehicle list
      mutate();
    } catch (err) {
      alert('Failed to update publish status');
    } finally {
      setPublishingId(null);
    }
  };

  return (
    <AdminLayout title="Vehicle Management" subtitle="Manage your vehicle inventory">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2 text-[#a235c3]">
          <CarFront size={24} />
          <span className="text-lg font-semibold">All Vehicles</span>
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
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
              value={filterPublished}
              onChange={(e) => setFilterPublished(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a235c3] focus:border-transparent text-gray-900"
              aria-label="Filter by published status"
            >
              <option value="all">All Vehicles</option>
              <option value="published">Published Only</option>
              <option value="draft">Drafts Only</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a235c3] focus:border-transparent text-gray-900"
              aria-label="Filter by status"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold</option>
              <option value="coming_soon">Coming Soon</option>
            </select>
            <button type="button" className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2" title="More Filters">
              <Filter size={20} />
              <span>More Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Vehicles</p>
          <p className="text-2xl font-bold text-gray-800">{loading ? '...' : dbVehicles.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Published</p>
          <p className="text-2xl font-bold text-green-600">{loading ? '...' : publishedCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Drafts</p>
          <p className="text-2xl font-bold text-gray-600">{loading ? '...' : draftCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Available</p>
          <p className="text-2xl font-bold text-blue-600">{loading ? '...' : availableCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Reserved</p>
          <p className="text-2xl font-bold text-orange-600">{loading ? '...' : reservedCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Sold</p>
          <p className="text-2xl font-bold text-purple-600">{loading ? '...' : soldCount}</p>
        </div>
      </div>

      {/* Vehicle Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <p className="text-gray-500">Loading vehicles...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <p className="text-red-600">Error loading vehicles. Please try again.</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500">No vehicles found.</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Vehicle</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Year</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Published</th>
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
                          <p className="text-sm text-gray-500">ID: #{vehicle.id.substring(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{vehicle.year}</td>
                    <td className="px-6 py-4 font-semibold text-gray-800">{formatPrice(vehicle.price)}</td>
                    <td className="px-6 py-4">
                      {vehicle.isPublished ? (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 flex items-center gap-1 w-fit">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                          Published
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 flex items-center gap-1 w-fit">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                          Draft
                        </span>
                      )}
                    </td>
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
                        <Link href={`/admin/vehicles/preview/${vehicle.id}`} className="p-2 hover:bg-blue-50 rounded-lg transition-colors" title="Preview vehicle">
                          <Eye size={16} className="text-blue-600" />
                        </Link>
                        <button type="button" className="p-2 hover:bg-purple-50 rounded-lg transition-colors" title="Edit vehicle">
                          <Edit size={16} className="text-purple-600" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickPublish(vehicle.id, vehicle.isPublished)}
                          disabled={publishingId === vehicle.id}
                          className={`p-2 rounded-lg transition-colors ${
                            vehicle.isPublished
                              ? 'hover:bg-gray-50'
                              : 'hover:bg-green-50'
                          }`}
                          title={vehicle.isPublished ? 'Unpublish vehicle' : 'Publish vehicle'}
                        >
                          {publishingId === vehicle.id ? (
                            <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-[#a235c3] rounded-full" />
                          ) : vehicle.isPublished ? (
                            <XCircle size={16} className="text-gray-600" />
                          ) : (
                            <CheckCircle size={16} className="text-green-600" />
                          )}
                        </button>
                        <button type="button" className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Delete vehicle">
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
              <p className="text-sm text-gray-600">
                Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalVehicles)} of {totalVehicles} vehicles
              </p>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={!pagination?.hasPrevPage}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Previous page"
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>

                {pagination && [...Array(Math.min(pagination.totalPages, 5))].map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-lg ${currentPage === i + 1 ? 'bg-[#a235c3] text-white' : 'border border-gray-300 hover:bg-gray-50'}`}
                    title={`Page ${i + 1}`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={!pagination?.hasNextPage}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Next page"
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
