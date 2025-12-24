'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function TopNavbar() {
    return (
        <nav className="sticky top-0 z-50 bg-gray-100 shadow">
            <div className="container mx-auto flex flex-wrap items-center justify-between px-6 py-3">

                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <Image
                        src="/images/logo-main.png"
                        alt="Logo"
                        width={120}
                        height={30}
                        className="h-6 sm:h-7 w-auto"
                    />
                </Link>

                {/* Nav Links - only on large screens */}
                <div className="hidden lg:flex space-x-6">
                    <Link
                        href="/"
                        className="text-gray-700 hover:text-fuchsia-700  transition-colors duration-200"
                    >
                        All Vehicles
                    </Link>
                    
                </div>

                {/* Search Bar - visible on all screens */}
                <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mt-3 sm:mt-0">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg
                            className="w-5 h-5 text-gray-400"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <path
                                d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </span>
                    <input
                        type="text"
                        placeholder="Search Vehicles, Brands, and Specifications"
                        className="w-full py-2 pl-10 pr-4 text-gray-700 bg-gray-200 border rounded-lg  focus:border-fuchsia-400  focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300"
                    />
                </div>
            </div>
        </nav>
    );
}
