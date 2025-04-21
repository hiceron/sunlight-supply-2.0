import React from 'react';
import { useTranslation } from 'react-i18next';
import { Facebook, Linkedin, Instagram } from 'lucide-react';

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-[#0056b3] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">{t('footer.aboutTitle')}</h3>
            <p className="text-gray-300">
              {t('footer.aboutDesc')}
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">{t('footer.linksTitle')}</h3>
            <ul className="space-y-2">
              {[
                { key: 'home', anchor: 'home' },
                { key: 'about', anchor: 'about-us' },
                { key: 'sustainability', anchor: 'sustainability' },
                { key: 'contact', anchor: 'contact-us' }
              ].map(({ key, anchor }) => (
                <li key={key}>
                  <a
                    href={`#${anchor}`}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {t(`header.${key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">{t('footer.contactTitle')}</h3>
            <ul className="space-y-2 text-gray-300">
              <li>{t('footer.address1')}</li>
              <li>{t('footer.address2')}</li>
              <li>{t('footer.address3')}</li>
              <li>{t('footer.email')}</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">{t('footer.followTitle')}</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>© 2024 Sunlight Supply Company. All rights reserved.</p>
          <div className="mt-4 space-x-4">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}