'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Phone, ChevronLeft, ChevronRight } from 'lucide-react';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  oldPrice?: number;
  mileage: string;
  transmission: string;
  fuelType: string;
  images: string[];
  badges?: ('NEW' | 'HOT DEAL' | 'LIMITED')[];
  location?: string;
  isSaved?: boolean;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  viewMode?: 'grid' | 'list';
  onSaveToggle?: (id: string) => void;
}

export default function VehicleCard({
  vehicle,
  viewMode = 'grid',
  onSaveToggle
}: VehicleCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(vehicle.isSaved || false);
  const [imageError, setImageError] = useState(false);

  // Fallback image SVG data URL
  const fallbackImage = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect fill='%23f3f4f6' width='800' height='600'/%3E%3Cg transform='translate(250,200)'%3E%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M18 18H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2Z'/%3E%3Cpath d='M9 16c0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2'/%3E%3Cpath d='M8 10h.01'/%3E%3Cpath d='M16 10h.01'/%3E%3Cpath d='M6 18v2'/%3E%3Cpath d='M18 18v2'/%3E%3C/svg%3E%3C/g%3E%3Ctext x='400' y='400' text-anchor='middle' fill='%239ca3af' font-family='system-ui' font-size='20'%3E${vehicle.make} ${vehicle.model}%3C/text%3E%3C/svg%3E`;

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? vehicle.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === vehicle.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
    onSaveToggle?.(vehicle.id);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const badgeStyles = {
    NEW: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white',
    'HOT DEAL': 'bg-gradient-to-r from-red-500 to-orange-600 text-white',
    LIMITED: 'bg-gradient-to-r from-[#a235c3] to-[#2b404f] text-white',
  };

  const whatsappNumber = '254708149430';
  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model} (${formatPrice(vehicle.price)})`
  );

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Image Gallery - List Mode */}
          <div className="relative w-full md:w-80 h-64 md:h-auto flex-shrink-0">
            <div className="relative w-full h-full">
              <Image
                src={imageError ? fallbackImage : vehicle.images[currentImageIndex]}
                alt={`${vehicle.make} ${vehicle.model}`}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
                unoptimized={imageError}
              />

              {/* Navigation Arrows */}
              {vehicle.images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Image Indicators */}
              {vehicle.images.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {vehicle.images.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 rounded-full transition-all ${
                        index === currentImageIndex
                          ? 'w-6 bg-white'
                          : 'w-1.5 bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Badges */}
              {vehicle.badges && vehicle.badges.length > 0 && (
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {vehicle.badges.map((badge) => (
                    <span
                      key={badge}
                      className={`${badgeStyles[badge]} px-3 py-1 rounded-full text-xs font-bold shadow-lg`}
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              )}

              {/* Save Button */}
              <button
                onClick={handleSaveToggle}
                className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-lg transition-all transform hover:scale-110"
                aria-label={isSaved ? 'Remove from saved' : 'Save vehicle'}
              >
                <Heart
                  size={20}
                  className={isSaved ? 'fill-red-500 stroke-red-500' : 'stroke-gray-700'}
                />
              </button>
            </div>
          </div>

          {/* Details - List Mode */}
          <div className="flex-1 p-6">
            <div className="flex flex-col h-full">
              {/* Title */}
              <Link href={`/mikki-trade-motors/${vehicle.id}`}>
                <h3 className="text-2xl font-bold text-gray-900 hover:text-[#a235c3] transition-colors mb-2">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h3>
              </Link>

              {/* Specs */}
              <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Year:</span>
                  <span>{vehicle.year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Mileage:</span>
                  <span>{vehicle.mileage}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Transmission:</span>
                  <span>{vehicle.transmission}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Fuel:</span>
                  <span>{vehicle.fuelType}</span>
                </div>
                {vehicle.location && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Location:</span>
                    <span>{vehicle.location}</span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="mb-4">
                {vehicle.oldPrice && (
                  <span className="text-lg text-gray-400 line-through mr-3">
                    {formatPrice(vehicle.oldPrice)}
                  </span>
                )}
                <span className="text-3xl font-bold bg-gradient-to-r from-[#a235c3] to-[#2b404f] bg-clip-text text-transparent">
                  {formatPrice(vehicle.price)}
                </span>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 mt-auto">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#20ba5a] transform hover:scale-105 transition-all shadow-md"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  WhatsApp
                </a>

                <a
                  href={`tel:+${whatsappNumber}`}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all shadow-md"
                >
                  <Phone size={20} />
                  Call
                </a>

                <Link
                  href={`/mikki-trade-motors/${vehicle.id}`}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#a235c3] to-[#2b404f] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid Mode (Default)
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Image Gallery - Grid Mode */}
      <div className="relative h-56 sm:h-64 overflow-hidden">
        <div className="relative w-full h-full">
          <Image
            src={imageError ? fallbackImage : vehicle.images[currentImageIndex]}
            alt={`${vehicle.make} ${vehicle.model}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageError(true)}
            unoptimized={imageError}
          />

          {/* Navigation Arrows - Visible on hover */}
          {vehicle.images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Image Indicators */}
          {vehicle.images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {vehicle.images.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentImageIndex
                      ? 'w-6 bg-white'
                      : 'w-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Badges */}
          {vehicle.badges && vehicle.badges.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {vehicle.badges.map((badge) => (
                <span
                  key={badge}
                  className={`${badgeStyles[badge]} px-3 py-1 rounded-full text-xs font-bold shadow-lg`}
                >
                  {badge}
                </span>
              ))}
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={handleSaveToggle}
            className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-lg transition-all transform hover:scale-110"
            aria-label={isSaved ? 'Remove from saved' : 'Save vehicle'}
          >
            <Heart
              size={20}
              className={isSaved ? 'fill-red-500 stroke-red-500' : 'stroke-gray-700'}
            />
          </button>
        </div>
      </div>

      {/* Details - Grid Mode */}
      <div className="p-5">
        {/* Title */}
        <Link href={`/mikki-trade-motors/${vehicle.id}`}>
          <h3 className="text-xl font-bold text-gray-900 hover:text-[#a235c3] transition-colors mb-3 line-clamp-1">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
        </Link>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-600">
          <div>
            <span className="font-semibold">Mileage:</span> {vehicle.mileage}
          </div>
          <div>
            <span className="font-semibold">Transmission:</span> {vehicle.transmission}
          </div>
          <div>
            <span className="font-semibold">Fuel:</span> {vehicle.fuelType}
          </div>
          {vehicle.location && (
            <div className="col-span-2">
              <span className="font-semibold">Location:</span> {vehicle.location}
            </div>
          )}
        </div>

        {/* Price */}
        <div className="mb-4">
          {vehicle.oldPrice && (
            <div className="text-sm text-gray-400 line-through">
              {formatPrice(vehicle.oldPrice)}
            </div>
          )}
          <div className="text-2xl font-bold bg-gradient-to-r from-[#a235c3] to-[#2b404f] bg-clip-text text-transparent">
            {formatPrice(vehicle.price)}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-2">
          <a
            href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-[#20ba5a] transform hover:scale-105 transition-all shadow-md w-full"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            WhatsApp
          </a>

          <div className="flex gap-2">
            <a
              href={`tel:+${whatsappNumber}`}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-all flex-1"
            >
              <Phone size={18} />
              Call
            </a>

            <Link
              href={`/mikki-trade-motors/${vehicle.id}`}
              className="flex items-center justify-center bg-gradient-to-r from-[#a235c3] to-[#2b404f] text-white px-4 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all flex-1"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
