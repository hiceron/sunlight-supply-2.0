import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from './Link';

export function About() {
  const { t } = useTranslation();
  return (
    <section id="about-us" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">{t('about.title')}</h2>
            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed">
                {t('about.description')}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {t('about.welcome')}
              </p>
            </div>
            <Link
              href="#contact-us"
              className="inline-block bg-[#0056b3] hover:bg-[#004494] text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              {t('about.button')}
            </Link>
          </div>
          <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80"
              alt={t('about.imageAlt')}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}