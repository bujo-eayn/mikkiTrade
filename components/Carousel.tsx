'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const images = [
    {
        src: '/images/hero1.jpg',
        alt: 'Mikki Trade Motors',
        title: 'Mikki Trade Motors',
        description: 'Innovative automobile solutions built for Africa.\nReliable, efficient, and future-ready.',
        link: '/mikki-trade-motors'
    },
    {
        src: '/images/hero2.jpg',
        alt: 'Mikki Trade Production',
        title: 'Mikki Trade Production',
        description: 'Creative media production for brands and storytellers. \nDelivering quality visuals, sound, and content with purpose.',
        link: '/mikki-trade-production'
    },
];

const Carousel = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative h-screen w-full overflow-hidden z-0">
            {images.map((image, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? 'opacity-100 z-0' : 'opacity-0 z-0'}`}
                >
                    <Image src={image.src} alt={image.alt} layout="fill" objectFit="cover" priority />
                    {index === current && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 bg-black/40 text-white">
                            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 drop-shadow-lg">
                                {image.title}
                            </h1>
                            <p className="text-lg sm:text-xl mb-6 whitespace-pre-line max-w-2xl">
                                {image.description}
                            </p>
                            <Link
                                href={image.link}
                                className="inline-block px-6 py-3 bg-fuchsia-700 hover:bg-fuchsia-800 text-white font-semibold rounded-lg shadow transition"
                            >
                                Learn More
                            </Link>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Carousel;
