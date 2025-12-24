import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
  background?: 'white' | 'gray' | 'gradient' | 'beige';
  padding?: 'default' | 'large' | 'small';
  id?: string;
}

export default function Section({
  children,
  className = '',
  background = 'white',
  padding = 'default',
  id
}: SectionProps) {
  const backgrounds = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    gradient: 'bg-gradient-to-br from-gray-50 to-white',
    beige: 'bg-[#f1eeeb]',
  };

  const paddings = {
    small: 'py-8 md:py-12',
    default: 'py-12 md:py-16',
    large: 'py-16 md:py-24',
  };

  return (
    <section
      id={id}
      className={`${backgrounds[background]} ${paddings[padding]} ${className}`}
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        {children}
      </div>
    </section>
  );
}
