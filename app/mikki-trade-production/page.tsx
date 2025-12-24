import ProductionNavbar from "@/components/production/Navbar";
import ComingSoon from "@/components/ComingSoon";
import ContactUs from "@/components/ContactUs";

export default function ProductionPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <ProductionNavbar />

            {/* Hero Section */}
            <div className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-[#2b404f] via-[#3d5a6f] to-[#a235c3] overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `repeating-linear-gradient(
                            0deg,
                            transparent,
                            transparent 2px,
                            rgba(255,255,255,0.03) 2px,
                            rgba(255,255,255,0.03) 4px
                        ),
                        repeating-linear-gradient(
                            90deg,
                            transparent,
                            transparent 2px,
                            rgba(255,255,255,0.03) 2px,
                            rgba(255,255,255,0.03) 4px
                        )`
                    }}></div>
                </div>

                <div className="relative z-10 text-center px-4 md:px-8 max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        Mikki Trade<br />
                        <span className="text-[#a235c3]">Production</span>
                    </h1>
                    <p className="text-xl md:text-3xl text-white/90 mb-8 font-light">
                        Capturing Moments, Creating Magic
                    </p>
                    <div className="mb-8">
                        <ComingSoon size="large" />
                    </div>
                    <p className="text-white/80 text-lg max-w-2xl mx-auto">
                        Professional videography, photography, and production services launching soon.
                        Stay tuned for something extraordinary.
                    </p>
                </div>
            </div>

            {/* Services Preview Section */}
            <div id="services" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
                        <p className="text-gray-600 text-lg mb-6">
                            Coming soon: Comprehensive production solutions for your creative vision
                        </p>
                        <ComingSoon />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                        {['Videography', 'Photography', 'Advertising', 'Film Production'].map((service) => (
                            <div key={service} className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-[#a235c3] to-[#2b404f] rounded-full mx-auto mb-4 flex items-center justify-center opacity-20">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-400">{service}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Portfolio Section */}
            <div id="portfolio" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Portfolio</h2>
                        <p className="text-gray-600 text-lg mb-6">
                            Our showcase of exceptional work is being curated
                        </p>
                        <ComingSoon />
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div id="team" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
                        <p className="text-gray-600 text-lg mb-6">
                            Talented professionals dedicated to bringing your vision to life
                        </p>
                        <ComingSoon />
                    </div>
                </div>
            </div>

            {/* Contact Section */}
            <div id="contact">
                {/* <ContactUs /> */}
            </div>
        </div>
    );
}
