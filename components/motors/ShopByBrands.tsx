'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ShopByBrands() {
  const [hoveredBrand, setHoveredBrand] = useState<string | null>(null);

  const brands = [
    { name: 'Toyota', count: 12, logo: 'https://logo.clearbit.com/toyota.com' },
    { name: 'Mercedes', count: 8, logo: 'https://logo.clearbit.com/mercedes-benz.com' },
    { name: 'BMW', count: 6, logo: 'https://logo.clearbit.com/bmw.com' },
    { name: 'Nissan', count: 10, logo: 'https://logo.clearbit.com/nissan.com' },
    { name: 'Honda', count: 7, logo: 'https://logo.clearbit.com/honda.com' },
    { name: 'Audi', count: 5, logo: 'https://logo.clearbit.com/audi.com' },
    { name: 'Mazda', count: 4, logo: 'https://logo.clearbit.com/mazda.com' },
    { name: 'Subaru', count: 6, logo: 'https://logo.clearbit.com/subaru.com' },
    { name: 'Volkswagen', count: 5, logo: 'https://logo.clearbit.com/vw.com' },
    { name: 'Lexus', count: 3, logo: 'https://logo.clearbit.com/lexus.com' },
    { name: 'Land Rover', count: 4, logo: 'https://logo.clearbit.com/landrover.com' },
    { name: 'Jeep', count: 3, logo: 'https://logo.clearbit.com/jeep.com' },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Shop by <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-700 to-blue-500">Popular Brands</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse our extensive collection from the world's leading automotive manufacturers
          </p>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-12">
          {brands.map((brand, index) => (
            <button
              key={index}
              type="button"
              onMouseEnter={() => setHoveredBrand(brand.name)}
              onMouseLeave={() => setHoveredBrand(null)}
              className="group relative bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-[#a235c3] hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              {/* Brand Logo */}
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-20 h-20 relative bg-white rounded-xl p-3 border-2 border-gray-100 group-hover:border-[#a235c3] transition-colors">
                  <Image
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    fill
                    className="object-contain p-2"
                    onError={(e) => {
                      // Fallback to first letter if logo fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-[#2b404f] opacity-0 group-hover:opacity-10 transition-opacity">
                    {brand.name[0]}
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-gray-800 text-lg group-hover:text-[#a235c3] transition-colors">
                    {brand.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{brand.count} vehicles</p>
                </div>
              </div>

              {/* Hover Gradient Effect */}
              {hoveredBrand === brand.name && (
                <div className="absolute inset-0 bg-gradient-to-br from-[#a235c3]/5 to-[#2b404f]/5 rounded-2xl pointer-events-none" />
              )}
            </button>
          ))}
        </div>

        {/* All Brands Button */}
        <div className="text-center">
          <button
            type="button"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#a235c3] to-[#2b404f] text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transform hover:scale-105 transition-all"
          >
            <span>View All Brands</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Featured Brands Banner */}
        <div className="mt-16 bg-gradient-to-r from-[#f1eeeb] to-gray-50 rounded-2xl p-8 border-2 border-gray-200 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-[#2b404f] mb-2">Can't find your preferred brand?</h3>
              <p className="text-gray-600">Let us know what you're looking for and we'll help you find it!</p>
            </div>
            <a
              href="https://wa.me/254708149430?text=Hi, I'm looking for a specific car brand"
              className="bg-gradient-to-r from-[#a235c3] to-[#2b404f] text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transform hover:scale-105 transition-all whitespace-nowrap"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
