'use client';

import React, { useEffect } from 'react';

type AboutCardProps = {
    title: string;
    description: string;
};

const AboutCard: React.FC<AboutCardProps> = ({ title, description }) => (
    <div className="p-10 sm:w-full md:w-1/3 md:mb-0 mb-6 flex flex-col items-center sm:mx-auto">
        <div className="pattern-dots-md gray-light">
            <div className="rounded bg-gray-800 p-4 transform translate-x-6 -translate-y-6">
                <div className="flex-grow">
                    <h2 className="text-2xl title-font font-semibold mb-2">{title}</h2>
                    <div className="w-12 h-1 bg-fuchsia-700 mb-4" />
                    <p className="leading-relaxed text-sm text-left">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    </div>
);

type AboutSectionProps = {
    title?: React.ReactNode;
    subtitle?: string;
    cards: AboutCardProps[];
};

const About: React.FC<AboutSectionProps> = ({
    title = 'About Us',
    subtitle = 'The About Section of Mikki Trade International',
    cards,
}) => {
    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/pattern.css';
        link.id = 'pattern-css';
        document.head.appendChild(link);

        return () => {
            document.getElementById('pattern-css')?.remove();
        };
    }, []);

    return (
        <section id="about" className="">
            <div className="max-w-6xl mx-auto px-5 py-24">
                <div className="text-center mb-20">
                    <h1 className="title-font text-black mb-4 text-3xl font-extrabold leading-10 tracking-tight sm:text-5xl sm:leading-none md:text-5xl">
                        {title}
                    </h1>
                    <p className="text-lg text-black leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto">
                        {subtitle}
                    </p>
                    <div className="flex mt-6 justify-center">
                        <div className="w-16 h-1 rounded-full bg-fuchsia-700 inline-flex" />
                    </div>
                </div>

                <div className="flex flex-wrap sm:justify-center sm:-m-4 -mx-4 -mb-10 -mt-4">
                    {cards.map((card, index) => (
                        <AboutCard key={index} title={card.title} description={card.description} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default About;
