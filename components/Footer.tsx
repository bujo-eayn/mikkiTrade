import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, Music2, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gradient-to-br from-[#2b404f] via-[#3d5a6f] to-[#2b404f] text-white mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">

                    {/* Company Info & Logo */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <Image
                                src="/images/logo-motors.png"
                                alt="Mikki Trade"
                                width={50}
                                height={50}
                                className="w-12 h-12"
                            />
                            <div>
                                <h3 className="text-xl font-bold text-white">Mikki Trade</h3>
                                <p className="text-xs text-gray-300">International Ltd.</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">
                            Your trusted partner for quality automotive solutions and industrial production services across East Africa.
                        </p>
                        {/* Social Media Icons */}
                        <div className="flex space-x-4 pt-2">
                            <a
                                href="https://www.facebook.com/people/Mikkitrade-Int-Ltd/100065314238004/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#a235c3] flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                                aria-label="Facebook"
                            >
                                <Facebook size={18} />
                            </a>
                            <a
                                href="https://www.instagram.com/mikkitrade_int"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#a235c3] flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                                aria-label="Instagram"
                            >
                                <Instagram size={18} />
                            </a>
                            <a
                                href="http://tiktok.com/@mikkitrade.int"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#a235c3] flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                                aria-label="TikTok"
                            >
                                <Music2 size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Our Brands */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-bold text-white border-b-2 border-[#a235c3] pb-2 inline-block">Our Brands</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="/mikki-trade-motors"
                                    className="text-gray-300 hover:text-[#a235c3] transition-colors duration-300 flex items-start group"
                                >
                                    <span className="mr-2 text-[#a235c3] group-hover:translate-x-1 transition-transform duration-300">→</span>
                                    <span className="text-sm">Mikki Trade Motors</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/mikki-trade-production"
                                    className="text-gray-300 hover:text-[#a235c3] transition-colors duration-300 flex items-start group"
                                >
                                    <span className="mr-2 text-[#a235c3] group-hover:translate-x-1 transition-transform duration-300">→</span>
                                    <span className="text-sm">Mikki Trade Production</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-bold text-white border-b-2 border-[#a235c3] pb-2 inline-block">Contact Us</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start space-x-3 text-sm">
                                <Phone size={18} className="text-[#a235c3] flex-shrink-0 mt-0.5" />
                                <span className="text-gray-300">+(254) 708 149 430</span>
                            </li>
                            <li className="flex items-start space-x-3 text-sm">
                                <Mail size={18} className="text-[#a235c3] flex-shrink-0 mt-0.5" />
                                <a
                                    href="mailto:support@mikkitrade.com"
                                    className="text-gray-300 hover:text-[#a235c3] transition-colors duration-300"
                                >
                                    support@mikkitrade.com
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Locations */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-bold text-white border-b-2 border-[#a235c3] pb-2 inline-block">Our Locations</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start space-x-3 text-sm">
                                <MapPin size={18} className="text-[#a235c3] flex-shrink-0 mt-0.5" />
                                <Link
                                    href="https://maps.app.goo.gl/TkzoN6nKz2urwuNTA"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-300 hover:text-[#a235c3] transition-colors duration-300"
                                >
                                    <div className="font-semibold text-white">Mikki Trade Motors</div>
                                    Milimani Business Park<br />
                                    Nairobi, Kenya
                                </Link>
                            </li>
                            <li className="flex items-start space-x-3 text-sm">
                                <MapPin size={18} className="text-[#a235c3] flex-shrink-0 mt-0.5" />
                                <Link
                                    href="https://maps.app.goo.gl/TkzoN6nKz2urwuNTA"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-300 hover:text-[#a235c3] transition-colors duration-300"
                                >
                                    <div className="font-semibold text-white">Mikki Trade Production</div>
                                    Milimani Business Park<br />
                                    Nairobi, Kenya
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="text-sm text-gray-300 text-center md:text-left">
                            © {currentYear} Mikki Trade International Ltd. All rights reserved.
                        </div>
                        <div className="text-sm text-gray-300 text-center md:text-right">
                            Created by{' '}
                            <a
                                href="https://itedasolutions.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#a235c3] hover:text-white font-semibold transition-colors duration-300"
                            >
                                ITEDA Solutions
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
