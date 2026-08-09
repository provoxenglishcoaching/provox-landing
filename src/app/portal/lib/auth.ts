import bcrypt from 'bcryptjs';

// No O/0, I/1/L -- avoids mixups when read aloud or handwritten.
const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

export function genCode(length = 4): string {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return code;
}

export function genPassword(length = 6): string {
  let password = '';
  for (let i = 0; i < length; i++) {
    password += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return password;
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  if (!hash) return false;
  return bcrypt.compare(plain, hash);
}
