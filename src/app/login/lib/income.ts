/**
 * Every income figure on the coach dashboard comes from here. Kept free of
 * any database or React dependency so the arithmetic can be reasoned about
 * (and corrected) in one place.
 *
 * The model: a contract is one month of teaching -- `weekly_classes` a week
 * for four weeks -- sold for `monthly_fee_amount`.
 */

/** A contract is sold as four weeks of classes. */
export const WEEKS_PER_CONTRACT = 4;

export interface ContractInput {
  feeAmount: number;
  weeklyClasses: number;
  classDurationMinutes: number;
  rescheduledCount: number;
}

export interface ContractFinancials {
  /** Classes the fee is meant to buy. */
  nominalClasses: number;
  /** Teaching hours the fee is meant to buy. */
  nominalHours: number;
  /** Fee split evenly across the classes it buys. */
  valuePerClass: number;
  /** What an hour of this student's time is sold for. */
  hourlyRate: number;
  /**
   * The fee re-spread over the time the contract will actually take. Each
   * rescheduled class pushes a makeup class onto the end, so a contract with
   * reschedules earns the same total over a longer stretch -- which is a
   * lower monthly rate. 4,000,000 over 8 classes with 4 rescheduled runs six
   * weeks rather than four, so it earns 2,666,667 a month, not 4,000,000.
   */
  effectiveMonthly: number;
  /** The gap between the fee on paper and what it really earns per month. */
  lostToReschedules: number;
}

export function contractFinancials(input: ContractInput): ContractFinancials {
  const { feeAmount, weeklyClasses, classDurationMinutes, rescheduledCount } = input;

  const nominalClasses = Math.max(0, weeklyClasses) * WEEKS_PER_CONTRACT;
  const nominalHours = (nominalClasses * Math.max(0, classDurationMinutes)) / 60;

  const valuePerClass = nominalClasses > 0 ? feeAmount / nominalClasses : 0;
  const hourlyRate = nominalHours > 0 ? feeAmount / nominalHours : 0;

  // Guarded rather than assumed positive: a contract with no classes on it
  // yet would otherwise divide by zero here.
  const actualClasses = nominalClasses + Math.max(0, rescheduledCount);
  const effectiveMonthly = actualClasses > 0 ? (feeAmount * nominalClasses) / actualClasses : 0;

  return {
    nominalClasses,
    nominalHours,
    valuePerClass,
    hourlyRate,
    effectiveMonthly,
    lostToReschedules: feeAmount - effectiveMonthly,
  };
}

/** Whole dong — Vietnamese prices are never quoted in decimals. */
export function formatVnd(amount: number): string {
  return `${Math.round(amount).toLocaleString('en-US')} vnđ`;
}

/** Drops the trailing zeroes on big figures: 6,000,000 -> 6.0M. */
export function formatVndShort(amount: number): string {
  if (Math.abs(amount) >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M vnđ`;
  if (Math.abs(amount) >= 1_000) return `${Math.round(amount / 1_000)}K vnđ`;
  return formatVnd(amount);
}

export function formatPercent(fraction: number, digits = 1): string {
  return `${(fraction * 100).toFixed(digits)}%`;
}

export function formatHours(hours: number): string {
  return Number.isInteger(hours) ? `${hours}h` : `${hours.toFixed(1)}h`;
}

export function formatDuration(minutes: number): string {
  if (minutes % 60 === 0) return `${minutes / 60} hr`;
  if (minutes < 60) return `${minutes} min`;
  return `${Math.floor(minutes / 60)} hr ${minutes % 60} min`;
}

/** "2026-08" -> "August 2026". */
export function formatMonth(yyyymm: string): string {
  const [y, m] = yyyymm.split('-').map(Number);
  if (!y || !m) return yyyymm;
  return new Date(y, m - 1, 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
}
