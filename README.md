

LAPORAN PROYEK APLIKASI BELAJAR PINTAR

NAMA : OLO STEVEN PANGGABEAN
NPM  : 233510828
KELAS: 4E

DOSEN PENGAMPU: M RIZKI FADHILAH, S.T., M.Eng
ASDOS 1       :Ikhsan Ramadhan
ASDOS 2       :Cici Wela Sari


1.Judul Aplikasi

Belajar Pintar – Platform Pembelajaran Modular Berbasis Web

---

2.Latar Belakang

Aplikasi *Belajar Pintar* dikembangkan sebagai solusi pembelajaran digital yang dapat disesuaikan dengan jurusan, fakultas, dan semester mahasiswa. Dengan pendekatan modular, aplikasi ini memungkinkan pengguna menyusun rencana belajar, mengakses materi berdasarkan tingkatannya (Dasar, Menengah, Lanjut), serta melakukan evaluasi mandiri melalui kuis.

---

3.Tujuan

* Menyediakan akses pembelajaran berbasis jurusan dan tingkat
* Mempermudah pengguna menyusun jadwal belajar personal
* Memberikan materi dan evaluasi secara terstruktur
* Menerapkan arsitektur SPA (Single Page Application) berbasis Vue

---

4.Fitur Utama

1.Pilih Jurusan

* Memilih jurusan, fakultas, dan semester
* Disimpan ke store Pinia dan `db.json` sebagai profil aktif

2.Rencana Belajar

* Menyusun jadwal belajar (2 jam per sesi)
* Menyimpan, mengedit, dan menghapus rencana belajar
* Data terhubung ke API lokal `/rencana`

3.Materi & Modul

* Tersedia 3 tingkat: Dasar, Menengah, Lanjut
* Setiap modul memuat:

  * Judul, durasi, deskripsi
  * Link download modul dan video
  * Progress bar pembelajaran (bisa diupdate)

4.Quiz & Evaluasi

* Mengakses kuis berdasarkan tingkat & jurusan
* Bertujuan mengukur pemahaman per level

5.notifikasi & Profil

* Menampilkan notifikasi dan informasi profil pengguna aktif

---

5.Struktur Menu Navigasi

```plaintext
Menu Utama:
- Beranda
- Pilih Jurusan
- Rencana Belajar

Materi & Modul:
- Dasar
- Menengah
- Lanjut

Evaluasi & Lainnya:
- Quiz
- Notifikasi
- Profil
```

---
6.Routing (Vue Router)

* Menggunakan mode history
* Path konsisten (misal: `/modul/dasar`, `/rencana-belajar`)
* Setiap route terhubung dengan komponen dinamis

---

7.Manajemen Data

* Backend: JSON Server
* Endpoint utama: `/profil`, `/rencana`, `/modul_dasar`, dll.
* Data diakses menggunakan `fetch()` (bukan axios)

---

8.Manajemen State (Pinia)

Store Utama:

* `useBelajarStore.js`: Menyimpan data profil & rencana belajar
* `useMateriStore.js`: Menyimpan data modul tiap level

Setiap store memiliki:

* `state`: Data utama
* `actions`: Fungsi untuk ambil, simpan, dan update data
* Digunakan lintas halaman secara reaktif

---

9.Unit Testing (Vitest)

* Framework: `vitest`, `@pinia/testing`
* Fokus pengujian:

  * Fungsi `simpanProfil()` menyimpan data ke state
  * Fungsi `simpanRencana()` menambah jadwal belajar
* `fetch()` dimock menggunakan `vi.fn()`

---

10.Kesimpulan

Aplikasi *Belajar Pintar* berhasil dikembangkan dengan fitur modular, integrasi API lokal, serta pengelolaan state global yang efisien. Proyek ini mencerminkan implementasi nyata dari SPA berbasis Vue lengkap dengan pengujian dan penyimpanan data dinamis.

---

