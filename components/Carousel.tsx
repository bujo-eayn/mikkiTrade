'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const images = [
    { src: '/images/hero1.jpg', alt: 'Mikki Trade Motors' },
    { src: '/images/hero2.jpg', alt: 'Mikki Trade Production' },
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
        <div className="relative h-screen w-full overflow-hidden">
            {images.map((image, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? 'opacity-100' : 'opacity-0'}`}
                >
                    <Image src={image.src} alt={image.alt} layout="fill" objectFit="cover" />
                </div>
            ))}
        </div>
    );
};

export default Carousel;
