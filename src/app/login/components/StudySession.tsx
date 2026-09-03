'use client';

import { useState, useMemo, useTransition } from 'react';
import { saveReview } from '../actions/student';
import type { CardRow } from '../lib/db';
import { shuffle, toDateOnly } from '../lib/flashcards';

type Answer = { id: string; correct: boolean; box: number };

/**
 * The review loop. Every flip and grade happens here in the browser: the deck
 * arrives once from the server, and the results go back once at the end. The
 * obvious alternative -- a server action per card -- would turn a forty-card
 * session into forty round trips against a database that suspends when idle.
 */
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
  // Cards due today, or the whole deck if nothing is due -- a student who
  // wants extra practice shouldn't be told to come back tomorrow.
  const queue = useMemo(() => {
    const today = toDateOnly(new Date());
    const due = cards.filter((c) => c.due_date <= today);
    return shuffle(due.length > 0 ? due : cards);
  }, [cards]);

  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [saving, startSaving] = useTransition();
  const [saved, setSaved] = useState(false);

  const card = queue[index];
  const finished = index >= queue.length;

  function grade(correct: boolean) {
    const next = [...answers, { id: card.id, correct, box: card.box }];
    setAnswers(next);
    setRevealed(false);
    setIndex((i) => i + 1);

    // Grading the last card ends the session, so the whole batch goes back
    // here -- one write for the review, straight from the event that finished
    // it rather than from an effect watching for the end.
    if (next.length >= queue.length) {
      setSaved(true);
      startSaving(() => saveReview(deckId, next));
    }
  }

  /**
   * Leaving part-way through still banks the cards already graded -- a student
   * who does fifteen of forty shouldn't lose the fifteen.
   */
  function stopAndSave() {
    if (!saved && answers.length > 0) {
      setSaved(true);
      startSaving(() => saveReview(deckId, answers));
    }
    onExit();
  }

  if (queue.length === 0) {
    return (
      <Shell deckName={deckName} onExit={onExit}>
        <p style={{ color: 'var(--dash-muted)', fontSize: '14px', textAlign: 'center', margin: '30px 0' }}>
          This deck has no cards yet. Add a few and come back.
        </p>
      </Shell>
    );
  }

  if (finished) {
    const right = answers.filter((a) => a.correct).length;
    return (
      <Shell deckName={deckName} onExit={onExit}>
        <div style={{ textAlign: 'center', padding: '26px 0' }}>
          <div style={{ fontFamily: 'var(--next-montserrat), sans-serif', fontSize: '30px', fontWeight: 700, color: 'var(--dash-ink)' }}>
            {right} / {answers.length}
          </div>
          <p style={{ color: 'var(--dash-muted)', fontSize: '13.5px', margin: '8px 0 20px' }}>
            {saving ? 'Saving your progress…' : 'Progress saved. Cards you missed will come back sooner.'}
          </p>
          <button type="button" onClick={onExit} style={primaryButton}>
            Done
          </button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell deckName={deckName} onExit={stopAndSave}>
      <div style={{ fontSize: '11.5px', color: 'var(--dash-muted)', textAlign: 'center', marginBottom: '10px' }}>
        Card {index + 1} of {queue.length}
      </div>

      <button
        type="button"
        onClick={() => setRevealed(true)}
        style={{
          width: '100%',
          minHeight: '190px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          padding: '26px 20px',
          background: revealed ? 'var(--portal-navy)' : '#fff',
          color: revealed ? '#fff' : 'var(--dash-ink)',
          border: '1px solid var(--dash-line)',
          borderRadius: '16px',
          cursor: revealed ? 'default' : 'pointer',
          textAlign: 'center',
        }}
      >
        <span style={{ fontFamily: 'var(--next-montserrat), sans-serif', fontSize: '24px', fontWeight: 700, lineHeight: 1.3 }}>
          {revealed ? card.back : card.front}
        </span>
        {revealed && card.example && (
          <span style={{ fontSize: '13px', opacity: 0.75, lineHeight: 1.5, maxWidth: '38ch' }}>{card.example}</span>
        )}
        {!revealed && (
          <span style={{ fontSize: '12px', color: 'var(--dash-muted)', fontWeight: 600 }}>Tap to reveal</span>
        )}
      </button>

      {revealed && (
        <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
          <button type="button" onClick={() => grade(false)} style={{ ...gradeButton, background: '#fbe6e9', color: '#a83a51' }}>
            Missed it
          </button>
          <button type="button" onClick={() => grade(true)} style={{ ...gradeButton, background: 'var(--dash-good-bg)', color: 'var(--dash-good-ink)' }}>
            Got it
          </button>
        </div>
      )}
    </Shell>
  );
}

function Shell({ deckName, onExit, children }: { deckName: string; onExit: () => void; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '14px' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--dash-muted)' }}>Studying {deckName}</span>
        <button type="button" onClick={onExit} style={{ background: 'none', border: 'none', color: 'var(--portal-slate)', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}>
          Stop
        </button>
      </div>
      {children}
    </div>
  );
}

const primaryButton: React.CSSProperties = {
  background: 'var(--portal-navy)',
  color: '#fff',
  border: 'none',
  borderRadius: '10px',
  padding: '11px 24px',
  fontWeight: 700,
  fontSize: '13.5px',
  cursor: 'pointer',
};

const gradeButton: React.CSSProperties = {
  flex: 1,
  border: 'none',
  borderRadius: '11px',
  padding: '13px 10px',
  fontWeight: 700,
  fontSize: '14px',
  cursor: 'pointer',
};
