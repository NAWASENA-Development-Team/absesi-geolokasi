-- ============================================================
-- SKEMA DATABASE: Aplikasi Absensi Rapat OSIS & MPK
-- Platform: Supabase (PostgreSQL)
-- ============================================================

-- Tabel utama absensi rapat
CREATE TABLE IF NOT EXISTS absensi_rapat (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nama            TEXT NOT NULL,
    kelas           TEXT NOT NULL,
    divisi          TEXT,
    organisasi      TEXT NOT NULL CHECK (organisasi IN ('OSIS', 'MPK')),
    waktu_absen     TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    latitude        DOUBLE PRECISION NOT NULL,
    longitude       DOUBLE PRECISION NOT NULL,
    jarak_meter     DOUBLE PRECISION NOT NULL,
    status_kehadiran TEXT NOT NULL CHECK (status_kehadiran IN ('HADIR', 'TERLAMBAT', 'DITOLAK')),
    sesi_rapat      TEXT,
    catatan         TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index untuk query cepat berdasarkan waktu dan organisasi
CREATE INDEX IF NOT EXISTS idx_absensi_waktu ON absensi_rapat (waktu_absen DESC);
CREATE INDEX IF NOT EXISTS idx_absensi_organisasi ON absensi_rapat (organisasi);
CREATE INDEX IF NOT EXISTS idx_absensi_nama ON absensi_rapat (nama);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE absensi_rapat ENABLE ROW LEVEL SECURITY;

-- Policy: Semua orang bisa INSERT (absen) — tanpa login
CREATE POLICY "Allow anonymous insert"
    ON absensi_rapat
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Policy: Semua orang bisa SELECT (lihat rekap) — sesuaikan jika perlu autentikasi
CREATE POLICY "Allow anonymous select"
    ON absensi_rapat
    FOR SELECT
    TO anon
    USING (true);

-- ============================================================
-- TABEL SESI RAPAT (opsional — untuk manajemen rapat)
-- ============================================================

CREATE TABLE IF NOT EXISTS sesi_rapat (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    judul       TEXT NOT NULL,
    organisasi  TEXT NOT NULL CHECK (organisasi IN ('OSIS', 'MPK', 'GABUNGAN')),
    tanggal     DATE NOT NULL,
    jam_mulai   TIME NOT NULL,
    jam_selesai TIME,
    lokasi      TEXT DEFAULT 'SMAN 2 Jonggol',
    aktif       BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE sesi_rapat ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous select sesi"
    ON sesi_rapat FOR SELECT TO anon USING (true);

-- ============================================================
-- CONTOH DATA AWAL (seed) — hapus jika tidak diperlukan
-- ============================================================

INSERT INTO sesi_rapat (judul, organisasi, tanggal, jam_mulai, aktif)
VALUES ('Rapat Pleno OSIS', 'OSIS', CURRENT_DATE, '14:00', TRUE)
ON CONFLICT DO NOTHING;