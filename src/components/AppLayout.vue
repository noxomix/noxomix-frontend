<template>
  <div class="app-layout">
    <HeaderBar />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import HeaderBar from './HeaderBar.vue'
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
}
</style>