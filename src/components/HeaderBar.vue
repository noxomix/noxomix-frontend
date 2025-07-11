<template>
  <div class="header-bar">
    <div class="header-content">
      <Logo />
      
      <div class="user-menu">
        <button 
          class="user-button" 
          @click="toggleDropdown"
          @blur="closeDropdown"
        >
          {{ user?.name || 'User' }}
          <span class="chevron">▼</span>
        </button>
        
        <div v-if="showDropdown" class="dropdown">
          <button class="dropdown-item" @click="goToSettings">
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-settings">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M14.647 4.081a.724 .724 0 0 0 1.08 .448c2.439 -1.485 5.23 1.305 3.745 3.744a.724 .724 0 0 0 .447 1.08c2.775 .673 2.775 4.62 0 5.294a.724 .724 0 0 0 -.448 1.08c1.485 2.439 -1.305 5.23 -3.744 3.745a.724 .724 0 0 0 -1.08 .447c-.673 2.775 -4.62 2.775 -5.294 0a.724 .724 0 0 0 -1.08 -.448c-2.439 1.485 -5.23 -1.305 -3.745 -3.744a.724 .724 0 0 0 -.447 -1.08c-2.775 -.673 -2.775 -4.62 0 -5.294a.724 .724 0 0 0 .448 -1.08c-1.485 -2.439 1.305 -5.23 3.744 -3.745a.722 .722 0 0 0 1.08 -.447c.673 -2.775 4.62 -2.775 5.294 0zm-2.647 4.919a3 3 0 1 0 0 6a3 3 0 0 0 0 -6z" />
            </svg>
            Settings
          </button>
          <button class="dropdown-item" @click="goToBilling">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-cash">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M7 15h-3a1 1 0 0 1 -1 -1v-8a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v3" />
              <path d="M7 9m0 1a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v8a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1z" />
              <path d="M12 14a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
            </svg>
            Billing
          </button>
          <button class="dropdown-item logout-button" @click="handleLogout">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-door-exit">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M13 12v.01" />
              <path d="M3 21h18" />
              <path d="M5 21v-16a2 2 0 0 1 2 -2h7.5m2.5 10.5v7.5" />
              <path d="M14 7h7m-3 -3l3 3l-3 3" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'
import Logo from './Logo.vue'

const { user, logout } = useAuth()
const showDropdown = ref(false)

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const closeDropdown = () => {
  setTimeout(() => {
    showDropdown.value = false
  }, 150)
}

const goToSettings = () => {
  showDropdown.value = false
  // TODO: Navigate to settings
  console.log('Navigate to settings')
}

const goToBilling = () => {
  showDropdown.value = false
  // TODO: Navigate to billing
  console.log('Navigate to billing')
}

const handleLogout = () => {
  showDropdown.value = false
  logout()
}
</script>

<style scoped>
.header-bar {
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.user-menu {
  position: relative;
}

.user-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}

.user-button:hover {
  background-color: #f5f5f5;
}

.chevron {
  font-size: 0.8rem;
  transition: transform 0.2s;
}

.dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.25rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-width: 180px;
  z-index: 100;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  border: none;
  border-radius: 0;
  cursor: pointer;
  background-color: white;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.dropdown-item.logout-button {
  padding: 0.75rem 1.5rem;
  margin: 0.5rem;
  width: calc(100% - 1rem);
  border: 1px solid #ccc;
  border-radius: 4px;
  color: red;
  background-color: #e9e9ed;
}

.dropdown-item:first-child {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.dropdown-item:last-child {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}
</style>