'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { submitContact } from '@/app/[locale]/actions/contact';

export default function ContactForm() {
  const t = useTranslations('contact');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    const formData = new FormData(e.currentTarget);
    const result = await submitContact(formData);
    setStatus(result.success ? 'success' : 'error');
    if (result.success) {
      (e.target as HTMLFormElement).reset();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-name" className="text-navy text-xs font-semibold font-body uppercase tracking-wide">
          {t('namePlaceholder')}
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal font-body text-sm transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-email" className="text-navy text-xs font-semibold font-body uppercase tracking-wide">
          {t('emailPlaceholder')}
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal font-body text-sm transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-message" className="text-navy text-xs font-semibold font-body uppercase tracking-wide">
          {t('messagePlaceholder')}
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal font-body text-sm resize-none transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full px-6 py-4 bg-teal text-white font-montserrat font-bold rounded-xl hover:bg-teal/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {status === 'loading' ? (
          <>
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            Sending…
          </>
        ) : (
          t('submit')
        )}
      </button>

      <div aria-live="polite" aria-atomic="true" className="min-h-[1.25rem]">
        {status === 'success' && (
          <p className="text-teal text-sm text-center font-body">{t('successMessage')}</p>
        )}
        {status === 'error' && (
          <p className="text-red-500 text-sm text-center font-body">{t('errorMessage')}</p>
        )}
      </div>
    </form>
  );
}
