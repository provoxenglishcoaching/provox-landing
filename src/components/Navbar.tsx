'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './ui/LanguageSwitcher';

export default function Navbar() {
  const t = useTranslations('nav');
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: t('program'), href: '#program' },
    { label: t('pricing'), href: '#pricing' },
    { label: t('contact'), href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo — real SVG logo on light bg */}
          <a
            href="#"
            className="flex items-center focus:outline-none focus:ring-2 focus:ring-teal rounded-md"
            aria-label="ProVox home"
          >
            <Image
              src="/logo-light.svg"
              alt="ProVox Professional English Coaching"
              width={160}
              height={56}
              priority
              className="h-10 w-auto"
            />
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-navy/70 hover:text-navy text-sm font-medium transition-colors focus:outline-none focus:text-navy focus:underline decoration-teal underline-offset-4"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <a
              href="#contact"
              className="hidden md:inline-flex items-center px-4 py-2 bg-teal text-white text-sm font-semibold rounded-lg hover:bg-teal/90 transition-colors focus:outline-none focus:ring-2 focus:ring-teal/40"
            >
              {t('cta')}
            </a>
            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-navy/70 hover:text-navy focus:outline-none focus:text-navy transition-colors"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          id="mobile-menu"
          className="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
          style={{ maxHeight: menuOpen ? '300px' : '0px', opacity: menuOpen ? 1 : 0 }}
          aria-hidden={!menuOpen}
        >
          <nav className="border-t border-gray-100 py-4 flex flex-col gap-4" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-navy/70 hover:text-navy text-sm font-medium transition-colors"
                tabIndex={menuOpen ? 0 : -1}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="inline-flex items-center justify-center px-4 py-2 bg-teal text-white text-sm font-semibold rounded-lg hover:bg-teal/90 transition-colors"
              tabIndex={menuOpen ? 0 : -1}
            >
              {t('cta')}
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
