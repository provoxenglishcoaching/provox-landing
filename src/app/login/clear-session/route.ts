import { NextResponse } from 'next/server';
import { getSession } from '../lib/session';

// A stale/invalid session (e.g. pointing at a student that no longer exists)
// can't be cleared from inside a page render -- Next only allows cookie
// mutation in Server Actions and Route Handlers. This gives pages somewhere
// to redirect to instead of looping back through a dead session forever.
export async function GET(request: Request) {
  const session = await getSession();
  session.destroy();
  return NextResponse.redirect(new URL('/login', request.url));
}
