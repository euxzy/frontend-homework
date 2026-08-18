---
name: figma-to-component
description: Generate Vue SFC dari Figma frame. Read-only — Figma jadi referensi visual saja, bukan source of truth. Teks spesifikasi dari user/PO tetap prioritas utama.
triggers:
  - "dari figma"
  - "implement design"
  - "bikin component dari figma"
  - "buat ui dari design"
  - "from figma"
  - "create from design"
  - "figma to code"
  - "figma to component"
  - "design to code"
tools_required: [figma]
---

# Skill: figma-to-component

Generate Vue SFC component dari Figma design dengan memprioritaskan snippet Sicoco yang sudah ada.

## PENTING: Figma = Visual Reference Only

> Teks spesifikasi dari user/PO **adalah source of truth**.
> Figma dipakai untuk lihat layout, warna, spacing, typography.
> **JANGAN replace spec yang user sudah kasih** dengan asumsi dari Figma.

Lihat `AGENTS.md` §3 untuk konfirmasi.

## ⏸️ Step 0: Plan Mode (WAJIB)

**Aturan**: Task ini **non-trivial** (introduce component baru + styling + props).
**WAJIB masuk plan mode dulu** sebelum eksekusi.

### Workflow Plan Mode

1. **Identifikasi scope**:
   - Berapa component yang akan dibuat?
   - Snippet Sicoco mana yang relevan? (cek `docs/sicoco-component-snippets.json`)
   - Icon apa yang dipakai? (cek heroicons.com)
   - Typography token apa?
   - Butuh props/events?
   - Butuh state/composable?

2. **Susun plan di chat**:
   ```markdown
   ## 📋 Plan: Component dari Figma
   
   ### Figma Reference
   - File key: [abc123XYZ]
   - Node ID: [1:23]
   - Spec teks (WAJIB ada, copy dari user/PO)
   - **Figma version** (pin supaya iterasi konsisten)
   
   ### Layout Manifest (WAJIB, dari Figma)
   Tulis ulang hierarchy berurutan persis seperti Figma `children[]`:
   ```
   Frame: Login
     1. Header (logo + system name)
     2. Content (HORIZONTAL)
        - Feature image
        - LoginCard
          1. Title (welcome title + subtitle)
          2. Form (VERTICAL)
             1. Google sign-in button  ← sibling #1, JANGAN dipindah ke bawah
             2. Divider section ("atau")
             3. Form container (username + password)
             4. Submit button
   ```
   Manifest ini jadi acuan struktur. Component reuse, snippet, atau class Tailwind **TIDAK BOLEH** mengubah urutan.

   ### Layout Coverage Matrix (WAJIB, fail-closed)
   Untuk setiap node visible (default `visible !== false`), catat status mapping:
   | Figma node ID | Node | Visibility | Asset type | Mapping | Status |
   |---|---|---|---|---|---|
   | `12244:9043` | Feature image | visible | IMAGE fill | hero image | IMPLEMENTED |
   | `12244:9000` | Login card | visible | – | form card | IMPLEMENTED |

   Status yang valid (4 saja):
   - `IMPLEMENTED` — ada di DOM dengan mapping yang sesuai.
   - `BLOCKED` — tidak bisa diimplementasi karena data/aset belum ada. **WAJIB** berhenti dan minta klarifikasi user, bukan `SKIP`.
   - `OMITTED_BY_USER` — user **eksplisit** menyebut node ID ini boleh dihilangkan. Persetujuan umum ("gas" / "ok") **TIDAK** dihitung.
   - (tidak ada status lain: `TBD`, `SKIP`, `OPTIONAL`, `LATER` **DILARANG** untuk node visible.)

   **Tidak boleh coding** jika ada node visible tanpa `IMPLEMENTED` / `OMITTED_BY_USER`.

   ### Asset Manifest (WAJIB saat ada IMAGE fill)
   Untuk setiap `imageRef`:
   | Figma node ID | imageRef | Source | Resolved file | Status |
   |---|---|---|---|---|
   | `12244:9043` | `c19650...` | `get_image_fills` URL | `apps/{app}/public/images/{feature}/{name}.webp` | DOWNLOADED |

   - `get_image_fills(file_key)` → URL signed S3.
   - Simpan ke `apps/{app}/public/images/{feature}/{semantic-name}.webp` (nama semantik, bukan hash).
   - Kalau download gagal: `BLOCKED`, bukan `SKIP`.
   - Image sudah ada di repo (mis. `campusData.bannerPortalDosen`): pakai existing, jangan duplikat.
   - Logo & avatar universitas: prioritaskan `campusData` daripada download statis.
   
    ### Component Plan
     - File: `apps/{app}/app/components/{feature}/{Name}.vue` (folder feature; ikuti konvensi filename proyek)
   - Props: [...]
   - Events: [...]
   - Slots: [...]
   - Reuse: [component yang dipakai, dengan catatan "tidak mengubah layout manifest"]
   - Jika frame memiliki filter atau pagination: gunakan `useQuerySync` di page/container sebagai state query URL dan pass params tersebut ke API.
   
   ### Design System Mapping
   - Snippet Sicoco: sialert, sicard, sibutton, dll
   - Color: text-main, bg-primary-main, bg-disabled
   - Typography: text-heading-md, text-body-md
   - Breakpoint: tablet:, desktop:
   - Icon: si-heroicon-{variant}-{name}
    - Shadow: shadow-1 / shadow-2 / shadow-{variant}
    - Test ID: `{owner}-{semantic-name}-{role}` untuk Sicoco interaktif/landmark
   
   ### Steps
   1. Ambil Figma reference via MCP (depth 10 + PNG + image fills)
   2. Tulis Layout Manifest di plan (lihat template di atas)
3. Mapping melalui `docs/agent-knowledge/figma-mappings/`, lalu gunakan snippet Sicoco sebagai fallback
   4. Generate SFC sesuai manifest (props, template, style)
   5. Tambah i18n key
    6. Validasi style + accessibility
    7. Jalankan `data-testid-convention` dan buat Test ID Manifest
    8. **Visual diff** vs PNG Figma pada viewport yang sama (lihat Step 6.5)
   ```

