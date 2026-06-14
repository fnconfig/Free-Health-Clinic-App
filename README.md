# Klinik Kesehatan GPIB Bukit Zaitun Makassar

Portal kesehatan digital Klinik Kesehatan GPIB Bukit Zaitun Makassar. Melayani Dengan Kasih, Menyembuhkan Dengan Harapan. Menghadirkan asisten triase AI interaktif dan rekam medis digital.

## Fitur Utama
- **Portal Pasien:** Akses rekam medis, antrean dokter, dan asisten triase awal.
- **Konsol Dokter:** Manajemen pasien, histori medis, dan integrasi diagnosis AI.
- **Sistem Admin (Diakonia):** Pengawasan akses dan pendaftaran relawan.
- **Autentikasi Aman:** Menggunakan integrasi Firebase dan Google Sign-in.

## Instalasi

### Prasyarat
- Node.js (versi 18+)
- Firebase Project dengan Autentikasi (Google Sign-In) yang telah diaktifkan.

### Langkah-langkah
1. Clone repositori ini:
   ```bash
   git clone <url-repositori-anda>
   cd klinik-kesehatan-gpib-bukit-zaitun
   ```

2. Instal dependensi:
   ```bash
   npm install
   ```

3. Ganti konfigurasi Firebase jika membawa project lokal Anda:
   - Akses file `firebase-applet-config.json` pada root directory dan isi dengan kredensial Firebase Anda.
   *(Jika Anda mendeploy dari AI Studio, file ini sudah tergenerate dengan project bersangkutan)*

4. Jalankan server pengembangan:
   ```bash
   npm run dev
   ```

5. Akses website pada browser: `http://localhost:3000`

## Build & Produksi

Untuk melakukan build ke production:
```bash
npm run build
npm start
```

## Lingkungan Pengembangan
Project ini dikonfigurasi secara lengkap menggunakan:
- **React.js 19**
- **Vite**
- **Tailwind CSS v4**
- **Firebase Auth** / Google Authentication
- **TypeScript**

## Lisensi
Hak cipta dilindungi oleh pengembang aplikasi dan gereja.
