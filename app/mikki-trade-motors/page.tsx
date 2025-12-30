'use client';

import { useState, useMemo } from 'react';
import Navbar from '@/components/motors/Navbar';
import QuickFilters from '@/components/motors/QuickFilters';
import FilterPanel, { VehicleFilters } from '@/components/motors/FilterPanel';
import HeroCarousel from '@/components/motors/HeroCarousel';
import VehicleCard from '@/components/motors/VehicleCard';
import WhyUs from '@/components/motors/WhyUs';
import { useVehicles, useFeaturedVehicles } from '@/lib/hooks/useVehicles';

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
  const [savedVehicles, setSavedVehicles] = useState<Set<string>>(new Set());

  // Fetch featured vehicles for hero carousel
  const { vehicles: featuredData, loading: featuredLoading } = useFeaturedVehicles(5);

  // Map sortBy values to API parameters
  const getSortingParams = (sortValue: string) => {
    switch (sortValue) {
      case 'newest':
        return { sortBy: 'created_at', sortOrder: 'desc' as const };
      case 'price-low':
        return { sortBy: 'price', sortOrder: 'asc' as const };
      case 'price-high':
        return { sortBy: 'price', sortOrder: 'desc' as const };
      case 'year-new':
        return { sortBy: 'year', sortOrder: 'desc' as const };
      case 'year-old':
        return { sortBy: 'year', sortOrder: 'asc' as const };
      case 'mileage':
        return { sortBy: 'mileage', sortOrder: 'asc' as const };
      default:
        return { sortBy: 'created_at', sortOrder: 'desc' as const };
    }
  };

  // Build API filters from UI state
  const apiFilters = useMemo(() => {
    const filters: any = {};

    // Search query
    if (searchQuery) {
      filters.search = searchQuery;
    }

    // Quick filters
    activeQuickFilters.forEach(filter => {
      switch (filter.category) {
        case 'price':
          if (filter.value.startsWith('<')) {
            filters.maxPrice = parseInt(filter.value.substring(1));
          } else if (filter.value.startsWith('>')) {
            filters.minPrice = parseInt(filter.value.substring(1));
          } else if (filter.value.includes('-')) {
            const [min, max] = filter.value.split('-').map(n => parseInt(n));
            filters.minPrice = min;
            filters.maxPrice = max;
          }
          break;
        case 'year':
          filters.minYear = parseInt(filter.value);
          filters.maxYear = parseInt(filter.value);
          break;
        case 'brand':
          filters.make = filter.value;
          break;
        case 'bodyType':
          filters.bodyType = filter.value;
          break;
        case 'transmission':
          filters.transmission = filter.value;
          break;
        case 'fuelType':
          filters.fuelType = filter.value;
          break;
      }
    });

    // Detailed filters
    if (detailedFilters) {
      if (detailedFilters.priceRange.min > 0) filters.minPrice = detailedFilters.priceRange.min;
      if (detailedFilters.priceRange.max < 20000000) filters.maxPrice = detailedFilters.priceRange.max;
      if (detailedFilters.yearRange.min > 2000) filters.minYear = detailedFilters.yearRange.min;
      if (detailedFilters.yearRange.max < 2025) filters.maxYear = detailedFilters.yearRange.max;
      if (detailedFilters.mileageRange.min > 0) filters.minMileage = detailedFilters.mileageRange.min;
      if (detailedFilters.mileageRange.max < 200000) filters.maxMileage = detailedFilters.mileageRange.max;
      if (detailedFilters.brands.length > 0) filters.make = detailedFilters.brands[0];
      if (detailedFilters.bodyTypes.length > 0) filters.bodyType = detailedFilters.bodyTypes[0];
      if (detailedFilters.transmissions.length > 0) filters.transmission = detailedFilters.transmissions[0];
      if (detailedFilters.fuelTypes.length > 0) filters.fuelType = detailedFilters.fuelTypes[0];
      if (detailedFilters.colors.length > 0) filters.color = detailedFilters.colors[0];
    }

    return filters;
  }, [searchQuery, activeQuickFilters, detailedFilters]);

  // Fetch vehicles from database with filters and sorting
  const sorting = getSortingParams(sortBy);
  const { vehicles, loading, error, pagination } = useVehicles({
    filters: apiFilters,
    sorting,
    pagination: { page: 1, limit: 50 },
  });

  // Map featured vehicles for carousel
  const featuredVehicles = featuredData.map(v => ({
    id: v.id,
    make: v.make,
    model: v.model,
    year: v.year,
    price: v.price,
    oldPrice: v.on_deal && v.deal_description ? undefined : undefined,
    image: v.vehicle_images && v.vehicle_images.length > 0
      ? (v.vehicle_images.find(img => img.is_primary)?.url || v.vehicle_images[0]?.url)
      : 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1200&h=600&fit=crop',
    tagline: v.description?.substring(0, 50) || `${v.year} ${v.make} ${v.model}`,
    badge: v.tags?.[0] as 'NEW' | 'HOT DEAL' | 'LIMITED' | undefined,
  }));

  // Map database vehicles to component format
  const displayVehicles = vehicles.map(v => ({
    id: v.id,
    make: v.make,
    model: v.model,
    year: v.year,
    price: v.price,
    oldPrice: v.on_deal && v.deal_description ? undefined : undefined,
    mileage: v.mileage ? `${v.mileage.toLocaleString()} km` : 'N/A',
    transmission: v.transmission || 'N/A',
    fuelType: v.fuel_type || 'N/A',
    bodyType: v.body_type || 'N/A',
    color: v.color || 'N/A',
    condition: 'Foreign Used', // Default for now
    location: 'Nairobi', // Default for now
    images: v.vehicle_images && v.vehicle_images.length > 0
      ? v.vehicle_images
          .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
          .map(img => img.url)
      : ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop'], // Fallback placeholder
    badges: v.tags as ('NEW' | 'HOT DEAL' | 'LIMITED')[] | undefined,
    isSaved: savedVehicles.has(v.id),
    featured: v.featured || false,
    tagline: v.description?.substring(0, 50),
    features: v.features || [],
    description: v.description || '',
    engineSize: 'N/A', // Not in database yet
    drivetrain: 'N/A', // Not in database yet
    seats: 5, // Default
    doors: 4, // Default
    createdAt: v.created_at || new Date().toISOString(),
  }));

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
        {featuredLoading ? (
          <div className="h-96 bg-gray-200 animate-pulse flex items-center justify-center">
            <p className="text-gray-500">Loading featured vehicles...</p>
          </div>
        ) : (
          <HeroCarousel vehicles={featuredVehicles} autoPlayInterval={6000} />
        )}
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
            {loading ? (
              <p className="text-gray-600">Loading vehicles...</p>
            ) : error ? (
              <p className="text-red-600">Error loading vehicles. Please try again.</p>
            ) : (
              <p className="text-gray-600">
                Showing {vehicles.length} of {pagination?.total || 0} vehicles
                {searchQuery && (
                  <span className="font-semibold"> matching "{searchQuery}"</span>
                )}
              </p>
            )}
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

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Failed to load vehicles
            </h2>
            <p className="text-gray-600 mb-6">
              {error.message || 'An error occurred. Please try again later.'}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-[#a235c3] to-[#2b404f] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Retry
            </button>
          </div>
        )}

        {/* No Results Message */}
        {!loading && !error && displayVehicles.length === 0 && (
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
        {!loading && !error && displayVehicles.length > 0 && (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'flex flex-col gap-6'
            }
          >
            {displayVehicles.map(vehicle => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                viewMode={viewMode}
                onSaveToggle={handleSaveToggle}
              />
            ))}
          </div>
        )}

        {/* Load More (Future Enhancement) */}
        {!loading && !error && displayVehicles.length > 0 && pagination?.hasNextPage && (
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
