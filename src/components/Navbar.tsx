'use client';

import { useState } from 'react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b"
      style={{ background: 'rgba(249,248,244,0.92)', backdropFilter: 'blur(12px)', borderColor: 'var(--border)' }}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Home text link instead of logo */}
        <a href="#"
          className="text-sm font-semibold transition-colors hover:opacity-70"
          style={{ color: 'var(--primary)', fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.05em' }}>
          Home
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {[['Programs', '#programs'], ['About', '#about'], ['Contact', '#contact']].map(([label, href]) => (
            <a key={href} href={href}
              className="text-sm font-medium transition-colors"
              style={{ color: 'var(--muted-foreground)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--foreground)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted-foreground)')}>
              {label}
            </a>
          ))}
          <a href="#contact"
            className="text-sm font-semibold px-4 py-2 transition-opacity hover:opacity-90"
            style={{ background: 'var(--primary)', color: '#fff', borderRadius: '2px' }}>
            Free consultation
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-1 -mr-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {menuOpen
              ? <><path d="M18 6L6 18"/><path d="M6 6l12 12"/></>
              : <><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/></>
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t px-6 py-5 flex flex-col gap-4"
          style={{ borderColor: 'var(--border)', background: 'var(--background)' }}>
          {[['Programs', '#programs'], ['About', '#about'], ['Contact', '#contact']].map(([label, href]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}
              className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
              {label}
            </a>
          ))}
          <a href="#contact" onClick={() => setMenuOpen(false)}
            className="text-sm font-semibold px-4 py-2.5 text-center transition-opacity hover:opacity-90"
            style={{ background: 'var(--primary)', color: '#fff', borderRadius: '2px' }}>
            Free consultation
          </a>
        </div>
      )}
    </header>
  );
}
