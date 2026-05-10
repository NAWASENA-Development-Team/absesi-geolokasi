// api/admin-data.js
// Endpoint untuk admin panel — ambil semua data absensi dari Neon PostgreSQL

import { neon } from "@neondatabase/serverless";

// Simpan ADMIN_SECRET di Vercel Environment Variables
const ADMIN_SECRET = process.env.ADMIN_SECRET || "OSIS26MPK26SECRET";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Autentikasi via query param ?secret=xxx
  const token = req.query.secret || "";
  if (!token || token !== ADMIN_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    const rows = await sql`
      SELECT
        id,
        nama,
        kelas,
        COALESCE(divisi, '-') AS divisi,
        organisasi,
        waktu_absen,
        latitude,
        longitude,
        jarak_meter,
        status_kehadiran
      FROM absensi_rapat
      ORDER BY waktu_absen DESC
      LIMIT 500
    `;

    const stats = await sql`
      SELECT
        COUNT(*)                                                  AS total,
        COUNT(*) FILTER (WHERE organisasi = 'OSIS')              AS total_osis,
        COUNT(*) FILTER (WHERE organisasi = 'MPK')               AS total_mpk,
        COUNT(*) FILTER (WHERE DATE(waktu_absen AT TIME ZONE 'Asia/Jakarta') = CURRENT_DATE) AS hadir_hari_ini,
        ROUND(AVG(jarak_meter)::numeric, 1)                      AS rata_jarak
      FROM absensi_rapat
      WHERE status_kehadiran = 'HADIR'
    `;

    return res.status(200).json({ data: rows, stats: stats[0] });

  } catch (err) {
    console.error("DB Error:", err);
    return res.status(500).json({ error: "Database error: " + err.message });
  }
}