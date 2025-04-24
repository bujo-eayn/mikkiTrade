import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="text-white py-10 mt-20">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-evenly gap-10">
                {/* Brands Section */}
                <div className="flex flex-col items-center text-center">
                    <h4 className="font-bold mb-2">Brands</h4>
                    <ul className="flex gap-4 flex-wrap justify-center">
                        <li>
                            <Link
                                href="/mikki-trade-motors"
                                className="transition-all duration-300 transform hover:scale-105 hover:shadow-md hover:text-gray-300 hover:underline"
                            >
                                Mikki Trade Motors
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/mikki-trade-production"
                                className="transition-all duration-300 transform hover:scale-105 hover:shadow-md hover:text-gray-300 hover:underline"
                            >
                                Mikki Trade Production
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Socials Section */}
                <div className="flex flex-col items-center text-center">
                    <h4 className="font-bold mb-2">Follow Us</h4>
                    <ul className="flex gap-4 flex-wrap justify-center">
                        <li>
                            <a
                                href="#"
                                className="transition-all duration-300 transform hover:scale-105 hover:shadow-md hover:text-gray-300 hover:underline"
                            >
                                Facebook
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="transition-all duration-300 transform hover:scale-105 hover:shadow-md hover:text-gray-300 hover:underline"
                            >
                                Instagram
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="transition-all duration-300 transform hover:scale-105 hover:shadow-md hover:text-gray-300 hover:underline"
                            >
                                LinkedIn
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Get In Touch Section */}
                <div className="flex flex-col items-center text-center">
                    <h4 className="font-bold mb-2">Get in touch</h4>
                    <ul className="flex gap-4 flex-wrap justify-center">
                        <li className="font-semibold mt-1">+(1) 123 456 7890</li>
                        <li><a
                            href="mailto:support@mikkitrade.com"
                            className="transition-all duration-300 transform hover:scale-105 hover:shadow-md hover:text-gray-300 hover:underline"
                        >
                            support@mikkitrade.com
                        </a></li>
                    </ul>
                </div>

                {/* Locations Section */}
                <div className="flex flex-col items-center text-center">
                    <h4 className="font-bold mb-2">Locations</h4>
                    <ul className="flex gap-4 flex-wrap justify-center">
                        <li>
                            <Link
                                href="/mikki-trade-motors"
                                className="transition-all duration-300 transform hover:scale-105 hover:shadow-md hover:text-gray-300 hover:underline"
                            >
                                Mikki Trade Motors
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/mikki-trade-production"
                                className="transition-all duration-300 transform hover:scale-105 hover:shadow-md hover:text-gray-300 hover:underline"
                            >
                                Mikki Trade Production
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-700 my-8 w-11/12 mx-auto"></div>

            {/* Signature */}
            <div className=" text-black text-center text-sm space-y-1">
                <div>
                    © {currentYear} Mikki Trade Platforms.
                </div>
                <div>
                    Created and Maintained by{' '}
                    <a
                        href="https://itedasolutions.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-all duration-300 transform hover:scale-105 hover:shadow-md hover:text-gray-300 hover:underline"
                    >
                        ITEDA Solutions
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
