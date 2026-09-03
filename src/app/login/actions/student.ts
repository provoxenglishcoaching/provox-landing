'use server';

import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import {
  getAssignmentById,
  setAssignmentStatus,
  createSubmission,
  updateStudentAvatar,
  newId,
  getDeckById,
  createDeck,
  renameDeck,
  deleteDeck,
  createCard,
  createCards,
  updateCard,
  deleteCard,
  getCardOwner,
  applyReviewResults,
  type DeckRow,
} from '../lib/db';
import { parseBulkCards, gradeCard } from '../lib/flashcards';
import { requireStudent } from '../lib/session';
import { validateFile, sanitizeFilename } from '../lib/upload';
import { isValidAvatar } from '../lib/avatars';

/**
 * Students change only their own icon: the id comes from the session, never
 * from the caller, so this can't be pointed at another student.
 */
export async function changeMyAvatar(avatar: string): Promise<void> {
  const session = await requireStudent();
  if (avatar !== '' && !isValidAvatar(avatar)) return;
  await updateStudentAvatar(session.studentId, avatar);
  revalidatePath('/login/student');
  revalidatePath('/login/coach');
}

export async function toggleAssignment(assignmentId: string): Promise<void> {
  const session = await requireStudent();

  const assignment = await getAssignmentById(assignmentId);
  // Server-side ownership check -- a student must never be able to toggle
  // another student's assignment just by knowing/guessing its id.
  if (!assignment || assignment.student_id !== session.studentId) return;

  const nextStatus = assignment.status === 'completed' ? 'assigned' : 'completed';
  const completedDate = nextStatus === 'completed' ? new Date().toISOString().slice(0, 10) : null;
  await setAssignmentStatus(assignmentId, nextStatus, completedDate);
  revalidatePath('/login/student');
}

export interface SubmitWorkState {
  error: string;
  success: boolean;
}

export async function submitWork(
  _prevState: SubmitWorkState,
  formData: FormData
): Promise<SubmitWorkState> {
  const session = await requireStudent();

  const title = String(formData.get('title') ?? '').trim();
  if (!title) return { error: 'Enter a title.', success: false };

  const bodyText = String(formData.get('text') ?? '').trim();
  const file = formData.get('file');

  let fileUrl: string | null = null;
  let fileName: string | null = null;

  if (file instanceof File && file.size > 0) {
    const validationError = validateFile(file);
    if (validationError) return { error: validationError, success: false };

    const pathname = `submissions/${session.studentId}/${newId('f')}-${sanitizeFilename(file.name)}`;
    const blob = await put(pathname, file, { access: 'private', addRandomSuffix: false });
    fileUrl = blob.url;
    fileName = file.name;
  }

  await createSubmission({ studentId: session.studentId, title, bodyText, fileUrl, fileName });
  revalidatePath('/login/student');
  return { error: '', success: true };
}

/*
 * Flashcards. Every action below re-derives the student id from the session
 * and proves the deck or card belongs to them before writing, following the
 * same rule as toggleAssignment above: an id from the caller is never trusted
 * on its own.
 */

/** Shared guard: the deck, but only if this student owns it. */
async function ownedDeck(deckId: string, studentId: string): Promise<DeckRow | undefined> {
  const deck = await getDeckById(deckId);
  if (!deck || deck.student_id !== studentId) return undefined;
  return deck;
}

export interface DeckFormState {
  error: string;
  success: boolean;
}

export async function createMyDeck(
  _prevState: DeckFormState,
  formData: FormData
): Promise<DeckFormState> {
  const session = await requireStudent();

  const name = String(formData.get('name') ?? '').trim();
  if (!name) return { error: 'Give the deck a name.', success: false };
  if (name.length > 60) return { error: 'Deck names are limited to 60 characters.', success: false };

  await createDeck({ studentId: session.studentId, name });
  revalidatePath('/login/student');
  return { error: '', success: true };
}

