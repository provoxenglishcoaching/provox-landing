import Image from 'next/image';

/**
 * How far a block pokes out from behind its photo. The column gaps are
 * percentages, so this has to scale with them — pinned at 20px it collides
 * with the neighbouring photo once the viewport drops near the md breakpoint.
 */
const BLOCK_OFFSET = 'clamp(9px, 1.4vw, 20px)';

type Block = {
  /** Texture lifted from Brad's Canva blocks. */
  texture: string;
  /** Flat fallback — the texture's dominant colour. */
  color: string;
  /** Direction the block sits in, as multiples of BLOCK_OFFSET. */
  offset: [-1 | 0 | 1, -1 | 0 | 1];
};

type Photo = {
  label: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  blocks: Block[];
};

const TURQUOISE: Omit<Block, 'offset'> = { texture: '/texture-turquoise.webp', color: '#58c8b8' };
const CORAL: Omit<Block, 'offset'> = { texture: '/texture-coral.webp', color: '#f8b898' };
const LIME: Omit<Block, 'offset'> = { texture: '/texture-lime.webp', color: '#a8e808' };
const NAVY: Omit<Block, 'offset'> = { texture: '/texture-navy.webp', color: '#182848' };

const COMMUNICATION: Photo = {
  label: 'Communication',
  src: '/hero-1.jpg',
  alt: 'Two women talking together over a laptop',
  width: 2500,
  height: 1667,
  blocks: [
    { ...TURQUOISE, offset: [-1, 1] },
    { ...NAVY, offset: [1, 1] },
  ],
};

const EXAM: Photo = {
  label: 'IELTS / TOEFL',
  src: '/hero-2.jpg',
  alt: 'Two students talking together outside a university',
  width: 2400,
  height: 1600,
  blocks: [
    { ...TURQUOISE, offset: [-1, 1] },
    { ...LIME, offset: [1, -1] },
  ],
};

const BUSINESS: Photo = {
  label: 'Business English',
  src: '/hero-3.jpg',
  alt: 'A professional English coaching session',
  width: 3000,
  height: 2000,
  blocks: [
    { ...CORAL, offset: [-1, 1] },
    { ...TURQUOISE, offset: [1, 1] },
  ],
};

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
);

/** Gap between a label and the topmost thing drawn beneath it. */
const LABEL_GAP = '10px';

/** A labelled photo sitting on Brad's textured brand blocks. Fills its wrapper. */
function LabelledPhoto({ photo, sizes, priority }: { photo: Photo; sizes: string; priority?: boolean }) {
  // A block sitting above the photo is the topmost thing drawn, so the label
  // has to clear that instead — otherwise IELTS' lime block would sit right
  // under its label while the others have room to spare.
  const blockAbove = photo.blocks.some((b) => b.offset[1] === -1);

  return (
    <figure>
      <figcaption
        className="relative z-10 text-sm md:text-base font-bold uppercase tracking-[0.08em]"
        style={{
          color: 'var(--primary)',
          fontFamily: 'Montserrat, sans-serif',
          marginBottom: blockAbove ? `calc(${BLOCK_OFFSET} + ${LABEL_GAP})` : LABEL_GAP,
        }}>
        {photo.label}
      </figcaption>

      <div className="relative">
        {photo.blocks.map((b) => (
          <div
            key={b.texture + b.offset.join()}
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              backgroundColor: b.color,
              backgroundImage: `url('${b.texture}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: `translate(calc(${b.offset[0]} * ${BLOCK_OFFSET}), calc(${b.offset[1]} * ${BLOCK_OFFSET}))`,
            }}
          />
        ))}
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes={sizes}
          priority={priority}
          className="relative w-full h-auto object-cover"
        />
      </div>
    </figure>
  );
}

export default function Hero() {
  // The photo column takes the larger share of the row and a tighter gutter, so
  // the cluster can run bigger without the hero growing past the fold. The text
  // column still clears the paragraph's max-w-md.
  return (
    <section className="pt-32 pb-20 md:pt-32 md:pb-28">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] items-center gap-16 md:gap-12">

        {/* Left — logo, paragraph, CTA */}
        <div>
          <Image
            src="/logo-light.svg"
            alt="ProVox — Professional English Coaching"
            width={420}
            height={340}
            priority
            className="w-56 md:w-72 h-auto mb-10"
          />

          <p className="text-lg leading-relaxed mb-9 max-w-md" style={{ color: 'var(--foreground)' }}>
            Learn English with native English tutors. Our courses are designed to meet your
            specific needs. From communication skills to business English, from IELTS to TOEFL,
            ProVox will teach you. Find out which course is best for you.
          </p>

          <a href="#courses"
            className="inline-flex items-center gap-2 px-7 py-4 text-sm font-semibold transition-opacity hover:opacity-90 group"
            style={{ background: 'var(--primary)', color: '#fff', borderRadius: '2px', fontFamily: 'Montserrat, sans-serif' }}>
            Get started
            <ArrowIcon />
          </a>
        </div>

        {/*
          Right — staggered cluster. All three sit above the fold, growing
          slightly from Communication to IELTS to Business English. Widths and
          offsets are percentages of the column so the composition holds its
          shape at every size.
        */}
        <div>
          {/*
            The 12% column gap has to swallow two block overhangs — the navy off
            Communication's right and the turquoise off IELTS's left — before
            any daylight shows between them.
          */}
          <div className="flex items-start">
            <div className="w-[40%] ml-[2%]">
              <LabelledPhoto photo={COMMUNICATION} sizes="(max-width: 768px) 38vw, 21vw" priority />
            </div>
            <div className="w-[43%] ml-[12%] mt-[7%]">
              <LabelledPhoto photo={EXAM} sizes="(max-width: 768px) 41vw, 23vw" priority />
            </div>
          </div>

          <div className="w-[53%] ml-[14%] mt-[8%]">
            <LabelledPhoto photo={BUSINESS} sizes="(max-width: 768px) 50vw, 28vw" priority />
          </div>
        </div>
      </div>
    </section>
  );
}
