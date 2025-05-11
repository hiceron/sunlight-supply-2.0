import { useTranslation } from 'react-i18next';
import { Link } from './Link';
import { Globe, Ship, Award, FileCheck } from 'lucide-react';

const exportFeatures = [
  {
    icon: Globe,
    titleKey: 'export.features.0.title',
    descriptionKey: 'export.features.0.description',
  },
  {
    icon: Ship,
    titleKey: 'export.features.1.title',
    descriptionKey: 'export.features.1.description',
  },
  {
    icon: Award,
    titleKey: 'export.features.2.title',
    descriptionKey: 'export.features.2.description',
  },
  {
    icon: FileCheck,
    titleKey: 'export.features.3.title',
    descriptionKey: 'export.features.3.description',
  },
];

export function Export() {
  const { t } = useTranslation();
  return (
    <section id="export" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t('export.heading')}</h2>
          <p className="text-gray-600 text-lg">
            {t('export.intro')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {exportFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.titleKey}
                className="bg-[#f8f9fa] rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
              >
                <Icon className="w-12 h-12 text-[#0056b3] mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t(feature.titleKey)}</h3>
                <p className="text-gray-600">{t(feature.descriptionKey)}</p>
              </div>
            );
          })}
        </div>

        <div id="export-cta" className="bg-[#0056b3] text-white rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">{t('export.cta.heading')}</h3>
          <p className="mb-6 text-lg">
            {t('export.cta.description')}
          </p>
          <Link
            href="#contact-us"
            className="inline-block bg-[#ff9900] hover:bg-[#e68a00] text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            {t('export.ctaButton')}
          </Link>
        </div>
      </div>
    </section>
  );
}