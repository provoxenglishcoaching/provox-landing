import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { requireStudent } from '../../../lib/session';
import { getDeckById, getCardsForDeck } from '../../../lib/db';
import { logout } from '../../../actions/auth';
import DeckDetail from '../../../components/DeckDetail';
import { Card } from '../../../components/DashUI';

export default async function DeckPage({ params }: { params: Promise<{ deckId: string }> }) {
  const session = await requireStudent();
  const { deckId } = await params;

  const deck = await getDeckById(deckId);
  // Ownership is checked here, not just in the actions: a deck id belonging to
  // another student must not even render.
  if (!deck || deck.student_id !== session.studentId) notFound();

  const cards = await getCardsForDeck(deck.id);

  return (
    <div className="dash-body">
      <div className="dash-shell">
        <div className="dash-frame">
          <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '18px' }}>
            <Link href="/login/student" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <Image
                src="/logo-vertical.png"
                alt="ProVox — English Coaching"
                width={1178}
                height={951}
                priority
                style={{ width: '104px', height: 'auto' }}
              />
            </Link>
            <form action={logout}>
              <button
                type="submit"
                style={{ background: '#fff', border: '1px solid var(--dash-line)', color: 'var(--dash-ink)', padding: '9px 16px', borderRadius: '10px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}
              >
                Sign out
              </button>
            </form>
          </header>

          <Link
            href="/login/student?tab=learn"
            style={{ display: 'inline-block', fontSize: '12.5px', fontWeight: 700, color: 'var(--portal-slate)', textDecoration: 'none', marginBottom: '6px' }}
          >
            ← Back to Learn
          </Link>

          <h1
            style={{
              margin: '4px 0 22px',
              fontFamily: 'var(--next-montserrat), sans-serif',
              fontSize: '30px',
              fontWeight: 700,
              letterSpacing: '-0.015em',
              color: 'var(--dash-ink)',
            }}
          >
            {deck.name}
          </h1>

          <div style={{ maxWidth: '620px' }}>
            <Card>
              <DeckDetail deck={deck} cards={cards} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
