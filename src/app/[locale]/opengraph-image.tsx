import { ImageResponse } from 'next/og';
import { join } from 'node:path';
import { readFile } from 'node:fs/promises';

export const alt = 'ProVox — Professional English Coaching';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const bradData = await readFile(join(process.cwd(), 'public/brad-photo.png'), 'base64');
  const bradSrc = `data:image/png;base64,${bradData}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#132861',
          fontFamily: 'sans-serif',
          overflow: 'hidden',
        }}
      >
        {/* Dot pattern top-right */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: 320, height: 320, opacity: 0.08,
          backgroundImage: 'radial-gradient(circle, #2abfbf 1.5px, transparent 1.5px)',
          backgroundSize: '20px 20px',
          display: 'flex',
        }} />

        {/* Teal glow bottom-left */}
        <div style={{
          position: 'absolute', bottom: -80, left: -80,
          width: 360, height: 360, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(42,191,191,0.15) 0%, transparent 70%)',
          display: 'flex',
        }} />

        {/* Left content */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', padding: '64px 60px', flex: 1,
        }}>

          {/* Wave icon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 32 }}>
            {[
              { h: 18, op: 0.4 }, { h: 28, op: 0.6 }, { h: 42, op: 1.0 },
              { h: 28, op: 0.6 }, { h: 18, op: 0.4 },
            ].map((bar, i) => (
              <div key={i} style={{
                width: 9, height: bar.h, borderRadius: 5,
                background: `rgba(42,191,191,${bar.op})`, display: 'flex',
              }} />
            ))}
          </div>

          {/* PRO VOX wordmark */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 0, lineHeight: 1, marginBottom: 8 }}>
            <span style={{ fontSize: 88, fontWeight: 900, color: '#ffffff', letterSpacing: '-2px' }}>PRO</span>
            <span style={{ fontSize: 88, fontWeight: 900, color: '#2abfbf', letterSpacing: '-2px' }}>VOX</span>
          </div>

          {/* Subtitle */}
          <div style={{
            fontSize: 17, color: 'rgba(255,255,255,0.55)',
            letterSpacing: '0.25em', textTransform: 'uppercase',
            marginBottom: 40, display: 'flex',
          }}>
            Professional English Coaching
          </div>

          {/* Tagline */}
          <div style={{
            fontSize: 38, fontWeight: 300, color: '#ffffff',
            lineHeight: 1.5, letterSpacing: '-0.5px', display: 'flex',
            flexDirection: 'column', gap: 0,
          }}>
            <span>Natural. Confident.</span>
            <span>English for adults.</span>
          </div>

          {/* Divider + programs */}
          <div style={{
            width: 48, height: 2, background: '#2abfbf',
            marginTop: 36, marginBottom: 24, display: 'flex',
          }} />

          <div style={{ display: 'flex', gap: 24 }}>
            {['2 Programs', '1-on-1 & Groups', 'Ho Chi Minh City'].map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#2abfbf', display: 'flex',
                }} />
                <span style={{ fontSize: 19, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{item}</span>
              </div>
            ))}
          </div>

          {/* Domain */}
          <div style={{
            marginTop: 28, fontSize: 15,
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: '0.1em', display: 'flex',
          }}>
            provoxcoach.com
          </div>
        </div>

        {/* Right — Brad photo */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          width: 320, paddingRight: 56, gap: 18,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 220, height: 220, borderRadius: '50%',
            background: 'rgba(42,191,191,0.18)', padding: 5,
          }}>
            <img
              src={bradSrc}
              style={{ width: 210, height: 210, borderRadius: '50%', objectFit: 'cover', objectPosition: 'top' }}
            />
          </div>

          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 10, padding: '10px 22px',
          }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#ffffff' }}>Brad Herdt</span>
            <span style={{ fontSize: 13, color: '#2abfbf', marginTop: 3 }}>ProVox English Coach</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
