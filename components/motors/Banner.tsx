'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

type Slide = {
    imageUrl: string
    title: string
    description: string
    link: string
}

type BannerProps = {
    slides: Slide[]
}

const Banner: React.FC<BannerProps> = ({ slides }) => {
    return (
        <div className="max-w-9xl mx-auto">
            {/* Carousel Wrapper */}
            <div className="overflow-hidden w-full shadow-lg">
                <div className="carousel flex w-full">
                    {slides.map((slide, index) => (
                        <Link
                            key={index}
                            href={slide.link}
                            className="carousel-item"
                        >
                            <div>
                                <Image
                                    src={slide.imageUrl}
                                    alt={`Slide ${index + 1}`}
                                    width={1200}
                                    height={400}
                                    className="w-full h-32 sm:h-48 lg:h-64 object-cover rounded-md"
                                />
                                {/* <h2 className="text-xl font-semibold mt-4">{slide.title}</h2>
                                <p className="text-gray-900 ">{slide.description}</p> */}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Banner
