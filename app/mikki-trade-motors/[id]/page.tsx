'use client';

import { use, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/motors/Navbar';
// import Footer from '@/components/Footer';
import {
  Calendar,
  Gauge,
  Fuel,
  Settings,
  CarFront,
  Palette,
  MapPin,
  Heart,
  Share2,
  Phone,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import useSWR from 'swr';
import { formatNumber, formatCurrency } from '@/lib/utils/formatNumber';

interface VehicleImage {
  id: string;
  url: string;
  alt_text: string;
  is_primary: boolean;
  display_order: number;
}

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  body_type: string;
  transmission: string;
  fuel_type: string;
  color: string;
  description: string;
  location: string;
  status: string;
  features: string[];
  vehicle_images: VehicleImage[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function VehicleDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const { data: vehicle, error, isLoading } = useSWR<Vehicle>(
    `/api/vehicles/${id}`,
    fetcher
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a235c3]"></div>
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Vehicle Not Found</h1>
            <p className="text-gray-600 mb-8">The vehicle you're looking for doesn't exist or has been removed.</p>
            <Link
              href="/mikki-trade-motors"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#a235c3] text-white rounded-lg hover:bg-[#8b2da3] transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Inventory
            </Link>
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    );
  }

  const images = vehicle.vehicle_images?.sort((a, b) => a.display_order - b.display_order) || [];
  const currentImage = images[selectedImageIndex] || {
    url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop',
    alt_text: `${vehicle.make} ${vehicle.model}`
  };

  const specs = [
    { icon: Calendar, label: 'Year', value: vehicle.year },
    { icon: Gauge, label: 'Mileage', value: `${formatNumber(vehicle.mileage)} km` },
    { icon: Fuel, label: 'Fuel Type', value: vehicle.fuel_type },
    { icon: Settings, label: 'Transmission', value: vehicle.transmission },
    { icon: CarFront, label: 'Body Type', value: vehicle.body_type },
    { icon: Palette, label: 'Color', value: vehicle.color },
    { icon: MapPin, label: 'Location', value: vehicle.location || 'Nairobi, Kenya' },
  ];

  const whatsappNumber = '254708149430';
  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model} (${formatCurrency(vehicle.price)})`
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/mikki-trade-motors"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#a235c3] mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Inventory
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden bg-white shadow-lg mb-4">
              <div className="relative h-[500px]">
                <Image
                  src={currentImage.url}
                  alt={currentImage.alt_text}
                  fill
                  className="object-cover"
                  priority
                />
                {vehicle.status === 'sold' && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">SOLD</span>
                  </div>
                )}
              </div>

              {/* Image Navigation */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === selectedImageIndex
                          ? 'bg-white w-8'
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {images.slice(0, 5).map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative h-24 rounded-lg overflow-hidden border-2 transition-all ${
                      index === selectedImageIndex
                        ? 'border-[#a235c3]'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt_text}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Vehicle Details */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Vehicle Details</h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {specs.map((spec, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="p-2 bg-[#a235c3]/10 rounded-lg">
                      <spec.icon className="text-[#a235c3]" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{spec.label}</p>
                      <p className="font-semibold text-gray-800">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {vehicle.description || 'No description available.'}
              </p>
            </div>

            {/* Features */}
            {vehicle.features && vehicle.features.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {vehicle.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="text-green-500" size={20} />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Price & Contact */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {vehicle.make} {vehicle.model}
                </h1>
                <p className="text-4xl font-bold text-[#a235c3]">
                  {formatCurrency(vehicle.price)}
                </p>
                <span className={`inline-block mt-3 px-3 py-1 rounded-full text-sm font-semibold ${
                  vehicle.status === 'available' ? 'bg-green-100 text-green-800' :
                  vehicle.status === 'reserved' ? 'bg-orange-100 text-orange-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-lg hover:bg-[#20ba5a] transition-colors font-semibold shadow-md transform hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  WhatsApp Us
                </a>

                <a
                  href={`tel:+${whatsappNumber}`}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md"
                >
                  <Phone size={20} />
                  Call Now
                </a>

                <button
                  onClick={() => setIsSaved(!isSaved)}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-colors font-semibold ${
                    isSaved
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Heart size={20} fill={isSaved ? 'currentColor' : 'none'} />
                  {isSaved ? 'Saved' : 'Save Vehicle'}
                </button>

                <button
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                >
                  <Share2 size={20} />
                  Share
                </button>
              </div>

              {/* Contact Info */}
              <div className="border-t pt-6 space-y-3">
                <h3 className="font-bold text-gray-800 mb-3">Contact Information</h3>
                <a
                  href={`tel:+${whatsappNumber}`}
                  className="flex items-center gap-3 text-gray-600 hover:text-[#a235c3] transition-colors"
                >
                  <Phone size={18} />
                  <span>+254 708 149 430</span>
                </a>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-600 hover:text-[#25D366] transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <Footer /> */}
    </div>
  );
}
