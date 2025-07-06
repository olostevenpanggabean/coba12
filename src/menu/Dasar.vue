<template>
  <div class="rencana-container">
    <h1>Modul Pembelajaran Dasar</h1>
    <div class="info-header">
      <h2>Teknik Informatika - Semester 1 - 3 (Tingkat Dasar)</h2>
      <p class="subtitle">Berikut modul pembelajaran dasar:</p>
    </div>
    <div class="timeline">
      <div v-for="(step, index) in modulSteps" :key="step.id" class="timeline-step">
        <div class="step-header">
          <div class="step-number">Step {{ index + 1 }}</div>
          <div class="step-duration">{{ step.week }}</div>
        </div>
        <div class="step-content">
          <div v-for="module in step.modules" :key="module.id" class="module-card">
            <h3>{{ module.nama }}</h3>
            <p>{{ module.deskripsi }}</p>
            <div class="module-meta">
              <span><strong>Durasi:</strong> {{ module.durasi }}</span>
              <span><strong>Sumber:</strong> {{ module.sumber }}</span>
            </div>
            <div class="module-actions">
              <button @click="downloadModule(module)" class="download-btn">Download Modul</button>
              <a :href="module.video_link" target="_blank" class="video-link" v-if="module.video_link">
                Video Pembelajaran
              </a>
            </div>
            <div class="progress-container">
              <label>Progress Belajar:</label>
              <input type="range" v-model="module.progress" @change="updateProgress(step.id, module)" min="0" max="100">
              <span>{{ module.progress }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useMateriStore } from '@/stores/materiStore'

export default {
  name: 'DasarModul',
  computed: {
    store() {
      return useMateriStore()
    },
    modulSteps() {
      return this.store.modulData
    }
  },
  methods: {
    downloadModule(mod) {
      alert(`Download simulasi: ${mod.nama}`)
    },
    updateProgress(stepId, module) {
      this.store.updateProgress(stepId, module.id, module.progress)
    }
  },
  mounted() {
    this.store.fetchModul('dasar')
  }
}
</script>

<style scoped>
.rencana-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.info-header {
  text-align: center;
  margin-bottom: 40px;
}

.info-header h2 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.subtitle {
  color: #7f8c8d;
  font-size: 1.1em;
}

.timeline {
  position: relative;
  padding-left: 50px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 20px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e0e0e0;
}

.timeline-step {
  position: relative;
  margin-bottom: 30px;
}

.step-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.step-number {
  background: #3498db;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 15px;
  font-size: 1.1em;
}

.step-duration {
  font-weight: bold;
  color: #555;
  font-size: 1.1em;
}

.step-content {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
  margin-left: 30px;
}

.module-card {
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.module-card:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.module-card h3 {
  margin-top: 0;
  color: #2c3e50;
  font-size: 1.3em;
}

.module-card p {
  color: #34495e;
  line-height: 1.6;
}

.module-meta {
  display: flex;
  justify-content: space-between;
  margin: 15px 0;
  color: #555;
  font-size: 0.95em;
}

.module-actions {
  display: flex;
  gap: 10px;
  margin: 15px 0;
}

.download-btn, .video-link {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  font-size: 0.9em;
}

.download-btn {
  background: #2ecc71;
  color: white;
  border: none;
}

.download-btn:hover {
  background: #27ae60;
}

.video-link {
  background: #e74c3c;
  color: white;
}

.video-link:hover {
  background: #c0392b;
}

.progress-container {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-container label {
  font-weight: 600;
  color: #555;
}

.progress-container input[type="range"] {
  flex-grow: 1;
  height: 6px;
  border-radius: 3px;
  background: #ddd;
  outline: none;
}

.progress-container span {
  font-weight: bold;
  color: #3498db;
  min-width: 40px;
  text-align: right;
}

/* Ikon Font Awesome */
.fas {
  margin-right: 5px;
}
</style>
