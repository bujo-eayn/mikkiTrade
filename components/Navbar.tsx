'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Navbar.module.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className="fixed top-0 w-full z-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 pt-3 flex flex-col items-center justify-center">
                {/* Logo Centered */}
                <Link href="/">
                    <Image
                        src="/images/logo-main.png"
                        alt="Mikki Trade International logo"
                        width={70}
                        height={70}
                    />
                </Link>

                {/* Subcompany Texts/Icons */}
                <div className="flex justify-evenly w-full mt-2 gap-4 sm:gap-6 md:gap-10">
                    <Link href="/mikki-trade-motors">
                        <span
                            className={`text-xl sm:text-3xl cursor-pointer ${styles.subcompany} ${scrolled ? styles.scrolled : ''}`}
                        >
                            <span className="sm:hidden">🚗 Motors</span>

                            <span className="hidden sm:flex sm:flex-col sm:items-center sm:text-center">
                                Mikki Trade
                                <span>Motors</span>
                            </span>
                        </span>
                    </Link>

                    <Link href="/mikki-trade-production">
                        <span
                            className={`text-xl sm:text-3xl cursor-pointer ${styles.subcompany} ${scrolled ? styles.scrolled : ''}`}
                        >
                            <span className="sm:hidden">🎥 Production</span>

                            <span className="hidden sm:flex sm:flex-col sm:items-center sm:text-center">
                                Mikki Trade
                                <span>Production</span>
                            </span>
                        </span>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
