'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

type Product = {
    id: number
    image: string
    title: string
    description: string
    price: number
    link: string
    tags: string
}

type NewArrivalsProps = {
    products: Product[]
}

const NewArrivals: React.FC<NewArrivalsProps> = ({ products }) => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-4">
            {/* Title Section */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900">New Arrivals</h2>
                <Link
                    href="/products?filter=new"
                    className="text-sm font-medium text-fuchsia-950 hover:underline"
                >
                    See all
                </Link>
            </div>

            {/* Product Carousel */}
            <div className="overflow-x-scroll scrollbar-hide mb-4">
                <div className="flex snap-x snap-mandatory gap-4">
                    {products.map((product) => (
                        <div key={product.id} className="flex-none w-64 snap-center">
                            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-4 shadow">
                                <Link href={product.link}>
                                    <Image
                                        src={product.image}
                                        alt={product.title}
                                        width={300}
                                        height={200}
                                        className="w-full h-40 object-cover hover:opacity-90 transition duration-200"
                                    />
                                </Link>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-900">{product.title}</h3>
                                    <p className="text-gray-600 mt-2 text-sm">{product.description}</p>

                                    {/* Rotating Tag Pill */}
                                    <RotatingTag tags={product.tags} />

                                    <div className="flex justify-between items-center mt-4">
                                        <span className="text-2xl font-extrabold text-gray-900">
                                            {'$' + product.price.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default NewArrivals

// 🔁 Rotating Tag Pill Component
const RotatingTag: React.FC<{ tags: string }> = ({ tags }) => {
    const tagList = tags.split(',').map((tag) => tag.trim())
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % tagList.length)
        }, 5000) // change tag every 5 seconds
        return () => clearInterval(interval)
    }, [tagList.length])

    return (
        <div className="mt-3">
            <span className="inline-block px-3 py-1 text-sm font-medium text-fuchsia-800 bg-fuchsia-100 rounded-full animate-fade">
                {tagList[index]}
            </span>
        </div>
    )
}
