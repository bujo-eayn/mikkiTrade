import ContactUs from "@/components/ContactUs";
import Gallery from "@/components/Gallery";
import Hero from "@/components/Hero";
import Banner from "@/components/motors/Banner";
import NewArrivals from "@/components/motors/NewArrivals";
import TopNavbar from "@/components/motors/TopNavbar";
import { Main } from "next/document";

import { Globe, Banknote, CalendarClock, Truck, UserCheck, Gavel, Wallet } from 'lucide-react'
import Services from "@/components/motors/Services";
import TopRanking from "@/components/motors/TopRanking";
import ForYou from "@/components/motors/ForYou";
import Deals from "@/components/Deals";

const slides = [
    {
        imageUrl: '/images/hero1.jpg',
        title: 'Slide 1',
        description: 'This is the first slide of the carousel.',
        link: '/product/1',
    },
    {
        imageUrl: '/images/hero2.jpg',
        title: 'Slide 2',
        description: 'This is the second slide of the carousel.',
        link: '/product/2',
    },
    {
        imageUrl: '/images/hero1.jpg',
        title: 'Slide 3',
        description: 'This is the third slide of the carousel.',
        link: '/product/3',
    },
    {
        imageUrl: '/images/hero2.jpg',
        title: 'Slide 4',
        description: 'This is the second slide of the carousel.',
        link: '/product/2',
    },
    {
        imageUrl: '/images/hero1.jpg',
        title: 'Slide 5',
        description: 'This is the third slide of the carousel.',
        link: '/product/3',
    },
]

const products = [
    {
        id: 1,
        image: 'https://loremflickr.com/300/200/grape',
        title: 'Cocktail',
        description: 'Tropical mix of flavors, perfect for parties.',
        price: 8.99,
        link: 'https://lqrs.com',
        tags: 'Local Used, Foreign Used, To Import, Locally Available, 3000CC, Manual, Automatic'

    },
    {
        id: 2,
        image: 'https://loremflickr.com/300/200/apple',
        title: 'Smoothie',
        description: 'Refreshing blend of fruits and yogurt.',
        price: 5.49,
        link: 'https://lqrs.com',
        tags: 'Local Used, Foreign Used, To Import, Locally Available, 3000CC, Manual, Automatic'

    },
    // More products...
    {
        id: 3,
        image: `https://loremflickr.com/300/200/${encodeURIComponent('banana')}`,
        title: 'Iced Coffee',
        description: 'Cold brewed coffee with a hint of vanilla.',
        price: 4.99,
        link: 'https://lqrs.com',
        tags: 'Local Used, Foreign Used, To Import, Locally Available, 3000CC, Manual, Automatic'

    },
    {
        id: 4,
        image: `https://loremflickr.com/300/200/${encodeURIComponent('berry')}`,
        title: 'Mojito',
        description: 'Classic Cuban cocktail with mint and lime.',
        price: 7.99,
        link: 'https://lqrs.com',
        tags: 'Local Used, Foreign Used, To Import, Locally Available, 3000CC, Manual, Automatic'

    },
    {
        id: 5,
        image: `https://loremflickr.com/300/200/${encodeURIComponent('orange')}`,
        title: 'Matcha Latte',
        description: 'Creamy green tea latte, rich in antioxidants.',
        price: 6.49,
        link: 'https://lqrs.com',
        tags: 'Local Used, Foreign Used, To Import, Locally Available, 3000CC, Manual, Automatic'

    },
    {
        id: 6,
        image: `https://loremflickr.com/300/200/${encodeURIComponent('peach')}`,
        title: 'Fruit Punch',
        description: 'Sweet and tangy punch, bursting with fruity flavors.',
        price: 3.99,
        link: 'https://lqrs.com',
        tags: 'Local Used, Foreign Used, To Import, Locally Available, 3000CC, Manual, Automatic'

    },
    {
        id: 7,
        image: `https://loremflickr.com/300/200/${encodeURIComponent('cherry')}`,
        title: 'Bubble Tea',
        description: 'Chewy tapioca pearls in a sweet milk tea base.',
        price: 4.99,
        link: 'https://lqrs.com',
        tags: 'Local Used, Foreign Used, To Import, Locally Available, 3000CC, Manual, Automatic'
    },
]

const services = [
    {
        title: 'Japan Auction Access',
        description: 'We’re connected to 200+ Japanese auctions and have access to most Japanese dealers stock, giving you a wide selection of high- quality vehicles at competitive prices.',
        color: '#7c3aed', // Violet
        icon: <Gavel className="w-6 h-6" />,
    },
    {
        title: 'Free Consultation',
        description: 'Get expert advice on budgeting, deposits, financing, and vehicle clearance—at no cost.',
        color: '#2C3E50', // Midnight Blue
        icon: <UserCheck className="w-6 h-6" />,
    },
    {
        title: 'Dual Market Stock',
        description: 'Skip the middlemen and choose from a wide selection of vehicles already in Kenya or directly from Japan—reliable, fast, and transparent.',
        color: '#2563eb', // Blue
        icon: <Globe className="w-6 h-6" />,
    },
    {
        title: 'Partial Payments',
        description: 'Make payments in stages to ease your financial burden pay 50% on booking and the remaining 50% upon arrival or delivery of your vehicle.',
        color: '#059669', // Emerald
        icon: <Wallet className="w-6 h-6" />,
    },
    {
        title: 'Doorstep Delivery',
        description: 'From buying in Japan to shipping, customs clearance, and doorstep delivery—we handle it all for a smooth, stress- free experience.',
        color: '#f59e0b', // Amber
        icon: <Truck className="w-6 h-6" />,
    },
    {
        title: 'Flexible Financing',
        description: 'With as little as a 50% deposit, enjoy extended payment periods of up to 2 year.',
        color: '#dc2626', // Red
        icon: <CalendarClock className="w-6 h-6" />,
    },
    {
        title: 'Payment Options',
        description: 'You can make payment to our local office in Kenya, and we’ll handle the transfer to Japan on your behalf. Prefer to manage it yourself? Send payment directly to Japan and take care of customs personally—with full transparency every step of the way.',
        color: '#34495E', // Slate Gray
        icon: <Banknote className="w-6 h-6" />,
    },
]
//     {
//         id: 1,
//         title: "20% off every Product",
//         subtitle: "Black Friday Sale",
//         ctaText: "Buy now",
//         icon: null,
//         image: "/images/deal1.png",
//         link: "#"
//     },
//     {
//         id: 2,
//         title: "Free Delivery on All Orders",
//         subtitle: "Holiday Special",
//         ctaText: "Shop now",
//         image: "/images/deal2.png",
//         icon: null,
//         link: "#"
//     },
//     {
//         id: 3,
//         title: "Exclusive Deals on SUVs",
//         subtitle: "Car Import Offer",
//         ctaText: "Explore",
//         image: "/images/deal3.png",
//         icon: null,
//         link: "#"
//     }
// ];

export default function LandingMotorsPage() {
    return (
        <div>
            <TopNavbar />

            <Banner slides={slides} />

            <Services services={services} />

            <NewArrivals products={products} />
            
            <Deals />

            <ForYou />

        </div>
    );
}
