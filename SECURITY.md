# Kebijakan Keamanan (Security Policy)

Dokumen ini menjelaskan kebijakan keamanan untuk sistem **Absensi Rapat Digital OSIS & MPK SMAN 2 Jonggol** dan prosedur pelaporan jika ditemukan celah keamanan pada aplikasi.

## Versi yang Didukung

Sistem ini dikelola dan diperbarui secara internal. Versi yang didukung untuk pembaruan keamanan saat ini adalah:

| Versi | Didukung |
|-------|----------|
| 1.0.x | ✅ Ya      |
| < 1.0 | ❌ Tidak   |

## Pelaporan Kerentanan Keamanan

Mengingat aplikasi ini memproses data penting seperti **koordinat lokasi (geolocation)** dan **identitas pengurus**, keamanan data dan integritas sistem adalah prioritas utama kami. 

Jika Anda menemukan *bug*, celah keamanan, atau cara untuk memanipulasi sistem absensi, harap ikuti langkah-langkah berikut:

1. **Jangan publikasikan celah secara terbuka**: Hindari membuat *Issue* GitHub yang bersifat publik atau membagikan celah tersebut kepada anggota lain untuk menghindari penyalahgunaan.
2. **Kirim Laporan Privat**: Segera laporkan temuan Anda secara langsung kepada tim pengembang (Divisi TIK) melalui email ke: `[masukkan-email-anda/osis@email.com]`.
3. **Detail Laporan**: Sertakan penjelasan rinci tentang kerentanan tersebut dan langkah-langkah untuk mereproduksi masalahnya (misalnya: cara mem-*bypass* radius lokasi).

### Tindakan Kami:
- Tim akan mengonfirmasi penerimaan laporan Anda secepatnya.
- Kami akan segera menganalisis dan menambal celah keamanan tersebut sebelum jadwal rapat organisasi berikutnya.

## Hal-hal yang Dilarang Keras (Security Rules)

Sebagai pengguna dan pengurus, Anda **dilarang keras** untuk:
* Melakukan manipulasi koordinat GPS (*location spoofing/fake GPS*) untuk mengakali validasi jarak absensi.
* Melakukan *spam* pengiriman form absensi (mengirim data palsu atau duplikat ke dalam *database*).
* Mencoba mengakses *database* kehadiran tanpa izin (otorisasi) yang sah.

---
Terima kasih telah berpartisipasi dalam menjaga integritas dan keamanan sistem digital Nawasena.
