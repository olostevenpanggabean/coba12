import { defineStore } from 'pinia'

export const useBelajarStore = defineStore('belajar', {
  state: () => ({
    profil: null,
    rencana: null
  }),

  actions: {
    async simpanProfil(data) {
      try {
        const resGet = await fetch('http://localhost:3000/profil')
        const existing = await resGet.json()
        const lastId = existing.length > 0 ? existing[existing.length - 1].id : 0
        const newId = lastId + 1

        const dataBaru = { id: newId, ...data }

        const resPost = await fetch('http://localhost:3000/profil', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataBaru)
        })

        if (!resPost.ok) throw new Error('Gagal menyimpan profil.')

        this.profil = dataBaru
      } catch (error) {
        console.error('Error simpanProfil:', error)
      }
    },

    async muatData() {
      try {
        const resProfil = await fetch('http://localhost:3000/profil')
        const dataProfil = await resProfil.json()
        const lastProfil = dataProfil.length > 0 ? dataProfil[dataProfil.length - 1] : null
        this.profil = lastProfil

        if (lastProfil) {
          const resRencana = await fetch(`http://localhost:3000/rencana?profilId=${lastProfil.id}`)
          const dataRencana = await resRencana.json()
          this.rencana = dataRencana.length > 0 ? dataRencana[0] : null
        }
      } catch (error) {
        console.error('Gagal memuat data:', error)
      }
    },

    async simpanRencana(jam) {
      try {
        const profilId = this.profil?.id
        if (!profilId) throw new Error('Profil tidak tersedia.')

        // Cek rencana berdasarkan profilId
        const resCheck = await fetch(`http://localhost:3000/rencana?profilId=${profilId}`)
        const data = await resCheck.json()

        if (data.length > 0) {
          // Sudah ada → update
          const rencanaLama = data[0]
          const resPut = await fetch(`http://localhost:3000/rencana/${rencanaLama.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...rencanaLama, jam })
          })

          if (!resPut.ok) throw new Error('Gagal update rencana.')

          this.rencana = { ...rencanaLama, jam }
        } else {
          // Belum ada → tambah
          const resGet = await fetch('http://localhost:3000/rencana')
          const semua = await resGet.json()
          const newId = semua.length > 0 ? semua[semua.length - 1].id + 1 : 1

          const baru = { id: newId, jam, profilId }

          const resPost = await fetch('http://localhost:3000/rencana', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(baru)
          })

          if (!resPost.ok) throw new Error('Gagal menyimpan rencana.')

          this.rencana = baru
        }
      } catch (error) {
        console.error('Error simpanRencana:', error)
      }
    },

    async hapusRencana() {
      try {
        const id = this.rencana?.id
        if (!id) throw new Error('Tidak ada rencana yang bisa dihapus.')

        const res = await fetch(`http://localhost:3000/rencana/${id}`, {
          method: 'DELETE'
        })

        if (!res.ok) throw new Error('Gagal menghapus rencana.')

        this.rencana = null
      } catch (error) {
        console.error('Error hapusRencana:', error)
      }
    }
  }
})
