'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Phone } from 'lucide-react';

interface FeaturedVehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  oldPrice?: number;
  image: string;
  tagline?: string;
  badge?: string;
}

interface HeroCarouselProps {
  vehicles: FeaturedVehicle[];
  autoPlayInterval?: number;
}

export default function HeroCarousel({
  vehicles,
  autoPlayInterval = 5000
}: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [imageError, setImageError] = useState<{ [key: number]: boolean }>({});

  // Fallback image for hero carousel
  const getFallbackImage = (vehicleName: string) =>
    `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080' viewBox='0 0 1920 1080'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%232b404f;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23a235c3;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23grad)' width='1920' height='1080'/%3E%3Cg transform='translate(660,390)'%3E%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='300' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='0.5' stroke-linecap='round' stroke-linejoin='round' opacity='0.3'%3E%3Cpath d='M18 18H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2Z'/%3E%3Cpath d='M9 16c0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2'/%3E%3Cpath d='M8 10h.01'/%3E%3Cpath d='M16 10h.01'/%3E%3Cpath d='M6 18v2'/%3E%3Cpath d='M18 18v2'/%3E%3C/svg%3E%3C/g%3E%3Ctext x='960' y='600' text-anchor='middle' fill='white' font-family='system-ui' font-size='40' font-weight='600'%3E${encodeURIComponent(vehicleName)}%3C/text%3E%3C/svg%3E`;

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === vehicles.length - 1 ? 0 : prevIndex + 1
    );
  }, [vehicles.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? vehicles.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!isAutoPlaying || vehicles.length <= 1) return;

    const interval = setInterval(() => {
      goToNext();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isAutoPlaying, autoPlayInterval, goToNext, vehicles.length]);

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const whatsappNumber = '254708149430';

  if (vehicles.length === 0) {
    return null;
  }

  const currentVehicle = vehicles[currentIndex];
  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in the ${currentVehicle.year} ${currentVehicle.make} ${currentVehicle.model} (${formatPrice(currentVehicle.price)})`
  );

  return (
    <div
      className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden bg-gray-900"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Slides */}
      <div className="relative w-full h-full">
        {vehicles.map((vehicle, index) => (
          <div
            key={vehicle.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
              <Image
                src={imageError[index] ? getFallbackImage(`${vehicle.make} ${vehicle.model}`) : vehicle.image}
                alt={`${vehicle.make} ${vehicle.model}`}
                fill
                className="object-cover"
                priority={index === 0}
                onError={() => setImageError({ ...imageError, [index]: true })}
                unoptimized={imageError[index]}
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
              <div className="container mx-auto px-4 md:px-8 lg:px-16">
                <div className="max-w-2xl">
                  {/* Badge */}
                  {vehicle.badge && (
                    <div className="mb-4 inline-block">
                      <span className="bg-gradient-to-r from-[#a235c3] to-[#2b404f] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        {vehicle.badge}
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                    {vehicle.year} {vehicle.make}
                    <br />
                    <span className="bg-gradient-to-r from-[#a235c3] to-[#2b404f] bg-clip-text text-transparent">
                      {vehicle.model}
                    </span>
                  </h2>

                  {/* Tagline */}
                  {vehicle.tagline && (
                    <p className="text-xl md:text-2xl text-gray-200 mb-6">
                      {vehicle.tagline}
                    </p>
                  )}

                  {/* Price */}
                  <div className="mb-8">
                    {vehicle.oldPrice && (
                      <div className="text-xl text-gray-400 line-through mb-2">
                        {formatPrice(vehicle.oldPrice)}
                      </div>
                    )}
                    <div className="text-4xl md:text-5xl font-bold text-white">
                      {formatPrice(vehicle.price)}
                    </div>
                    {vehicle.oldPrice && (
                      <div className="text-sm text-green-400 font-semibold mt-2">
                        Save {formatPrice(vehicle.oldPrice - vehicle.price)}!
                      </div>
                    )}
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-wrap gap-4">
                    <a
                      href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-[#25D366] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#20ba5a] transform hover:scale-105 transition-all shadow-xl"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      Contact on WhatsApp
                    </a>

                    <a
                      href={`tel:+${whatsappNumber}`}
                      className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white border-2 border-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/30 transform hover:scale-105 transition-all"
                    >
                      <Phone size={24} />
                      Call Now
                    </a>

                    <Link
                      href={`/mikki-trade-motors/${vehicle.id}`}
                      className="flex items-center gap-2 bg-gradient-to-r from-[#a235c3] to-[#2b404f] text-white px-8 py-4 rounded-lg font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {vehicles.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 md:p-4 rounded-full transition-all transform hover:scale-110 border border-white/30"
            aria-label="Previous vehicle"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 md:p-4 rounded-full transition-all transform hover:scale-110 border border-white/30"
            aria-label="Next vehicle"
          >
            <ChevronRight size={28} />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {vehicles.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {vehicles.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all rounded-full ${
                index === currentIndex
                  ? 'w-12 h-3 bg-white'
                  : 'w-3 h-3 bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Auto-play Indicator */}
      {vehicles.length > 1 && (
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-white/30 transition-colors border border-white/30"
          >
            {isAutoPlaying ? 'Auto-playing' : 'Paused'}
          </button>
        </div>
      )}
    </div>
  );
}
