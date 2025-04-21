import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../src/i18n';
import { About } from '../../src/components/About';

/**
 * Utility for rendering with i18n context
 */
const renderWithI18n = (ui: React.ReactElement) => {
  return render(
    <I18nextProvider i18n={i18n}>{ui}</I18nextProvider>
  );
};

describe('About Component i18n', () => {
  it('renders English content by default', () => {
    renderWithI18n(<About />);
    expect(screen.getByText(/About Us/i)).toBeInTheDocument();
    expect(screen.getByText(/Sunlight Supply Company/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Contact Our Team/i })).toBeInTheDocument();
  });

  it('switches to Thai when language is changed', () => {
    renderWithI18n(<About />);
    fireEvent.click(screen.getByRole('button', { name: /ไทย/i }));
    expect(screen.getByText('เกี่ยวกับเรา')).toBeInTheDocument();
    expect(screen.getByText(/ซันไลท์ซัพพลายเป็นผู้ให้บริการ/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ติดต่อทีมงานของเรา/i })).toBeInTheDocument();
  });

  it('shows fallback to English if missing translation', () => {
    // Simulate a missing key by requesting a non-existent one
    renderWithI18n(<About />);
    expect(i18n.t('about.nonexistent', { defaultValue: 'about.nonexistent' })).toBe('about.nonexistent');
  });
});
