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
    </div>
    
    <div v-else class="server-content">
      <h3>{{ server?.name }}</h3>
      <p>{{ server?.status }}</p>
      <p>CPU: {{ server?.cpu }}%</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Server {
  id: number
  name: string
  status: string
  cpu: number
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

const handleClick = () => {
  if (props.isAddCard) {
    emit('addServer')
  } else {
    emit('click', props.server)
  }
}
</script>

<style scoped>
.server-card {
  width: 120px;
  height: 160px;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s;
  display: flex;
  flex-direction: column;
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
  align-items: center;
  justify-content: center;
  height: 100%;
}

.add-content svg {
  transition: transform 0.2s ease;
}

.server-card.add-card:hover .add-content svg {
  transform: scale(1.2);
}

.server-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  font-weight: bold;
}

.server-content p {
  margin: 0.25rem 0;
  font-size: 0.8rem;
  color: #666;
  line-height: 1.2;
}
</style>