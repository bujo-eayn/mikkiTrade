'use client';

import React, { useState } from 'react';

interface Product {
    id: number;
    name: string;
    brand: string;
    price: number;
    oldPrice: number;
    imageUrl: string;
}

const products: Product[] = [
    {
        id: 1,
        name: 'Product Name 1',
        brand: 'Design',
        price: 149,
        oldPrice: 199,
        imageUrl: 'https://images.unsplash.com/photo-1646753522408-077ef9839300?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    },
    {
        id: 2,
        name: 'Product Name 2',
        brand: 'Development',
        price: 149,
        oldPrice: 199,
        imageUrl: 'https://images.unsplash.com/photo-1651950519238-15835722f8bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    },
    {
        id: 3,
        name: 'Product Name 3',
        brand: 'Marketing',
        price: 149,
        oldPrice: 199,
        imageUrl: 'https://images.unsplash.com/photo-1606813909359-ccd3f84e1d7c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    },
    {
        id: 4,
        name: 'Product Name 4',
        brand: 'Design',
        price: 149,
        oldPrice: 199, 
        imageUrl: 'https://source.unsplash.com/featured/?car',
    },
    {
        id: 5,
        name: 'Product Name 5',
        brand: 'Development',
        price: 149,
        oldPrice: 199,
        imageUrl: 'https://images.unsplash.com/photo-1651950519238-15835722f8bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    },
    {
        id: 6,
        name: 'Product Name 6',
        brand: 'Marketing',
        price: 149,
        oldPrice: 199,
        imageUrl: 'https://images.unsplash.com/photo-1606813909359-ccd3f84e1d7c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    },
    {
        id: 7,
        name: 'Product Name 7',
        brand: 'Development',
        price: 149,
        oldPrice: 199,
        imageUrl: 'https://images.unsplash.com/photo-1651950519238-15835722f8bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    },
    {
        id: 8,
        name: 'Product Name 8',
        brand: 'Marketing',
        price: 149,
        oldPrice: 199,
        imageUrl: 'https://images.unsplash.com/photo-1606813909359-ccd3f84e1d7c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    },
];

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => (
    <div className="w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl">
        <a href="#">
            <img
                src={product.imageUrl}
                alt={product.name}
                className="h-80 w-72 object-cover rounded-t-xl"
            />
            <div className="px-4 py-3 w-72">
                <span className="text-gray-400 mr-3 uppercase text-xs">{product.brand}</span>
                <p className="text-lg font-bold text-black truncate capitalize">{product.name}</p>
                <div className="flex items-center">
                    <p className="text-lg font-semibold text-black my-3">${product.price}</p>
                    <del>
                        <p className="text-sm text-gray-600 ml-2">${product.oldPrice}</p>
                    </del>
                    <div className="ml-auto">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            className="bi bi-bag-plus"
                            viewBox="0 0 16 16"
                        >
                            <path
                                fillRule="evenodd"
                                d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z"
                            />
                            <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
                        </svg>
                    </div>
                </div>
            </div>
        </a>
    </div>
);

const Gallery: React.FC = () => {
    const [selectedBrand, setSelectedBrand] = useState<string>('All');

    const brands = ['All', 'Design', 'Development', 'Marketing', 'BrandX', 'BrandY', 'BrandZ', 'BrandA', 'BrandB', 'BrandC'];

    const filteredProducts = selectedBrand === 'All'
        ? products
        : products.filter(product => product.brand === selectedBrand);

    return (
        <div className="text-center p-10">
            <h1 className="font-bold text-black text-4xl mb-4">Our Products</h1>

            {/* Brand Filter Panel */}
            <div className="flex items-center justify-center mb-10">
                <div className="flex overflow-x-auto flex-nowrap w-3/4 space-x-4 p-2 border border-blue-600 rounded-xl scrollbar-hide">
                    {brands.map((brand) => (
                        <button
                            key={brand}
                            onClick={() => setSelectedBrand(brand)}
                            className={`flex-shrink-0 px-4 py-2 text-sm font-medium capitalize md:py-3 md:px-12 rounded-xl transition-colors duration-300 
                ${selectedBrand === brand
                                    ? 'bg-blue-600 text-white'
                                    : 'text-blue-600 hover:bg-blue-600 hover:text-white'
                                }`}
                        >
                            {brand}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products */}
            <section
                id="Projects"
                className="w-fit mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-items-center gap-y-20 gap-x-14"
            >
                {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </section>
        </div>
    );
};

export default Gallery;
