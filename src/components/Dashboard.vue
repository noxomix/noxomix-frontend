<template>
  <div class="dashboard">
    <HeaderBar />
    
    <div class="main-content">
      <h2>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-server-bolt">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M3 4m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z" />
          <path d="M15 20h-9a3 3 0 0 1 -3 -3v-2a3 3 0 0 1 3 -3h12" />
          <path d="M7 8v.01" />
          <path d="M7 16v.01" />
          <path d="M20 15l-2 3h3l-2 3" />
        </svg>
        My Servers
      </h2>
      
      <div class="servers-container">
        <ServerCard 
          v-for="server in servers" 
          :key="server.id" 
          :server="server"
          @click="handleServerClick"
        />
        
        <ServerCard 
          :is-add-card="true"
          @add-server="handleAddServer"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HeaderBar from './HeaderBar.vue'
import ServerCard from './ServerCard.vue'

interface Server {
  id: number
  name: string
  status: string
  cpu: number
}

const servers = ref<Server[]>([
  { id: 1, name: 'Server 1', status: 'Online', cpu: 45 },
  { id: 2, name: 'Server 2', status: 'Online', cpu: 23 },
  { id: 3, name: 'Server 3', status: 'Offline', cpu: 0 },
])

const handleServerClick = (server?: Server) => {
  console.log('Server clicked:', server)
}

const handleAddServer = () => {
  console.log('Add server clicked')
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
}

.main-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.main-content h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.servers-container {
  margin-top: 2rem;
  padding: 2rem 2rem 20rem 2rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }
  
  .servers-container {
    padding: 1rem;
  }
}
</style>