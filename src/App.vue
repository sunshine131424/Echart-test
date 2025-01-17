<template>
  <nav class="nav-menu">
    <router-link to="/" class="nav-link">雙圖表</router-link>
    <router-link to="/kline" class="nav-link">K線圖</router-link>
    <router-link to="/heatmap" class="nav-link">熱力圖</router-link>
    <router-link to="/3d" class="nav-link">3D視圖</router-link>
  </nav>
  <router-view></router-view>
</template>

<style scoped>
.nav-menu {
  padding: 1rem;
  background-color: #f8f9fa;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.nav-link {
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #333;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: #e9ecef;
}

.nav-link.router-link-active {
  background-color: #007bff;
  color: white;
}
</style>

