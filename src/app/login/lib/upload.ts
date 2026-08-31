export const ALLOWED_EXTENSIONS = ['.docx', '.doc', '.pdf', '.png', '.jpg', '.jpeg'];

/**
 * Vercel caps a server-side upload's whole request body at 4.5MB, so this
 * sits just under it to leave room for the other form fields. Raising it
 * further means uploading from the browser straight to blob storage rather
 * than routing the bytes through a server action.
 */
export const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
export const MAX_FILE_SIZE_LABEL = '4MB';

export function validateFile(file: File): string | null {
  const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return `That file type isn't accepted. Use one of: ${ALLOWED_EXTENSIONS.join(', ')}.`;
  }
  if (file.size > MAX_FILE_SIZE) {
    return `That file is too large. Max size is ${MAX_FILE_SIZE_LABEL}.`;
  }
  return null;
}

export function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}
