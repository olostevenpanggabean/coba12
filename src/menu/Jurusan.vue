<template>
  <div class="jurusan-container">
    <h1>Pilih Jurusan & Semester</h1>
    
    <div class="selection-card">
      <div class="form-group">
        <label for="fakultas">Fakultas:</label>
        <select id="fakultas" v-model="selectedFakultas" @change="resetJurusan">
          <option value="">-- Pilih Fakultas --</option>
          <option v-for="fakultas in fakultasList" :key="fakultas.id" :value="fakultas">
            {{ fakultas.nama }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="jurusan">Jurusan:</label>
        <select id="jurusan" v-model="selectedJurusan" :disabled="!selectedFakultas">
          <option value="">-- Pilih Jurusan --</option>
          <option v-for="jurusan in jurusanList" :key="jurusan.id" :value="jurusan">
            {{ jurusan.nama }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="semester">Semester:</label>
        <select id="semester" v-model="selectedSemester" :disabled="!selectedJurusan">
          <option value="">-- Pilih Semester --</option>
          <option v-for="n in 8" :key="n" :value="n">Semester {{ n }}</option>
        </select>
      </div>

      <button 
        class="submit-btn" 
        :disabled="!isFormComplete"
        @click="submitSelection"
      >
        Simpan Pilihan
      </button>
    </div>

    <div v-if="selectedJurusan" class="jurusan-info">
      <h2>Informasi Jurusan</h2>
      <div class="info-card">
        <h3>{{ selectedJurusan.nama }}</h3>
        <p><strong>Akreditasi:</strong> {{ selectedJurusan.akreditasi }}</p>
        <p><strong>Deskripsi:</strong> {{ selectedJurusan.deskripsi }}</p>
        <p><strong>Mata Kuliah Unggulan:</strong> {{ selectedJurusan.mataKuliah }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useBelajarStore } from '@/stores/useBelajarStore'


export default {
  name: 'JurusanPage',
  data() {
    return {
      selectedFakultas: null,
      selectedJurusan: null,
      selectedSemester: null,
      fakultasList: [
        {
          id: 1,
          nama: 'Teknik',
          jurusan: [
            { id: 101, nama: 'Teknik Informatika', akreditasi: 'A', deskripsi: 'Mempelajari pengembangan perangkat lunak dan sistem komputer', mataKuliah: 'Algoritma, Struktur Data, Kecerdasan Buatan' },
            { id: 102, nama: 'Teknik Elektro', akreditasi: 'A', deskripsi: 'Mempelajari sistem elektrik dan elektronika', mataKuliah: 'Rangkaian Listrik, Sistem Digital, Elektronika Daya' }
          ]
        },
        {
          id: 2,
          nama: 'Ekonomi',
          jurusan: [
            { id: 201, nama: 'Manajemen', akreditasi: 'A', deskripsi: 'Mempelajari pengelolaan bisnis dan organisasi', mataKuliah: 'Manajemen Keuangan, Pemasaran, SDM' },
            { id: 202, nama: 'Akuntansi', akreditasi: 'A', deskripsi: 'Mempelajari pencatatan dan analisis keuangan', mataKuliah: 'Akuntansi Keuangan, Auditing, Perpajakan' }
          ]
        }
      ]
    }
  },
  computed: {
    jurusanList() {
      return this.selectedFakultas ? this.selectedFakultas.jurusan : []
    },
    isFormComplete() {
      return this.selectedFakultas && this.selectedJurusan && this.selectedSemester
    }
  },
  methods: {
    resetJurusan() {
      this.selectedJurusan = null
      this.selectedSemester = null
    },
    submitSelection() {
  const store = useBelajarStore()
  const newProfil = {
    fakultas: this.selectedFakultas.nama,
    jurusan: this.selectedJurusan.nama,
    semester: this.selectedSemester
  }
  store.simpanProfil(newProfil) // ✅ ID akan ditentukan otomatis di store
  alert('Profil disimpan!')
  this.$router.push('/rencana-belajar')
}

  }
}
</script>



<style scoped>
.jurusan-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #003049;
  text-align: center;
  margin-bottom: 30px;
}

.selection-card {
  background: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #003049;
}

select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  background-color: #f7f9fc;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background-color: #003049;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 15px;
}

.submit-btn:hover {
  background-color: #005f90;
}

.submit-btn:disabled {
  background-color: #9db4c0;
  cursor: not-allowed;
}

.jurusan-info {
  background: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.info-card {
  margin-top: 15px;
  padding: 15px;
  border-left: 4px solid #ffd60a;
  background-color: #f7f9fc;
}

h3 {
  color: #005f90;
  margin-top: 0;
}

@media (max-width: 768px) {
  .jurusan-container {
    padding: 15px;
  }
  
  .selection-card, .jurusan-info {
    padding: 15px;
  }
}
</style>