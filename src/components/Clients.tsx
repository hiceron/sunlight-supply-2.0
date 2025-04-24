import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, Building2, Factory, Recycle, Leaf } from 'lucide-react';

const testimonials = [
  {
    quoteKey: 'clients.testimonials.0.quote',
    authorKey: 'clients.testimonials.0.author',
    positionKey: 'clients.testimonials.0.position',
  },
  {
    quoteKey: 'clients.testimonials.1.quote',
    authorKey: 'clients.testimonials.1.author',
    positionKey: 'clients.testimonials.1.position',
  },
  {
    quoteKey: 'clients.testimonials.2.quote',
    authorKey: 'clients.testimonials.2.author',
    positionKey: 'clients.testimonials.2.position',
  },
];

const partners = [
  { icon: Building2, nameKey: 'clients.partners.0.name' },
  { icon: Factory, nameKey: 'clients.partners.1.name' },
  { icon: Recycle, nameKey: 'clients.partners.2.name' },
  { icon: Leaf, nameKey: 'clients.partners.3.name' }
];

/**
 * Clients component displays testimonials and partners with i18n support.
 *
 * Renders testimonials and a list of partners with unique keys for React lists.
 */
export function Clients() {
  const { t } = useTranslation();
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
          <h2 className="text-3xl font-bold text-center mb-12">{t('clients.heading')}</h2>
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
                  "{t(testimonials[currentTestimonial].quoteKey)}"
                </p>
                <div className="space-y-2">
                  <p className="font-semibold text-gray-900">
                    {t(testimonials[currentTestimonial].authorKey)}
                  </p>
                  <p className="text-gray-500">
                    {t(testimonials[currentTestimonial].positionKey)}
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
          <h2 className="text-3xl font-bold text-center mb-12">{t('clients.partners.heading')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {partners.map((partner) => {
              const Icon = partner.icon;
              return (
                <div
                  key={partner.nameKey}
                  className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center hover:shadow-lg transition-shadow"
                >
                  <Icon className="w-16 h-16 text-[#0056b3] mb-4" />
                  <p className="text-center font-semibold text-gray-800">{t(partner.nameKey)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}