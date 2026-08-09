import { get } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getSession } from '../lib/session';
import { getSubmissionById } from '../lib/db';

// The Blob store is private -- files aren't reachable by a bare URL. Every
// download goes through this route so we can check the requester actually
// owns the submission (or is the coach) before streaming it back.
export async function GET(request: Request) {
  const session = await getSession();
  const submissionId = new URL(request.url).searchParams.get('id');
  if (!submissionId) return new NextResponse('Not found', { status: 404 });

  const submission = await getSubmissionById(submissionId);
  if (!submission || !submission.file_url) return new NextResponse('Not found', { status: 404 });

  const isOwner = session.role === 'student' && session.studentId === submission.student_id;
  const isCoach = session.role === 'coach';
  if (!isOwner && !isCoach) return new NextResponse('Forbidden', { status: 403 });

  const result = await get(submission.file_url, { access: 'private' });
  if (!result) return new NextResponse('Not found', { status: 404 });

  return new NextResponse(result.stream, {
    headers: {
      'Content-Type': result.blob.contentType || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${submission.file_name ?? 'file'}"`,
    },
  });
}
