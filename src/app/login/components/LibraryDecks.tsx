'use client';

import { useState, useActionState, useRef, useEffect, useTransition } from 'react';
import {
  createLibraryDeck,
  addLibraryCards,
  removeLibraryCard,
  deleteLibraryDeck,
  pushDeckToStudent,
  type LibraryDeckState,
} from '../actions/coach';
import type { BulkAddState } from '../actions/student';
import type { CardRow, DeckSummary } from '../lib/db';
import { MAX_BULK_CARDS } from '../lib/flashcards';
import ConfirmDeleteButton from './ConfirmDeleteButton';
import { EmptyNote } from './DashUI';

const deckState: LibraryDeckState = { error: '', success: false };
const bulkState: BulkAddState = { error: '', added: 0, skippedLines: [] };

const fieldInput: React.CSSProperties = {
  width: '100%',
  padding: '9px 11px',
  border: '1px solid var(--portal-slate-200)',
  borderRadius: '8px',
  fontSize: '13.5px',
  background: '#fff',
};

export interface LibraryStudent {
  id: string;
  name: string;
}

/**
 * The coach's master decks. Sending one to a student copies it, so the student
 * owns their copy and can add to it -- editing the master afterwards never
 * reaches back into work they have already done.
 */
export default function LibraryDecks({
  decks,
  cardsByDeck,
  recipientsByDeck,
  students,
}: {
  decks: DeckSummary[];
  cardsByDeck: Record<string, CardRow[]>;
  recipientsByDeck: Record<string, string[]>;
  students: LibraryStudent[];
}) {
  const [state, formAction, pending] = useActionState(createLibraryDeck, deckState);
  const [openDeck, setOpenDeck] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <div>
      {decks.length === 0 && (
        <EmptyNote>
          No decks yet. Build one for a topic, fill it with vocabulary, then send it
          to whichever students need it.
        </EmptyNote>
      )}

      <div style={{ display: 'grid', gap: '8px' }}>
        {decks.map((deck) => (
          <div key={deck.id} style={{ border: '1px solid var(--dash-line)', borderRadius: '12px', background: '#fff' }}>
            <button
              type="button"
              onClick={() => setOpenDeck(openDeck === deck.id ? null : deck.id)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', padding: '13px 15px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            >
              <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--dash-ink)' }}>{deck.name}</span>
              <span style={{ fontSize: '11.5px', color: 'var(--dash-muted)', whiteSpace: 'nowrap' }}>
                {deck.card_count} card{deck.card_count === 1 ? '' : 's'}
                {(recipientsByDeck[deck.id]?.length ?? 0) > 0 && ` · sent to ${recipientsByDeck[deck.id].length}`}
                {openDeck === deck.id ? '  ▲' : '  ▼'}
              </span>
            </button>

            {openDeck === deck.id && (
              <div style={{ padding: '0 15px 15px' }}>
                <SendToStudent
                  deckId={deck.id}
                  students={students}
                  alreadySent={recipientsByDeck[deck.id] ?? []}
                />

                <LibraryBulkAdd deckId={deck.id} />

                {(cardsByDeck[deck.id] ?? []).length > 0 && (
                  <div style={{ marginTop: '12px', display: 'grid', gap: '6px' }}>
                    {(cardsByDeck[deck.id] ?? []).map((card) => (
                      <LibraryCardRow key={card.id} card={card} />
                    ))}
                  </div>
                )}

                <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--dash-line)' }}>
                  <ConfirmDeleteButton
                    label="Delete deck"
                    confirmLabel="Delete this master deck? Copies already sent to students are kept."
                    onConfirm={() => deleteLibraryDeck(deck.id)}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

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
            required
            maxLength={60}
            placeholder="New deck name, e.g. Business Meetings"
            style={{ ...fieldInput, flex: '1 1 200px', width: 'auto' }}
          />
          <button
            type="submit"
            disabled={pending}
            style={{ background: 'var(--portal-navy)', color: '#fff', border: 'none', borderRadius: '9px', padding: '9px 16px', fontWeight: 700, fontSize: '13px', cursor: pending ? 'default' : 'pointer' }}
          >
            {pending ? 'Creating…' : 'Create deck'}
          </button>
        </div>
      </form>
    </div>
  );
}

function SendToStudent({
  deckId,
  students,
  alreadySent,
}: {
  deckId: string;
  students: LibraryStudent[];
  alreadySent: string[];
}) {
  const [studentId, setStudentId] = useState('');
  const [pending, startTransition] = useTransition();
  const [sentTo, setSentTo] = useState<string | null>(null);

  const sentSet = new Set(alreadySent);

  return (
    <div style={{ background: 'var(--portal-navy-050)', borderRadius: '10px', padding: '12px', marginBottom: '10px' }}>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        <select
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          style={{ ...fieldInput, flex: '1 1 160px', width: 'auto', fontSize: '13px' }}
        >
          <option value="">Send to…</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
              {sentSet.has(s.id) ? ' (has it)' : ''}
            </option>
          ))}
        </select>
        <button
          type="button"
          disabled={!studentId || pending}
          onClick={() =>
            startTransition(async () => {
              const name = students.find((s) => s.id === studentId)?.name ?? '';
              await pushDeckToStudent(deckId, studentId);
              setSentTo(name);
              setStudentId('');
            })
          }
          style={{
            background: studentId ? 'var(--portal-turq-600)' : '#eceef7',
            color: studentId ? '#fff' : 'var(--dash-muted)',
            border: 'none',
            borderRadius: '9px',
            padding: '9px 16px',
            fontWeight: 700,
            fontSize: '13px',
            cursor: studentId && !pending ? 'pointer' : 'default',
          }}
        >
          {pending ? 'Sending…' : 'Send'}
        </button>
      </div>
      {sentTo && (
        <div style={{ fontSize: '12px', color: 'var(--portal-navy-700)', fontWeight: 600, marginTop: '8px' }}>
          Sent to {sentTo}. They get their own copy to study and edit.
        </div>
      )}
    </div>
  );
}

