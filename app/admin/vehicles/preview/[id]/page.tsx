'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Eye,
  CheckCircle,
  XCircle,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  Palette,
  CarFront,
  Tag,
  FileText,
  Sparkles
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import type { Database } from '@/lib/database.types';

type Vehicle = Database['public']['Tables']['vehicles']['Row'] & {
  vehicle_images?: Database['public']['Tables']['vehicle_images']['Row'][];
};

export default function VehiclePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const vehicleId = params.id as string;

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    async function fetchVehicle() {
      try {
        const response = await fetch(`/api/vehicles/${vehicleId}?includeUnpublished=true`);
        if (!response.ok) {
          throw new Error('Failed to fetch vehicle');
        }
        const data = await response.json();
        setVehicle(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load vehicle');
      } finally {
        setLoading(false);
      }
    }

    if (vehicleId) {
      fetchVehicle();
    }
  }, [vehicleId]);

  const handlePublishToggle = async () => {
    if (!vehicle) return;

    try {
      const response = await fetch(`/api/vehicles/${vehicleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_published: !vehicle.is_published,
        }),
      });

      if (!response.ok) throw new Error('Failed to update vehicle');

      const updated = await response.json();
      setVehicle(updated);
    } catch (err) {
      alert('Failed to update publish status');
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Preview Vehicle" subtitle="Loading vehicle preview...">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-500">Loading preview...</div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !vehicle) {
    return (
      <AdminLayout title="Preview Vehicle" subtitle="Error loading vehicle">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-red-600">{error || 'Vehicle not found'}</div>
        </div>
      </AdminLayout>
    );
  }

  const images = vehicle.vehicle_images && vehicle.vehicle_images.length > 0
    ? vehicle.vehicle_images
        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
        .map(img => img.url)
    : ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1200&h=800&fit=crop'];

  const formatPrice = (price: number) => {
    return `KES ${(price / 1000000).toFixed(1)}M`;
  };

  const getStatusBadge = (status: string) => {
    const config = {
      available: { label: 'Available', className: 'bg-green-100 text-green-800' },
      sold: { label: 'Sold', className: 'bg-gray-100 text-gray-800' },
      reserved: { label: 'Reserved', className: 'bg-orange-100 text-orange-800' },
      coming_soon: { label: 'Coming Soon', className: 'bg-blue-100 text-blue-800' },
    };
    return config[status as keyof typeof config] || config.available;
  };

  return (
    <AdminLayout
      title="Preview Vehicle"
      subtitle={`${vehicle.make} ${vehicle.model} ${vehicle.year}`}
    >
      {/* Action Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <Link
            href="/admin/vehicles"
            className="flex items-center space-x-2 text-gray-600 hover:text-[#a235c3] transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Vehicles</span>
          </Link>

          <div className="flex items-center space-x-4">
            {/* Published Status Indicator */}
            <div className="flex items-center space-x-2">
              {vehicle.is_published ? (
                <>
                  <CheckCircle size={20} className="text-green-600" />
                  <span className="text-sm font-semibold text-green-600">Published</span>
                </>
              ) : (
                <>
                  <XCircle size={20} className="text-gray-600" />
                  <span className="text-sm font-semibold text-gray-600">Draft</span>
                </>
              )}
            </div>

            {/* Publish/Unpublish Button */}
            <button
              type="button"
              onClick={handlePublishToggle}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                vehicle.is_published
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-gradient-to-r from-[#a235c3] to-[#2b404f] text-white hover:shadow-lg'
              }`}
            >
              {vehicle.is_published ? 'Unpublish' : 'Publish Now'}
            </button>

            {/* Edit Button */}
            <Link
              href={`/admin/vehicles/${vehicleId}/edit`}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Edit Vehicle
            </Link>
          </div>
        </div>
      </div>

      {/* Preview Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-start space-x-3">
          <Eye className="text-blue-600 mt-1" size={20} />
          <div>
            <h3 className="font-semibold text-blue-900">Preview Mode</h3>
            <p className="text-sm text-blue-700 mt-1">
              This is how your vehicle will appear on the public Motors page.
              {!vehicle.is_published && " This vehicle is currently a draft and not visible to the public."}
            </p>
          </div>
        </div>
      </div>

      {/* Vehicle Detail Preview - Mimics Public Page */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Image Gallery */}
        <div className="relative h-[500px] bg-gray-900">
          <Image
            src={images[currentImageIndex]}
            alt={`${vehicle.make} ${vehicle.model}`}
            fill
            className="object-cover"
            priority
          />

          {/* Image Navigation */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentImageIndex
                      ? 'bg-white w-8'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <span className={`px-4 py-2 rounded-full text-sm font-bold capitalize ${getStatusBadge(vehicle.status ?? 'available').className}`}>
              {getStatusBadge(vehicle.status ?? 'available').label}
            </span>
          </div>

          {/* Featured Badge */}
          {vehicle.featured && (
            <div className="absolute top-4 left-4">
              <span className="px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-[#a235c3] to-[#2b404f] text-white flex items-center space-x-1">
                <Sparkles size={16} />
                <span>Featured</span>
              </span>
            </div>
          )}

          {/* Deal Badge */}
          {vehicle.on_deal && (
            <div className="absolute bottom-20 left-4">
              <span className="px-4 py-2 rounded-full text-sm font-bold bg-red-600 text-white">
                Special Deal!
              </span>
            </div>
          )}
        </div>

        {/* Vehicle Info */}
        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {vehicle.make} {vehicle.model}
              </h1>
              <p className="text-xl text-gray-600">{vehicle.year}</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-[#a235c3]">
                {formatPrice(vehicle.price)}
              </p>
            </div>
          </div>

          {/* Key Specs Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 p-6 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <Calendar className="text-[#a235c3]" size={24} />
              <div>
                <p className="text-xs text-gray-500">Year</p>
                <p className="font-semibold text-gray-900">{vehicle.year}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Gauge className="text-[#a235c3]" size={24} />
              <div>
                <p className="text-xs text-gray-500">Mileage</p>
                <p className="font-semibold text-gray-900">{vehicle.mileage?.toLocaleString()} km</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Fuel className="text-[#a235c3]" size={24} />
              <div>
                <p className="text-xs text-gray-500">Fuel Type</p>
                <p className="font-semibold text-gray-900">{vehicle.fuel_type}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Settings className="text-[#a235c3]" size={24} />
              <div>
                <p className="text-xs text-gray-500">Transmission</p>
                <p className="font-semibold text-gray-900">{vehicle.transmission}</p>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center space-x-3">
              <CarFront className="text-gray-400" size={20} />
              <div>
                <p className="text-xs text-gray-500">Body Type</p>
                <p className="font-semibold text-gray-900">{vehicle.body_type}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Palette className="text-gray-400" size={20} />
              <div>
                <p className="text-xs text-gray-500">Color</p>
                <p className="font-semibold text-gray-900">{vehicle.color}</p>
              </div>
            </div>
            {vehicle.tags && vehicle.tags.length > 0 && (
              <div className="flex items-center space-x-3">
                <Tag className="text-gray-400" size={20} />
                <div className="flex flex-wrap gap-2">
                  {vehicle.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {vehicle.description && (
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="text-[#a235c3]" size={24} />
                <h2 className="text-2xl font-bold text-gray-900">Description</h2>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {vehicle.description}
              </p>
            </div>
          )}

          {/* Features */}
          {vehicle.features && vehicle.features.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle className="text-[#a235c3]" size={24} />
                <h2 className="text-2xl font-bold text-gray-900">Features</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {vehicle.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact CTA */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="bg-gradient-to-r from-[#a235c3] to-[#2b404f] rounded-xl p-8 text-center text-white">
              <h3 className="text-2xl font-bold mb-2">Interested in this vehicle?</h3>
              <p className="mb-6">Contact us today to schedule a test drive or get more information.</p>
              <button
                type="button"
                className="bg-white text-[#a235c3] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Card Preview Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">How it looks in the grid</h2>
        <p className="text-gray-600 mb-6">This is how your vehicle will appear in the Motors page grid view:</p>

        <div className="max-w-sm">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="relative h-64">
              <Image
                src={images[0]}
                alt={`${vehicle.make} ${vehicle.model}`}
                fill
                className="object-cover"
              />
              {vehicle.featured && (
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-gradient-to-r from-[#a235c3] to-[#2b404f] text-white text-xs font-bold rounded-full">
                    Featured
                  </span>
                </div>
              )}
              {vehicle.on_deal && (
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
                    Deal
                  </span>
                </div>
              )}
              <div className="absolute bottom-3 right-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(vehicle.status ?? 'available').className}`}>
                  {getStatusBadge(vehicle.status ?? 'available').label}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {vehicle.make} {vehicle.model}
              </h3>
              <p className="text-gray-600 mb-4">{vehicle.year} • {vehicle.mileage?.toLocaleString()} km</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-[#a235c3]">
                  {formatPrice(vehicle.price)}
                </span>
                <button
                  type="button"
                  className="bg-gradient-to-r from-[#a235c3] to-[#2b404f] text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
