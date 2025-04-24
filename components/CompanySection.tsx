import Image from 'next/image';
import Link from 'next/link';

interface CompanySectionProps {
    title: string;
    description: string;
    imageSrc: string;
    link: string;
}

const CompanySection = ({ title, description, imageSrc, link }: CompanySectionProps) => {
    return (
        <div className="max-w-7xl mx-auto my-12 px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-500 rounded-lg shadow-white p-6">
                <div className="md:w-1/2">
                    <h2 className="text-2xl text-black font-bold mb-4">{title}</h2>
                    <p className="text-lg text-gray-800">{description}</p>
                </div>
                <div className="md:w-1/2">
                    <Link href={link}>
                        <Image
                            src={imageSrc}
                            alt={title}
                            width={500}
                            height={300}
                            className="rounded shadow-md cursor-pointer hover:scale-105 transition-transform duration-300"
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CompanySection;