3. **Tunggu user approve** plan
4. **Eksekusi** sesuai plan
5. **Report** file yang dibuat + token yang dipakai

### Skip Plan Mode?

Hanya boleh skip jika:
- Edit 1 baris styling existing
- Rename 1 class
- Fix typo di template

**Default: masuk plan mode**. Component baru punya impact ke design system consistency.

## Workflow

### Step 1: Klarifikasi dengan User

Tanya:
1. **File key & node ID** — URL Figma frame yang mau diimplementasi
2. **Spec teks** — behavior, state, event (loading, error, empty, click handler)
3. **Data source** — props, API, atau hardcoded?
4. **Page/feature context** — di mana component ini dipakai?

> **Field `description` di Figma itu OPSIONAL** — sering kosong/generic.
> Jangan pakai description sebagai spec. Source of truth hanya:
> layout, variable alias ID, component name.
> Kalau info tidak cukup, **tanya user** — JANGAN asumsi.

### Step 2: Akses Figma via MCP

Gunakan `figma` MCP server (`mcp/figma.json`):

```
get_node(file_key, node_id, depth=10, version=<pin>)
get_image(file_key, ids, format=png, scale=1-2, use_absolute_bounds=true)
get_image_fills(file_key)
```

**WAJIB**:

1. **Pin Figma version** dari URL atau response pertama; pakai `version` di fetch berikutnya supaya iterasi tidak drift.
2. Fetch dengan `depth: 10`. Schema tool MCP menerima positive integer (batas 1–4 di deskripsi `mcp-figma@0.1.1` tidak berlaku).
3. Fetch rendered PNG pada viewport identik dengan frame Figma.
4. Fetch `get_image_fills` untuk dapat URL gambar asli.
5. Fetch `get_file_styles` dan `get_file_components` untuk resolve variable alias & component name.

Output: layout, colors, dimensions, text content (untuk referensi, BUKAN source of truth).

### Pre-execution Checklist (WAJIB)

Sebelum generate code, **WAJIB verify design token mapping**:

1. **Color tokens**:
   - List semua Figma `VariableID` di `boundVariables` & `background.color`
   - Map ke Sicoco alias (text-main, bg-primary-main, border-main) atau shade (neutral-500)
   - ❌ Pakai shade number jika alias equivalent tersedia
   - ❌ Pakai `bg-blue-500` / `text-red-600` (default Tailwind)

