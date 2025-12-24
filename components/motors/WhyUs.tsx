import { Shield, Award, Users, Wrench, DollarSign, Clock } from 'lucide-react';

export default function WhyUs() {
  const reasons = [
    {
      icon: Shield,
      title: 'Quality Guaranteed',
      description: 'Every vehicle undergoes rigorous inspection to ensure top quality and reliability.',
      color: 'bg-blue-500',
    },
    {
      icon: Award,
      title: '15+ Years Experience',
      description: 'Trusted by thousands of customers across Kenya for over a decade.',
      color: 'bg-purple-500',
    },
    {
      icon: DollarSign,
      title: 'Competitive Pricing',
      description: 'Best prices in the market with flexible payment options and financing available.',
      color: 'bg-green-500',
    },
    {
      icon: Wrench,
      title: 'After-Sales Support',
      description: 'Comprehensive maintenance and repair services for your peace of mind.',
      color: 'bg-orange-500',
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Professional sales and support staff ready to help you find your perfect vehicle.',
      color: 'bg-cyan-500',
    },
    {
      icon: Clock,
      title: 'Fast Processing',
      description: 'Quick and efficient purchase process. Drive away your dream car sooner.',
      color: 'bg-fuchsia-500',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a235c3] to-[#2b404f]">Mikki Trade Motors?</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We're committed to providing you with the best car buying experience in Kenya. Here's what sets us apart.
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-100"
            >
              <div className={`${reason.color} w-16 h-16 rounded-full flex items-center justify-center mb-6`}>
                <reason.icon className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{reason.title}</h3>
              <p className="text-gray-600 leading-relaxed">{reason.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="mt-20 bg-gradient-to-r from-[#a235c3] via-[#7d2ca0] to-[#2b404f] rounded-3xl shadow-2xl p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center text-white">
            <div className="transform hover:scale-110 transition-transform">
              <p className="text-5xl font-bold mb-3">2000+</p>
              <p className="text-base opacity-95 font-medium">Happy Customers</p>
            </div>
            <div className="transform hover:scale-110 transition-transform">
              <p className="text-5xl font-bold mb-3">500+</p>
              <p className="text-base opacity-95 font-medium">Vehicles Sold</p>
            </div>
            <div className="transform hover:scale-110 transition-transform">
              <p className="text-5xl font-bold mb-3">15+</p>
              <p className="text-base opacity-95 font-medium">Years in Business</p>
            </div>
            <div className="transform hover:scale-110 transition-transform">
              <p className="text-5xl font-bold mb-3">98%</p>
              <p className="text-base opacity-95 font-medium">Customer Satisfaction</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 text-lg mb-8">Ready to find your perfect vehicle?</p>
          <a
            href="https://wa.me/254708149430"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#a235c3] to-[#2b404f] text-white px-10 py-5 rounded-full font-semibold text-lg hover:shadow-2xl transform hover:scale-105 transition-all"
          >
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            <span>Contact Us on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}
