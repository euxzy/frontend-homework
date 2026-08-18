import { defineEventHandler, getQuery } from 'h3';

import { getImplementations } from '../data/implementations';

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const periodId = typeof query.period_id === 'string' ? query.period_id : undefined;
  const unitId = typeof query.unit_id === 'string' ? query.unit_id : undefined;

  return { implementations: getImplementations(periodId, unitId) };
});
