import Image from "next/image";
import CompanySection from "@/components/CompanySection";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Carousel from "@/components/Carousel";
import LandingNavbar from "@/components/LandingNavbar";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mikki Trade International | Motors & Production Services in Kenya',
  description: 'Leading provider of quality vehicles and professional production services in Kenya. Explore Mikki Trade Motors for cars and Mikki Trade Production for videography and photography.',
  keywords: 'Mikki Trade, Kenya cars, car dealership Kenya, videography Kenya, production services Kenya',
  openGraph: {
    title: 'Mikki Trade International',
    description: 'Quality vehicles and production services in Kenya',
    url: 'https://mikkitrade.com',
    siteName: 'Mikki Trade International',
    images: [
      {
        url: '/logo-main.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mikki Trade International',
    description: 'Quality vehicles and production services in Kenya',
    images: ['/logo-main.png'],
  },
};

export default function Home() {
  return (
    <main>
      <LandingNavbar />
      {/* <Hero variant="international" /> */}
      <Carousel />

      <About
        title={
          <>
            About Us
          </>
        }
        subtitle="Mikki Trade International"
        cards={[
          {
            title: 'Story',
            description:
              'Founded by a team of passionate experts and entrepreneurs, Mikki Trade International emerged from the need for a seamless bridge between global automotive solutions and creative media services.',
          },
          {
            title: 'Vision',
            description:
              'To be a globally trusted powerhouse that transforms lives through innovative motor trade solutions and cutting-edge creative production.',
          },
          {
            title: 'Mision',
            description:
              'To deliver seamless and trustworthy vehicle import and resale services, empower clients through bold and authentic creative productions, and foster a community driven by excellence, integrity, and innovation.',
          },
        ]}
      />

      <CompanySection
        title="Mikki Trade Motors"
        description="We import, sell, and service premium vehicles across Kenya. Our brand is built on trust, value, and after-sales service."
        imageSrc="/images/hero1.jpg"
        link="/mikki-trade-motors"
      />

      <CompanySection
        title="Mikki Trade Production"
        description="We specialize in professional video production, brand storytelling, and media solutions that enhance brand visibility and market engagement."
        imageSrc="/images/hero2.jpg"
        link="/mikki-trade-production"
      />
    </main>
  );
}