2. **Spacing tokens**:
   - List Figma `itemSpacing` & `padding*` per element
   - Map ke Tailwind (`gap-2`=8, `gap-6`=24, `p-8`=32, `px-10`=40)
   - ❌ Pakai `gap-6` arbitrary tanpa cross-check Figma

3. **Icon mapping**:
   - List Figma `name` field di children (contoh: `heroicons-outline/envelope`)
   - Map ke `<i class="si-heroicon-{variant}-{name}" />`
   - ❌ Pakai icomoon (`si-mail`, `si-eye`) — Figma pakai heroicons
   - ❌ Tebak icon name kalau tidak ada di Figma

4. **Re-fetch depth**:
   - Default `depth: 3-5` sering **MISSING** icon/component name eksplisit
   - Pakai `depth: 10` untuk dapat semua nested references
   - Kalau tetap tidak ketemu → **tanya user**, jangan asumsi

> Lihat `AGENTS.md` §3 "Design Token Compliance" untuk detail.

### Step 3: Mapping Component

1. Cocokkan nama/component set Figma dengan manifest di `docs/agent-knowledge/figma-mappings/`.
2. Gunakan `code.component`, `code.composition`, dan `properties.targets` dari manifest sebagai referensi component, prop, slot, dan conditional content.
3. Baca `docs/sicoco-component-snippets.json` atau `docs/agent-knowledge/04-component-checklist.md` hanya jika manifest belum tersedia atau untuk contoh penggunaan component hasil mapping.
4. Jika manifest dan API component terpasang tidak cocok, tandai `BLOCKED` dan verifikasi; jangan memilih prop atau variant berdasarkan tebakan.

**Mapping contoh**:

| Figma element | Snippet/Component |
|---|---|
| Tombol | `sibutton` (SButton) |
| Card | `sicard` (SCard) |
| Input field | `siinput` (SInput) |
| Dropdown | `siselect` (SSelect) |
| Checkbox | `sicheckbox` (SCheckbox) |
| Modal | `sidialog` (SDialog) |
| Alert | `sialert` (SAlert) |
| Table | `SDataTable` + `SDataTableColumn` |
| Tabs | `sitabs` (STabs) |
| Toast | `useNotification().showToast()` |
| Icon | `<i class="si-heroicon-{variant}-{name}" />` (solid/outline) |

**Typography mapping** (Figma text style → Tailwind token):

| Figma text style | Tailwind class |
|---|---|
| Page hero title | `text-display-md` / `text-display-sm` |
| Page title | `text-heading-lg` / `text-heading-xl` |
| Section title | `text-heading-md` |
| Sub-section | `text-heading-sm` |
| Card title | `text-title-md` / `text-title-lg` |
| Body text | `text-body-md` (default) |
| Secondary text | `text-body-sm` |
| Label | `text-label-md` |
| Tag | `text-label-sm` |
| Caption | `text-caption-md` / `text-caption-sm` |

**PENTING**: Jangan bikin component custom jika Sicoco sudah punya equivalent.

**PENTING untuk Table**: Semua tabel **WAJIB** memakai `SDataTable` dan `SDataTableColumn`, tanpa pengecualian. Gunakan `docs/agent-knowledge/figma-mappings/table.yaml` untuk mapping `data`, kolom, header slot, dan cell slot. **JANGAN** gunakan `STable` atau keluarga komponen `STable`.

**PENTING**: Manifest mapping lebih tinggi prioritasnya daripada snippet generik. Tidak ditemukannya manifest bukan izin untuk mengarang component API.

**PENTING untuk Layout Manifest**:
- Snippet Sicoco boleh dipakai, **tapi tidak boleh mengubah urutan sibling** yang sudah ada di manifest.
- Kalau snippet yang ada (mis. `LoginForm`) tidak match dengan struktur Figma, **tanyakan user** sebelum reorder.
- Reuse component dengan urutan yang salah bukan reuse yang valid.

### Step 4: Generate SFC

Generate **persis sesuai Layout Manifest**:

