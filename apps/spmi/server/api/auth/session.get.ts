import { createError, defineEventHandler, getHeader } from 'h3';

import { getBearerToken, getSession } from '../../auth/session';

export default defineEventHandler((event) => {
  const token = getBearerToken(getHeader(event, 'authorization'));
  const user = getSession(token);

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthenticated.' });
  }

  return user;
});
