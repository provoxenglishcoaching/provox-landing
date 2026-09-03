'use client';

import { useState, useActionState, useRef, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  addMyCard,
  addMyCardsInBulk,
  deleteMyCard,
  deleteMyDeck,
  renameMyDeck,
  type DeckFormState,
  type BulkAddState,
} from '../actions/student';
import type { CardRow, DeckRow } from '../lib/db';
import { MAX_BULK_CARDS, isMastered } from '../lib/flashcards';
import StudySession from './StudySession';
import ConfirmDeleteButton from './ConfirmDeleteButton';
import { EmptyNote } from './DashUI';

const cardState: DeckFormState = { error: '', success: false };
const bulkState: BulkAddState = { error: '', added: 0, skippedLines: [] };

const fieldInput: React.CSSProperties = {
  width: '100%',
  padding: '9px 11px',
  border: '1px solid var(--portal-slate-200)',
  borderRadius: '8px',
  fontSize: '13.5px',
  background: '#fff',
};

const fieldLabel: React.CSSProperties = {
  display: 'block',
  fontSize: '11.5px',
  fontWeight: 700,
  color: '#4f5f7c',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  marginBottom: '5px',
};

export default function DeckDetail({ deck, cards }: { deck: DeckRow; cards: CardRow[] }) {
  const [studying, setStudying] = useState(false);
  const router = useRouter();

  if (studying) {
    return (
      <StudySession
        deckId={deck.id}
        deckName={deck.name}
        cards={cards}
        onExit={() => {
          setStudying(false);
          // Pull the fresh boxes and due dates the save just wrote.
          router.refresh();
        }}
      />
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
        <span style={{ fontSize: '13px', color: 'var(--dash-muted)' }}>
          {cards.length === 0 ? 'No cards yet' : `${cards.length} card${cards.length === 1 ? '' : 's'}`}
        </span>
        <button
          type="button"
          disabled={cards.length === 0}
          onClick={() => setStudying(true)}
          style={{
            background: cards.length === 0 ? '#eceef7' : 'var(--portal-navy)',
            color: cards.length === 0 ? 'var(--dash-muted)' : '#fff',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 22px',
            fontWeight: 700,
            fontSize: '13.5px',
            cursor: cards.length === 0 ? 'default' : 'pointer',
          }}
        >
          Study
        </button>
      </div>

      <AddCardForm deckId={deck.id} />
      <BulkAddForm deckId={deck.id} />

      {cards.length === 0 ? (
        <EmptyNote>Add your first card above, or paste a whole list at once.</EmptyNote>
      ) : (
        <div style={{ marginTop: '18px', display: 'grid', gap: '8px' }}>
          {cards.map((card) => (
            <CardRowItem key={card.id} card={card} />
          ))}
        </div>
      )}

      <div style={{ marginTop: '22px', paddingTop: '14px', borderTop: '1px solid var(--dash-line)', display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
        <RenameDeck deck={deck} />
        <ConfirmDeleteButton
          label="Delete deck"
          confirmLabel="Delete this deck and all its cards?"
          onConfirm={async () => {
            await deleteMyDeck(deck.id);
            router.push('/login/student?tab=learn');
          }}
        />
      </div>
    </div>
  );
}

function AddCardForm({ deckId }: { deckId: string }) {
  const action = addMyCard.bind(null, deckId);
  const [state, formAction, pending] = useActionState(action, cardState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} style={{ background: 'var(--portal-navy-050)', borderRadius: '12px', padding: '16px' }}>
      {state.error && (
        <div style={{ background: '#fbeeef', color: '#b0475c', fontSize: '12.5px', fontWeight: 600, padding: '9px 12px', borderRadius: '8px', marginBottom: '12px' }}>
          {state.error}
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', marginBottom: '10px' }}>
        <div>
          <label style={fieldLabel}>English</label>
          <input name="front" type="text" required maxLength={200} placeholder="sunset" style={fieldInput} />
        </div>
        <div>
          <label style={fieldLabel}>Your language</label>
          <input name="back" type="text" required maxLength={200} placeholder="hoàng hôn" style={fieldInput} />
        </div>
      </div>
      <div style={{ marginBottom: '12px' }}>
        <label style={fieldLabel}>Example sentence (optional)</label>
        <input name="example" type="text" maxLength={300} placeholder="We watched the sunset from the roof." style={fieldInput} />
      </div>
      <button
        type="submit"
        disabled={pending}
        style={{ background: 'var(--portal-navy)', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 18px', fontWeight: 700, fontSize: '13.5px', cursor: pending ? 'default' : 'pointer' }}
      >
        {pending ? 'Adding…' : 'Add card'}
      </button>
    </form>
  );
}

/**
 * Paste-a-list entry. Typing a few hundred words one form at a time is the
 * quickest way to make a student give up on the feature, so a whole
 * vocabulary list can go in at once.
 */
function BulkAddForm({ deckId }: { deckId: string }) {
  const action = addMyCardsInBulk.bind(null, deckId);
  const [state, formAction, pending] = useActionState(action, bulkState);
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.added > 0) formRef.current?.reset();
  }, [state.added]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{ marginTop: '10px', background: 'none', border: 'none', color: 'var(--portal-navy)', fontWeight: 700, fontSize: '13px', cursor: 'pointer', padding: 0 }}
      >
        Or paste a whole list →
      </button>
    );
  }

  return (
    <form ref={formRef} action={formAction} style={{ marginTop: '10px', background: 'var(--portal-navy-050)', borderRadius: '12px', padding: '16px' }}>
      {state.error && (
        <div style={{ background: '#fbeeef', color: '#b0475c', fontSize: '12.5px', fontWeight: 600, padding: '9px 12px', borderRadius: '8px', marginBottom: '12px' }}>
          {state.error}
        </div>
      )}
      {state.added > 0 && (
        <div style={{ background: 'var(--portal-turq-100)', color: 'var(--portal-navy-700)', fontSize: '12.5px', fontWeight: 600, padding: '9px 12px', borderRadius: '8px', marginBottom: '12px' }}>
          Added {state.added} card{state.added === 1 ? '' : 's'}.
          {state.skippedLines.length > 0 && ` Skipped line${state.skippedLines.length === 1 ? '' : 's'} ${state.skippedLines.join(', ')} — no translation found.`}
        </div>
      )}
      <label style={fieldLabel}>One card per line</label>
      <textarea
        name="bulk"
        required
        placeholder={'sunset, hoàng hôn\nto negotiate, thương lượng\nbudget, ngân sách'}
        style={{ ...fieldInput, resize: 'vertical', minHeight: '130px', fontFamily: 'ui-monospace, monospace', fontSize: '13px', lineHeight: 1.6 }}
      />
      <div style={{ fontSize: '11.5px', color: 'var(--portal-slate)', margin: '6px 0 12px' }}>
        Separate the two sides with a comma, a tab, or a dash. Up to {MAX_BULK_CARDS} cards at a time.
      </div>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button
          type="submit"
          disabled={pending}
          style={{ background: 'var(--portal-navy)', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 18px', fontWeight: 700, fontSize: '13.5px', cursor: pending ? 'default' : 'pointer' }}
        >
          {pending ? 'Adding…' : 'Add cards'}
        </button>
        <button type="button" onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--portal-slate)', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
          Close
        </button>
      </div>
    </form>
  );
}

function CardRowItem({ card }: { card: CardRow }) {
  const [pending, startTransition] = useTransition();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        padding: '11px 13px',
        border: '1px solid var(--dash-line)',
        borderRadius: '10px',
        background: '#fff',
        opacity: pending ? 0.5 : 1,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--dash-ink)' }}>{card.front}</div>
        <div style={{ fontSize: '13px', color: 'var(--dash-muted)', marginTop: '2px' }}>{card.back}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        {isMastered(card.box) && (
          <span style={{ background: 'var(--dash-good-bg)', color: 'var(--dash-good-ink)', fontSize: '11px', fontWeight: 700, padding: '3px 9px', borderRadius: '999px' }}>
            Learned
          </span>
        )}
        <button
          type="button"
          onClick={() => startTransition(() => deleteMyCard(card.id))}
          style={{ background: 'none', border: 'none', color: 'var(--portal-slate)', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer', padding: 0 }}
        >
          Remove
        </button>
      </div>
    </div>
  );
}

function RenameDeck({ deck }: { deck: DeckRow }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(deck.name);
  const [pending, startTransition] = useTransition();

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        style={{ background: 'none', border: 'none', color: 'var(--portal-slate)', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer', padding: 0 }}
      >
        Rename deck
      </button>
    );
  }

  return (
    <span style={{ display: 'inline-flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
      <input
        value={name}
        autoFocus
        maxLength={60}
        onChange={(e) => setName(e.target.value)}
        style={{ ...fieldInput, width: 'auto', padding: '6px 10px', fontSize: '13px' }}
      />
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await renameMyDeck(deck.id, name);
            setEditing(false);
          })
        }
        style={{ background: 'var(--portal-navy)', color: '#fff', border: 'none', borderRadius: '8px', padding: '7px 14px', fontWeight: 700, fontSize: '12.5px', cursor: 'pointer' }}
      >
        Save
      </button>
      <button
        type="button"
        onClick={() => {
          setName(deck.name);
          setEditing(false);
        }}
        style={{ background: 'none', border: 'none', color: 'var(--portal-slate)', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}
      >
        Cancel
      </button>
    </span>
  );
}
