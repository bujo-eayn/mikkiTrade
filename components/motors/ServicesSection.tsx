import React from 'react';

// Define the type for the service
type Service = {
    title: string;
    description: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
};

const ServicesSection: React.FC<{ services: Service[] }> = ({ services }) => {
    return (
        <div className="container relative flex flex-col justify-between h-full max-w-6xl px-10 mx-auto xl:px-0 mt-5">
            <h2 className="mb-1 text-3xl font-extrabold leading-tight text-gray-900">Services</h2>
            <p className="mb-12 text-lg text-gray-500">Here is a few of the awesome Services we provide.</p>
            <div className="w-full">
                {services?.length > 0 && (
                    <div className="flex flex-wrap -mx-4">
                        {services.map((service, index) => (
                            <div key={index} className="w-full sm:w-1/2 lg:w-1/3 px-4 mb-10">
                                <div className="relative h-full">
                                    <span
                                        className={`absolute top-0 left-0 w-full h-full mt-1 ml-1 rounded-lg ${service.bgColor}`}
                                    ></span>
                                    <div
                                        className={`relative h-full p-5 bg-white border-2 rounded-lg ${service.borderColor}`}
                                    >
                                        <div className="flex items-center -mt-1">
                                            <h3 className="my-2 ml-3 text-lg font-bold text-gray-800">
                                                {service.title}
                                            </h3>
                                        </div>
                                        <p className={`mt-3 mb-1 text-xs font-medium uppercase ${service.textColor}`}>
                                            ------------
                                        </p>
                                        <p className="mb-2 text-gray-600">{service.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServicesSection;
