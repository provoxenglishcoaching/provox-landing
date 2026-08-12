'use client';

import { useState } from 'react';
import WaveMark from '@/components/ui/WaveMark';

const NAV_LINKS: [string, string][] = [
  ['English Courses', '#courses'],
  ['Coaches', '#about'],
  ['Contact', '#contact'],
];

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="10" r="3.2" />
    <path d="M6.5 19.2a6.5 6.5 0 0 1 11 0" />
  </svg>
);

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50" style={{ background: 'var(--primary)' }}>
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between gap-6">

        {/* Wave mark — links back to the top */}
        <a href="#" className="flex items-center transition-opacity hover:opacity-80 flex-shrink-0" aria-label="ProVox — home">
          <WaveMark className="h-9 w-auto" />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 ml-2">
          {NAV_LINKS.map(([label, href]) => (
            <a key={href} href={href}
              className="text-[0.95rem] font-semibold transition-opacity hover:opacity-75 whitespace-nowrap"
              style={{ color: '#fff', fontFamily: 'Montserrat, sans-serif' }}>
              {label}
            </a>
          ))}
        </nav>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-6 ml-auto">
          <a href="/login"
            className="flex items-center gap-2 text-[0.95rem] font-semibold transition-opacity hover:opacity-75 whitespace-nowrap"
            style={{ color: '#fff', fontFamily: 'Montserrat, sans-serif' }}>
            <UserIcon />
            Student Login
          </a>
          <a href="#contact"
            className="text-[0.95rem] font-semibold px-5 py-2.5 transition-opacity hover:opacity-90 whitespace-nowrap"
            style={{ background: 'var(--accent)', color: '#fff', borderRadius: '2px', fontFamily: 'Montserrat, sans-serif' }}>
            Free Consultation
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-1 -mr-1"
          style={{ color: '#fff' }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {menuOpen
              ? <><path d="M18 6L6 18"/><path d="M6 6l12 12"/></>
              : <><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/></>
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-6 py-5 flex flex-col gap-4"
          style={{ background: 'var(--primary)', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
          {NAV_LINKS.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}
              className="text-[0.95rem] font-semibold"
              style={{ color: '#fff', fontFamily: 'Montserrat, sans-serif' }}>
              {label}
            </a>
          ))}
          <a href="/login" onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 text-[0.95rem] font-semibold"
            style={{ color: '#fff', fontFamily: 'Montserrat, sans-serif' }}>
            <UserIcon />
            Student Login
          </a>
          <a href="#contact" onClick={() => setMenuOpen(false)}
            className="text-[0.95rem] font-semibold px-4 py-3 text-center transition-opacity hover:opacity-90"
            style={{ background: 'var(--accent)', color: '#fff', borderRadius: '2px', fontFamily: 'Montserrat, sans-serif' }}>
            Free Consultation
          </a>
        </div>
      )}
    </header>
  );
}
