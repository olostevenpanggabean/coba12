<template>
  <aside class="sidebar">
    <div class="logo">Belajar Pintar</div>
    
    <div class="section">
      <p class="section-title">Menu Utama</p>
      <router-link to="/" class="link" exact-active-class="active">Beranda</router-link>
      <router-link to="/jurusan" class="link" exact-active-class="active">Pilih Jurusan</router-link>
      <router-link to="/RencanaBelajar" class="link" exact-active-class="active">Rencana Belajar</router-link>
    </div>

    <div class="section">
      <p class="section-title">Materi & Modul</p>
      <router-link to="/dasar" class="link" exact-active-class="active">Dasar</router-link>
      <router-link to="/menengah" class="link" exact-active-class="active">Menengah</router-link>
      <router-link to="/lanjut" class="link" exact-active-class="active">Lanjut</router-link>
    </div>

    <div class="section">
      <p class="section-title">Evaluasi & Lainnya</p>
      <router-link to="/quiz" class="link" exact-active-class="active">Quiz</router-link>
      <router-link to="/notifikasi" class="link" exact-active-class="active">Notifikasi</router-link>
      <router-link to="/profil" class="link" exact-active-class="active">Profil</router-link>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar',
  data() {
    return {
      defaultJurusan: 'informatika'
    }
  }
}
</script>

<style lang="scss" scoped>
$primary-color: #003049;
$primary-hover: rgba(0, 75, 115, 0.7);
$primary-active: #005f90;
$text-color: #fff;
$subtext-color: #9db4c0;
$highlight-color: #ffd60a;
$border-radius: 8px;

.sidebar {
  width: 260px;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  background-color: $primary-color;
  color: $text-color;
  padding: 30px 25px;
  overflow-y: auto;
  box-shadow: 3px 0 10px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  z-index: 100;

  .logo {
    font-size: 24px;
    font-weight: 900;
    margin-bottom: 40px;
    color: $highlight-color;
    letter-spacing: 1.2px;
    user-select: none;
    padding: 0 15px 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .section {
    margin-bottom: 30px;

    .section-title {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      color: $subtext-color;
      margin-bottom: 12px;
      letter-spacing: 0.1em;
      user-select: none;
      padding: 0 15px;
    }

    .link {
      display: flex;
      align-items: center;
      padding: 12px 15px;
      color: $text-color;
      text-decoration: none;
      border-radius: $border-radius;
      font-weight: 500;
      font-size: 15px;
      transition: all 0.3s ease;
      margin-bottom: 5px;

      &:hover {
        background-color: $primary-hover;
        transform: translateX(5px);
      }

      &.active {
        background-color: $primary-active;
        font-weight: 700;
        box-shadow: inset 3px 0 $highlight-color;
        transform: translateX(0);
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

@media (max-width: 768px) {
  .sidebar {
    position: relative;
    width: 100%;
    height: auto;
  }

}
}
</style>