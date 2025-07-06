<template>
  <div class="app-container">
    <sidebar />
    <main class="content">
      <div class="content-scrollable">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script>
import sidebar from "./components/sidebar.vue";

export default {
  name: 'App',
  components: { 
    sidebar 
  }
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

.app-container {
  display: flex;
  min-height: 100vh;
}

/* Sidebar akan tetap terlihat karena posisi fixed */
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 260px;
  z-index: 100;
}

.content {
  margin-left: 260px; /* Sama dengan lebar sidebar */
  width: calc(100% - 260px);
  min-height: 100vh;
  position: relative;
  background-color: #f7f9fc;
}

.content-scrollable {
  padding: 30px;
  min-height: 100vh;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .sidebar {
    position: relative;
    width: 100%;
    height: auto;
  }
  
  .content {
    margin-left: 0;
    width: 100%;
  }
  
  .content-scrollable {
    padding: 20px;
  }
}
</style>