export const ALLOWED_EXTENSIONS = ['.docx', '.doc', '.pdf', '.png', '.jpg', '.jpeg'];
export const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

export function validateFile(file: File): string | null {
  const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return `That file type isn't accepted. Use one of: ${ALLOWED_EXTENSIONS.join(', ')}.`;
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'That file is too large. Max size is 25MB.';
  }
  return null;
}

export function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}
