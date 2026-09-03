'use client';

import { useEffect, useRef, useState } from 'react';
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

/** A frozen snapshot of the card just graded, animating off the top of the stack. */
interface ExitingCard {
  key: number;
  word: string;
  example: string;
  leaving: boolean;
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

  // The card just graded keeps showing its own answer as it drops away, on
  // its own element -- the card underneath has already silently moved on to
  // the next question, so there's nothing for the departing one to leak.
  const [exiting, setExiting] = useState<ExitingCard | null>(null);
  const exitKey = useRef(0);

  // A pending "session complete" swap waits for the last card's exit
  // animation to finish, so it doesn't get cut short by the summary screen
  // replacing the whole component mid-drop.
  const pendingFinish = useRef<ReviewEntry[] | null>(null);

  // Starts each new exiting card resting in place, then flips it to its
  // "leaving" (dropped, faded) state a couple of frames later so the browser
  // actually paints the resting position first and the transition has
  // something to animate from.
  useEffect(() => {
    if (!exiting || exiting.leaving) return;
    let raf2 = 0;
    const key = exiting.key;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setExiting((prev) => (prev && prev.key === key ? { ...prev, leaving: true } : prev));
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [exiting]);

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

  async function finish(finalResults: ReviewEntry[]) {
    setDone(true);
    setSaving(true);
    await saveReview(deckId, finalResults);
    setSaving(false);
  }

  function grade(correct: boolean) {
    const current = order[index];
    const entry: ReviewEntry = { id: current.id, correct, box: current.box };
    const nextResults = [...results, entry];
    setResults(nextResults);
    setFlipped(false);

    const isLast = index + 1 >= order.length;

    if (prefersReducedMotion()) {
      if (isLast) finish(nextResults);
      else setIndex((i) => i + 1);
      return;
    }

    exitKey.current += 1;
    setExiting({ key: exitKey.current, word: answerText, example: current.example, leaving: false });

    if (isLast) {
      pendingFinish.current = nextResults;
    } else {
      setIndex((i) => i + 1);
    }
  }

  function handleExitTransitionEnd(e: React.TransitionEvent<HTMLDivElement>) {
    if (e.propertyName !== 'opacity') return;
    setExiting(null);
    if (pendingFinish.current) {
      const finalResults = pendingFinish.current;
      pendingFinish.current = null;
      finish(finalResults);
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
          {/* Keyed by card id: moving to a new card must unmount and remount
              this element fresh, unflipped, with no transition playing --
              otherwise this SAME node's own 600ms flip-back animation (from
              the previous card) plays out with the new card's answer already
              swapped onto its back face, showing through right as the exit
              overlay above finishes fading. A flip the student triggers on
              the current card (key unchanged) still animates normally. */}
          <div key={current.id} className={`fc-card-inner${flipped ? ' is-flipped' : ''}`}>
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

        {exiting && (
          <div
            key={exiting.key}
            className={`fc-exit-overlay${exiting.leaving ? ' fc-exit-leaving' : ''}`}
            onTransitionEnd={handleExitTransitionEnd}
          >
            <div className="fc-word">{exiting.word}</div>
            {exiting.example && <div className="fc-example">{exiting.example}</div>}
          </div>
        )}
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
