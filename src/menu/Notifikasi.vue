<template>
  <div class="notifikasi-container">
    <!-- Header -->
    <div class="header-section">
      <h2> Notifikasi</h2>
      <p class="subtitle">Pengingat jadwal belajar Anda</p>
    </div>

    <!-- Profil Summary -->
    <div class="profil-card" v-if="store.profil">
      <div class="profil-header">
        <h3> Profil Pembelajaran</h3>
      </div>
      <div class="profil-content">
        <div class="profil-item">
          <span class="label">Nama Jurusan:</span>
          <span class="value">{{ store.profil.jurusan }}</span>
        </div>
        <div class="profil-item">
          <span class="label">Semester:</span>
          <span class="value">{{ store.profil.semester }}</span>
        </div>
        <div class="profil-item">
          <span class="label">Fakultas:</span>
          <span class="value">{{ store.profil.fakultas }}</span>
        </div>
      </div>
    </div>

    <!-- Jadwal Aktif -->
    <div v-if="store.rencana && store.rencana.jam" class="jadwal-aktif-card">
      <div class="jadwal-header">
        <div class="jadwal-icon"></div>
        <div class="jadwal-title">
          <h3>Jadwal Belajar Aktif</h3>
          <p>Jam belajar yang telah dipilih</p>
        </div>
        <div class="jadwal-status">
          <span class="status-badge active">Aktif</span>
        </div>
      </div>
      
      <div class="jadwal-content">
        <div class="waktu-display">
          <div class="waktu-box">
            <div class="waktu-label">Waktu Belajar</div>
            <div class="waktu-value">{{ store.rencana.jam }}</div>
          </div>
        </div>
        
        <div class="jadwal-details">
          <div class="detail-row">
            <span class="detail-label"> Frekuensi:</span>
            <span class="detail-value">Setiap hari</span>
          </div>
          <div class="detail-row">
            <span class="detail-label"> Durasi:</span>
            <span class="detail-value">2 jam</span>
          </div>
          <div class="detail-row">
            <span class="detail-label"> Notifikasi:</span>
            <span class="detail-value">
              {{ store.rencana.notifikasi ? 
                (store.rencana.notifikasi.aktif ? 
                  `${store.rencana.notifikasi.waktu} menit sebelum` : 
                  'Nonaktif') : 
                'Belum diatur' }}
            </span>
          </div>
          <div class="detail-row">
            <span class="detail-label"> Status:</span>
            <span class="detail-value status-aktif">Berjalan</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Notifikasi Hari Ini -->
    <div class="notifikasi-hari-ini">
      <h3> Notifikasi Hari Ini</h3>
      
      <div v-if="!store.rencana || !store.rencana.jam" class="empty-jadwal">
        <div class="empty-icon"></div>
        <p>Belum ada jadwal belajar yang dipilih</p>
        <router-link to="/rencana-belajar" class="btn-pilih-jadwal">
          Pilih Jadwal Belajar
        </router-link>
      </div>

      <div v-else class="notifikasi-list">
        <div 
          v-for="notifikasi in notifikasiHariIni" 
          :key="notifikasi.id"
          class="notifikasi-item"
          :class="{ 'completed': notifikasi.completed, 'upcoming': notifikasi.upcoming }">
          
          <div class="notifikasi-icon">
            <span v-if="notifikasi.completed"></span>
            <span v-else-if="notifikasi.upcoming"></span>
            <span v-else></span>
          </div>
          
          <div class="notifikasi-content">
            <div class="notifikasi-title">{{ notifikasi.judul }}</div>
            <div class="notifikasi-subtitle">{{ notifikasi.deskripsi }}</div>
            <div class="notifikasi-waktu">{{ notifikasi.waktu }}</div>
          </div>
          
          <div class="notifikasi-action">
            <button 
              v-if="notifikasi.upcoming" 
              @click="testNotifikasi(notifikasi)"
              class="btn-test-small">
              Test
            </button>
            <span v-else-if="notifikasi.completed" class="status-done">Selesai</span>
            <span v-else class="status-pending">Menunggu</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Pengaturan Notifikasi -->
    <div v-if="store.rencana && store.rencana.jam" class="pengaturan-notifikasi">
      <h3> Pengaturan Notifikasi</h3>
      
      <div class="pengaturan-content">
        <div class="pengaturan-item">
          <label class="switch">
            <input 
              type="checkbox" 
              v-model="notifikasiAktif"
              @change="toggleNotifikasi">
            <span class="slider"></span>
          </label>
          <div class="pengaturan-info">
            <div class="pengaturan-label">Aktifkan Notifikasi</div>
            <div class="pengaturan-desc">Terima pengingat sebelum waktu belajar</div>
          </div>
        </div>
        
        <div v-if="notifikasiAktif" class="pengaturan-item">
          <div class="waktu-reminder">
            <label>Ingatkan saya:</label>
            <select v-model="waktuNotifikasi" @change="updateWaktuNotifikasi">
              <option value="5">5 menit sebelum</option>
              <option value="10">10 menit sebelum</option>
              <option value="15">15 menit sebelum</option>
              <option value="30">30 menit sebelum</option>
              <option value="60">1 jam sebelum</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistik -->
    <div class="statistik-card">
      <h3> Statistik Notifikasi</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-number">{{ statistik.hariIni }}</div>
          <div class="stat-label">Hari Ini</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ statistik.mingguIni }}</div>
          <div class="stat-label">Minggu Ini</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ statistik.bulanIni }}</div>
          <div class="stat-label">Bulan Ini</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ statistik.streak }}</div>
          <div class="stat-label">Streak Hari</div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="showToast" class="toast-notification" :class="{ 'show': showToast }">
      <div class="toast-content">
        <div class="toast-icon"></div>
        <div class="toast-text">
          <strong>{{ toastMessage.title }}</strong>
          <p>{{ toastMessage.body }}</p>
        </div>
        <button class="toast-close" @click="closeToast">×</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useBelajarStore } from '@/stores/useBelajarStore'

