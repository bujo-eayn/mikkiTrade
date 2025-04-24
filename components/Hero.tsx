'use client';

import { useRef, useState } from 'react';
import { useAnimationFrame } from 'motion/react';
import Image from 'next/image';

type Variant = 'international' | 'motors' | 'production';

interface HeroProps {
    variant: Variant;
}

const fallbackColors = [
    '#f87171', // red
    '#facc15', // yellow
    '#4ade80', // green
    '#38bdf8', // blue
    '#c084fc', // purple
    '#f472b6', // pink
];

const cubeImages: Record<Variant, string[]> = {
    international: [
        '/images/international/car.jpg',
        '/images/international/mansion.jpg',
        '/images/international/motorcycle.jpg',
        '/images/international/land.jpg',
        '/images/international/plane.jpg',
        '/images/international/boat.jpg',
    ],
    motors: [
        '/images/motors/high-end-car.jpg',
        '/images/motors/budget-car.jpg',
        '/images/motors/small-budget-car.jpg',
        '/images/motors/sports-motorcycle.jpg',
        '/images/motors/truck.jpg',
        '/images/motors/van.jpg',
    ],
    production: [
        '/images/production/camera.jpg',
        '/images/production/studio.jpg',
        '/images/production/editing.jpg',
        '/images/production/crew.jpg',
        '/images/production/lighting.jpg',
        '/images/production/sound.jpg',
    ],
};

const slogans: Record<Variant, string> = {
    international: 'Connecting Dreams to Reality Across Borders',
    motors: 'Drive with Purpose, Style, and Power',
    production: 'Capturing Moments, Creating Magic',
};

export default function Hero({ variant }: HeroProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [loadErrors, setLoadErrors] = useState<boolean[]>(new Array(6).fill(false));

    useAnimationFrame((t) => {
        if (!ref.current) return;
        const rotate = Math.sin(t / 10000) * 200;
        const y = (1 + Math.sin(t / 1000)) * -50;
        ref.current.style.transform = `translateY(${y}px) rotateX(${rotate}deg) rotateY(${rotate}deg)`;
    });

    const images = cubeImages[variant];

    return (
        <section className="hero-container min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
            <div className="cube-wrapper w-[200px] h-[200px]">
                <div className="cube" ref={ref}>
                    {images.map((src, index) => (
                        <div
                            key={index}
                            className={`side side-${index}`}
                            style={{ backgroundColor: loadErrors[index] ? fallbackColors[index] : undefined }}
                        >
                            {!loadErrors[index] && (
                                <Image
                                    src={src}
                                    alt={`Cube face ${index}`}
                                    layout="fill"
                                    objectFit="cover"
                                    onError={() =>
                                        setLoadErrors((prev) => {
                                            const updated = [...prev];
                                            updated[index] = true;
                                            return updated;
                                        })
                                    }
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-10 text-center">
                <h1 className="text-black text-3xl sm:text-5xl font-bold mb-2 leading-tight">
                    Mikki Trade <br />
                    {variant === 'international' && 'International'}
                    {variant === 'motors' && 'Motors'}
                    {variant === 'production' && 'Production'}
                </h1>
                <p className="text-gray-600 text-lg sm:text-xl mt-2 italic">{slogans[variant]}</p>
            </div>
            <HeroStyles />
        </section>
    );
}

function HeroStyles() {
    return (
        <style>{`
      .cube-wrapper {
        perspective: 800px;
      }

      .cube {
        width: 100%;
        height: 100%;
        position: relative;
        transform-style: preserve-3d;
      }

      .side {
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0.9;
        border: 1px solid rgba(255,255,255,0.1);
        overflow: hidden;
      }

      .side-0 { transform: rotateY(  0deg) translateZ(100px); }
      .side-1 { transform: rotateY( 90deg) translateZ(100px); }
      .side-2 { transform: rotateY(180deg) translateZ(100px); }
      .side-3 { transform: rotateY(-90deg) translateZ(100px); }
      .side-4 { transform: rotateX( 90deg) translateZ(100px); }
      .side-5 { transform: rotateX(-90deg) translateZ(100px); }
    `}</style>
    );
}
