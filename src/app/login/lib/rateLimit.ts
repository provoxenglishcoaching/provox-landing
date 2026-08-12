const MAX_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

export function isLocked(lockedUntil: string | null): boolean {
  return !!lockedUntil && new Date(lockedUntil).getTime() > Date.now();
}

export function nextLockState(failedAttempts: number): { failedAttempts: number; lockedUntil: string | null } {
  const attempts = failedAttempts + 1;
  if (attempts >= MAX_ATTEMPTS) {
    return { failedAttempts: 0, lockedUntil: new Date(Date.now() + LOCKOUT_MINUTES * 60_000).toISOString() };
  }
  return { failedAttempts: attempts, lockedUntil: null };
}

export const clearedLockState = { failedAttempts: 0, lockedUntil: null as string | null };
