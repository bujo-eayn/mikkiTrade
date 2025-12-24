'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface QuickFilter {
  id: string;
  label: string;
  value: string;
  category: 'price' | 'year' | 'brand' | 'bodyType' | 'transmission' | 'fuelType';
}

interface QuickFiltersProps {
  onFilterSelect?: (filter: QuickFilter) => void;
  activeFilters?: QuickFilter[];
  onClearAll?: () => void;
}

const popularFilters: QuickFilter[] = [
  { id: 'under-2m', label: 'Under KES 2M', value: '<2000000', category: 'price' },
  { id: '2m-5m', label: 'KES 2M - 5M', value: '2000000-5000000', category: 'price' },
  { id: 'above-5m', label: 'Above KES 5M', value: '>5000000', category: 'price' },
  { id: 'new-2024', label: '2024 Models', value: '2024', category: 'year' },
  { id: 'new-2023', label: '2023 Models', value: '2023', category: 'year' },
  { id: 'toyota', label: 'Toyota', value: 'Toyota', category: 'brand' },
  { id: 'mercedes', label: 'Mercedes-Benz', value: 'Mercedes-Benz', category: 'brand' },
  { id: 'bmw', label: 'BMW', value: 'BMW', category: 'brand' },
  { id: 'nissan', label: 'Nissan', value: 'Nissan', category: 'brand' },
  { id: 'suv', label: 'SUV', value: 'SUV', category: 'bodyType' },
  { id: 'sedan', label: 'Sedan', value: 'Sedan', category: 'bodyType' },
  { id: 'pickup', label: 'Pickup', value: 'Pickup', category: 'bodyType' },
  { id: 'automatic', label: 'Automatic', value: 'Automatic', category: 'transmission' },
  { id: 'petrol', label: 'Petrol', value: 'Petrol', category: 'fuelType' },
  { id: 'diesel', label: 'Diesel', value: 'Diesel', category: 'fuelType' },
  { id: 'hybrid', label: 'Hybrid', value: 'Hybrid', category: 'fuelType' },
];

export default function QuickFilters({
  onFilterSelect,
  activeFilters = [],
  onClearAll
}: QuickFiltersProps) {
  const isFilterActive = (filter: QuickFilter) => {
    return activeFilters.some(
      (af) => af.id === filter.id || (af.category === filter.category && af.value === filter.value)
    );
  };

  const handleFilterClick = (filter: QuickFilter) => {
    onFilterSelect?.(filter);
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-[120px] md:top-20 z-40 shadow-sm">
      <div className="container mx-auto px-4 md:px-8">
        <div className="py-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">Quick Filters</h3>
            {activeFilters.length > 0 && (
              <button
                onClick={onClearAll}
                className="flex items-center gap-1 text-sm text-[#a235c3] hover:text-[#2b404f] font-medium transition-colors"
              >
                <X size={16} />
                Clear All ({activeFilters.length})
              </button>
            )}
          </div>

          {/* Filter Pills - Single Scrollable Row */}
          <div className="relative">
            {/* Left fade indicator */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10 md:hidden" />

            {/* Right fade indicator */}
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />

            <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
              <div className="flex gap-2 min-w-max pb-1">
                {popularFilters.map((filter) => {
                  const active = isFilterActive(filter);
                  return (
                    <button
                      type="button"
                      key={filter.id}
                      onClick={() => handleFilterClick(filter)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                        active
                          ? 'bg-gradient-to-r from-[#a235c3] to-[#2b404f] text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {filter.label}
                      {active && (
                        <X size={14} className="inline-block ml-1.5 -mr-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Filters Summary (Mobile) */}
          {activeFilters.length > 0 && (
            <div className="md:hidden mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-600">
                {activeFilters.length} filter{activeFilters.length !== 1 ? 's' : ''} active
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
