import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function Newsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  const { t } = useTranslation();

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">{t('newsletter.heading')}</h2>
        <p className="mb-8 max-w-2xl mx-auto text-gray-600">
          {t('newsletter.description')}
        </p>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('newsletter.placeholder')}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0056b3] focus:border-transparent"
            required
          />
          <button
            type="submit"
            className="bg-[#ff9900] hover:bg-[#e68a00] px-6 py-2 rounded-lg font-semibold transition-colors text-white"
          >
            {t('newsletter.button')}
          </button>
        </form>
      </div>
    </section>
  );
}