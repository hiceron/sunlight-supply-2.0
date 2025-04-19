import React from 'react';
import { Link } from './Link';
import { Globe, Ship, Award, FileCheck } from 'lucide-react';

const exportFeatures = [
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Serving clients across Europe, Asia, and the Americas with reliable plastic recycling solutions.',
  },
  {
    icon: Ship,
    title: 'Logistics Excellence',
    description: 'Efficient shipping and handling processes ensure timely delivery to international destinations.',
  },
  {
    icon: Award,
    title: 'Quality Standards',
    description: 'Meeting international quality certifications and compliance requirements for global markets.',
  },
  {
    icon: FileCheck,
    title: 'Documentation',
    description: 'Complete export documentation and customs clearance support for smooth transactions.',
  },
];

export function Export() {
  return (
    <section id="export" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Export Information</h2>
          <p className="text-gray-600 text-lg">
            We meet international quality standards to serve clients worldwide, including those in the European market. 
            We handle logistics and ensure timely delivery of recycled plastic products.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {exportFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-[#f8f9fa] rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
              >
                <Icon className="w-12 h-12 text-[#0056b3] mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-[#0056b3] text-white rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Export?</h3>
          <p className="mb-6 text-lg">
            Our export team is ready to assist you with international orders and shipping requirements.
          </p>
          <Link
            href="#contact-us"
            className="inline-block bg-[#ff9900] hover:bg-[#e68a00] text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Contact Our Export Team
          </Link>
        </div>
      </div>
    </section>
  );
}