export async function renameMyDeck(deckId: string, name: string): Promise<void> {
  const session = await requireStudent();
  if (!(await ownedDeck(deckId, session.studentId))) return;

  const trimmed = name.trim();
  if (!trimmed || trimmed.length > 60) return;

  await renameDeck(deckId, trimmed);
  revalidatePath('/login/student');
  revalidatePath(`/login/student/flashcards/${deckId}`);
}

export async function deleteMyDeck(deckId: string): Promise<void> {
  const session = await requireStudent();
  if (!(await ownedDeck(deckId, session.studentId))) return;

  await deleteDeck(deckId);
  revalidatePath('/login/student');
}

export async function addMyCard(
  deckId: string,
  _prevState: DeckFormState,
  formData: FormData
): Promise<DeckFormState> {
  const session = await requireStudent();
  if (!(await ownedDeck(deckId, session.studentId))) return { error: 'Deck not found.', success: false };

  const front = String(formData.get('front') ?? '').trim();
  const back = String(formData.get('back') ?? '').trim();
  if (!front || !back) return { error: 'Fill in both sides of the card.', success: false };

  const example = String(formData.get('example') ?? '').trim();
  await createCard({ deckId, front, back, example });
  revalidatePath(`/login/student/flashcards/${deckId}`);
  revalidatePath('/login/student');
  return { error: '', success: true };
}

/**
 * The paste box. Reports how many cards landed and which lines were skipped,
 * rather than silently dropping rows the student then has to hunt for.
 */
export interface BulkAddState {
  error: string;
  added: number;
  skippedLines: number[];
}

export async function addMyCardsInBulk(
  deckId: string,
  _prevState: BulkAddState,
  formData: FormData
): Promise<BulkAddState> {
  const session = await requireStudent();
  if (!(await ownedDeck(deckId, session.studentId))) {
    return { error: 'Deck not found.', added: 0, skippedLines: [] };
  }

  const raw = String(formData.get('bulk') ?? '');
  const { cards, skipped } = parseBulkCards(raw);
  if (cards.length === 0) {
    return {
      error: 'No cards found. Put one card per line, as: english, translation',
      added: 0,
      skippedLines: skipped,
    };
  }

  await createCards(deckId, cards);
  revalidatePath(`/login/student/flashcards/${deckId}`);
  revalidatePath('/login/student');
  return { error: '', added: cards.length, skippedLines: skipped };
}

export async function editMyCard(cardId: string, front: string, back: string, example: string): Promise<void> {
  const session = await requireStudent();

  const owner = await getCardOwner(cardId);
  if (!owner || owner.student_id !== session.studentId) return;
  if (!front.trim() || !back.trim()) return;

  await updateCard(cardId, front.trim(), back.trim(), example.trim());
  revalidatePath('/login/student');
}

export async function deleteMyCard(cardId: string): Promise<void> {
  const session = await requireStudent();

  const owner = await getCardOwner(cardId);
  if (!owner || owner.student_id !== session.studentId) return;

  await deleteCard(cardId);
  revalidatePath('/login/student');
}

/**
 * Saves a finished study session. The whole review runs in the browser and
 * lands here once, as a batch -- see applyReviewResults in lib/db.ts for why
 * that shape matters.
 */
export async function saveReview(
  deckId: string,
  results: { id: string; correct: boolean; box: number }[]
): Promise<void> {
  const session = await requireStudent();
  if (!(await ownedDeck(deckId, session.studentId))) return;

  // The new box is computed here, not taken from the client: the browser
  // sends what happened (which card, right or wrong), the server decides what
  // that means for the schedule.
  const today = new Date();
  const graded = results.map((r) => ({ id: r.id, ...gradeCard(r.box, r.correct, today) }));

  await applyReviewResults(deckId, graded);
  revalidatePath(`/login/student/flashcards/${deckId}`);
  revalidatePath('/login/student');
}
