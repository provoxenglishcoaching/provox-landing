import ContactForm from '@/components/ui/ContactForm';

export default function Contact() {
  return (
    <section id="contact" className="border-t" style={{ borderColor: 'var(--border)', background: 'var(--secondary)' }}>
      <div className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-[1fr_1.4fr] gap-12 md:gap-20">

        {/* Left — contact info */}
        <div>
          <p className="text-xs uppercase tracking-[0.2em] font-semibold mb-4" style={{ color: 'var(--accent)', fontFamily: 'Montserrat, sans-serif' }}>
            Contact
          </p>
          <h2 className="text-4xl md:text-5xl leading-tight mb-6 font-bold" style={{ color: 'var(--primary)', fontFamily: 'Montserrat, sans-serif' }}>
            Let's talk about your goals
          </h2>
          <p className="leading-relaxed mb-10" style={{ color: 'var(--muted-foreground)' }}>
            Start with a free 30-minute consultation. No commitment. Just a conversation about your goals — and I'll tell you honestly whether we're a good fit.
          </p>

          <div className="flex flex-col gap-5">
            <a href="mailto:brad@provoxcoach.com"
              className="flex items-center gap-3 text-sm transition-colors hover:opacity-80"
              style={{ color: 'var(--foreground)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)', flexShrink: 0 }}>
                <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              brad@provoxcoach.com
            </a>

            <div className="flex items-center gap-3 text-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)', flexShrink: 0 }}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <span>Zalo: 0965869015</span>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)', flexShrink: 0 }}>
                <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
              </svg>
              <span>KakaoTalk: BradHerdt</span>
            </div>

            <a href="https://facebook.com/provoxenglish" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm transition-colors hover:opacity-80"
              style={{ color: 'var(--foreground)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)', flexShrink: 0 }}>
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
              facebook.com/provoxenglish
            </a>

            <a href="https://linkedin.com/in/bradherdt" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm transition-colors hover:opacity-80"
              style={{ color: 'var(--foreground)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)', flexShrink: 0 }}>
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
              </svg>
              linkedin.com/in/bradherdt
            </a>

            <p className="text-xs border-t pt-4" style={{ color: 'var(--muted-foreground)', borderColor: 'var(--border)' }}>
              Indochina Time (ICT) · GMT+7 · Response within 24 hours
            </p>
          </div>
        </div>

        {/* Right — form */}
        <div className="border p-8 rounded-sm" style={{ background: 'var(--card)', borderColor: 'var(--border)', borderRadius: '2px' }}>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
