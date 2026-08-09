import { getIronSession, type SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export interface PortalSessionData {
  role?: 'coach' | 'student';
  studentId?: string;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: 'provox_portal_session',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<PortalSessionData>(cookieStore, sessionOptions);
}

export async function requireCoach() {
  const session = await getSession();
  if (session.role !== 'coach') redirect('/portal');
  return session;
}

export async function requireStudent() {
  const session = await getSession();
  if (session.role !== 'student' || !session.studentId) redirect('/portal');
  return session as PortalSessionData & { studentId: string };
}
