'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/motors/Navbar';
import QuickFilters from '@/components/motors/QuickFilters';
import FilterPanel, { VehicleFilters } from '@/components/motors/FilterPanel';
import HeroCarousel from '@/components/motors/HeroCarousel';
import VehicleCard from '@/components/motors/VehicleCard';
import WhyUs from '@/components/motors/WhyUs';
import { mockVehicles, getFeaturedVehicles, Vehicle } from '@/lib/mockVehicles';

interface QuickFilter {
  id: string;
  label: string;
  value: string;
  category: 'price' | 'year' | 'brand' | 'bodyType' | 'transmission' | 'fuelType';
}

export default function MikkiTradeMotorsPage() {
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeQuickFilters, setActiveQuickFilters] = useState<QuickFilter[]>([]);
  const [detailedFilters, setDetailedFilters] = useState<VehicleFilters | null>(null);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>(mockVehicles);
  const [savedVehicles, setSavedVehicles] = useState<Set<string>>(new Set());

  // Featured vehicles for hero carousel
  const featuredVehicles = getFeaturedVehicles().map(v => ({
    id: v.id,
    make: v.make,
    model: v.model,
    year: v.year,
    price: v.price,
    oldPrice: v.oldPrice,
    image: v.images[0],
    tagline: v.tagline,
    badge: v.badges?.[0],
  }));

  // Filter and sort vehicles
  useEffect(() => {
    let filtered = [...mockVehicles];

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        v =>
          v.make.toLowerCase().includes(query) ||
          v.model.toLowerCase().includes(query) ||
          `${v.year}`.includes(query)
      );
    }

    // Apply quick filters
    activeQuickFilters.forEach(filter => {
      switch (filter.category) {
        case 'price':
          if (filter.value.startsWith('<')) {
            const max = parseInt(filter.value.substring(1));
            filtered = filtered.filter(v => v.price < max);
          } else if (filter.value.startsWith('>')) {
            const min = parseInt(filter.value.substring(1));
            filtered = filtered.filter(v => v.price > min);
          } else if (filter.value.includes('-')) {
            const [min, max] = filter.value.split('-').map(n => parseInt(n));
            filtered = filtered.filter(v => v.price >= min && v.price <= max);
          }
          break;
        case 'year':
          filtered = filtered.filter(v => v.year === parseInt(filter.value));
          break;
        case 'brand':
          filtered = filtered.filter(v => v.make === filter.value);
          break;
        case 'bodyType':
          filtered = filtered.filter(v => v.bodyType === filter.value);
          break;
        case 'transmission':
          filtered = filtered.filter(v => v.transmission === filter.value);
          break;
        case 'fuelType':
          filtered = filtered.filter(v => v.fuelType === filter.value);
          break;
      }
    });

    // Apply detailed filters
    if (detailedFilters) {
      // Price range
      if (detailedFilters.priceRange.min > 0 || detailedFilters.priceRange.max < 20000000) {
        filtered = filtered.filter(
          v =>
            v.price >= detailedFilters.priceRange.min &&
            v.price <= detailedFilters.priceRange.max
        );
      }

      // Year range
      if (detailedFilters.yearRange.min > 2000 || detailedFilters.yearRange.max < 2025) {
        filtered = filtered.filter(
          v =>
            v.year >= detailedFilters.yearRange.min &&
            v.year <= detailedFilters.yearRange.max
        );
      }

      // Mileage range
      if (detailedFilters.mileageRange.min > 0 || detailedFilters.mileageRange.max < 200000) {
        const mileageInKm = (v: Vehicle) => {
          const match = v.mileage.match(/[\d,]+/);
          return match ? parseInt(match[0].replace(/,/g, '')) : 0;
        };
        filtered = filtered.filter(
          v =>
            mileageInKm(v) >= detailedFilters.mileageRange.min &&
            mileageInKm(v) <= detailedFilters.mileageRange.max
        );
      }

      // Multi-select filters
      if (detailedFilters.brands.length > 0) {
        filtered = filtered.filter(v => detailedFilters.brands.includes(v.make));
      }
      if (detailedFilters.bodyTypes.length > 0) {
        filtered = filtered.filter(v => detailedFilters.bodyTypes.includes(v.bodyType));
      }
      if (detailedFilters.transmissions.length > 0) {
        filtered = filtered.filter(v => detailedFilters.transmissions.includes(v.transmission));
      }
      if (detailedFilters.fuelTypes.length > 0) {
        filtered = filtered.filter(v => detailedFilters.fuelTypes.includes(v.fuelType));
      }
      if (detailedFilters.colors.length > 0) {
        filtered = filtered.filter(v => detailedFilters.colors.includes(v.color));
      }
      if (detailedFilters.condition.length > 0) {
        filtered = filtered.filter(v => detailedFilters.condition.includes(v.condition));
      }
      if (detailedFilters.features.length > 0) {
        filtered = filtered.filter(v =>
          detailedFilters.features.some(feature => v.features.includes(feature))
        );
      }
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => b.year - a.year || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'year-new':
        filtered.sort((a, b) => b.year - a.year);
        break;
      case 'year-old':
        filtered.sort((a, b) => a.year - b.year);
        break;
      case 'mileage':
        filtered.sort((a, b) => {
          const getMileage = (v: Vehicle) => {
            const match = v.mileage.match(/[\d,]+/);
            return match ? parseInt(match[0].replace(/,/g, '')) : 0;
          };
          return getMileage(a) - getMileage(b);
        });
        break;
    }

    setFilteredVehicles(filtered);
  }, [searchQuery, sortBy, activeQuickFilters, detailedFilters]);

  const handleQuickFilterSelect = (filter: QuickFilter) => {
    setActiveQuickFilters(prev => {
      const exists = prev.find(f => f.id === filter.id);
      if (exists) {
        return prev.filter(f => f.id !== filter.id);
      } else {
        // Remove other filters of the same category for single-select categories
        if (['transmission', 'fuelType'].includes(filter.category)) {
          return [...prev.filter(f => f.category !== filter.category), filter];
        }
        return [...prev, filter];
      }
    });
  };

  const handleClearAllQuickFilters = () => {
    setActiveQuickFilters([]);
  };

  const handleSaveToggle = (id: string) => {
    setSavedVehicles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const activeFilterCount =
    activeQuickFilters.length +
    (detailedFilters ? Object.values(detailedFilters).filter((v: any) =>
      Array.isArray(v) ? v.length > 0 : false
    ).length : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar
        onFilterClick={() => setIsFilterPanelOpen(true)}
        onSearchChange={setSearchQuery}
        onSortChange={setSortBy}
        onViewChange={setViewMode}
        activeFiltersCount={activeFilterCount}
      />

      {/* Hero Carousel - Featured Vehicles */}
      <div className="mt-16 md:mt-20">
        <HeroCarousel vehicles={featuredVehicles} autoPlayInterval={6000} />
      </div>

      {/* Quick Filters */}
      <QuickFilters
        onFilterSelect={handleQuickFilterSelect}
        activeFilters={activeQuickFilters}
        onClearAll={handleClearAllQuickFilters}
      />

      {/* Main Content - Vehicle Grid */}
      <div className="container mx-auto px-4 md:px-8 py-8">
        {/* Results Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Available Vehicles
            </h1>
            <p className="text-gray-600">
              Showing {filteredVehicles.length} of {mockVehicles.length} vehicles
              {searchQuery && (
                <span className="font-semibold"> matching "{searchQuery}"</span>
              )}
            </p>
          </div>

          {/* Desktop Sort (mobile sort is in navbar) */}
          <div className="hidden md:block mt-4 md:mt-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a235c3] focus:border-transparent bg-white text-gray-900"
              aria-label="Sort vehicles by"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="year-new">Year: Newest</option>
              <option value="year-old">Year: Oldest</option>
              <option value="mileage">Mileage: Low to High</option>
            </select>
          </div>
        </div>

        {/* No Results Message */}
        {filteredVehicles.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🚗</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No vehicles found
            </h2>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or search query
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveQuickFilters([]);
                setDetailedFilters(null);
              }}
              className="px-6 py-3 bg-gradient-to-r from-[#a235c3] to-[#2b404f] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Vehicle Grid/List */}
        {filteredVehicles.length > 0 && (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'flex flex-col gap-6'
            }
          >
            {filteredVehicles.map(vehicle => (
              <VehicleCard
                key={vehicle.id}
                vehicle={{
                  ...vehicle,
                  isSaved: savedVehicles.has(vehicle.id),
                }}
                viewMode={viewMode}
                onSaveToggle={handleSaveToggle}
              />
            ))}
          </div>
        )}

        {/* Load More (Future Enhancement) */}
        {filteredVehicles.length > 0 && filteredVehicles.length >= 12 && (
          <div className="text-center mt-12">
            <button
              type="button"
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Load More Vehicles
            </button>
          </div>
        )}
      </div>

      {/* Why Choose Us Section */}
      <WhyUs />

      {/* Filter Panel Slide-over */}
      <FilterPanel
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        onApplyFilters={(filters) => setDetailedFilters(filters)}
        initialFilters={detailedFilters || undefined}
      />
    </div>
  );
}
