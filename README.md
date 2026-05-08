# 📋 Absensi Rapat — OSIS & MPK SMAN 2 Jonggol

Aplikasi absensi rapat berbasis lokasi GPS untuk pengurus OSIS dan MPK.

---

## 🗂️ Struktur Proyek

```
absensi-rapat/
├── public/
│   └── index.html        ← Aplikasi utama (frontend + logika)
├── sql/
│   └── schema.sql        ← Skema database Supabase
├── vercel.json           ← Konfigurasi deployment Vercel
└── README.md
```

---

## ⚙️ Langkah Setup

### 1. Setup Supabase

1. Buka [supabase.com](https://supabase.com) → **New Project**
2. Beri nama project (misal: `absensi-nawasena`)
3. Setelah project siap, buka **SQL Editor**
4. Paste isi file `sql/schema.sql` dan klik **Run**
5. Catat dua nilai ini dari **Settings → API**:
   - **Project URL** → `https://xxxx.supabase.co`
   - **anon public key** → panjang, dimulai dengan `eyJ...`

### 2. Isi Konfigurasi di `index.html`

Buka `public/index.html`, cari baris berikut (sekitar baris 270) dan isi:

```javascript
const SUPABASE_URL     = "https://XXXX.supabase.co";       // ← Ganti ini
const SUPABASE_ANON_KEY = "eyJhbGc...";                    // ← Ganti ini
```

Lokasi sekolah sudah diisi default, tapi bisa diubah:

```javascript
const SCHOOL_LOCATION = {
  latitude:  -6.469821658683405,   // ← Ganti jika perlu
  longitude: 107.07387463910511,   // ← Ganti jika perlu
};
const RADIUS_METER = 100;          // ← Ubah radius jika perlu
```

### 3. Deploy ke Vercel

**Cara A — via GitHub (Direkomendasikan):**

1. Upload seluruh folder ke repository GitHub
2. Buka [vercel.com](https://vercel.com) → **New Project**
3. Import repository tersebut
4. Klik **Deploy** — selesai!

**Cara B — via Vercel CLI:**

```bash
npm i -g vercel
cd absensi-rapat
vercel
```

---

## 🗄️ Penjelasan Kolom Database

| Kolom              | Tipe          | Keterangan                          |
|--------------------|---------------|-------------------------------------|
| `id`               | UUID          | Primary key otomatis                |
| `nama`             | TEXT          | Nama pengurus                       |
| `kelas`            | TEXT          | Kelas (misal: XI-3)                 |
| `divisi`           | TEXT          | Jabatan/divisi (opsional)           |
| `organisasi`       | TEXT          | "OSIS" atau "MPK"                   |
| `waktu_absen`      | TIMESTAMPTZ   | Waktu absen (otomatis)              |
| `latitude`         | DOUBLE        | Koordinat lat pengguna              |
| `longitude`        | DOUBLE        | Koordinat lon pengguna              |
| `jarak_meter`      | DOUBLE        | Jarak dari sekolah (meter)          |
| `status_kehadiran` | TEXT          | "HADIR" / "TERLAMBAT" / "DITOLAK"  |

---

## 🔒 Keamanan

- Data **HANYA** dikirim ke Supabase jika jarak ≤ 100 meter (validasi di sisi client)
- RLS (Row Level Security) aktif di Supabase — anon hanya bisa INSERT dan SELECT
- Header keamanan dikonfigurasi di `vercel.json` (X-Frame-Options, dll.)
- Untuk keamanan lebih tinggi, tambahkan validasi jarak di Supabase Edge Function

---

## 📊 Lihat Data Absensi

Buka Supabase Dashboard → **Table Editor** → tabel `absensi_rapat`

Atau query manual di SQL Editor:

```sql
SELECT nama, kelas, organisasi, waktu_absen, jarak_meter, status_kehadiran
FROM absensi_rapat
ORDER BY waktu_absen DESC;
```

---

*Dibuat untuk OSIS & MPK Nawasena — SMAN 2 Jonggol*