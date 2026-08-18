import { defineEventHandler } from 'h3';

import { periods } from '../data/periods';

export default defineEventHandler(async () => {
  const delayMs = Math.floor(Math.random() * 2_001) + 500;

  await new Promise<void>((resolve) => {
    setTimeout(resolve, delayMs);
  });

  return {
    periods,
  };
});
