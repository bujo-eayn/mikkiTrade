import Image from "next/image";
import CompanySection from "@/components/CompanySection";
import Hero from "@/components/Hero";
import About from "@/components/About";

export default function Home() {
  return (
    <main>
      <Hero variant="international" />

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
