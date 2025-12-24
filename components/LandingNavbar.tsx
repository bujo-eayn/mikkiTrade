'use client';

import { useState, useEffect } from 'react';
import styles from './LandingNavbar.module.css';
import Link from 'next/link';
import ContactUsModal from './ContactUsModal';
import MikkiTradeLogo from './MikkiTradeLogo';

const LandingNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className={`${styles.navbar} ${isSticky ? styles.sticky : styles.transparent}`}> {/* added styles.transparent */}
            <div className="relative px-4 sm:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex-shrink-0">
                        <MikkiTradeLogo subsidiary="International" href="/" theme="light" />
                    </div>

                    <div className="hidden md:flex items-center space-x-10">
                        <button onClick={() => scrollToSection('about')} className="relative group hover:underline text-fuchsia-700">
                            <span className="text-blue-100 group-hover:text-white transition-colors duration-300">About</span>
                        </button>
                        <Link href="/mikki-trade-motors" className="relative group hover:underline text-fuchsia-700">
                            <span className="text-blue-100 group-hover:text-white transition-colors duration-300">Motors</span>
                        </Link>
                        <Link href="/mikki-trade-production" className="relative group hover:underline text-fuchsia-700">
                            <span className="text-blue-100 group-hover:text-white transition-colors duration-300">Production</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button onClick={() => setShowModal(true)} className="hidden sm:flex relative group cursor-pointer">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-200" />
                            <div className="relative px-5 sm:px-7 py-2 sm:py-3 bg-blue-950 rounded-lg flex items-center">
                                <span className="text-blue-200 group-hover:text-white transition duration-200">Contact Us</span>
                            </div>
                        </button>

                        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden relative group" aria-label="Toggle mobile menu">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded blur opacity-60 group-hover:opacity-100 transition duration-200" />
                            <div className="relative p-2 bg-blue-950 rounded">
                                <svg className="w-6 h-6 text-blue-200 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {isOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </div>
                        </button>
                    </div>
                </div>

                {isOpen && (
                    <div className="relative mt-4 md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 bg-blue-900/50 backdrop-blur-sm rounded-lg border border-blue-500/10">
                            <button onClick={() => scrollToSection('about')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:text-white hover:bg-blue-800/50 transition-all duration-200">
                                About
                            </button>
                            <Link href="/mikki-trade-motors" className="block px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:text-white hover:bg-blue-800/50 transition-all duration-200">
                                Motors
                            </Link>
                            <Link href="/mikki-trade-production" className="block px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:text-white hover:bg-blue-800/50 transition-all duration-200">
                                Production
                            </Link>
                            <div className="px-3 py-2">
                                <button onClick={() => setShowModal(true)} className="w-full relative group cursor-pointer">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-200" />
                                    <div className="relative px-4 py-2 bg-blue-950 rounded-lg flex items-center justify-center">
                                        <span className="text-blue-200 group-hover:text-white transition duration-200">Contact Us</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {showModal && <ContactUsModal onClose={() => setShowModal(false)} />}
        </nav>
    );
};

export default LandingNavbar;