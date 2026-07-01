'use client';

import { useState } from 'react';

export default function Preview() {
  const [activeTab, setActiveTab] = useState<'video' | 'book'>('video');

  return (
    <section className="border-t" style={{ borderColor: 'var(--border)', background: 'var(--background)' }}>
      <div className="max-w-6xl mx-auto px-6 py-24">

        {/* Header */}
        <div className="mb-12 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] font-semibold mb-4"
            style={{ color: 'var(--accent)', fontFamily: 'Montserrat, sans-serif' }}>
            See it for yourself
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight"
            style={{ color: 'var(--primary)', fontFamily: 'Montserrat, sans-serif' }}>
            See what a ProVox session looks like
          </h2>
          <p className="text-base leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
            This is a sample audio exercise from session 11 in the VOX: Professional Communication curriculum.
            You can also check out a preview of the book.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 mb-8 p-1 w-fit"
          style={{ background: 'var(--secondary)', borderRadius: '2px' }}>
          <button
            onClick={() => setActiveTab('video')}
            className="px-5 py-2 text-sm font-semibold transition-all"
            style={{
              background: activeTab === 'video' ? 'var(--card)' : 'transparent',
              color: activeTab === 'video' ? 'var(--primary)' : 'var(--muted-foreground)',
              borderRadius: '2px',
              border: activeTab === 'video' ? '1px solid var(--border)' : '1px solid transparent',
            }}>
            🎧 Audio Session
          </button>
          <button
            onClick={() => setActiveTab('book')}
            className="px-5 py-2 text-sm font-semibold transition-all"
            style={{
              background: activeTab === 'book' ? 'var(--card)' : 'transparent',
              color: activeTab === 'book' ? 'var(--primary)' : 'var(--muted-foreground)',
              borderRadius: '2px',
              border: activeTab === 'book' ? '1px solid var(--border)' : '1px solid transparent',
            }}>
            📖 Book Preview
          </button>
        </div>

        {/* Video tab */}
        {activeTab === 'video' && (
          <div>
            <div className="border overflow-hidden" style={{ borderColor: 'var(--border)', borderRadius: '2px' }}>
              {/* Label bar */}
              <div className="px-5 py-3 border-b flex items-center gap-3"
                style={{ borderColor: 'var(--border)', background: 'var(--secondary)' }}>
                <span className="text-xs font-semibold uppercase tracking-[0.12em]"
                  style={{ color: 'var(--accent)', fontFamily: 'Montserrat, sans-serif' }}>
                  VOX: Professional Communication
                </span>
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>·</span>
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  Session 11 — Handling Misunderstandings
                </span>
              </div>
              {/* YouTube embed */}
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/iifeO1RNgyk"
                  title="ProVox Session 11 — Handling Misunderstandings"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
            <p className="mt-4 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              This audio exercise is from Core Skill 2 — Clarity and Accuracy. Each session includes real workplace scenarios like this one.
            </p>
          </div>
        )}

        {/* Book tab */}
        {activeTab === 'book' && (
          <div>
            <div className="border overflow-hidden" style={{ borderColor: 'var(--border)', borderRadius: '2px' }}>
              {/* Label bar */}
              <div className="px-5 py-3 border-b flex items-center justify-between"
                style={{ borderColor: 'var(--border)', background: 'var(--secondary)' }}>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em]"
                    style={{ color: 'var(--accent)', fontFamily: 'Montserrat, sans-serif' }}>
                    VOX: Professional Communication
                  </span>
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>·</span>
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    Tier 1 · Foundations — Preview
                  </span>
                </div>
                <a href="/vox-preview.pdf" target="_blank" rel="noopener noreferrer"
                  className="text-xs font-semibold transition-opacity hover:opacity-70"
                  style={{ color: 'var(--accent)' }}>
                  Open full screen ↗
                </a>
              </div>
              {/* PDF embed */}
              <div style={{ height: '720px' }}>
                <iframe
                  src="/vox-preview.pdf"
                  className="w-full h-full"
                  title="VOX Professional Communication — Tier 1 Foundations Preview"
                  frameBorder="0"
                />
              </div>
            </div>
            <p className="mt-4 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              This is a preview of the full 24-session VOX: Professional Communication curriculum used in the Professional Communication program.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