export default {
  name: 'NotifikasiJadwal',
  data() {
    return {
      store: useBelajarStore(),
      notifikasiAktif: true,
      waktuNotifikasi: 10,
      showToast: false,
      toastMessage: {
        title: '',
        body: ''
      },
      statistik: {
        hariIni: 2,
        mingguIni: 14,
        bulanIni: 60,
        streak: 7
      }
    }
  },
  computed: {
    notifikasiHariIni() {
      if (!this.store.rencana || !this.store.rencana.jam) return []
      
      const jamBelajar = this.store.rencana.jam
      const sekarang = new Date()
      const [jamMulai, jamSelesai] = jamBelajar.split(' - ')
      
      // Parse jam mulai
      const [jamM, menitM] = jamMulai.split('.').map(Number)
      const waktuMulai = new Date()
      waktuMulai.setHours(jamM, menitM, 0, 0)
      
      // Parse jam selesai
      const [jamS, menitS] = jamSelesai.split('.').map(Number)
      const waktuSelesai = new Date()
      waktuSelesai.setHours(jamS, menitS, 0, 0)
      
      // Waktu notifikasi
      const waktuNotif = new Date(waktuMulai)
      waktuNotif.setMinutes(waktuNotif.getMinutes() - (this.waktuNotifikasi || 10))
      
      const notifications = []
      
      // Notifikasi pengingat
      if (this.notifikasiAktif) {
        notifications.push({
          id: 1,
          judul: 'Pengingat Belajar',
          deskripsi: `Bersiap untuk belajar ${this.store.profil?.jurusan || 'mata kuliah'}`,
          waktu: waktuNotif.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          completed: waktuNotif < sekarang,
          upcoming: waktuNotif > sekarang && waktuNotif.getTime() - sekarang.getTime() < 60 * 60 * 1000
        })
      }
      
      // Notifikasi mulai belajar
      notifications.push({
        id: 2,
        judul: 'Waktu Belajar Dimulai',
        deskripsi: `Saatnya mulai belajar ${this.store.profil?.jurusan || 'mata kuliah'}`,
        waktu: waktuMulai.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        completed: waktuMulai < sekarang,
        upcoming: waktuMulai > sekarang && waktuMulai.getTime() - sekarang.getTime() < 10 * 60 * 1000
      })
      
      // Notifikasi selesai belajar
      notifications.push({
        id: 3,
        judul: 'Waktu Belajar Selesai',
        deskripsi: 'Sesi belajar telah berakhir, istirahat sejenak',
        waktu: waktuSelesai.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        completed: waktuSelesai < sekarang,
        upcoming: false
      })
      
      return notifications
    }
  },
  created() {
    this.store.muatData()
    this.loadNotifikasiSettings()
  },
  methods: {
    loadNotifikasiSettings() {
      if (this.store.rencana && this.store.rencana.notifikasi) {
        this.notifikasiAktif = this.store.rencana.notifikasi.aktif
        this.waktuNotifikasi = this.store.rencana.notifikasi.waktu
      }
    },
    async toggleNotifikasi() {
      if (!this.store.rencana) return
      
      const updatedRencana = {
        ...this.store.rencana,
        notifikasi: {
          aktif: this.notifikasiAktif,
          waktu: this.waktuNotifikasi
        }
      }
      
      await this.store.editRencana(updatedRencana)
      
      this.showToastMessage(
        this.notifikasiAktif ? 'Notifikasi Diaktifkan' : 'Notifikasi Dinonaktifkan',
        this.notifikasiAktif ? 
          `Pengingat akan muncul ${this.waktuNotifikasi} menit sebelum jadwal` : 
          'Pengingat tidak akan muncul'
      )
    },
    async updateWaktuNotifikasi() {
      if (!this.store.rencana) return
      
      const updatedRencana = {
        ...this.store.rencana,
        notifikasi: {
          aktif: this.notifikasiAktif,
          waktu: this.waktuNotifikasi
        }
      }
      
      await this.store.editRencana(updatedRencana)
      
      this.showToastMessage(
        'Pengaturan Diperbarui',
        `Pengingat akan muncul ${this.waktuNotifikasi} menit sebelum jadwal`
      )
    },
    testNotifikasi(notifikasi) {
      this.showToastMessage(
        'Test Notifikasi',
        notifikasi.deskripsi
      )
      
      // Browser notification
      if (Notification.permission === "granted") {
        new Notification(notifikasi.judul, {
          body: notifikasi.deskripsi,
          icon: "/favicon.ico"
        })
      }
    },
    showToastMessage(title, body) {
      this.toastMessage = { title, body }
      this.showToast = true
      setTimeout(() => {
        this.showToast = false
      }, 3000)
    },
    closeToast() {
      this.showToast = false
    }
  },
  watch: {
    'store.rencana': {
      handler() {
        this.loadNotifikasiSettings()
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.notifikasi-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background: #f8f9fa;
  min-height: 100vh;
}

.header-section {
  text-align: center;
  margin-bottom: 30px;
}

.header-section h2 {
  color: #2c3e50;
  font-size: 28px;
  margin-bottom: 8px;
}

.subtitle {
  color: #6c757d;
  font-size: 16px;
  margin: 0;
}

.profil-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-left: 4px solid #007bff;
}

.profil-header h3 {
  color: #2c3e50;
  margin: 0 0 15px 0;
  font-size: 18px;
}

.profil-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.profil-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.profil-item .label {
  color: #6c757d;
  font-size: 14px;
  font-weight: 500;
}

.profil-item .value {
  color: #2c3e50;
  font-weight: 600;
}

.jadwal-aktif-card {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border: 2px solid #2196f3;
}

.jadwal-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.jadwal-icon {
  font-size: 32px;
  margin-right: 15px;
}

.jadwal-title {
  flex: 1;
}

.jadwal-title h3 {
  margin: 0 0 5px 0;
  color: #1976d2;
  font-size: 20px;
}

.jadwal-title p {
  margin: 0;
  color: #424242;
  font-size: 14px;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.active {
  background: #4caf50;
  color: white;
}

.waktu-display {
  text-align: center;
  margin-bottom: 20px;
}

.waktu-box {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: inline-block;
  min-width: 200px;
}

.waktu-label {
  color: #6c757d;
  font-size: 14px;
  margin-bottom: 5px;
}

.waktu-value {
  color: #1976d2;
  font-size: 24px;
  font-weight: bold;
}

.jadwal-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255,255,255,0.7);
  padding: 12px;
  border-radius: 8px;
}

.detail-label {
  color: #424242;
  font-weight: 500;
}

.detail-value {
  color: #1976d2;
  font-weight: 600;
}

.status-aktif {
  color: #4caf50 !important;
}

.notifikasi-hari-ini {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.notifikasi-hari-ini h3 {
  color: #2c3e50;
  margin: 0 0 20px 0;
  font-size: 18px;
}

.empty-jadwal {
  text-align: center;
  padding: 40px;
  color: #6c757d;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.btn-pilih-jadwal {
  display: inline-block;
  background: #007bff;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  margin-top: 15px;
  transition: background 0.3s;
}

.btn-pilih-jadwal:hover {
  background: #0056b3;
}

.notifikasi-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notifikasi-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid #dee2e6;
  transition: all 0.3s;
}

.notifikasi-item.completed {
  border-left-color: #28a745;
  background: #d4f6d4;
}

.notifikasi-item.upcoming {
  border-left-color: #ffc107;
  background: #fff3cd;
}

.notifikasi-icon {
  font-size: 24px;
  margin-right: 15px;
}

.notifikasi-content {
  flex: 1;
}

.notifikasi-title {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 3px;
}

.notifikasi-subtitle {
  color: #6c757d;
  font-size: 14px;
  margin-bottom: 5px;
}

.notifikasi-waktu {
  color: #007bff;
  font-size: 12px;
  font-weight: 500;
}

.notifikasi-action {
  margin-left: 15px;
}

.btn-test-small {
  background: #ffc107;
  color: #212529;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
}

.status-done {
  color: #28a745;
  font-size: 12px;
  font-weight: 500;
}

.status-pending {
  color: #6c757d;
  font-size: 12px;
  font-weight: 500;
}

.pengaturan-notifikasi {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.pengaturan-notifikasi h3 {
  color: #2c3e50;
  margin: 0 0 20px 0;
  font-size: 18px;
}

.pengaturan-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.pengaturan-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 28px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:checked + .slider:before {
  transform: translateX(22px);
}

.pengaturan-info {
  flex: 1;
}

.pengaturan-label {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 3px;
}

.pengaturan-desc {
  color: #6c757d;
  font-size: 14px;
}

.waktu-reminder {
  display: flex;
  align-items: center;
  gap: 10px;
}

.waktu-reminder select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
}

.statistik-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.statistik-card h3 {
  color: #2c3e50;
  margin: 0 0 20px 0;
  font-size: 18px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 20px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  border-top: 3px solid #007bff;
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 5px;
}

.stat-label {
  color: #6c757d;
  font-size: 14px;
  font-weight: 500;
}

.toast-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  opacity: 0;
  transform: translateX(100%);
  transition: all 0.3s ease;
}

.toast-notification.show {
  opacity: 1;
  transform: translateX(0);
}

.toast-content {
  background: white;
  border-left: 4px solid #007bff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 300px;
}

.toast-icon {
  font-size: 24px;
}

.toast-text {
  flex: 1;
}

.toast-text strong {
  color: #007bff;
  display: block;
  margin-bottom: 5px;
}

.toast-text p {
  margin: 0;
  color: #6c757d;
  font-size: 14px;
}

.toast-close {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-close:hover {
  color: #333;
}

@media (max-width: 768px) {
  .notifikasi-container {
    padding: 15px;
  }
  
  .profil-content {
    grid-template-columns: 1fr;
  }
  
  .jadwal-details {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .pengaturan-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .toast-notification {
    right: 15px;
    left: 15px;
  }
  
  .toast-content {
    max-width: none;
  }
}
</style>