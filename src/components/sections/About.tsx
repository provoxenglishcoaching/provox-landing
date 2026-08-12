import Image from 'next/image';

const coaches: { id: string; name: string; photo: string; alt: string; objectPosition: string; cert: string; bio: string[] }[] = [
  {
    id: 'brad',
    name: 'Coach Brad',
    photo: '/brad-photo.png',
    alt: 'Brad Herdt — ProVox English Coach',
    objectPosition: 'center 20%',
    cert: 'TESOL/TEFL Certified — Global Leadership College',
    bio: [
      "I'm Brad Herdt, founder of ProVox and a certified English coach with over a decade of experience working with adults across Vietnam and beyond.",
      "My approach is built on Communicative Language Teaching. This method is grounded in real conversation, not memorization or grammar drills. My goal isn't to help you speak perfect English — my goal is to help you become a skillful communicator. Each session is designed around how you actually use English: at work, in meetings, with colleagues, or in everyday situations where confidence matters.",
      "I started ProVox because I enjoy seeing individuals grow into confident, natural English speakers. That's why I exclusively work 1-on-1 or in small groups. I take time to understand your world, and tailor each session to your real goals.",
      "If you're ready to communicate with more clarity and confidence, I'd love to work with you.",
    ],
  },
  {
    id: 'khoa',
    name: 'Coach Khoa',
    photo: '/khoa-photo.jpg',
    alt: 'Coach Khoa — ProVox English Coach',
    objectPosition: 'center 50%',
    cert: 'Australian · Based in Vietnam since 2014',
    bio: [
      "I'm an Australian with Vietnamese heritage and have been living and working in Vietnam since 2014. During that time, I've travelled extensively across the country and worked with people from a wide range of industries, cultures, and professional backgrounds.",
      "Through my experience in international workplaces, I've seen that many capable professionals struggle not because of their English ability, but because they lack confidence using it. Speaking up in meetings, participating in training, networking, or simply holding a conversation can feel challenging, even when you know more English than you think.",
      "I believe effective communication is about confidence, clarity, and feeling comfortable expressing yourself. My goal is to create a relaxed and supportive environment where you can develop those skills, receive practical feedback, and build confidence using English at work, in meetings, during training, or in everyday life.",
      "I bring a friendly and approachable style, along with real-world experience, and I'm genuinely committed to helping you grow and achieve your goals.",
    ],
  },
];

export default function About() {
  return (
    <section id="about">
      {/* Section intro — outside dark box, left aligned */}
      {/* "Who will coach me?" is now the small teal label */}
      {/* "Meet the ProVox Team" is now the big bold heading */}
      <div className="border-t px-6 py-16 max-w-6xl mx-auto" style={{ borderColor: 'var(--border)' }}>
        <p className="text-xs uppercase tracking-[0.2em] font-semibold mb-4"
          style={{ color: 'var(--accent)', fontFamily: 'Montserrat, sans-serif' }}>
          Who will coach me?
        </p>
        <h2 className="text-3xl md:text-4xl font-bold"
          style={{ color: 'var(--primary)', fontFamily: 'Montserrat, sans-serif' }}>
          Meet the ProVox Team
        </h2>
      </div>

      {/* Navy section */}
      <div style={{ background: 'linear-gradient(135deg, #132861 60%, #1a3a7a 100%)' }}>
        <div className="max-w-6xl mx-auto px-6 py-20">

          {/* Two coach columns */}
          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            {coaches.map((coach) => (
              <div key={coach.id} className="flex flex-col">

                {/* Coach name — big and prominent */}
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {coach.name}
                </h3>

                {/* Photo — square crop, face centered */}
                <div className="relative mb-8 w-full overflow-hidden"
                  style={{ aspectRatio: '1/1', borderRadius: '2px', maxWidth: '420px' }}>
                  <Image
                    src={coach.photo}
                    alt={coach.alt}
                    fill
                    className="object-cover"
                    style={{ objectPosition: coach.objectPosition }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                {/* Teal accent line */}
                <div className="mb-8 w-12 h-px" style={{ background: 'rgba(42,191,191,0.7)' }} aria-hidden="true" />

                {/* Bio paragraphs */}
                <div className="flex flex-col gap-4 flex-1">
                  {coach.bio.map((para, i) => (
                    <p key={i} className="text-sm leading-relaxed"
                      style={{ color: 'rgba(255,255,255,0.75)' }}>
                      {para}
                    </p>
                  ))}
                  <p className="text-xs uppercase tracking-[0.12em] mt-4 pt-4"
                    style={{ color: 'rgba(255,255,255,0.35)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    {coach.cert}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 pt-12" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <a href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold transition-opacity hover:opacity-90 group"
              style={{ background: 'var(--accent)', color: '#fff', borderRadius: '2px' }}>
              Work with us
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
