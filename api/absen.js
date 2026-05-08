// api/absen.js
// Vercel Serverless Function — jembatan antara browser dan Neon PostgreSQL
// File ini berjalan di server (Node.js), bukan di browser.
// DATABASE_URL aman tersimpan di environment variable Vercel, tidak terekspos.

import { neon } from "@neondatabase/serverless";

export default async function handler(req, res) {
  // ── Hanya terima metode POST ──────────────────────────────────────────────
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ── Ambil koneksi dari environment variable ───────────────────────────────
  const sql = neon(process.env.DATABASE_URL);

  try {
    const { nama, kelas, divisi, organisasi, latitude, longitude, jarak_meter } =
      req.body;

    // ── Validasi input server-side (lapisan keamanan kedua) ───────────────
    if (!nama || !kelas || !organisasi || !latitude || !longitude || !jarak_meter) {
      return res.status(400).json({ error: "Data tidak lengkap" });
    }

    if (!["OSIS", "MPK"].includes(organisasi)) {
      return res.status(400).json({ error: "Organisasi tidak valid" });
    }

    // ── VALIDASI JARAK SERVER-SIDE (lapisan keamanan paling penting) ──────
    // Validasi ini mencegah manipulasi dari sisi client (misal: edit JS di browser)
    const RADIUS_METER = 100;
    const SCHOOL_LAT   = -6.469821658683405;  // ← Ganti jika perlu
    const SCHOOL_LON   = 107.07387463910511;  // ← Ganti jika perlu

    const jarakServer = hitungJarak(
      parseFloat(latitude), parseFloat(longitude),
      SCHOOL_LAT, SCHOOL_LON
    );

    if (jarakServer > RADIUS_METER) {
      // Tolak di server — bahkan jika client mencoba manipulasi data jarak
      return res.status(403).json({
        error: "Ditolak: di luar area sekolah",
        jarak: Math.round(jarakServer),
      });
    }

    // ── Insert ke Neon PostgreSQL ─────────────────────────────────────────
    await sql`
      INSERT INTO absensi_rapat
        (nama, kelas, divisi, organisasi, latitude, longitude, jarak_meter, status_kehadiran)
      VALUES
        (
          ${nama.trim()},
          ${kelas},
          ${divisi?.trim() || null},
          ${organisasi},
          ${parseFloat(latitude)},
          ${parseFloat(longitude)},
          ${parseFloat(jarakServer.toFixed(2))},
          'HADIR'
        )
    `;

    return res.status(200).json({ success: true, jarak: Math.round(jarakServer) });

  } catch (err) {
    console.error("DB Error:", err);
    return res.status(500).json({ error: "Kesalahan server: " + err.message });
  }
}

// ── Haversine Formula (duplikat di server untuk validasi independen) ────────
function hitungJarak(lat1, lon1, lat2, lon2) {
  const R    = 6371000;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const dPhi    = ((lat2 - lat1) * Math.PI) / 180;
  const dLambda = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dPhi / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLambda / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}