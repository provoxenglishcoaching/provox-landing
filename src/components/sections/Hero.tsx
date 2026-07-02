import Image from 'next/image';

export default function Hero() {
  return (
    <section className="pt-16 min-h-screen grid md:grid-cols-2 items-center max-w-6xl mx-auto px-6 gap-12 md:gap-20">
      {/* Left — text */}
      <div className="pt-16 md:pt-0">
        {/* Logo — prominent, above the tagline */}
        <div className="mb-10">
          <Image
            src="/logo-light.svg"
            alt="ProVox Professional English Coaching"
            width={280}
            height={96}
            priority
            className="w-56 md:w-72 h-auto"
          />
        </div>

        {/* Tagline — light weight, generous line spacing */}
        <h1 style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)',
          fontWeight: 300,
          color: 'var(--primary)',
          letterSpacing: '-0.01em',
          lineHeight: 1.85,
          marginBottom: '1.75rem',
        }}>
          Natural.<br />
          Confident.<br />
          English for adults.
        </h1>

        <p className="text-lg leading-relaxed mb-10 max-w-md" style={{ color: 'var(--muted-foreground)' }}>
          A premium coaching program for adults who want to speak English with confidence.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <a href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold transition-opacity hover:opacity-90 group"
            style={{ background: 'var(--primary)', color: '#fff', borderRadius: '2px' }}>
            Book a free consultation
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </a>
          <a href="#programs"
            className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold border transition-colors hover:opacity-80"
            style={{ borderColor: 'var(--border)', color: 'var(--foreground)', borderRadius: '2px' }}>
            Explore programs
          </a>
        </div>
      </div>

      {/* Right — book cover */}
      <div className="relative flex items-center justify-center">
        <div className="w-full max-w-sm mx-auto overflow-hidden" style={{ aspectRatio: '3/4', borderRadius: '2px', background: 'var(--secondary)' }}>
          <Image
            src="/book-cover.png"
            alt="VOX Professional Communication — Program Book"
            width={400}
            height={533}
            className="w-full h-full object-cover"
            priority
          />
        </div>

      </div>
    </section>
  );
}
