'use client';

import Link from 'next/link';
import { useActionState, useRef, useEffect, useState } from 'react';
import { createMyDeck, type DeckFormState } from '../actions/student';
import type { DeckSummary } from '../lib/db';
import { EmptyNote } from './DashUI';

const initialState: DeckFormState = { error: '', success: false };

/**
 * A student's decks. Counts come pre-rolled-up from the query, so this never
 * needs the cards themselves -- those load only once a deck is opened.
 */
export default function DeckList({ decks }: { decks: DeckSummary[] }) {
  const [state, formAction, pending] = useActionState(createMyDeck, initialState);
  const [adding, setAdding] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Reset only -- the form stays open so several decks can be made in a row.
  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <div>
      {decks.length === 0 && !adding && (
        <EmptyNote>
          No decks yet. Make one for a topic — food, work, sport — and fill it with
          the words you want to remember.
        </EmptyNote>
      )}

      {decks.length > 0 && (
        <div style={{ display: 'grid', gap: '10px' }}>
          {decks.map((deck) => (
            <DeckRow key={deck.id} deck={deck} />
          ))}
        </div>
      )}

      {adding ? (
        <form ref={formRef} action={formAction} style={{ marginTop: '12px' }}>
          {state.error && (
            <div style={{ background: '#fbeeef', color: '#b0475c', fontSize: '12.5px', fontWeight: 600, padding: '9px 12px', borderRadius: '8px', marginBottom: '10px' }}>
              {state.error}
            </div>
          )}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <input
              name="name"
              type="text"
              autoFocus
              required
              maxLength={60}
              placeholder="Deck name, e.g. Food"
              style={{ flex: '1 1 180px', padding: '9px 11px', border: '1px solid var(--portal-slate-200)', borderRadius: '8px', fontSize: '13.5px', background: '#fff' }}
            />
            <button
              type="submit"
              disabled={pending}
              style={{ background: 'var(--portal-navy)', color: '#fff', border: 'none', borderRadius: '9px', padding: '9px 16px', fontWeight: 700, fontSize: '13px', cursor: pending ? 'default' : 'pointer' }}
            >
              {pending ? 'Creating…' : 'Create'}
            </button>
            <button
              type="button"
              onClick={() => setAdding(false)}
              style={{ background: 'none', border: 'none', color: 'var(--portal-slate)', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          style={{ marginTop: decks.length > 0 ? '12px' : '0', background: '#fff', border: '1px dashed var(--portal-slate-200)', color: 'var(--portal-navy)', borderRadius: '10px', padding: '10px 16px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', width: '100%' }}
        >
          + New deck
        </button>
      )}
    </div>
  );
}

function DeckRow({ deck }: { deck: DeckSummary }) {
  const progress = deck.card_count > 0 ? deck.mastered_count / deck.card_count : 0;

  return (
    <Link
      href={`/login/student/flashcards/${deck.id}`}
      style={{ display: 'block', textDecoration: 'none', border: '1px solid var(--dash-line)', borderRadius: '12px', padding: '13px 15px', background: '#fff' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
        <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--dash-ink)' }}>{deck.name}</span>
        {deck.due_count > 0 && (
          <span style={{ background: 'var(--portal-turq-100)', color: 'var(--portal-navy-700)', fontSize: '11.5px', fontWeight: 700, padding: '3px 9px', borderRadius: '999px', whiteSpace: 'nowrap' }}>
            {deck.due_count} to review
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '9px' }}>
        <div style={{ flex: 1, height: '6px', background: '#eceef7', borderRadius: '999px', overflow: 'hidden' }}>
          <div style={{ width: `${Math.round(progress * 100)}%`, height: '100%', background: 'var(--portal-turq)', borderRadius: '999px' }} />
        </div>
        <span style={{ fontSize: '11.5px', color: 'var(--dash-muted)', whiteSpace: 'nowrap' }}>
          {deck.card_count === 0
            ? 'Empty'
            : `${deck.mastered_count} / ${deck.card_count} learned`}
        </span>
      </div>

      {deck.source_deck_id && (
        <div style={{ fontSize: '11px', color: 'var(--portal-slate)', marginTop: '7px' }}>From your coach</div>
      )}
    </Link>
  );
}
