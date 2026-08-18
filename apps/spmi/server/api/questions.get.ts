import { defineEventHandler, getQuery } from 'h3';

import { periods } from '../data/periods';

const TOTAL_QUESTIONS = 10;

export function getQuestions(periodId?: string) {
  const questions = Array.from({ length: TOTAL_QUESTIONS }, (_, index) => {
    const number = index + 1;

    return {
      id: number,
      period_id: periods[Math.floor(Math.random() * periods.length)].id,
      category: `Standar ${((index % 9) + 1).toString().padStart(2, '0')}`,
      question: `Bagaimana bukti pelaksanaan indikator mutu untuk pertanyaan nomor ${number}?`,
      options: [
        'Sangat tidak sesuai',
        'Tidak sesuai',
        'Sesuai',
        'Sangat sesuai',
      ],
    };
  });

  return periodId ? questions.filter((question) => question.period_id === periodId) : questions;
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const periodId = typeof query.period_id === 'string' ? query.period_id : undefined;
  const delayMs = Math.floor(Math.random() * 2_001) + 500;

  await new Promise<void>((resolve) => {
    setTimeout(resolve, delayMs);
  });

  return {
    questions: getQuestions(periodId),
  };
});
