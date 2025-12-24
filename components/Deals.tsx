'use client';

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

interface Deal {
    id: number;
    title: string;
    subtitle: string;
    ctaText: string;
    link: string;
}

const deals: Deal[] = [
    {
        id: 1,
        title: "20% off every Product",
        subtitle: "Black Friday Sale",
        ctaText: "Buy now",
        link: "#"
    },
    {
        id: 2,
        title: "Free Delivery on All Orders",
        subtitle: "Holiday Special",
        ctaText: "Shop now",
        link: "#"
    },
    {
        id: 3,
        title: "Exclusive Deals on SUVs",
        subtitle: "Car Import Offer",
        ctaText: "Explore",
        link: "#"
    }
];

export default function Deals() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % deals.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const currentDeal = deals[currentIndex];

    return (
        <section className="px-4">
            <div className="bg-gradient-to-br from-sky-400 via-sky-400 to-violet-400 p-6 sm:p-10 rounded-2xl w-full text-white flex items-center justify-between max-w-3xl mx-auto mt-20 transition-all duration-500 ease-in-out">
                <div className="flex flex-col gap-6">
                    <div>
                        <span className="text-gray-200">{currentDeal.subtitle}</span>
                        <br />
                        <span className="text-white text-4xl font-semibold">
                            {currentDeal.title}
                        </span>
                    </div>
                    <a
                        href={currentDeal.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-black bg-white hover:bg-gray-50 px-4 py-2 rounded-lg w-fit ease duration-300 flex gap-1 items-center group"
                    >
                        <span>{currentDeal.ctaText}</span>
                        <ChevronRight className="group-hover:translate-x-1 transition-transform duration-200" />
                    </a>
                </div>
            </div>
        </section>
    );
}
