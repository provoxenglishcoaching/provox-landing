'use client';

import { useState } from 'react';
import type { CardRow } from '../lib/db';
import { shuffle } from '../lib/flashcards';
import { saveReview } from '../actions/student';
import { EmptyNote } from './DashUI';

type Direction = 'en-first' | 'native-first';

const DIRECTION_KEY = 'provox-flashcard-direction';

function readStoredDirection(): Direction {
  try {
    const stored = localStorage.getItem(DIRECTION_KEY);
    return stored === 'native-first' ? 'native-first' : 'en-first';
  } catch {
    return 'en-first'; // Storage can be unavailable (private browsing, locked-down browser); default rather than throw.
  }
}

interface ReviewEntry {
  id: string;
  correct: boolean;
  box: number;
}

export default function StudySession({
  deckId,
  deckName,
  cards,
  onExit,
}: {
  deckId: string;
  deckName: string;
  cards: CardRow[];
  onExit: () => void;
}) {
  const [direction, setDirection] = useState<Direction>(readStoredDirection);
  const [order] = useState(() => shuffle(cards));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [results, setResults] = useState<ReviewEntry[]>([]);
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  if (cards.length === 0) {
    return <EmptyNote>Add some cards to this deck before studying.</EmptyNote>;
  }

  function setDirectionAndStore(next: Direction) {
    setDirection(next);
    try {
      localStorage.setItem(DIRECTION_KEY, next);
    } catch {
      // Nothing to fall back to -- the preference just won't persist this session.
    }
  }

  async function grade(correct: boolean) {
    const current = order[index];
    const entry: ReviewEntry = { id: current.id, correct, box: current.box };
    const nextResults = [...results, entry];
    setResults(nextResults);
    setFlipped(false);

    if (index + 1 >= order.length) {
      setDone(true);
      setSaving(true);
      await saveReview(deckId, nextResults);
      setSaving(false);
    } else {
      setIndex(index + 1);
    }
  }

  if (done) {
    const correctCount = results.filter((r) => r.correct).length;
    return (
      <div className="fc-summary">
        <h3 style={{ margin: '0 0 8px', fontFamily: 'var(--next-montserrat), sans-serif', color: 'var(--dash-ink)' }}>
          Session complete
        </h3>
        <p style={{ color: 'var(--dash-muted)', margin: '0 0 20px' }}>
          {correctCount} of {results.length} correct{saving ? ' — saving…' : ''}
        </p>
        <button
          type="button"
          disabled={saving}
          onClick={onExit}
          style={{
            background: 'var(--portal-navy)',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 22px',
            fontWeight: 700,
            fontSize: '13.5px',
            cursor: saving ? 'default' : 'pointer',
          }}
        >
          {saving ? 'Saving…' : 'Done'}
        </button>
      </div>
    );
  }

  const current = order[index];
  const questionText = direction === 'en-first' ? current.front : current.back;
  const answerText = direction === 'en-first' ? current.back : current.front;

  return (
    <div className="fc-study">
      <div className="fc-toolbar">
        <button
          type="button"
          onClick={onExit}
          style={{ background: 'none', border: 'none', color: 'var(--portal-slate)', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer', padding: 0 }}
        >
          ← {deckName}
        </button>
        <div className="fc-progress">
          {index + 1} / {order.length}
        </div>
        <nav className="dash-tabs fc-direction">
          <button
            type="button"
            className="dash-tab"
            data-active={direction === 'en-first'}
            onClick={() => setDirectionAndStore('en-first')}
          >
            EN → VI
          </button>
          <button
            type="button"
            className="dash-tab"
            data-active={direction === 'native-first'}
            onClick={() => setDirectionAndStore('native-first')}
          >
            VI → EN
          </button>
        </nav>
      </div>

      <div className="fc-stage">
        <div className="fc-stack fc-stack-2" />
        <div className="fc-stack fc-stack-1" />
        <div
          className="fc-card"
          role="button"
          tabIndex={0}
          onClick={() => setFlipped((f) => !f)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setFlipped((f) => !f);
            }
          }}
        >
          <div className={`fc-card-inner${flipped ? ' is-flipped' : ''}`}>
            <div className="fc-face fc-face-front">
              <div className="fc-word">{questionText}</div>
              <div className="fc-hint">Click to flip{current.example ? ' & see example' : ''}</div>
            </div>
            <div className="fc-face fc-face-back">
              <div className="fc-word">{answerText}</div>
              {current.example && <div className="fc-example">{current.example}</div>}
            </div>
          </div>
        </div>
      </div>

      <div className="fc-grade-row">
        {flipped ? (
          <>
            <button type="button" className="fc-grade-btn fc-grade-bad" onClick={() => grade(false)}>
              Missed it
            </button>
            <button type="button" className="fc-grade-btn fc-grade-good" onClick={() => grade(true)}>
              Got it
            </button>
          </>
        ) : (
          <span className="fc-tap-note">Tap the card to reveal the answer</span>
        )}
      </div>
    </div>
  );
}
