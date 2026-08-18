import { randomBytes } from 'node:crypto';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface DummyUser extends AuthenticatedUser {
  password: string;
}

interface Session {
  user: AuthenticatedUser;
  expiresAt: number;
}

const sessionLifetimeInMilliseconds = 1000 * 60 * 60 * 8;

const users: DummyUser[] = [
  {
    id: 'admin-1',
    name: 'Administrator SPMI',
    email: 'admin@spmi.local',
    password: 'spmi12345',
    role: 'admin',
  },
];

const sessions = new Map<string, Session>();

export function authenticate(username: string, password: string): AuthenticatedUser | null {
  const user = users.find((candidate) =>
    (candidate.email === username) && candidate.password === password,
  );

  if (!user) return null;

  const { password: _password, ...authenticatedUser } = user;
  return authenticatedUser;
}

export function createSession(user: AuthenticatedUser): string {
  const token = randomBytes(32).toString('base64url');
  sessions.set(token, {
    user,
    expiresAt: Date.now() + sessionLifetimeInMilliseconds,
  });
  return token;
}

export function getSession(token: string | undefined): AuthenticatedUser | null {
  if (!token) return null;

  const session = sessions.get(token);
  if (!session) return null;

  if (session.expiresAt <= Date.now()) {
    sessions.delete(token);
    return null;
  }

  return session.user;
}

export function deleteSession(token: string | undefined): void {
  if (token) sessions.delete(token);
}

export function getBearerToken(authorization: string | undefined): string | undefined {
  if (!authorization?.startsWith('Bearer ')) return undefined;
  return authorization.slice('Bearer '.length);
}
