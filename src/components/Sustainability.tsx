import React, { useState } from 'react';
import { Leaf, Recycle, Factory, Award, TreePine } from 'lucide-react';

const milestones = [
  {
    year: 2015,
    title: 'Company Founded',
    description: 'Started with a vision to revolutionize plastic recycling in Thailand.',
    icon: Factory,
  },
  {
    year: 2018,
    title: 'ISO Certification',
    description: 'Achieved ISO 14001 Environmental Management certification.',
    icon: Award,
  },
  {
    year: 2020,
    title: 'Zero Waste Initiative',
    description: 'Implemented zero-waste manufacturing processes.',
    icon: Recycle,
  },
  {
    year: 2023,
    title: 'Carbon Neutral',
    description: 'Achieved carbon neutrality in all operations.',
    icon: TreePine,
  },
];

const initiatives = [
  {
    title: 'Recycling Process',
    description: 'Advanced sorting and cleaning technologies ensure high-quality recycled materials.',
    icon: Recycle,
  },
  {
    title: 'Environmental Impact',
    description: 'Reduced CO2 emissions by 60% through renewable energy implementation.',
    icon: Leaf,
  },
  {
    title: 'Future Goals',
    description: 'Aiming for 100% renewable energy usage by 2025.',
    icon: TreePine,
  },
];

export function Sustainability() {
  const [selectedMilestone, setSelectedMilestone] = useState<number | null>(null);

  return (
    <section id="sustainability" className="py-20 bg-[#f8f9fa]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Sustainability Journey</h2>
        <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          We are committed to reducing our environmental impact by innovating in the recycling process. 
          Our efforts save tons of plastic from ending up in landfills and oceans every year.
        </p>

        {/* Timeline */}
        <div className="relative mb-20">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-[#0056b3]" />
          <div className="space-y-16">
            {milestones.map((milestone, index) => {
              const Icon = milestone.icon;
              return (
                <div
                  key={milestone.year}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'justify-start' : 'justify-end'
                  }`}
                  onMouseEnter={() => setSelectedMilestone(index)}
                  onMouseLeave={() => setSelectedMilestone(null)}
                >
                  <div
                    className={`w-1/2 ${index % 2 === 0 ? 'pr-8' : 'pl-8'} ${
                      index % 2 === 0 ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div
                      className={`bg-white p-6 rounded-lg shadow-lg transition-transform duration-300 ${
                        selectedMilestone === index ? 'scale-105' : ''
                      }`}
                    >
                      <div className="flex items-center gap-4 mb-2">
                        <Icon className={`w-6 h-6 text-[#0056b3] ${index % 2 === 0 ? 'ml-auto' : ''}`} />
                        <span className="text-xl font-bold">{milestone.year}</span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#0056b3] rounded-full" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Initiatives Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {initiatives.map((initiative) => {
            const Icon = initiative.icon;
            return (
              <div
                key={initiative.title}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <Icon className="w-12 h-12 text-[#0056b3] mb-4" />
                <h3 className="text-xl font-semibold mb-2">{initiative.title}</h3>
                <p className="text-gray-600">{initiative.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}