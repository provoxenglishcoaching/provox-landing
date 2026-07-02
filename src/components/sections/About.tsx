import Image from 'next/image';

export default function About() {
  return (
    <section id="about">
      {/* "Who will coach me?" — outside the dark box, left aligned, matches other headings */}
      <div className="border-t px-6 py-16 max-w-6xl mx-auto" style={{ borderColor: 'var(--border)' }}>
        <p className="text-xs uppercase tracking-[0.2em] font-semibold mb-4"
          style={{ color: 'var(--accent)', fontFamily: 'Montserrat, sans-serif' }}>
          Meet your coach
        </p>
        <h2 className="text-3xl md:text-4xl font-bold"
          style={{ color: 'var(--primary)', fontFamily: 'Montserrat, sans-serif' }}>
          Who will coach me?
        </h2>
      </div>

      {/* Navy bio section */}
      <div style={{ background: 'linear-gradient(135deg, #132861 60%, #1a3a7a 100%)' }}>
      <div className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-[1fr_1.2fr] gap-12 md:gap-20 items-center">

        {/* Photo */}
        <div className="relative">
          <div className="overflow-hidden" style={{ aspectRatio: '3/4', borderRadius: '2px', background: 'rgba(19,40,97,0.4)' }}>
            <Image
              src="/brad-photo.png"
              alt="Brad Herdt — ProVox English Coach"
              width={400}
              height={533}
              className="w-full h-full object-cover object-top"
            />
          </div>
          {/* Teal accent line */}
          <div className="absolute -right-4 top-10 w-px h-32" style={{ background: 'rgba(42,191,191,0.6)' }} aria-hidden="true" />
        </div>

        {/* Bio */}
        <div className="text-white">
          <p className="text-3xl md:text-4xl leading-tight mb-6 font-bold text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            I help adults speak English with confidence
          </p>
          <p className="leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.7)' }}>
            I'm Brad Herdt, founder of ProVox and a certified English coach with over a decade of experience working with adults across Vietnam and beyond.
          </p>
          <p className="leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.7)' }}>
            My approach is built on Communicative Language Teaching. This method is grounded in real conversation, not memorization or grammar drills. My goal isn't to help you speak perfect English — my goal is to help you become a skillful communicator. Each session is designed around how you actually use English: at work, in meetings, with colleagues, or in everyday situations where confidence matters.
          </p>
          <p className="leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.7)' }}>
            I started ProVox because I enjoy seeing individuals grow into confident, natural English speakers. That's why I exclusively work 1-on-1 or in small groups. I take time to understand your world, and tailor each session to your real goals.
          </p>
          <p className="leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.7)' }}>
            If you're ready to communicate with more clarity and confidence, I'd love to work with you.
          </p>
          <p className="text-xs uppercase tracking-[0.14em] mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
            TESOL/TEFL Certified English Coach — Global Leadership College
          </p>
          <a href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold transition-opacity hover:opacity-90 group"
            style={{ background: 'var(--accent)', color: '#fff', borderRadius: '2px' }}>
            Work with Brad
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
      </div>
    </section>
  );
}
