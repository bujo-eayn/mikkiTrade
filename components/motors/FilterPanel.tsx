'use client';

import { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters?: (filters: VehicleFilters) => void;
  initialFilters?: VehicleFilters;
}

export interface VehicleFilters {
  priceRange: {
    min: number;
    max: number;
  };
  yearRange: {
    min: number;
    max: number;
  };
  mileageRange: {
    min: number;
    max: number;
  };
  brands: string[];
  bodyTypes: string[];
  transmissions: string[];
  fuelTypes: string[];
  colors: string[];
  features: string[];
  condition: string[];
}

const defaultFilters: VehicleFilters = {
  priceRange: { min: 0, max: 20000000 },
  yearRange: { min: 2000, max: 2025 },
  mileageRange: { min: 0, max: 200000 },
  brands: [],
  bodyTypes: [],
  transmissions: [],
  fuelTypes: [],
  colors: [],
  features: [],
  condition: [],
};

const brandOptions = [
  'Toyota', 'Mercedes-Benz', 'BMW', 'Nissan', 'Honda', 'Audi',
  'Mazda', 'Subaru', 'Volkswagen', 'Lexus', 'Land Rover', 'Jeep',
  'Ford', 'Chevrolet', 'Hyundai', 'Kia', 'Mitsubishi', 'Peugeot',
];

const bodyTypeOptions = ['Sedan', 'SUV', 'Hatchback', 'Pickup', 'Coupe', 'Convertible', 'Van', 'Wagon'];

const transmissionOptions = ['Automatic', 'Manual', 'CVT', 'Semi-Automatic'];

const fuelTypeOptions = ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'Plug-in Hybrid'];

const colorOptions = [
  'White', 'Black', 'Silver', 'Gray', 'Blue', 'Red',
  'Green', 'Brown', 'Beige', 'Gold', 'Orange', 'Yellow',
];

const featureOptions = [
  'Leather Seats', 'Sunroof', 'Navigation System', 'Backup Camera',
  'Parking Sensors', 'Bluetooth', 'Cruise Control', 'Heated Seats',
  'Keyless Entry', 'Alloy Wheels', 'LED Headlights', 'Power Windows',
];

const conditionOptions = ['Brand New', 'Foreign Used', 'Locally Used', 'Certified Pre-Owned'];

