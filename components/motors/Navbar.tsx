'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, X, Grid3x3, List, ChevronDown } from 'lucide-react';
import MikkiTradeLogo from '@/components/MikkiTradeLogo';

interface NavbarProps {
  onFilterClick?: () => void;
  onSearchChange?: (value: string) => void;
  onSortChange?: (sort: string) => void;
  onViewChange?: (view: 'grid' | 'list') => void;
  activeFiltersCount?: number;
}

export default function Navbar({
  onFilterClick,
  onSearchChange,
  onSortChange,
  onViewChange,
  activeFiltersCount = 0
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearchChange?.(value);
  };

  const handleViewToggle = () => {
    const newView = viewMode === 'grid' ? 'list' : 'grid';
    setViewMode(newView);
    onViewChange?.(newView);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    onSortChange?.(value);
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-lg backdrop-blur-md'
          : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          {/* Logo */}
          <MikkiTradeLogo subsidiary="Motors" href="/mikki-trade-motors" />

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchValue}
                onChange={handleSearchChange}
                placeholder="Search by make, model, year, price..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a235c3] focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Filters Button */}
            <button
              onClick={onFilterClick}
              className="relative flex items-center gap-2 px-4 py-2.5 border-2 border-gray-200 rounded-lg hover:border-[#a235c3] hover:bg-[#a235c3]/5 transition-all font-medium text-gray-700"
            >
              <SlidersHorizontal size={20} className="text-gray-600" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#a235c3] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 border-2 border-gray-200 rounded-lg hover:border-[#a235c3] focus:ring-2 focus:ring-[#a235c3] focus:border-transparent transition-all font-medium cursor-pointer bg-white text-gray-700"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="year-new">Year: Newest</option>
                <option value="year-old">Year: Oldest</option>
                <option value="mileage">Mileage: Low to High</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>

            {/* View Toggle */}
            <button
              onClick={handleViewToggle}
              className="p-2.5 border-2 border-gray-200 rounded-lg hover:border-[#a235c3] hover:bg-[#a235c3]/5 transition-all text-gray-600"
              title={viewMode === 'grid' ? 'Switch to List View' : 'Switch to Grid View'}
            >
              {viewMode === 'grid' ? <List size={20} /> : <Grid3x3 size={20} />}
            </button>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/254708149430"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-[#20ba5a] transform hover:scale-105 transition-all shadow-md"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span className="hidden lg:inline">WhatsApp</span>
            </a>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Search Icon */}
            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-700">
              <Search size={20} />
            </button>

            {/* Mobile Filters */}
            <button
              onClick={onFilterClick}
              className="relative p-2 hover:bg-gray-100 rounded-lg text-gray-700"
            >
              <SlidersHorizontal size={20} />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#a235c3] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (Expandable) */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="Search cars..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a235c3] focus:border-transparent text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="grid grid-cols-4 gap-1 p-2">
          <Link
            href="/mikki-trade-motors"
            className="flex flex-col items-center gap-1 py-2 px-1 text-gray-600 hover:text-[#a235c3] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs font-medium">Home</span>
          </Link>

          <button
            onClick={onFilterClick}
            className="flex flex-col items-center gap-1 py-2 px-1 text-gray-600 hover:text-[#a235c3] transition-colors relative"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span className="text-xs font-medium">Filters</span>
            {activeFiltersCount > 0 && (
              <span className="absolute top-1 right-2 bg-[#a235c3] text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <button className="flex flex-col items-center gap-1 py-2 px-1 text-gray-600 hover:text-[#a235c3] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-xs font-medium">Saved</span>
          </button>

          <a
            href="https://wa.me/254708149430"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 py-2 px-1 text-[#25D366] hover:text-[#20ba5a] transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            <span className="text-xs font-medium">Chat</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
