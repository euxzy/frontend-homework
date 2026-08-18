import { vi } from 'vitest';

import { getQuestions } from '../server/api/questions.get';
import { periods } from '../server/data/periods';

describe('questions API data', () => {
  it('assigns and filters questions by a listed period', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const questions = getQuestions(periods[0].id);

    expect(questions).toHaveLength(10);
    expect(questions.every((question) => question.period_id === periods[0].id)).toBe(true);

    vi.restoreAllMocks();
  });
});
