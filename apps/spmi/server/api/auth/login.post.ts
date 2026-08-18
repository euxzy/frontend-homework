import { createError, defineEventHandler, readBody } from 'h3';

import { authenticate, createSession } from '../../auth/session';

interface LoginBody {
  username?: unknown;
  password?: unknown;
}

export default defineEventHandler(async (event) => {
  const body = await readBody<LoginBody>(event);

  if (typeof body.username !== 'string' || typeof body.password !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Username and password are required.' });
  }

  const user = authenticate(body.username, body.password);
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid username or password.' });
  }

  return { token: createSession(user) };
});
