<template>
  <div class="servers">
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
        <template v-if="loading">
          <ServerCardSkeleton v-for="n in 4" :key="`skeleton-${n}`" />
          <ServerCard 
            :is-add-card="true"
            @add-server="handleAddServer"
          />
        </template>
        
        <div v-else-if="error" class="error-state">
          {{ error }}
        </div>
        
        <template v-else>
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
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ServerCard from './ServerCard.vue'
import ServerCardSkeleton from './ServerCardSkeleton.vue'
import { useAuth } from '../composables/useAuth'

interface Server {
  id: number
  name: string
  status: string
  cpu: number
  ram: string
  storage: string
}

const servers = ref<Server[]>([])
const loading = ref(true)
const error = ref('')

const { apiCall } = useAuth()

const loadServers = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const [response] = await Promise.all([
      apiCall('/api/servers'),
      new Promise(resolve => setTimeout(resolve, 1000))
    ])
    servers.value = response.servers
  } catch (err) {
    console.error('Failed to load servers:', err)
    error.value = 'Failed to load servers'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadServers()
})

const handleServerClick = (server?: Server) => {
  console.log('Server clicked:', server)
}

const handleAddServer = () => {
  console.log('Add server clicked')
}
</script>

<style scoped>
.servers {
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

.error-state {
  text-align: center;
  padding: 2rem;
  color: #ef4444;
  font-style: italic;
  width: 100%;
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