import { createRouter, createWebHistory } from 'vue-router'
import Beranda from '../menu/Beranda.vue'
import Jurusan from '../menu/Jurusan.vue'
import Dasar from '../menu/Dasar.vue'
import Menengah from '../menu/Menengah.vue'
import Lanjut from '../menu/Lanjut.vue'
import Notifikasi from '../menu/Notifikasi.vue'
import Profil from '../menu/Profil.vue'
import Quiz from '../menu/Quiz.vue'
import RencanaBelajar from '../menu/RencanaBelajar.vue'

const routes = [
  { path: '/', component: Beranda },
  { path: '/jurusan', component: Jurusan },
  { path: '/dasar', component: Dasar },
  { path: '/menengah', component: Menengah },
  { path: '/lanjut', component: Lanjut },
  { path: '/notifikasi', component: Notifikasi },
  { path: '/profil', component: Profil },
  { path: '/quiz', component: Quiz },
  { path: '/rencanabelajar', component: RencanaBelajar }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
