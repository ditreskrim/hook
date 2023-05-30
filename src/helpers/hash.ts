import crypto from 'node:crypto';

export function hashPassword(password: string) {
  /*
   * Creating a unique salt for a particular user
   * Salt is a random bit of data added to the user's password
   * Salt means that every password's hash is going to be unique
   */
  const salt = crypto.randomBytes(16).toString('hex');

  /*
   * Create a hash with 1000 iterations
   */
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

  return { hash, salt };
}

export function verifyPassword({ passwd, salt, hash }: { passwd: string; salt: string; hash: string }) {
  return crypto.pbkdf2Sync(passwd, salt, 1000, 64, 'sha512').toString('hex') === hash;
}
