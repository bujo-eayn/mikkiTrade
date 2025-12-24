'use client'

import React, { useEffect, useState, useRef } from 'react'
import { Eye } from 'lucide-react'
import Link from 'next/link'

interface Product {
    id: number
    name: string
    brand: string
    price: number
    oldPrice: number
    imageUrl: string
}

const categories = ['technology', 'nature', 'fashion', 'food', 'travel', 'sports', 'architecture', 'animals', 'art', 'cars'];

const allProducts: Product[] = Array.from({ length: 50 }, (_, index) => {
    const randomCategory = categories[index % categories.length];
    const randomQueryParam = Math.floor(Math.random() * 1000); // add randomness to prevent caching
    return {
        id: index + 1,
        name: `Product Name ${index + 1}`,
        brand: ['Design', 'Development', 'Marketing'][index % 3],
        price: 149 + (index % 5) * 10, // vary the price slightly
        oldPrice: 199 + (index % 5) * 15,
        imageUrl: `https://source.unsplash.com/random/500x500/?${randomCategory}`,
    };
});


const ForYou: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [page, setPage] = useState(1)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        loadMore()
    }, [])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && page < 4) {
                    loadMore()
                }
            },
            { threshold: 1 }
        )
        if (containerRef.current) {
            observer.observe(containerRef.current)
        }
        return () => observer.disconnect()
    }, [products, page])

    const loadMore = () => {
        const newProducts = allProducts.slice((page - 1) * 10, page * 10)
        setProducts((prev) => [...prev, ...newProducts])
        setPage((prev) => prev + 1)
    }

    return (
        <div className="max-w-7xl mx-auto p-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">For You</h2>

            <section
                className="grid grid-cols-2 lg:grid-cols-5 gap-4 justify-items-center"
            >
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="w-full bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl"
                    >
                        <Link href={`/products/${product.id}`}>
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="h-48 w-full object-cover rounded-t-xl"
                            />
                            <div className="px-4 py-3">
                                <span className="text-gray-400 uppercase text-xs">{product.brand}</span>
                                <p className="text-lg font-bold text-black truncate capitalize">
                                    {product.name}
                                </p>
                                <div className="flex items-center">
                                    <p className="text-lg font-semibold text-fuchsia-700 my-3">${product.price}</p>
                                    <del>
                                        <p className="text-sm text-gray-600 ml-2">${product.oldPrice}</p>
                                    </del>
                                    <Eye className="ml-auto w-5 h-5 text-fuchsia-700" />
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </section>

            {/* Intersection observer trigger */}
            <div ref={containerRef} className="h-10"></div>

            {/* View All Button after 3 fetches */}
            {page > 3 && (
                <div className="flex justify-center mt-6">
                    <Link
                        href="/products"
                        className="px-6 py-2 bg-fuchsia-700 text-white rounded-lg hover:bg-fuchsia-800"
                    >
                        View All
                    </Link>
                </div>
            )}
        </div>
    )
}

export default ForYou
