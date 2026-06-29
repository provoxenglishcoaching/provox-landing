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
        {/* Teal glow top-left */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            left: -120,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(42,191,191,0.18) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Teal glow bottom-right */}
        <div
          style={{
            position: 'absolute',
            bottom: -100,
            right: 300,
            width: 360,
            height: 360,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(42,191,191,0.12) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Left content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '64px 56px',
            flex: 1,
          }}
        >
          {/* Waveform logo bars */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 28 }}>
            {[
              { h: 24, op: 0.45 },
              { h: 36, op: 0.65 },
              { h: 52, op: 1.0 },
              { h: 36, op: 0.65 },
              { h: 24, op: 0.45 },
            ].map((bar, i) => (
              <div
                key={i}
                style={{
                  width: 10,
                  height: bar.h,
                  borderRadius: 5,
                  background: `rgba(42,191,191,${bar.op})`,
                  display: 'flex',
                }}
              />
            ))}
            <span
              style={{
                marginLeft: 16,
                fontSize: 13,
                letterSpacing: '0.3em',
                color: 'rgba(255,255,255,0.5)',
                textTransform: 'uppercase',
              }}
            >
              provoxcoach.com
            </span>
          </div>

          {/* Brand name */}
          <div
            style={{
              fontSize: 86,
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1,
              letterSpacing: '-2px',
              display: 'flex',
            }}
          >
            ProVox
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 26,
              color: '#2abfbf',
              marginTop: 12,
              fontWeight: 600,
              letterSpacing: '0.02em',
              display: 'flex',
            }}
          >
            Professional English Coaching
          </div>

          {/* Divider */}
          <div
            style={{
              width: 56,
              height: 3,
              background: '#2abfbf',
              borderRadius: 2,
              marginTop: 28,
              marginBottom: 28,
              display: 'flex',
            }}
          />

          {/* Key stats */}
          <div style={{ display: 'flex', gap: 28, marginBottom: 20 }}>
            {['1 Program', '12 Weeks', 'Business English'].map((item) => (
              <div
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: '#2abfbf',
                    display: 'flex',
                  }}
                />
                <span style={{ fontSize: 22, color: '#ffffff', fontWeight: 600 }}>{item}</span>
              </div>
            ))}
          </div>

          {/* Audience */}
          <div
            style={{
              fontSize: 19,
              color: 'rgba(255,255,255,0.65)',
              display: 'flex',
            }}
          >
            Premium 1-on-1 for Korean &amp; Vietnamese Professionals
          </div>
        </div>

        {/* Right — Brad photo */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: 340,
            paddingRight: 60,
            gap: 20,
          }}
        >
          {/* Photo ring */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 228,
              height: 228,
              borderRadius: '50%',
              background: 'rgba(42,191,191,0.2)',
              padding: 6,
            }}
          >
            <img
              src={bradSrc}
              style={{
                width: 216,
                height: 216,
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
          </div>

          {/* Name badge */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 12,
              padding: '10px 24px',
            }}
          >
            <span style={{ fontSize: 18, fontWeight: 700, color: '#ffffff' }}>Brad Herdt</span>
            <span style={{ fontSize: 13, color: '#2abfbf', marginTop: 2 }}>Lead Coach</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