function LibraryBulkAdd({ deckId }: { deckId: string }) {
  const action = addLibraryCards.bind(null, deckId);
  const [state, formAction, pending] = useActionState(action, bulkState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.added > 0) formRef.current?.reset();
  }, [state.added]);

  return (
    <form ref={formRef} action={formAction}>
      {state.error && (
        <div style={{ background: '#fbeeef', color: '#b0475c', fontSize: '12.5px', fontWeight: 600, padding: '9px 12px', borderRadius: '8px', marginBottom: '10px' }}>
          {state.error}
        </div>
      )}
      {state.added > 0 && (
        <div style={{ background: 'var(--portal-turq-100)', color: 'var(--portal-navy-700)', fontSize: '12.5px', fontWeight: 600, padding: '9px 12px', borderRadius: '8px', marginBottom: '10px' }}>
          Added {state.added} card{state.added === 1 ? '' : 's'}.
          {state.skippedLines.length > 0 && ` Skipped line${state.skippedLines.length === 1 ? '' : 's'} ${state.skippedLines.join(', ')}.`}
        </div>
      )}
      <textarea
        name="bulk"
        required
        placeholder={'One card per line:\nsunset, hoàng hôn\nto negotiate, thương lượng'}
        style={{ ...fieldInput, resize: 'vertical', minHeight: '90px', fontFamily: 'ui-monospace, monospace', fontSize: '12.5px', lineHeight: 1.6 }}
      />
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '8px' }}>
        <button
          type="submit"
          disabled={pending}
          style={{ background: 'var(--portal-navy)', color: '#fff', border: 'none', borderRadius: '9px', padding: '8px 16px', fontWeight: 700, fontSize: '12.5px', cursor: pending ? 'default' : 'pointer' }}
        >
          {pending ? 'Adding…' : 'Add cards'}
        </button>
        <span style={{ fontSize: '11.5px', color: 'var(--portal-slate)' }}>Up to {MAX_BULK_CARDS} at a time.</span>
      </div>
    </form>
  );
}

function LibraryCardRow({ card }: { card: CardRow }) {
  const [pending, startTransition] = useTransition();

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', fontSize: '12.5px', padding: '7px 10px', borderRadius: '8px', background: 'var(--portal-off)', opacity: pending ? 0.5 : 1 }}>
      <span style={{ color: 'var(--dash-ink)' }}>
        <strong style={{ fontWeight: 700 }}>{card.front}</strong>
        <span style={{ color: 'var(--dash-muted)' }}> — {card.back}</span>
      </span>
      <button
        type="button"
        onClick={() => startTransition(() => removeLibraryCard(card.id))}
        style={{ background: 'none', border: 'none', color: 'var(--portal-slate)', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer', padding: 0, flexShrink: 0 }}
      >
        Remove
      </button>
    </div>
  );
}
