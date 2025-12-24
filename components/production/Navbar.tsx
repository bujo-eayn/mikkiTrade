'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MikkiTradeLogo from '@/components/MikkiTradeLogo';

export default function ProductionNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-lg backdrop-blur-md'
          : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <MikkiTradeLogo subsidiary="Production" href="/mikki-trade-production" />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/mikki-trade-production#services"
              className="text-gray-700 hover:text-[#a235c3] font-medium transition-colors"
            >
              Services
            </Link>
            <Link
              href="/mikki-trade-production#portfolio"
              className="text-gray-700 hover:text-[#a235c3] font-medium transition-colors"
            >
              Portfolio
            </Link>
            <Link
              href="/mikki-trade-production#team"
              className="text-gray-700 hover:text-[#a235c3] font-medium transition-colors"
            >
              Team
            </Link>
            <Link
              href="/mikki-trade-production#contact"
              className="px-6 py-2.5 bg-gradient-to-r from-[#a235c3] to-[#2b404f] text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            aria-label="Toggle mobile menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 pt-2 space-y-2">
            <Link
              href="/mikki-trade-production#services"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/mikki-trade-production#portfolio"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Portfolio
            </Link>
            <Link
              href="/mikki-trade-production#team"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Team
            </Link>
            <Link
              href="/mikki-trade-production#contact"
              className="block px-4 py-2.5 bg-gradient-to-r from-[#a235c3] to-[#2b404f] text-white rounded-lg font-semibold text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact Us
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
