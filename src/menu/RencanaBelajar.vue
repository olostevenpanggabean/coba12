<template>
  <div class="rencana-container">
    <!-- Profil -->
    <div class="profil-card" v-if="store.profil">
      <h2>Profil Pembelajaran</h2>
      <hr />
      <p><strong>Nama Jurusan:</strong> {{ store.profil.jurusan }}</p>
      <p><strong>Semester:</strong> {{ store.profil.semester }}</p>
      <p><strong>Fakultas:</strong> {{ store.profil.fakultas }}</p>
    </div>

    <!-- Pilih Jam -->
    <h3>Pilih Jam Belajar</h3>
    <p><small>*Pilih waktu belajar 2 jam</small></p>

    <div class="jam-belajar">
      <button 
        v-for="jam in jamOptions" 
        :key="jam" 
        class="jam-btn" 
        @click="selectJam(jam)" 
        :class="{ aktif: jamDipilih === jam }">
        {{ jam }}
      </button>
    </div>

    <!-- Simpan -->
    <div v-if="jamDipilih">
      <button class="simpan-btn" @click="simpan">
        Simpan Rencana
      </button>
    </div>

    <!-- Bubble Ringkasan -->
    <div v-if="store.rencana" class="ringkasan-bubble">
      <p><strong>Jam belajar tersimpan:</strong> {{ store.rencana.jam }}</p>
      <div class="aksi-btn">
        <button class="edit-btn" @click="editRencana">Edit Rencana</button>
        <button class="hapus-btn" @click="hapusRencana">Hapus Rencana</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useBelajarStore } from '@/stores/useBelajarStore'

export default {
  data() {
    return {
      jamOptions: ['08.00 - 10.00', '10.00 - 12.00', '13.00 - 15.00', '15.00 - 17.00', '19.00 - 21.00'],
      jamDipilih: null,
      store: useBelajarStore()
    }
  },
  created() {
    this.store.muatData()
  },
  methods: {
    selectJam(jam) {
      this.jamDipilih = jam
    },
    async simpan() {
      if (!this.store.rencana) {
        await this.store.simpanRencana(this.jamDipilih)
      } else {
        await this.store.editRencana(this.jamDipilih)
      }
      alert('Rencana berhasil disimpan!')
      this.jamDipilih = null
    },
    async editRencana() {
      this.jamDipilih = this.store.rencana.jam
    },
    async hapusRencana() {
      if (confirm('Yakin ingin menghapus rencana belajar?')) {
        await this.store.hapusRencana()
        this.jamDipilih = null
      }
    }
  }
}
</script>

<style scoped>
.rencana-container {
  max-width: 800px;
  margin: auto;
  padding: 30px;
}

.profil-card {
  background: #fff;
  padding: 20px;
  border-left: 5px solid #005f90;
  border-radius: 10px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.jam-belajar {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  margin: 20px 0;
}

.jam-btn {
  padding: 10px 20px;
  background: #eee;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.jam-btn.aktif {
  background-color: #005f90;
  color: white;
}

.simpan-btn {
  background-color: #28a745;
  padding: 10px 20px;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 15px;
}

.ringkasan-bubble {
  background-color: #f4f4f4;
  border-left: 5px solid #007bff;
  padding: 15px;
  border-radius: 10px;
  margin-top: 20px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.aksi-btn {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

.edit-btn {
  background-color: #17a2b8;
  padding: 8px 16px;
  border: none;
  color: white;
  border-radius: 6px;
  cursor: pointer;
}

.hapus-btn {
  background-color: #dc3545;
  padding: 8px 16px;
  border: none;
  color: white;
  border-radius: 6px;
  cursor: pointer;
}
</style>
