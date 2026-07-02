'use client';

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)', flexShrink: 0 }}>
    <path d="M20 6 9 17l-5-5"/>
  </svg>
);

const ArrowIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
);

export default function Programs() {
  return (
    <section id="programs" className="max-w-6xl mx-auto px-6 py-24">
      {/* Header */}
      <div className="mb-14 max-w-xl">
        <p className="text-xs uppercase tracking-[0.2em] font-semibold mb-4"
          style={{ color: 'var(--accent)', fontFamily: 'Montserrat, sans-serif' }}>
          Programs
        </p>
        <h2 className="text-4xl md:text-5xl leading-tight font-bold"
          style={{ color: 'var(--primary)', fontFamily: 'Montserrat, sans-serif' }}>
          What program is best for me?
        </h2>
        <p className="mt-4" style={{ color: 'var(--muted-foreground)' }}>
          Two programs. One goal — English that works for you.
        </p>
      </div>

      {/* Cards — Professional Communication LEFT, Communication Skills RIGHT */}
      <div className="grid md:grid-cols-2 gap-px border rounded-sm overflow-hidden mb-6"
        style={{ background: 'var(--border)', borderColor: 'var(--border)', borderRadius: '2px' }}>

        {/* LEFT — Professional Communication */}
        <div className="p-8 md:p-10" style={{ background: 'var(--card)' }}>
          <div className="flex items-start justify-between gap-4 mb-3">
            <span className="text-xs uppercase tracking-[0.14em] font-semibold"
              style={{ color: 'var(--accent)', fontFamily: 'Montserrat, sans-serif' }}>
              Business English
            </span>
            <span className="text-xs text-right" style={{ color: 'var(--muted-foreground)' }}>
              6,990,000₫ / month
            </span>
          </div>
          <h3 className="text-2xl mt-1 mb-4 font-bold"
            style={{ color: 'var(--primary)', fontFamily: 'Montserrat, sans-serif' }}>
            Professional Communication
          </h3>
          <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--muted-foreground)' }}>
            A structured 12-week, 24-session program designed for professionals who need to communicate with precision at work. This course is centered on 4 Core Skills: Communication Etiquette, Clarity and Accuracy, Participating in Discussions, and Professional Assertiveness.
          </p>
          <ul className="flex flex-col gap-2 mb-6">
            {[
              '1-on-1 Business English coaching sessions',
              'The full VOX: Professional Communication curriculum',
              'Full access to ProVox audio coaching materials',
              'Personalized feedback tailored to your job',
            ].map(item => (
              <li key={item} className="flex items-center gap-2.5 text-sm">
                <CheckIcon />{item}
              </li>
            ))}
          </ul>
          <p className="text-xs border-t pt-4" style={{ color: 'var(--muted-foreground)', borderColor: 'var(--border)' }}>
            3-month option available at 18,990,000₫
          </p>
        </div>

        {/* RIGHT — Communication Skills */}
        <div className="p-8 md:p-10" style={{ background: 'var(--card)' }}>
          <div className="flex items-start justify-between gap-4 mb-3">
            <span className="text-xs uppercase tracking-[0.14em] font-semibold"
              style={{ color: 'var(--accent)', fontFamily: 'Montserrat, sans-serif' }}>
              Essential English
            </span>
            <span className="text-xs text-right" style={{ color: 'var(--muted-foreground)' }}>
              5,990,000₫ / month
            </span>
          </div>
          <h3 className="text-2xl mt-1 mb-4 font-bold"
            style={{ color: 'var(--primary)', fontFamily: 'Montserrat, sans-serif' }}>
            Communication Skills
          </h3>
          <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--muted-foreground)' }}>
            A conversational coaching program focused on speaking and listening for everyday, natural communication. Built for adults who want to feel comfortable and confident in English at work and in life.
          </p>
          <ul className="flex flex-col gap-2 mb-6">
            {[
              'Structured 1-on-1 coaching sessions',
              'Improve speaking and listening skills',
              'Each session is built specifically for your needs',
            ].map(item => (
              <li key={item} className="flex items-center gap-2.5 text-sm">
                <CheckIcon />{item}
              </li>
            ))}
          </ul>
          <p className="text-xs border-t pt-4" style={{ color: 'var(--muted-foreground)', borderColor: 'var(--border)' }}>
            3-month option available at 15,990,000₫
          </p>
        </div>
      </div>

      {/* Need something different */}
      <div className="border p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6"
        style={{ borderColor: 'var(--border)', background: 'var(--card)', borderRadius: '2px' }}>
        <div>
          <h3 className="text-xl mb-2 font-bold"
            style={{ color: 'var(--primary)', fontFamily: 'Montserrat, sans-serif' }}>
            Need Something Different?
          </h3>
          <p className="text-sm leading-relaxed max-w-lg" style={{ color: 'var(--muted-foreground)' }}>
            Do you have a specific goal, industry, or situation you want to focus on? I offer custom curriculum built entirely around your needs — whether that's technical vocabulary, a specific exam, or a unique workplace context. Please reach out to me and we'll put something together that works for you.
          </p>
        </div>
        <a href="#contact"
          className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold transition-opacity hover:opacity-90 whitespace-nowrap group flex-shrink-0"
          style={{ background: 'var(--accent)', color: '#fff', borderRadius: '2px' }}>
          Get in touch
          <ArrowIcon />
        </a>
      </div>
    </section>
  );
}
