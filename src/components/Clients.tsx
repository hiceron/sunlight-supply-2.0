import React from 'react';
import { ArrowLeft, ArrowRight, Building2, Factory, Recycle, Leaf } from 'lucide-react';

const testimonials = [
  {
    quote: "Sunlight Supply Company has been instrumental in helping us meet our sustainability goals. Their recycled plastics are top-notch!",
    author: "Jane Doe",
    position: "CEO of EcoProducts"
  },
  {
    quote: "Their commitment to quality and environmental responsibility sets them apart in the industry.",
    author: "John Smith",
    position: "Sustainability Director, GreenTech Solutions"
  },
  {
    quote: "A reliable partner in our journey towards sustainable manufacturing practices.",
    author: "Sarah Johnson",
    position: "Operations Manager, Eco Innovations"
  }
];

const partners = [
  { icon: Building2, name: "EcoProducts" },
  { icon: Factory, name: "GreenTech Solutions" },
  { icon: Recycle, name: "Sustainable Industries" },
  { icon: Leaf, name: "Eco Innovations" }
];

export function Clients() {
  const [currentTestimonial, setCurrentTestimonial] = React.useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="clients-partners" className="py-20 bg-[#f8f9fa]">
      <div className="container mx-auto px-4">
        {/* Testimonials Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-white rounded-xl shadow-lg p-8 md:p-12">
              <button
                onClick={prevTestimonial}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div className="text-center">
                <p className="text-xl md:text-2xl text-gray-700 italic mb-8">
                  "{testimonials[currentTestimonial].quote}"
                </p>
                <div className="space-y-2">
                  <p className="font-semibold text-gray-900">
                    {testimonials[currentTestimonial].author}
                  </p>
                  <p className="text-gray-600">
                    {testimonials[currentTestimonial].position}
                  </p>
                </div>
              </div>
              <button
                onClick={nextTestimonial}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowRight className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Partners Section */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-12">Our Trusted Clients & Partners</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {partners.map((partner) => {
              const Icon = partner.icon;
              return (
                <div
                  key={partner.name}
                  className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center hover:shadow-lg transition-shadow"
                >
                  <Icon className="w-16 h-16 text-[#0056b3] mb-4" />
                  <p className="text-center font-semibold text-gray-800">{partner.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}