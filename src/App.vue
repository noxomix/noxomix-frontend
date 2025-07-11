<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuth } from './composables/useAuth'

const { getCurrentUser } = useAuth()

onMounted(() => {
  getCurrentUser()
})
</script>

<template>
  <div class="app">
    <router-view />
  </div>
</template>

<style>
body {
  color-scheme: light;
}
</style>