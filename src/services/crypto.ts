/**
 * Secure Cryptographic Hashing using Web Crypto API (SubtleCrypto)
 * Implements PBKDF2 with SHA-256 and 100,000 iterations + random salt.
 * Ensures zero plaintext passwords stored.
 */

export async function generateSalt(): Promise<string> {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function hashPassword(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const passwordKey = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  const derivedBits = await window.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: enc.encode(salt),
      iterations: 100000,
      hash: 'SHA-256',
    },
    passwordKey,
    256
  );

  const hashArray = Array.from(new Uint8Array(derivedBits));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(
  attempt: string,
  storedHash: string,
  storedSalt: string
): Promise<boolean> {
  const computedHash = await hashPassword(attempt, storedSalt);
  return computedHash === storedHash;
}

export function generateToken(prefix = 'T'): string {
  const num = Math.floor(10 + Math.random() * 90);
  return `${prefix}-${num}`;
}

export function generateOrderNumber(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `BB-${num}`;
}
