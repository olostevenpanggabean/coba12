import { defineStore } from 'pinia'

export const useMateriStore = defineStore('materi', {
  state: () => ({
    level: '', 
    modulData: []
  }),
  actions: {
    async fetchModul(level) {
      this.level = level
      try {
        const res = await fetch(`http://localhost:3000/modul_${level}`)
        if (!res.ok) throw new Error('Gagal ambil data')
        this.modulData = await res.json()
      } catch (err) {
        console.error(`Gagal ambil modul ${level}:`, err)
      }
    },
    async updateProgress(stepId, moduleId, newProgress) {
      const step = this.modulData.find(s => s.id === stepId)
      if (!step) return

      const updatedModules = step.modules.map(mod => {
        if (mod.id === moduleId) {
          return { ...mod, progress: newProgress }
        }
        return mod
      })

      try {
        await fetch(`http://localhost:3000/modul_${this.level}/${stepId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ modules: updatedModules })
        })
        step.modules = updatedModules
      } catch (err) {
        console.error("Gagal update progress:", err)
      }
    }
  }
})
