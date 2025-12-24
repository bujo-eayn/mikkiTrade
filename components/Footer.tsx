import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="text-black py-10 mt-20">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-evenly gap-10">
                {/* Brands Section */}
                <div className="flex flex-col items-center text-center">
                    <h4 className="font-bold mb-2 text-fuchsia-700">Brands</h4>
                    <ul className="flex gap-4 flex-wrap justify-center">
                        <li>
                            <Link
                                href="/mikki-trade-motors"
                                className="transition-all duration-300 transform hover:scale-105 hover:shadow-md hover:text-fuchsia-700 hover:underline"
                            >
                                Mikki Trade Motors
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/mikki-trade-production"
                                className="transition-all duration-300 transform hover:scale-105 hover:shadow-md hover:text-fuchsia-700 hover:underline"
                            >
                                Mikki Trade Production
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Socials Section */}
                <div className="flex flex-col items-center text-center">
                    <h4 className="font-bold mb-2 text-fuchsia-700">Follow Us</h4>
                    <ul className="flex gap-4 flex-wrap justify-center">
                        <li>
                            <a
                                href="https://www.facebook.com/people/Mikkitrade-Int-Ltd/100065314238004/"
                                target="_blank" rel="noopener noreferrer"
                                className="transition-all duration-300 transform hover:scale-105 hover:shadow-md hover:text-fuchsia-700 hover:underline"
                            >
                                Facebook
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://www.instagram.com/mikkitrade_int"
                                target="_blank" rel="noopener noreferrer"
                                className="transition-all duration-300 transform hover:scale-105 hover:shadow-md hover:text-fuchsia-700 hover:underline"
                            >
                                Instagram
                            </a>
                        </li>
                        <li>
                            <a
                                href="http://tiktok.com/@mikkitrade.int"
                                target="_blank" rel="noopener noreferrer"
                                className="transition-all duration-300 transform hover:scale-105 hover:shadow-md hover:text-fuchsia-700 hover:underline"
                            >
                                TikTok
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Get In Touch Section */}
                <div className="flex flex-col items-center text-center">
                    <h4 className="font-bold mb-2 text-fuchsia-700">Get in touch</h4>
                    <ul className="flex gap-4 flex-wrap justify-center">
                        <li className="font-semibold mt-1">+(254) 708 149 430</li>
                        <li><a
                            href="mailto:support@mikkitrade.com"
                            target="_blank" rel="noopener noreferrer"
                            className="transition-all duration-300 transform hover:scale-105 hover:shadow-md hover:text-fuchsia-700 hover:underline"
                        >
                            support@mikkitrade.com
                        </a></li>
                    </ul>
                </div>

                {/* Locations Section */}
                <div className="flex flex-col items-center text-center">
                    <h4 className="font-bold mb-2 text-fuchsia-700">Locations</h4>
                    <ul className="flex gap-4 flex-wrap justify-center">
                        <li>
                            <Link
                                href="https://maps.app.goo.gl/TkzoN6nKz2urwuNTA"
                                target="_blank" rel="noopener noreferrer"
                                className="transition-all duration-300 transform hover:scale-105 hover:shadow-md hover:text-fuchsia-700 hover:underline"
                            >
                                Mikki Trade Motors <br /> Milimani Business Park, Nairobi, Kenya
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="https://maps.app.goo.gl/TkzoN6nKz2urwuNTA"
                                target="_blank" rel="noopener noreferrer"
                                className="transition-all duration-300 transform hover:scale-105 hover:shadow-md hover:text-fuchsia-700 hover:underline"
                            >
                                Mikki Trade Production <br /> Milimani Business Park, Nairobi, Kenya
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
                        className="transition-all duration-300 transform hover:scale-105 hover:shadow-md hover:text-fuchsia-700 hover:underline"
                    >
                        ITEDA Solutions
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
