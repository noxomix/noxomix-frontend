<template>
  <div class="server-card" :class="{ 'add-card': isAddCard }" @click="handleClick">
    <div v-if="isAddCard" class="add-content">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-cube-plus">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M21 12.5v-4.509a1.98 1.98 0 0 0 -1 -1.717l-7 -4.008a2.016 2.016 0 0 0 -2 0l-7 4.007c-.619 .355 -1 1.01 -1 1.718v8.018c0 .709 .381 1.363 1 1.717l7 4.008a2.016 2.016 0 0 0 2 0" />
        <path d="M12 22v-10" />
        <path d="M12 12l8.73 -5.04" />
        <path d="M3.27 6.96l8.73 5.04" />
        <path d="M16 19h6" />
        <path d="M19 16v6" />
      </svg>
      
      <div class="hover-label">
        + Server
      </div>
    </div>
    
    <div v-else class="server-content">
      <div class="title-container" @mouseenter="showCopyIcon = true" @mouseleave="showCopyIcon = false" @click="copyToClipboard">
        <h3>{{ server?.name?.split('.')[0] }}</h3>
        <div class="domain">
          .{{ server?.name?.substring(server.name.indexOf('.') + 1) }}
          <!-- Copy Icon -->
          <svg 
            v-if="showCopyIcon && !showCheckmark"
            xmlns="http://www.w3.org/2000/svg" 
            width="12" 
            height="12" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            class="copy-icon"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" />
            <path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" />
          </svg>
          <!-- Checkmark Icon -->
          <svg 
            v-if="showCheckmark"
            xmlns="http://www.w3.org/2000/svg" 
            width="12" 
            height="12" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            class="check-icon"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M5 12l5 5l10 -10" />
          </svg>
        </div>
      </div>
      <p class="status">
        <span class="status-dot" :class="{ 
          'online': server?.status === 'Online',
          'offline': server?.status === 'Offline',
          'loading': server?.status === 'Loading'
        }"></span>
        {{ server?.status }}
      </p>
      <div class="metrics">
        <div class="metric">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" class="metric-icon">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M18 3a3 3 0 0 1 2.995 2.824l.005 .176v12a3 3 0 0 1 -2.824 2.995l-.176 .005h-12a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-12a3 3 0 0 1 2.824 -2.995l.176 -.005h12zm0 2h-12a1 1 0 0 0 -.993 .883l-.007 .117v9h14v-9a1 1 0 0 0 -.883 -.993l-.117 -.007z" />
          </svg>
          <span>{{ server?.ram }}</span>
        </div>
        <div class="metric">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="metric-icon">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M12 6m-8 0a8 3 0 1 0 16 0a8 3 0 1 0 -16 0" />
            <path d="M4 6v6a8 3 0 0 0 16 0v-6" />
            <path d="M4 12v6a8 3 0 0 0 16 0v-6" />
          </svg>
          <span>{{ server?.storage }}</span>
        </div>
      </div>
      
      <div class="manage-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-settings">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M14.647 4.081a.724 .724 0 0 0 1.08 .448c2.439 -1.485 5.23 1.305 3.745 3.744a.724 .724 0 0 0 .447 1.08c2.775 .673 2.775 4.62 0 5.294a.724 .724 0 0 0 -.448 1.08c1.485 2.439 -1.305 5.23 -3.744 3.745a.724 .724 0 0 0 -1.08 .447c-.673 2.775 -4.62 2.775 -5.294 0a.724 .724 0 0 0 -1.08 -.448c-2.439 1.485 -5.23 -1.305 -3.745 -3.744a.724 .724 0 0 0 -.447 -1.08c-2.775 -.673 -2.775 -4.62 0 -5.294a.724 .724 0 0 0 .448 -1.08c-1.485 -2.439 1.305 -5.23 3.744 -3.745a.722 .722 0 0 0 1.08 -.447c.673 -2.775 4.62 -2.775 5.294 0zm-2.647 4.919a3 3 0 1 0 0 6a3 3 0 0 0 0 -6z" />
        </svg>
        Manage
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Server {
  id: number
  name: string
  status: string
  cpu: number
  ram: string
  storage: string
}

interface Props {
  server?: Server
  isAddCard?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isAddCard: false
})

const emit = defineEmits<{
  click: [server?: Server]
  addServer: []
}>()

const showCopyIcon = ref(false)
const showCheckmark = ref(false)

const handleClick = () => {
  if (props.isAddCard) {
    emit('addServer')
  } else {
    emit('click', props.server)
  }
}

const copyToClipboard = async () => {
  if (props.server?.name) {
    try {
      await navigator.clipboard.writeText(props.server.name)
      console.log('Domain copied to clipboard:', props.server.name)
      
      // Show checkmark for 1 second
      showCheckmark.value = true
      setTimeout(() => {
        showCheckmark.value = false
      }, 1000)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }
}
</script>

<style scoped>
.server-card {
  width: 170px;
  height: 160px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s, background-color 0.2s;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.server-card:not(.add-card) {
  width: 170px;
}

.server-card:hover:not(.add-card) {
  border-color: #8b93a6;
  background: #f5f5f5;
}

.server-card.add-card {
  background: #f9f9f9;
}

.server-card.add-card:hover {
  border-color: #3b82f6;
  background: #eff6ff;
}

.server-card.add-card:active {
  box-shadow: 0 0 0 2px #3b82f6;
}

.add-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  position: relative;
  padding: 0.75rem;
}

.add-content svg {
  transition: transform 0.2s ease;
}

.server-card.add-card:hover .add-content svg {
  transform: scale(1.2);
}

.hover-label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #3b82f6;
  color: white;
  text-align: center;
  padding: 0.5rem;
  border-radius: 0 0 4px 4px;
  font-size: 0.8rem;
  font-weight: 500;
  transform: translateY(100%);
  transition: transform 0.3s ease, opacity 0.3s ease;
  opacity: 0;
}

.server-card.add-card:hover .hover-label {
  transform: translateY(0);
  opacity: 1;
}

.server-content {
  padding: 1rem 0.75rem 0.75rem 0.75rem;
}

.title-container {
  text-align: center;
  cursor: pointer;
}

.server-content h3 {
  margin: 0 0 0.125rem 0;
  font-size: 0.9rem;
  font-weight: bold;
  text-align: center;
}

.domain {
  font-size: 0.7rem;
  font-weight: 300;
  color: #666;
  text-align: center;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}

.copy-icon {
  opacity: 0.6;
  transition: opacity 0.2s;
}

.copy-icon:hover {
  opacity: 1;
}

.check-icon {
  color: #16a34a;
  opacity: 1;
}

.server-content p {
  margin: 0.25rem 0;
  font-size: 0.8rem;
  color: #666;
  line-height: 1.2;
}

.status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.status-dot.online {
  background-color: #22c55e;
}

.status-dot.offline {
  background-color: #ef4444;
}

.status-dot.loading {
  background-color: #6b7280;
}

.metrics {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
}

.metric {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #666;
}

.metric-icon {
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.manage-button {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.4rem 0.75rem;
  background-color: #8b93a6;
  color: white;
  border: 1px solid #8b93a6;
  border-radius: 0 0 4px 4px;
  font-size: 0.7rem;
  font-weight: 500;
  cursor: pointer;
  transform: translateY(100%);
  transition: transform 0.3s ease, opacity 0.3s ease;
  opacity: 0;
}

.server-card:hover:not(.add-card) .manage-button {
  transform: translateY(0);
  opacity: 1;
}
</style>