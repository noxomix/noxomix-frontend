<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuth } from './composables/useAuth'
import LoginForm from './components/LoginForm.vue'
import ServerPanel from './components/ServerPanel.vue'

const { isAuthenticated, getCurrentUser } = useAuth()

onMounted(() => {
  getCurrentUser()
})
</script>

<template>
  <div class="app">
    <LoginForm v-if="!isAuthenticated" />
    <ServerPanel v-else />
  </div>
</template>

<style>
body {
  color-scheme: light;
}
</style>