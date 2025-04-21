import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * LanguageSwitcher as a dropdown menu for language selection.
 */
export const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'th', label: 'ไทย' },
  ];

  const handleSelect = (lng: string) => {
    i18n.changeLanguage(lng);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        className="px-3 py-1 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('header.languageSwitcher') || 'Change language'}
        type="button"
      >
        {languages.find(l => l.code === i18n.language)?.label || 'Language'}
        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg" role="listbox">
          {languages.map((lng) => (
            <li
              key={lng.code}
              className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${i18n.language === lng.code ? 'font-bold text-blue-700' : ''}`}
              onClick={() => handleSelect(lng.code)}
              role="option"
              aria-selected={i18n.language === lng.code}
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter') handleSelect(lng.code); }}
            >
              {lng.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
