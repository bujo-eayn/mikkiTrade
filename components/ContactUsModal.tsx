'use client';

import React, { useRef, useEffect } from 'react';
import { FaPhoneAlt, FaEnvelope, FaWhatsapp } from 'react-icons/fa';
import { CONTACT_DETAILS} from "../constants.js"; // Adjust the import path as necessary

interface ContactUsModalProps {
    onClose: () => void;
}

const ContactUsModal: React.FC<ContactUsModalProps> = ({ onClose }) => {
    const modalRef = useRef<HTMLDivElement | null>(null);

    const phoneNumber = CONTACT_DETAILS.PHONE_NUMBER;
    const emailAddress = CONTACT_DETAILS.EMAIL_ADDRESS;
    const whatsappMessage = 'Hello, I am interested in learning more about the following regarding Mikki Trade:';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div ref={modalRef} className="bg-blue-950 text-blue-100 rounded-xl p-6 shadow-2xl max-w-sm w-full relative animate-slide-down">
                <h2 className="text-2xl font-bold mb-4 text-white">Contact Us</h2>

                <ul className="space-y-4">
                    <li className="flex items-center space-x-3">
                        <FaPhoneAlt className="text-cyan-400" />
                        <a href={`tel:${phoneNumber}`} className="hover:text-white transition">{phoneNumber}</a>
                    </li>
                    <li className="flex items-start space-x-3">
                        <FaEnvelope className="text-cyan-400 mt-1" />
                        <a
                            href={`mailto:${emailAddress}?subject=Inquiry&body=${encodeURIComponent(whatsappMessage)}`}
                            className="hover:text-white transition"
                        >
                            {emailAddress}<br />
                            <span className="text-sm text-blue-300">Pre-filled inquiry message</span>
                        </a>
                    </li>
                    <li className="flex items-start space-x-3">
                        <FaWhatsapp className="text-cyan-400 mt-1" />
                        <a
                            href={`https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent(whatsappMessage)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white transition"
                        >
                            WhatsApp Chat<br />
                            <span className="text-sm text-blue-300">Pre-filled inquiry message</span>
                        </a>
                    </li>
                </ul>

                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-blue-300 hover:text-white text-xl font-bold"
                    aria-label="Close contact modal"
                >
                    &times;
                </button>
            </div>
        </div>
    );
};

export default ContactUsModal;
