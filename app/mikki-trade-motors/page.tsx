import ContactUs from "@/components/ContactUs";
import Gallery from "@/components/Gallery";
import Hero from "@/components/Hero";
import { Main } from "next/document";

export default function MotorsPage() {
    return (
        <div>
            <Hero variant="motors" />

            <div>
                {/* <!-- ABOUT Section --> */}
                <div className="w-full lg:h-screen h-full m-auto flex items-center justify-cetner py-20">
                    <div className="w-full h-full flex flex-col justify-center items-center sm:px-4 px-2">
                        {/* <!--  --> */}
                        <div className="lg:w-[90%] w-full mx-auto flex flex-col lg:gap-6 lg:flex-row items-center justify-center ">
                            <div className="relative">
                                {/* <!-- Side Img 1 --> */}
                                <img className="absolute z-20 lg:left-[2rem] -top-4 left-[1rem] lg:w-[8rem] lg:h-[8rem] sm:w-[6rem] sm:h-[6rem] w-[3rem] h-[3rem] rounded-full" src="https://images.unsplash.com/photo-1496483648148-47c686dc86a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw3fHxmbG93ZXJ8ZW58MHwwfHx8MTcyMDk0OTQ2MHww&ixlib=rb-4.0.3&q=80&w=1080" alt="Side Image" />

                                {/* <!-- Side Img 2 --> */}
                                <img className="absolute z-20 lg:top-[12rem] sm:top-[11rem] top-[5rem] sm:-left-[3rem] -left-[2rem] lg:w-[8rem] lg:h-[8rem] sm:w-[6rem] sm:h-[6rem] w-[3rem] h-[3rem] rounded-full" src="https://images.unsplash.com/photo-1558281033-19cead6981dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxMHx8Zmxvd2VyfGVufDB8MHx8fDE3MjA5NDk0NjB8MA&ixlib=rb-4.0.3&q=80&w=1080" alt="Side Image 2" />

                                {/* <!-- Side Img 3 --> */}
                                <img className="absolute z-20 lg:top-[23rem] sm:top-[20.5rem] top-[10.5rem] left-[2rem] lg:w-[8rem] lg:h-[8rem] sm:w-[6rem] sm:h-[6rem] w-[3rem] h-[3rem] rounded-full" src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxfHxmbG93ZXJ8ZW58MHwwfHx8MTcyMDk0OTQ2MHww&ixlib=rb-4.0.3&q=80&w=1080" alt="Side Image 3" />

                                {/* <!-- Main Img --> */}
                                <img
                                    className="rounded-full relative object-cover right-0 lg:w-[30rem] lg:h-[30rem] sm:w-[25rem] sm:h-[25rem] w-[12rem] h-[12rem] outline sm:outline-offset-[.77em] outline-offset-[.37em] outline-green-500"
                                    src="https://images.unsplash.com/photo-1507290439931-a861b5a38200?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxM3x8Zmxvd2VyfGVufDB8MHx8fDE3MjA5NDk0NjB8MA&ixlib=rb-4.0.3&q=80&w=1080" alt="About us" />
                            </div>
                            {/* <!--  --> */}
                            <div
                                className="lg:w-[60%] bg-gray-800 p-4 w-full h-fit shadow-xl shadow-green-300/40 flex flex-col justify-center items-center sm:px-6 px-4 rounded-xl">
                                <h2 className="text-4xl text-center text-green-600 font-bold px-4 py-1 md:mt-0 mt-10">
                                    About Us
                                </h2>
                                <p className="md:text-3xl text-2xl text-center font-bold my-5">We are
                                    Mikki Trade Motors
                                </p>
                                <p className="md:text-xl sm:text-lg text-base mt-2 text-justify sm:px-2">At Petal Haven,
                                    we believe in the transformative power of flowers. Our blooms are not just arrangements; they are
                                    expressions of beauty, joy, and emotion. From elegant bouquets to enchanting floral designs, we
                                    curate every creation with precision and care. Whether it's a celebration, a gesture of love, or a
                                    moment of solace, Petal Haven's exquisite flowers speak a language of their own, bringing nature's
                                    beauty to your doorstep. Experience the enchantment of Petal Haven and let flowers tell your story.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-gray-800 p-6">
                    <div className="max-w-7xl mx-auto">
                        {/* <!-- Title --> */}
                        <div className="text-center mb-10">
                            <h1 className="text-3xl font-bold">Meet Our Team</h1>
                            <p className="text-gray-800">Our dedicated team of professionals is here to help you succeed.</p>
                        </div>

                        {/* <!-- Team Members Grid --> */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* <!-- Team Member Card --> */}
                            <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                                <img src="https://res.cloudinary.com/djv4xa6wu/image/upload/v1735722161/AbhirajK/Abhirajk2.webp" alt="Team Member 1" className="w-full h-48 object-cover" />
                                    <div className="p-6">
                                        <h2 className="text-xl font-semibold">John Doe</h2>
                                        <p className="text-white">Full-Stack Developer</p>
                                        <div className="flex items-center mt-4 space-x-3">
                                            <a href="#" className="text-blue-500 hover:text-blue-300">[Facebook]</a>
                                            <a href="#" className="text-blue-400 hover:text-blue-300">[Twitter]</a>
                                            <a href="#" className="text-gray-600 hover:text-gray-300">[Email]</a>
                                        </div>
                                    </div>
                            </div>

                            {/* <!-- Duplicate the above block for other team members --> */}
                            <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                                <img src="https://res.cloudinary.com/djv4xa6wu/image/upload/v1735722161/AbhirajK/Abhirajk3.webp" alt="Team Member 2" className="w-full h-48 object-cover" />
                                    <div className="p-6">
                                        <h2 className="text-xl font-semibold">Jane Smith</h2>
                                        <p className="text-white">UI/UX Designer</p>
                                        <div className="flex items-center mt-4 space-x-3">
                                            <a href="#" className="text-blue-500 hover:text-blue-300">[Facebook]</a>
                                            <a href="#" className="text-blue-400 hover:text-blue-300">[Twitter]</a>
                                            <a href="#" className="text-gray-600 hover:text-gray-300">[Email]</a>
                                        </div>
                                    </div>
                            </div>

                            <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                                <img src="https://res.cloudinary.com/djv4xa6wu/image/upload/v1735722163/AbhirajK/Abhirajk%20mykare.webp" alt="Team Member 3" className="w-full h-48 object-cover" />
                                    <div className="p-6">
                                        <h2 className="text-xl font-semibold">Alex Johnson</h2>
                                        <p className="text-white">Project Manager</p>
                                        <div className="flex items-center mt-4 space-x-3">
                                            <a href="#" className="text-blue-500 hover:text-blue-300">[Facebook]</a>
                                            <a href="#" className="text-blue-400 hover:text-blue-300">[Twitter]</a>
                                            <a href="#" className="text-gray-600 hover:text-gray-300">[Email]</a>
                                        </div>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Gallery />

            <ContactUs />
        </div>
    );
}
