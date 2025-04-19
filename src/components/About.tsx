import React from 'react';
import { Link } from './Link';

export function About() {
  return (
    <section id="about-us" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">About Us</h2>
            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed">
                Sunlight Supply Company is a leading provider of high-quality recycled
                plastic materials, serving industries around the globe. We are committed to
                sustainability, driving innovation, and reducing environmental impact
                through our dedicated efforts in plastic recycling.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We welcome you to get to know our passionate team and learn more about
                our ongoing journey towards a more sustainable future. Our commitment is
                rooted in transparency, excellence, and making a positive contribution to
                both our clients and the environment.
              </p>
            </div>
            <Link
              href="#contact-us"
              className="inline-block bg-[#0056b3] hover:bg-[#004494] text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Contact Our Team
            </Link>
          </div>
          <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80"
              alt="Our Team"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}