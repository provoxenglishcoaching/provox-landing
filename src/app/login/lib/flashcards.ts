/**
 * Flashcard review scheduling and bulk-entry parsing. Kept free of any
 * database or React dependency, like `income.ts`, so the rules can be read
 * and changed in one place.
 *
 * The model is a Leitner box system: every card sits in a box from 0 to 5.
 * Answering correctly promotes it one box and pushes its next review further
 * out; missing it drops the card back to box 0 to be relearned.
 */

/** Highest box a card can reach. */
export const MAX_BOX = 5;

/**
 * Days until a card in each box comes up again, indexed by box. Box 0 is due
 * the same day so a card just learned (or just missed) is seen again in the
 * next session rather than disappearing for a day.
 */
export const BOX_INTERVAL_DAYS = [0, 1, 3, 7, 16, 35] as const;

/** A card is "mastered" once it reaches the last box. */
export function isMastered(box: number): boolean {
  return box >= MAX_BOX;
}

export interface ReviewResult {
  box: number;
  /** ISO yyyy-mm-dd. */
  dueDate: string;
}

/**
 * The new box and due date for a card just answered. `today` is passed in
 * rather than read from the clock so this stays a pure function.
 */
export function gradeCard(currentBox: number, correct: boolean, today: Date): ReviewResult {
  const box = correct ? Math.min(currentBox + 1, MAX_BOX) : 0;
  const due = new Date(today);
  due.setDate(due.getDate() + BOX_INTERVAL_DAYS[box]);
  return { box, dueDate: toDateOnly(due) };
}

/** yyyy-mm-dd in local time -- `toISOString` would shift across a timezone. */
export function toDateOnly(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export interface DueCard {
  box: number;
  due_date: string;
}

/** Cards whose due date has arrived. Used to size the "due now" badge. */
export function countDue(cards: DueCard[], today: Date): number {
  const cutoff = toDateOnly(today);
  return cards.filter((c) => c.due_date <= cutoff).length;
}

/**
 * Fisher-Yates. Returns a new array so callers can shuffle React state
 * without mutating it in place.
 */
export function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export interface ParsedCard {
  front: string;
  back: string;
}

/** How many cards one paste may create, so a runaway paste can't flood a deck. */
export const MAX_BULK_CARDS = 500;

/**
 * Parses pasted lines into cards. One card per line, the English and the
 * translation separated by a comma, a tab, a semicolon or an en/em dash --
 * whichever the student's own notes happen to use.
 *
 * Only the *first* separator splits the line, so "We had to negotiate, then
 * agree" survives intact on the right-hand side. Lines without a separator,
 * and lines missing either side, are reported back rather than silently
 * dropped, so a student can see exactly which rows need fixing.
 */
export function parseBulkCards(input: string): { cards: ParsedCard[]; skipped: number[] } {
  const cards: ParsedCard[] = [];
  const skipped: number[] = [];

  input.split(/\r?\n/).forEach((rawLine, index) => {
    const line = rawLine.trim();
    if (!line) return; // Blank lines are padding, not mistakes.

    const match = line.match(/^(.*?)\s*(?:\t|,|;|—|–)\s*(.*)$/);
    const front = match?.[1].trim() ?? '';
    const back = match?.[2].trim() ?? '';

    if (!front || !back) {
      skipped.push(index + 1);
      return;
    }
    cards.push({ front, back });
  });

  return { cards: cards.slice(0, MAX_BULK_CARDS), skipped };
}