export default function FilterPanel({
  isOpen,
  onClose,
  onApplyFilters,
  initialFilters = defaultFilters
}: FilterPanelProps) {
  const [filters, setFilters] = useState<VehicleFilters>(initialFilters);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['price', 'year', 'brand', 'bodyType'])
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    setFilters({
      ...filters,
      priceRange: {
        ...filters.priceRange,
        [type]: parseInt(value) || 0,
      },
    });
  };

  const handleYearChange = (type: 'min' | 'max', value: string) => {
    setFilters({
      ...filters,
      yearRange: {
        ...filters.yearRange,
        [type]: parseInt(value) || 0,
      },
    });
  };

  const handleMileageChange = (type: 'min' | 'max', value: string) => {
    setFilters({
      ...filters,
      mileageRange: {
        ...filters.mileageRange,
        [type]: parseInt(value) || 0,
      },
    });
  };

  const handleMultiSelect = (category: keyof VehicleFilters, value: string) => {
    const currentValues = filters[category] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    setFilters({
      ...filters,
      [category]: newValues,
    });
  };

  const handleReset = () => {
    setFilters(defaultFilters);
  };

  const handleApply = () => {
    onApplyFilters?.(filters);
    onClose();
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.priceRange.min > 0 || filters.priceRange.max < 20000000) count++;
    if (filters.yearRange.min > 2000 || filters.yearRange.max < 2025) count++;
    if (filters.mileageRange.min > 0 || filters.mileageRange.max < 200000) count++;
    count += filters.brands.length;
    count += filters.bodyTypes.length;
    count += filters.transmissions.length;
    count += filters.fuelTypes.length;
    count += filters.colors.length;
    count += filters.features.length;
    count += filters.condition.length;
    return count;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full md:w-[480px] bg-white z-50 shadow-2xl transform transition-transform overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#a235c3] to-[#2b404f] text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Filter Vehicles</h2>
            {getActiveFilterCount() > 0 && (
              <p className="text-sm text-white/80 mt-1">
                {getActiveFilterCount()} filter{getActiveFilterCount() !== 1 ? 's' : ''} active
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close filter panel"
          >
            <X size={24} />
          </button>
        </div>

        {/* Filters Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Price Range */}
          <FilterSection
            title="Price Range"
            isExpanded={expandedSections.has('price')}
            onToggle={() => toggleSection('price')}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Price (KES)
                  </label>
                  <input
                    type="number"
                    value={filters.priceRange.min}
                    onChange={(e) => handlePriceChange('min', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a235c3] focus:border-transparent text-gray-900 placeholder:text-gray-400"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Price (KES)
                  </label>
                  <input
                    type="number"
                    value={filters.priceRange.max}
                    onChange={(e) => handlePriceChange('max', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a235c3] focus:border-transparent text-gray-900 placeholder:text-gray-400"
                    placeholder="20,000,000"
                  />
                </div>
              </div>
              <div className="flex gap-2 text-sm">
                <button
                  onClick={() => setFilters({ ...filters, priceRange: { min: 0, max: 2000000 } })}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-700"
                >
                  Under 2M
                </button>
                <button
                  onClick={() => setFilters({ ...filters, priceRange: { min: 2000000, max: 5000000 } })}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-700"
                >
                  2M - 5M
                </button>
                <button
                  onClick={() => setFilters({ ...filters, priceRange: { min: 5000000, max: 20000000 } })}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-700"
                >
                  Above 5M
                </button>
              </div>
            </div>
          </FilterSection>

          {/* Year Range */}
          <FilterSection
            title="Year"
            isExpanded={expandedSections.has('year')}
            onToggle={() => toggleSection('year')}
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Year
                </label>
                <input
                  type="number"
                  value={filters.yearRange.min}
                  onChange={(e) => handleYearChange('min', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a235c3] focus:border-transparent text-gray-900 placeholder:text-gray-400"
                  placeholder="2000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Year
                </label>
                <input
                  type="number"
                  value={filters.yearRange.max}
                  onChange={(e) => handleYearChange('max', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a235c3] focus:border-transparent text-gray-900 placeholder:text-gray-400"
                  placeholder="2025"
                />
              </div>
            </div>
          </FilterSection>

          {/* Mileage Range */}
          <FilterSection
            title="Mileage (KM)"
            isExpanded={expandedSections.has('mileage')}
            onToggle={() => toggleSection('mileage')}
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min KM
                </label>
                <input
                  type="number"
                  value={filters.mileageRange.min}
                  onChange={(e) => handleMileageChange('min', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a235c3] focus:border-transparent text-gray-900 placeholder:text-gray-400"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max KM
                </label>
                <input
                  type="number"
                  value={filters.mileageRange.max}
                  onChange={(e) => handleMileageChange('max', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a235c3] focus:border-transparent text-gray-900 placeholder:text-gray-400"
                  placeholder="200,000"
                />
              </div>
            </div>
          </FilterSection>

          {/* Brands */}
          <FilterSection
            title="Brand"
            count={filters.brands.length}
            isExpanded={expandedSections.has('brand')}
            onToggle={() => toggleSection('brand')}
          >
            <div className="grid grid-cols-2 gap-2">
              {brandOptions.map((brand) => (
                <CheckboxOption
                  key={brand}
                  label={brand}
                  checked={filters.brands.includes(brand)}
                  onChange={() => handleMultiSelect('brands', brand)}
                />
              ))}
            </div>
          </FilterSection>

          {/* Body Type */}
          <FilterSection
            title="Body Type"
            count={filters.bodyTypes.length}
            isExpanded={expandedSections.has('bodyType')}
            onToggle={() => toggleSection('bodyType')}
          >
            <div className="grid grid-cols-2 gap-2">
              {bodyTypeOptions.map((type) => (
                <CheckboxOption
                  key={type}
                  label={type}
                  checked={filters.bodyTypes.includes(type)}
                  onChange={() => handleMultiSelect('bodyTypes', type)}
                />
              ))}
            </div>
          </FilterSection>

          {/* Transmission */}
          <FilterSection
            title="Transmission"
            count={filters.transmissions.length}
            isExpanded={expandedSections.has('transmission')}
            onToggle={() => toggleSection('transmission')}
          >
            <div className="space-y-2">
              {transmissionOptions.map((transmission) => (
                <CheckboxOption
                  key={transmission}
                  label={transmission}
                  checked={filters.transmissions.includes(transmission)}
                  onChange={() => handleMultiSelect('transmissions', transmission)}
                />
              ))}
            </div>
          </FilterSection>

          {/* Fuel Type */}
          <FilterSection
            title="Fuel Type"
            count={filters.fuelTypes.length}
            isExpanded={expandedSections.has('fuelType')}
            onToggle={() => toggleSection('fuelType')}
          >
            <div className="space-y-2">
              {fuelTypeOptions.map((fuel) => (
                <CheckboxOption
                  key={fuel}
                  label={fuel}
                  checked={filters.fuelTypes.includes(fuel)}
                  onChange={() => handleMultiSelect('fuelTypes', fuel)}
                />
              ))}
            </div>
          </FilterSection>

          {/* Color */}
          <FilterSection
            title="Color"
            count={filters.colors.length}
            isExpanded={expandedSections.has('color')}
            onToggle={() => toggleSection('color')}
          >
            <div className="grid grid-cols-3 gap-2">
              {colorOptions.map((color) => (
                <CheckboxOption
                  key={color}
                  label={color}
                  checked={filters.colors.includes(color)}
                  onChange={() => handleMultiSelect('colors', color)}
                />
              ))}
            </div>
          </FilterSection>

          {/* Features */}
          <FilterSection
            title="Features"
            count={filters.features.length}
            isExpanded={expandedSections.has('features')}
            onToggle={() => toggleSection('features')}
          >
            <div className="grid grid-cols-2 gap-2">
              {featureOptions.map((feature) => (
                <CheckboxOption
                  key={feature}
                  label={feature}
                  checked={filters.features.includes(feature)}
                  onChange={() => handleMultiSelect('features', feature)}
                />
              ))}
            </div>
          </FilterSection>

          {/* Condition */}
          <FilterSection
            title="Condition"
            count={filters.condition.length}
            isExpanded={expandedSections.has('condition')}
            onToggle={() => toggleSection('condition')}
          >
            <div className="space-y-2">
              {conditionOptions.map((cond) => (
                <CheckboxOption
                  key={cond}
                  label={cond}
                  checked={filters.condition.includes(cond)}
                  onChange={() => handleMultiSelect('condition', cond)}
                />
              ))}
            </div>
          </FilterSection>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Reset All
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#a235c3] to-[#2b404f] text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Helper Components
interface FilterSectionProps {
  title: string;
  count?: number;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function FilterSection({ title, count, isExpanded, onToggle, children }: FilterSectionProps) {
  return (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-2 hover:text-[#a235c3] transition-colors"
      >
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {count !== undefined && count > 0 && (
            <span className="bg-[#a235c3] text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {count}
            </span>
          )}
        </div>
        {isExpanded ? <ChevronUp size={20} className="text-gray-600" /> : <ChevronDown size={20} className="text-gray-600" />}
      </button>
      {isExpanded && <div className="mt-4">{children}</div>}
    </div>
  );
}

interface CheckboxOptionProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

function CheckboxOption({ label, checked, onChange }: CheckboxOptionProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-[#a235c3] border-gray-300 rounded focus:ring-[#a235c3] cursor-pointer"
      />
      <span className="text-sm text-gray-700 group-hover:text-[#a235c3] transition-colors">
        {label}
      </span>
    </label>
  );
}
