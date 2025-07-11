<template>
  <div class="server-card skeleton-card">
  </div>
</template>

<style scoped>
.skeleton-card {
  width: 170px;
  height: 160px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #e5e7eb;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
</style>