- Sibling order pada setiap `FRAME`/`layoutMode` sama dengan `children[]` Figma.
- `layoutMode` (VERTICAL/HORIZONTAL), `primaryAxisAlignItems`, `counterAxisAlignItems` dipakai apa adanya.
- `itemSpacing`, `padding*`, `cornerRadius` dipetakan ke token terdekat, nilai dijaga relatif.
- `visible: false` di Figma → tidak dirender; `visible: true` → wajib dirender.
- Komponen hasil boleh dibungkus/dipisah sesuai snippet, **selama sibling order tetap**.
- Untuk filter atau pagination, state query berada di page/container memakai `useQuerySync`, bukan `ref` lokal component. Bind ke `params.page` dan `params.per_page`, lalu pass `params` ke API request.

```vue
<script setup lang="ts">
import { SCard, SButton } from '@sutekipub/sicoco-v3-next'
import { STableEmpty } from '@sutekipub/siakad-next/components'

interface Props {
  // Definisikan props berdasarkan spec
  title: string
  items: Item[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  // Events berdasarkan spec
  action: [item: Item]
}>()
</script>

<template>
  <SCard class="p-4 tablet:p-6 shadow-1 hover:shadow-2">
    <!-- Layout dari Figma, tapi styling pakai palette + token baru -->
    <h3 class="text-heading-md text-main">{{ title }}</h3>
    <SButton
      data-testid="feature-card-action-button"
      variant="primary"
      @click="emit('action', item)"
    >
      <i class="si-heroicon-solid-arrow-right"></i>
      {{ t('common_action') }}
    </SButton>
  </SCard>
</template>
```

### Step 5: i18n Keys

Setiap text dari Figma (yang dipakai) → tambah i18n key:

```json
// apps/{app}/i18n/lang/id.json
{
  "common": {
    "action": "Aksi"
  }
}
```

**Jangan hardcode** text dari Figma langsung di template.

### Step 6: Validasi Style

Pastikan:
- ❌ Tidak ada default Tailwind colors: `gray-200`, `blue-500`, `red-600`
- ❌ Tidak ada default Tailwind colors: `text-gray-700`, `bg-blue-500`
- ✅ Pakai **alias** (preferred): `text-main`, `bg-primary-main`, `bg-disabled`
- ❌ Tidak ada typography obsolete: `text-h1`, `text-h2`, `text-h3`
- ❌ Tidak ada arbitrary size: `text-[18px]`
- ✅ Pakai **typography token**: `text-heading-md`, `text-body-md`
- ❌ Tidak ada default Tailwind breakpoints: `sm:`, `md:`, `lg:`
- ✅ Pakai **custom breakpoints**: `tablet:`, `desktop:`
- ❌ Tidak ada shadow default: `shadow-sm`, `shadow-md`, `shadow-lg`
- ✅ Pakai **shadow token**: `shadow-1`, `shadow-2`, `shadow-{variant}`
- ❌ Tidak ada `class` pada `SButton`; gunakan prop `variant`, `outlined`, dan `size`
- ❌ Tidak ada inline style
- ✅ Icon pakai `<i class="si-heroicon-{variant}-{name}" />`
- ✅ Sicoco interaktif/landmark baru memiliki `data-testid` stabil

### Step 6.5: Visual Diff vs Figma (WAJIB)

Render hasil implementasi di **viewport yang sama dengan Figma frame** (gunakan Chrome DevTools atau Playwright). Simpan screenshot dan bandingkan dengan PNG Figma dari `get_image`.

Checklist visual:
- Sibling order sama dengan manifest
- Node `visible: false` di Figma tidak muncul di render
- Alignment & spacing kasat mata sama (token boleh berbeda)
- Icon & image benar (heroicon, image fill)
- Tidak ada element “tambahan” yang tidak ada di Figma (kecuali placeholder yang akan diisi kemudian, dan sudah ditandai TODO)

**Jika ada perbedaan layout**: jangan claim selesai. Kembali ke Step 4 atau tanyakan user.

Baca `docs/agent-knowledge/07-styling-system.md` untuk full reference.

### Step 7: Quality Gate

```bash
pnpm lint
pnpm lint:i18n:missing
```

### Step 8: Completion Gate (WAJIB sebelum klaim "selesai")

Agent **DILARANG** menyatakan selesai sebelum SEMUA ini terpenuhi:

