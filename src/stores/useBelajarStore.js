// src/stores/useBelajarStore.js
import { defineStore } from 'pinia'

export const useBelajarStore = defineStore('belajar', {
  state: () => ({
    profil: null, // Akan menyimpan data profil dari backend
    rencana: null // Akan menyimpan data rencana belajar dari backend
  }),

  actions: {
    /**
     * Menyimpan profil pengguna ke backend.
     * Jika profil sudah ada di backend (dilihat dari `id` terakhir),
     * ini akan membuat ID baru.
     * @param {Object} data Objek profil yang akan disimpan (misal: {fakultas, jurusan, semester})
     */
    async simpanProfil(data) {
      try {
        // Mendapatkan semua profil yang sudah ada untuk menentukan ID baru
        const resGet = await fetch('http://localhost:3000/profil')
        if (!resGet.ok) throw new Error('Gagal mengambil data profil yang sudah ada.')
        const existing = await resGet.json()
        
        // Menentukan ID baru: id terakhir + 1, atau 1 jika belum ada profil
        const lastId = existing.length > 0 ? existing[existing.length - 1].id : 0
        const newId = lastId + 1

        const dataBaru = { id: newId, ...data }

        // Mengirim data profil baru ke backend
        const resPost = await fetch('http://localhost:3000/profil', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataBaru)
        })

        if (!resPost.ok) throw new Error('Gagal menyimpan profil.')

        this.profil = dataBaru // Perbarui state Pinia dengan profil yang baru disimpan
        console.log('Profil berhasil disimpan:', dataBaru);
      } catch (error) {
        console.error('Error simpanProfil:', error.message);
        // Anda bisa menambahkan notifikasi pengguna di sini
      }
    },

    /**
     * Memuat data profil dan rencana belajar terakhir dari backend.
     */
    async muatData() {
      try {
        // Muat profil terakhir
        const resProfil = await fetch('http://localhost:3000/profil')
        if (!resProfil.ok) throw new Error('Gagal memuat profil.')
        const dataProfil = await resProfil.json()
        const lastProfil = dataProfil.length > 0 ? dataProfil[dataProfil.length - 1] : null
        this.profil = lastProfil // Atur profil di state

        // Jika ada profil, muat rencana belajarnya
        if (lastProfil) {
          const resRencana = await fetch(`http://localhost:3000/rencana?profilId=${lastProfil.id}`)
          if (!resRencana.ok) throw new Error('Gagal memuat rencana.')
          const dataRencana = await resRencana.json()
          this.rencana = dataRencana.length > 0 ? dataRencana[0] : null // Asumsikan satu rencana per profil
          console.log('Data profil dan rencana berhasil dimuat.');
        } else {
            this.rencana = null;
            console.log('Tidak ada profil yang ditemukan.');
        }
      } catch (error) {
        console.error('Gagal memuat data:', error.message);
        // Anda bisa menambahkan notifikasi pengguna di sini
      }
    },

    /**
     * Menyimpan atau memperbarui rencana belajar (misal: jam belajar) untuk profil saat ini.
     * @param {Object} jam Data jam belajar yang akan disimpan
     */
    async simpanRencana(jam) {
      try {
        const profilId = this.profil?.id
        if (!profilId) throw new Error('Profil tidak tersedia. Tidak dapat menyimpan rencana.')

        // Cek apakah rencana untuk profil ini sudah ada di backend
        const resCheck = await fetch(`http://localhost:3000/rencana?profilId=${profilId}`)
        if (!resCheck.ok) throw new Error('Gagal memeriksa rencana yang sudah ada.')
        const data = await resCheck.json()

        if (data.length > 0) {
          // Jika rencana sudah ada, lakukan UPDATE (PUT request)
          const rencanaLama = data[0]
          const resPut = await fetch(`http://localhost:3000/rencana/${rencanaLama.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...rencanaLama, jam }) // Gabungkan data lama dengan jam baru
          })

          if (!resPut.ok) throw new Error('Gagal update rencana.')

          this.rencana = { ...rencanaLama, jam } // Perbarui state Pinia
          console.log('Rencana berhasil diupdate:', this.rencana);
        } else {
          // Jika rencana belum ada, lakukan PENAMBAHAN (POST request)
          // Dapatkan semua rencana untuk menentukan ID baru
          const resGet = await fetch('http://localhost:3000/rencana')
          if (!resGet.ok) throw new Error('Gagal mengambil rencana yang ada untuk ID baru.')
          const semua = await resGet.json()
          const newId = semua.length > 0 ? semua[semua.length - 1].id + 1 : 1

          const baru = { id: newId, jam, profilId } // Rencana baru dengan ID dan profilId

          const resPost = await fetch('http://localhost:3000/rencana', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(baru)
          })

          if (!resPost.ok) throw new Error('Gagal menyimpan rencana.')

          this.rencana = baru // Perbarui state Pinia
          console.log('Rencana baru berhasil disimpan:', this.rencana);
        }
      } catch (error) {
        console.error('Error simpanRencana:', error.message);
        // Anda bisa menambahkan notifikasi pengguna di sini
      }
    },

    /**
     * Menghapus rencana belajar dari backend.
     */
    async hapusRencana() {
      try {
        const id = this.rencana?.id
        if (!id) throw new Error('Tidak ada rencana yang bisa dihapus.')

        const res = await fetch(`http://localhost:3000/rencana/${id}`, {
          method: 'DELETE'
        })

        if (!res.ok) throw new Error('Gagal menghapus rencana.')

        this.rencana = null // Kosongkan state Pinia
        console.log('Rencana berhasil dihapus.');
      } catch (error) {
        console.error('Error hapusRencana:', error.message);
        // Anda bisa menambahkan notifikasi pengguna di sini
      }
    },

    /**
     * Fungsi pembantu untuk mendapatkan profil saat ini (state Pinia).
     * @returns {Object|null} Objek profil atau null.
     */
    getCurrentProfil() {
      return this.profil;
    }
  }
})