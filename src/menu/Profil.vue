<template>
  <div class="profile-container">
    <h1>Profil Pengguna</h1>

    <div v-if="userProfile" class="profile-card">
      <div class="profile-item">
        <strong>Nama Lengkap:</strong>
        <span>{{ namaPengguna }}</span>
      </div>
      <div class="profile-item">
        <strong>Nama Kampus:</strong>
        <span>{{ namaKampus }}</span>
      </div>

      <div class="profile-item">
        <strong>Fakultas:</strong>
        <span>{{ userProfile.fakultas }}</span>
      </div>
      <div class="profile-item">
        <strong>Jurusan:</strong>
        <span>{{ userProfile.jurusan }}</span>
      </div>
      <div class="profile-item">
        <strong>Semester:</strong>
        <span>{{ userProfile.semester }}</span>
      </div>
      
      <button @click="editProfile" class="edit-btn">
        Ubah Pilihan Jurusan/Semester
      </button>
      <button @click="clearProfile" class="clear-btn">
        Hapus Profil
      </button>
    </div>

    <div v-else class="no-profile-message">
      <p>Data profil belum tersedia. Silakan isi profil Anda.</p>
      <button @click="goToJurusanSelection" class="go-to-selection-btn">
        Isi Profil Sekarang
      </button>
    </div>
  </div>
</template>

<script>
import { useBelajarStore } from '@/stores/useBelajarStore'

export default {
  name: 'ProfilPage',
  data() {
    return {
      userProfile: null,
      namaPengguna: 'Olo Steven Panggabean', 
      namaKampus: 'Universitas Gerbang Marpoyan', 
    }
  },
  mounted() {
    this.loadUserProfile()
  },
  methods: {
    async loadUserProfile() {
      const store = useBelajarStore()
      await store.muatData()
      this.userProfile = store.profil
    },
    editProfile() {
      this.$router.push('/pilih-jurusan')
    },
    async clearProfile() {
      const store = useBelajarStore()
      // Karena nama dan kampus tidak di DB, kita hanya perlu fokus pada data dari DB
      // Hapus rencana yang terkait (jika ada)
      await store.hapusRencana(); 

      // Untuk membersihkan profil di state Pinia, kita bisa set langsung menjadi null
      // Jika Anda ingin juga menghapus entri profil dari database,
      // Anda perlu menambahkan `hapusProfil` action di store dan memanggilnya di sini.
      // Contoh: await store.hapusProfil(this.userProfile.id);

      // Setelah proses penghapusan data DB (jika dilakukan), kosongkan state lokal
      store.profil = null; // Menghapus profil dari state Pinia
      this.userProfile = null; // Mengosongkan data di komponen ProfilPage

      alert('Profil Anda telah dihapus!');
      this.$router.push('/pilih-jurusan');
    },
    goToJurusanSelection() {
      this.$router.push('/pilih-jurusan')
    }
  }
}
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f7f9fc;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #003049;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.2em;
}

.profile-card {
  background: white;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
}

.profile-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  font-size: 1.1em;
  color: #333;
}

.profile-item:last-child {
  border-bottom: none;
}

.profile-item strong {
  color: #005f90;
  flex-basis: 30%;
}

.profile-item span {
  flex-basis: 65%;
  text-align: right;
}

.edit-btn, .clear-btn, .go-to-selection-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s;
  margin-top: 15px;
}

.edit-btn {
  background-color: #005f90;
  color: white;
}

.edit-btn:hover {
  background-color: #003049;
  transform: translateY(-2px);
}

.clear-btn {
  background-color: #dc3545;
  color: white;
}

.clear-btn:hover {
  background-color: #c82333;
  transform: translateY(-2px);
}

.no-profile-message {
  text-align: center;
  padding: 30px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.no-profile-message p {
  font-size: 1.1em;
  color: #555;
  margin-bottom: 20px;
}

.go-to-selection-btn {
  background-color: #ffd60a;
  color: #003049;
  border: 1px solid #ffc107;
}

.go-to-selection-btn:hover {
  background-color: #ffc107;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .profile-container {
    padding: 15px;
  }
}
</style>