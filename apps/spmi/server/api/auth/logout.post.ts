import { defineEventHandler, getHeader } from 'h3';

import { deleteSession, getBearerToken } from '../../auth/session';

export default defineEventHandler((event) => {
  deleteSession(getBearerToken(getHeader(event, 'authorization')));
  return { success: true };
});
