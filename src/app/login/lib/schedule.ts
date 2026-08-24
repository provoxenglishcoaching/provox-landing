export interface ScheduleSlot {
  dayOfWeek: number; // 0 = Sunday .. 6 = Saturday
  timeOfDay: string; // 24h "HH:MM"
}

export interface GeneratedSession {
  date: string; // "YYYY-MM-DD"
  time: string; // 24h "HH:MM"
}

export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const DAY_NAMES_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function toDateOnlyString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function sortedSlots(slots: ScheduleSlot[]): ScheduleSlot[] {
  return [...slots].sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.timeOfDay.localeCompare(b.timeOfDay));
}

/**
 * Generates a contract's full set of class sessions. The first session is
 * pinned exactly to firstDate/firstTime as entered by the coach (it need not
 * fall on one of the recurring slots' weekdays); every session after that is
 * produced by walking forward day-by-day and emitting one whenever the
 * weekday matches a slot, cycling through the pattern until `count` sessions
 * exist.
 */
export function generateInitialSessions(
  slots: ScheduleSlot[],
  firstDate: string,
  firstTime: string,
  count: number
): GeneratedSession[] {
  const results: GeneratedSession[] = [];
  if (count <= 0) return results;
  results.push({ date: firstDate, time: firstTime });
  if (count === 1) return results;

  const pattern = sortedSlots(slots);
  const cursor = new Date(firstDate + 'T00:00:00');
  while (results.length < count) {
    cursor.setDate(cursor.getDate() + 1);
    const slot = pattern.find((s) => s.dayOfWeek === cursor.getDay());
    if (slot) results.push({ date: toDateOnlyString(cursor), time: slot.timeOfDay });
  }
  return results;
}

/**
 * Regenerates the "not yet happened" tail of a contract after the coach
 * edits the weekly schedule or class count mid-contract. Walks forward from
 * fromDateInclusive (today) matching the new pattern until `count` sessions
 * are produced -- no manual anchor, since there's no "first class" moment
 * here, just a resumption point.
 */
export function generateSessionsFrom(slots: ScheduleSlot[], fromDateInclusive: string, count: number): GeneratedSession[] {
  const results: GeneratedSession[] = [];
  if (count <= 0) return results;

  const pattern = sortedSlots(slots);
  const cursor = new Date(fromDateInclusive + 'T00:00:00');
  cursor.setDate(cursor.getDate() - 1);
  while (results.length < count) {
    cursor.setDate(cursor.getDate() + 1);
    const slot = pattern.find((s) => s.dayOfWeek === cursor.getDay());
    if (slot) results.push({ date: toDateOnlyString(cursor), time: slot.timeOfDay });
  }
  return results;
}

export function formatTime12h(hhmm: string): string {
  const [hStr, mStr] = hhmm.split(':');
  const h = Number(hStr);
  const m = Number(mStr);
  if (Number.isNaN(h) || Number.isNaN(m)) return hhmm;
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

export function formatSessionDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: '2-digit', year: '2-digit' });
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

export function formatScheduleText(slots: ScheduleSlot[]): string {
  return sortedSlots(slots)
    .map((s) => `${DAY_NAMES_SHORT[s.dayOfWeek]} ${formatTime12h(s.timeOfDay)}`)
    .join(', ');
}
