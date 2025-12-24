'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Dialog } from '@headlessui/react'
import { PhoneCall, MessageSquare, Mail, MessageCircleMore } from 'lucide-react'

type Service = {
    title: string
    description: string
    color: string
    icon: React.ReactNode
}

type ServiceProps = {
    services: Service[]
}

const Service: React.FC<ServiceProps> = ({ services }) => {
    const [selectedService, setSelectedService] = useState<Service | null>(null)

    const phoneNumber = '+254708149430' // 📞 Your team's phone number
    const emailAddress = 'info@strathmore.edu' // 📧 Your team's email address

    const openWhatsApp = (service: string) => {
        window.open(`https://wa.me/${phoneNumber}?text=Hello, I'm interested in ${service}`, '_blank')
    }

    const openCall = () => {
        window.location.href = `tel:${phoneNumber}`
    }

    const openMessage = (service: string) => {
        window.location.href = `sms:${phoneNumber}?body=Hello, I'm interested in ${service}`
    }

    const openEmail = (service: string) => {
        window.location.href = `mailto:${emailAddress}?subject=Inquiry about ${service}&body=Hello, I'm interested in ${service}`
    }

    return (
        <div className="max-w-7xl mx-auto px-4">

            {/* Services Title */}
            <h2 className="text-lg font-bold text-gray-800 mt-4">Services</h2>

            {/* Scrollable Cards */}
            <div className="flex gap-4 overflow-x-auto scrollbar-hide py-6">
                {services.map((service, index) => (
                    <div
                        key={index}
                        onClick={() => setSelectedService(service)}
                        className="flex-shrink-0 w-74 cursor-pointer rounded-lg p-6 text-white shadow-lg"
                        style={{ backgroundColor: service.color }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            {service.icon}
                            <h3 className="text-xl font-bold">{service.title}</h3>
                        </div>
                        <p className="text-sm">{service.description.slice(0, 60)}...</p>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {selectedService && (
                <Dialog open={true} onClose={() => setSelectedService(null)} className="relative z-50">
                    {/* Overlay */}
                    <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

                    {/* Modal Panel */}
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Dialog.Panel className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-xl">
                            <Dialog.Title className="text-2xl font-bold text-gray-900 mb-4">
                                {selectedService.title}
                            </Dialog.Title>
                            <Dialog.Description className="text-gray-700 mb-6">
                                {selectedService.description}
                            </Dialog.Description>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-4">
                                <button
                                    onClick={() => openWhatsApp(selectedService.title)}
                                    className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-2 flex items-center justify-center gap-2"
                                >
                                    <MessageCircleMore className="w-5 h-5" />
                                    WhatsApp
                                </button>
                                <button
                                    onClick={openCall}
                                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center justify-center gap-2"
                                >
                                    <PhoneCall className="w-5 h-5" />
                                    Call
                                </button>
                                <button
                                    onClick={() => openMessage(selectedService.title)}
                                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg px-4 py-2 flex items-center justify-center gap-2"
                                >
                                    <MessageSquare className="w-5 h-5" />
                                    Message
                                </button>
                                <button
                                    onClick={() => openEmail(selectedService.title)}
                                    className="flex-1 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-lg px-4 py-2 flex items-center justify-center gap-2"
                                >
                                    <Mail className="w-5 h-5" />
                                    Email
                                </button>
                            </div>

                            <button
                                onClick={() => setSelectedService(null)}
                                className="mt-6 w-full text-center text-sm text-gray-500 hover:underline"
                            >
                                Close
                            </button>
                        </Dialog.Panel>
                    </div>
                </Dialog>
            )}
        </div>
    )
}

export default Service