1. **Layout Coverage Matrix lengkap** — tidak ada node visible dengan status kosong.
2. **Asset Manifest lengkap** — semua `imageRef` resolved ke file atau `BLOCKED` dengan klarifikasi user.
3. **Visual diff** — screenshot implementation dibandingkan dengan PNG Figma pada viewport yang sama.
4. **No implicit omission** — setiap node visible yang tidak di-render memiliki `OMITTED_BY_USER` dengan nama node + alasan eksplisit.
5. **Quality gate standard lulus** — lint, i18n, missing imports, security.
6. **Test ID Manifest lengkap** — semua Sicoco interaktif/landmark baru tercatat.

Sebelum semua terpenuhi, klaim "selesai" = klaim palsu. **Lebih baik berhenti dan tanya** daripada mengklaim selesai dengan elemen hilang.

## Apa yang TIDAK Dilakukan

- ❌ Render pixel-perfect 1:1 dengan Figma
- ❌ Extract text spec dari Figma (pakai spec user)
- ❌ Bikin component custom kalau Sicoco sudah ada
- ❌ Pakai standard Tailwind colors
- ❌ Hardcode text dari Figma
- ❌ **Reorder sibling Figma** (mis. social login → credential form) demi “kebiasaan UI” atau “reuse component”
- ❌ **Meratakan/membalik hierarchy Figma**
- ❌ **Mengubah visibility Figma** (hide/show) tanpa spec teks user
- ❌ **Mengubah `layoutMode`, `layoutSizing`, atau alignment** tanpa spec teks user
- ❌ **Menggunakan Figma depth < 10** (icon/component name bisa hilang)
- ❌ **Menghilangkan node visible** karena data/aset belum jelas, tanpa persetujuan eksplisit user yang menyebut node ID
- ❌ **Menandai node visible sebagai `TBD`, `SKIP`, `OPTIONAL`, atau `LATER`**
- ❌ **Klaim selesai** sebelum Coverage Matrix lengkap, Asset Manifest resolved, dan visual diff dengan PNG Figma dilakukan
- ❌ **Mengarang component, prop, slot, atau variant** ketika manifest mapping dan API Sicoco terpasang tidak memberikan referensi

## Yang Dilakukan

- ✅ Lihat layout Figma sebagai panduan
- ✅ Lihat color/spacing/typography reference
- ✅ Map ke Sicoco component/snippet (tanpa mengubah Layout Manifest)
- ✅ Gunakan `docs/agent-knowledge/figma-mappings/` sebagai referensi utama mapping component
- ✅ Generate SFC yang clean, i18n, dan accessible
- ✅ Pakai palette custom project
- ✅ Pakai spec teks user sebagai acuan utama
- ✅ **Pertahankan sibling order Figma persis seperti `children[]`**
- ✅ **Pertahankan hierarchy, grouping, dan nesting Figma**
- ✅ **Pertahankan `layoutMode`, `layoutSizing`, dan `visibility`**
- ✅ **Fetch dengan depth 10 + PNG + image fills**, pin Figma version
- ✅ **Visual diff** dengan PNG Figma pada viewport yang sama
- ✅ **Layout Coverage Matrix** lengkap dengan status `IMPLEMENTED` / `BLOCKED` / `OMITTED_BY_USER`
- ✅ **Asset Manifest** lengkap, semua imageRef resolved atau di-block dengan klarifikasi
- ✅ **Tidak ada node visible yang di-skip** tanpa persetujuan eksplisit user yang menyebut node ID
- ✅ **Test ID Manifest** untuk dev/QA

## Output Skill Ini

- File component baru (atau edit existing)
- i18n keys yang ditambah
- Layout Manifest (sibling order dari Figma) di laporan
- **Layout Coverage Matrix** dengan status setiap node visible
- **Asset Manifest** dengan lokasi file hasil unduhan atau status BLOCKED
- Screenshot hasil render + catatan diff vs PNG Figma
- Catatan: bagian mana yang "visual ref" vs "sesuai spec"
- Daftar omission (jika ada) dengan node ID + alasan user
- Quality gate result
- Test ID Manifest

## Related Skills

- `feature-scaffold` — bikin feature lengkap (termasuk component)
- `i18n-coverage` — audit i18n
- `quality-gate` — final check
- `data-testid-convention` — stable Playwright selector contracts
