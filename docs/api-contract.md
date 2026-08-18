# API Contract

## Pelaksanaan Audit

### `GET /api/implementations`

Mengembalikan daftar pelaksanaan audit. Endpoint dapat difilter berdasarkan periode dan unit program studi.

| Query parameter | Tipe | Deskripsi |
| --- | --- | --- |
| `period_id` | string, opsional | ID periode, misalnya `2025-ganjil`. |
| `unit_id` | string, opsional | ID unit program studi, misalnya `informatika`. |

Kedua filter dapat digunakan bersamaan. Tanpa filter, endpoint mengembalikan seluruh data. Filter yang tidak cocok mengembalikan `implementations: []` dengan status `200`.

Contoh request:

```http
GET /api/implementations?period_id=2025-ganjil&unit_id=informatika
```

Contoh response:

```json
{
  "implementations": [
    {
      "id": "implementation-1",
      "period_id": "2025-ganjil",
      "unit": {
        "id": "informatika",
        "name": "Program Studi Informatika"
      },
      "audit_name": "Audit Mutu Internal 2025",
      "instrument": "Paket Instrumen Audit Program Studi",
      "filling_date": {
        "start": "2025-09-01T00:00:00.000Z",
        "end": "2025-09-30T23:59:59.000Z"
      },
      "filling_progress": 75
    }
  ]
}
```

| Field | Tipe | Deskripsi |
| --- | --- | --- |
| `id` | string | ID unik pelaksanaan. |
| `period_id` | string | ID periode pelaksanaan. |
| `unit.id` | string | ID unit program studi. |
| `unit.name` | string | Nama program studi. |
| `audit_name` | string | Nama audit. |
| `instrument` | string | Nama paket instrumen. |
| `filling_date.start` | ISO 8601 datetime | Waktu mulai pengisian. |
| `filling_date.end` | ISO 8601 datetime | Waktu akhir pengisian. |
| `filling_progress` | number | Progress pengisian, selalu dalam rentang `0-100`. |

Contoh response lengkap tersedia di `ai-resources/knowledge/api-responses/implementations.json`.

## Unit

### `GET /api/units`

Mengembalikan daftar unit program studi yang dapat digunakan sebagai pilihan filter `unit_id`.

Contoh response:

```json
{
  "units": [
    {
      "id": "informatika",
      "name": "Program Studi Informatika"
    }
  ]
}
```

Contoh response lengkap tersedia di `ai-resources/knowledge/api-responses/units.json`.
