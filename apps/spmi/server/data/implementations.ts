export interface Unit {
  id: string;
  name: string;
}

export interface Implementation {
  id: string;
  period_id: string;
  unit: Unit;
  audit_name: string;
  instrument: string;
  filling_date: {
    start: string;
    end: string;
  };
  filling_progress: number;
}

export const units: Unit[] = [
  { id: 'informatika', name: 'Program Studi Informatika' },
  { id: 'sistem-informasi', name: 'Program Studi Sistem Informasi' },
  { id: 'akuntansi', name: 'Program Studi Akuntansi' },
  { id: 'manajemen', name: 'Program Studi Manajemen' },
];

export const implementations: Implementation[] = [
  {
    id: 'implementation-1',
    period_id: '2025-ganjil',
    unit: units[0],
    audit_name: 'Audit Mutu Internal 2025',
    instrument: 'Paket Instrumen Audit Program Studi',
    filling_date: {
      start: '2025-09-01T00:00:00.000Z',
      end: '2025-09-30T23:59:59.000Z',
    },
    filling_progress: 75,
  },
  {
    id: 'implementation-2',
    period_id: '2025-ganjil',
    unit: units[1],
    audit_name: 'Audit Mutu Internal 2025',
    instrument: 'Paket Instrumen Audit Program Studi',
    filling_date: {
      start: '2025-09-01T00:00:00.000Z',
      end: '2025-09-30T23:59:59.000Z',
    },
    filling_progress: 40,
  },
  {
    id: 'implementation-3',
    period_id: '2025-genap',
    unit: units[2],
    audit_name: 'Audit Mutu Internal 2025',
    instrument: 'Paket Instrumen Audit Fakultas',
    filling_date: {
      start: '2026-02-01T00:00:00.000Z',
      end: '2026-02-28T23:59:59.000Z',
    },
    filling_progress: 100,
  },
  {
    id: 'implementation-4',
    period_id: '2025-genap',
    unit: units[3],
    audit_name: 'Audit Mutu Internal 2025',
    instrument: 'Paket Instrumen Audit Fakultas',
    filling_date: {
      start: '2026-02-01T00:00:00.000Z',
      end: '2026-02-28T23:59:59.000Z',
    },
    filling_progress: 0,
  },
];

export function getImplementations(periodId?: string, unitId?: string): Implementation[] {
  return implementations.filter((implementation) => (
    (!periodId || implementation.period_id === periodId)
    && (!unitId || implementation.unit.id === unitId)
  ));
}
