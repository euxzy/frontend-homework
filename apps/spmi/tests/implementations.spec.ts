import { getImplementations, implementations, units } from '../server/data/implementations';

describe('implementations API data', () => {
  it('returns the documented implementation response shape', () => {
    expect(implementations[0]).toEqual({
      id: 'implementation-1',
      period_id: '2025-ganjil',
      unit: { id: 'informatika', name: 'Program Studi Informatika' },
      audit_name: 'Audit Mutu Internal 2025',
      instrument: 'Paket Instrumen Audit Program Studi',
      filling_date: {
        start: '2025-09-01T00:00:00.000Z',
        end: '2025-09-30T23:59:59.000Z',
      },
      filling_progress: 75,
    });
  });

  it('returns the documented units response shape', () => {
    expect(units[0]).toEqual({ id: 'informatika', name: 'Program Studi Informatika' });
  });

  it('filters implementations by period', () => {
    expect(getImplementations('2025-ganjil')).toHaveLength(2);
    expect(getImplementations('2025-ganjil').every((item) => item.period_id === '2025-ganjil')).toBe(true);
  });

  it('filters implementations by unit', () => {
    expect(getImplementations(undefined, 'akuntansi')).toMatchObject([
      { id: 'implementation-3', unit: { id: 'akuntansi' } },
    ]);
  });

  it('filters implementations by period and unit together', () => {
    expect(getImplementations('2025-ganjil', 'informatika')).toMatchObject([
      { id: 'implementation-1' },
    ]);
    expect(getImplementations('2025-ganjil', 'akuntansi')).toEqual([]);
  });

  it('keeps filling progress in the accepted range', () => {
    expect(implementations.every((item) => (
      Number.isInteger(item.filling_progress)
      && item.filling_progress >= 0
      && item.filling_progress <= 100
    ))).toBe(true);
  });
});
