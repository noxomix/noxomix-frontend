<template>
  <div class="server-manage">
    <div class="main-content">
      <div class="header">
        <div class="header-content">
          <router-link to="/servers" class="back-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-left">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M15 6l-6 6l6 6" />
            </svg>
          </router-link>
          <h2>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-tool tool-icon">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M7 10h3v-3l-3.5 -3.5a6 6 0 0 1 8 8l6 6a2 2 0 0 1 -3 3l-6 -6a6 6 0 0 1 -8 -8l3.5 3.5" />
            </svg>
            <span class="manage-text">Manage:&nbsp;</span><span v-if="server?.name" class="server-name" @click="copyToClipboard" @mouseenter="showCopyIcon = true" @mouseleave="showCopyIcon = false">
              <span class="subdomain">{{ server.name.split('.')[0] }}</span><span class="domain">.{{ server.name.substring(server.name.indexOf('.') + 1) }}</span>
              <!-- Copy Icon -->
              <svg 
                v-if="showCopyIcon && !showCheckmark"
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
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
                width="16" 
                height="16" 
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
            </span>
            <span v-else class="server-name">Loading...</span>
          </h2>
        </div>
      </div>
      
      <fieldset class="manage-container">
        <legend>General</legend>
        <div class="server-controls-container">
          <div class="server-controls">
            <!-- Loading State -->
            <div v-if="isActionLoading" class="loading-state">
              <div class="loading-spinner"></div>
              <span>Loading to finish action</span>
            </div>

            <!-- Control Buttons - only show when not loading -->
            <template v-else>
              <!-- Start Button - only show if server is offline -->
              <button 
                v-if="server?.status === 'Offline'" 
                @click="startServer" 
                class="control-button start-button"
              >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-player-play">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z" />
              </svg>
              Start
            </button>

            <!-- Restart Button - only show if server is online -->
            <button 
              v-if="server?.status === 'Online'" 
              @click="restartServer" 
              class="control-button restart-button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-refresh">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
                <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
              </svg>
              Restart
            </button>

            <!-- Stop Button - only show if server is online -->
            <button 
              v-if="server?.status === 'Online'" 
              @click="stopServer" 
              class="control-button stop-button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-player-pause">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M9 4h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2z" />
                <path d="M17 4h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2z" />
              </svg>
              Stop
            </button>

            <!-- Kill Button - only show if server is online -->
            <button 
              v-if="server?.status === 'Online'" 
              @click="killServer" 
              class="control-button kill-button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-skull">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M12 4c4.418 0 8 3.358 8 7.5c0 1.901 -.755 3.637 -2 4.96l0 2.54a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1v-2.54c-1.245 -1.322 -2 -3.058 -2 -4.96c0 -4.142 3.582 -7.5 8 -7.5z" />
                <path d="M10 17v3" />
                <path d="M14 17v3" />
                <path d="M9 11m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                <path d="M15 11m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
              </svg>
              Kill
            </button>
            </template>
          </div>

          <!-- Server Info -->
          <div v-if="server" class="server-info">
            <div class="info-item domain-item" @click="copyToClipboard">
              <span class="domain-text"><span class="subdomain">{{ server.name.split('.')[0] }}</span><span class="domain">.{{ server.name.substring(server.name.indexOf('.') + 1) }}</span></span>
              <!-- Copy Icon -->
              <svg 
                v-if="!showCheckmark"
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
            <div class="info-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="metric-icon">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M18 3a3 3 0 0 1 2.995 2.824l.005 .176v12a3 3 0 0 1 -2.824 2.995l-.176 .005h-12a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-12a3 3 0 0 1 2.824 -2.995l.176 -.005h12zm0 2h-12a1 1 0 0 0 -.993 .883l-.007 .117v9h14v-9a1 1 0 0 0 -.883 -.993l-.117 -.007z" />
              </svg>
              {{ server.ram }}
            </div>
            <div class="info-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="metric-icon">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M12 6m-8 0a8 3 0 1 0 16 0a8 3 0 1 0 -16 0" />
                <path d="M4 6v6a8 3 0 0 0 16 0v-6" />
                <path d="M4 12v6a8 3 0 0 0 16 0v-6" />
              </svg>
              {{ server.storage }}
            </div>
            <div class="info-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-cpu metric-icon">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M5 5m0 1a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1z" />
                <path d="M9 9h6v6h-6z" />
                <path d="M3 10h2" />
                <path d="M3 14h2" />
                <path d="M10 3v2" />
                <path d="M14 3v2" />
                <path d="M21 10h-2" />
                <path d="M21 14h-2" />
                <path d="M14 21v-2" />
                <path d="M10 21v-2" />
              </svg>
              {{ server.cpu }} vCores
            </div>
          </div>
        </div>
        
        <p>Server management interface for {{ server?.name || serverId }}</p>
      </fieldset>

      <fieldset class="manage-container console-container">
        <legend>Console</legend>
        <div class="console-layout" :class="{ 'console-layout-minimized': isTerminalMinimized, 'console-layout-maximized': isTerminalMaximized }">
          <div class="terminal-wrapper" :class="{ 'terminal-maximized': isTerminalMaximized, 'terminal-minimized': isTerminalMinimized }">
            <div class="terminal-header" @click="focusInput">
              <div class="terminal-title">{{ server?.name || 'Server' }} Console</div>
              <div class="terminal-controls" @click.stop>
                <div class="terminal-button close" @click="minimizeTerminal"></div>
                <div class="terminal-button minimize" @click="minimizeTerminal"></div>
                <div class="terminal-button maximize" @click="maximizeTerminal"></div>
              </div>
            </div>
            <div class="terminal-body" @click="focusInput">
              <div class="terminal-scroll-area">
                <div class="terminal-content">
                  <div v-for="(line, index) in terminalHistory" :key="index" class="terminal-line">
                    <span class="command-text">{{ line }}</span>
                  </div>
                  <div class="terminal-prompt">
                    <span class="prompt-chevron">></span>
                    <input 
                      ref="terminalInput"
                      type="text" 
                      class="terminal-input" 
                      placeholder="Enter command..." 
                      v-model="currentCommand"
                      @keyup.enter="executeCommand"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div v-show="isTerminalMinimized || isTerminalMaximized" class="quick-tools">
            <div class="quick-tool-box">
              <h4>OP Tool</h4>
              <div class="tool-input-group">
                <input 
                  type="text" 
                  class="tool-input" 
                  placeholder="Player name..." 
                  v-model="opPlayerName"
                />
                <button @click="executeOp" class="tool-button">OP</button>
              </div>
            </div>
            
            <div class="quick-tool-box">
              <h4>Teleport</h4>
              <div class="tool-input-group">
                <input 
                  type="text" 
                  class="tool-input" 
                  placeholder="Player to teleport..." 
                  v-model="tpPlayer"
                />
                <input 
                  type="text" 
                  class="tool-input" 
                  placeholder="Target player..." 
                  v-model="tpTarget"
                />
                <button @click="executeTp" class="tool-button">TP</button>
              </div>
            </div>
            
            <div class="quick-tool-box">
              <h4>Weather</h4>
              <div class="tool-button-group">
                <button @click="executeWeather('clear')" class="tool-button">Clear</button>
                <button @click="executeWeather('rain')" class="tool-button">Rain</button>
                <button @click="executeWeather('thunder')" class="tool-button">Thunder</button>
              </div>
            </div>
          </div>
        </div>
      </fieldset>

      <fieldset class="manage-container files-container">
        <legend>Files</legend>
        <p>File management interface coming soon...</p>
      </fieldset>
    </div>

    <!-- Kill Confirmation Dialog -->
    <div v-if="showKillDialog" class="dialog-overlay" @click="cancelKill">
      <div class="dialog" @click.stop>
        <p>Hard kill <strong>{{ server?.name }}</strong>?<br>This could result in data loss.</p>
        <div class="dialog-actions">
          <button @click="cancelKill" class="dialog-button cancel-button">Cancel</button>
          <button @click="confirmKill" class="dialog-button confirm-button">Confirm</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth'

interface Server {
  id: number
  name: string
  status: string
  cpu: number
  ram: string
  storage: string
}

const route = useRoute()
const { apiCall } = useAuth()
const serverId = route.params.id
const server = ref<Server | null>(null)
const showCopyIcon = ref(false)
const showCheckmark = ref(false)
const isActionLoading = ref(false)
const showKillDialog = ref(false)
const isTerminalMaximized = ref(false)
const isTerminalMinimized = ref(true)
const terminalHistory = ref<string[]>([])
const currentCommand = ref('')
const terminalInput = ref<HTMLInputElement | null>(null)
const opPlayerName = ref('')
const tpPlayer = ref('')
const tpTarget = ref('')

const loadServer = async () => {
  try {
    const response = await apiCall('/api/servers')
    const servers = response.servers
    server.value = servers.find((s: Server) => s.id.toString() === serverId) || null
  } catch (err) {
    console.error('Failed to load server:', err)
  }
}

const copyToClipboard = async () => {
  if (server.value?.name) {
    try {
      // Check if clipboard API is available
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(server.value.name)
        console.log('Domain copied to clipboard:', server.value.name)
        
        // Show checkmark for 1 second
        showCheckmark.value = true
        setTimeout(() => {
          showCheckmark.value = false
        }, 1000)
      } else {
        // Fallback for HTTP or unsupported browsers
        const textArea = document.createElement('textarea')
        textArea.value = server.value.name
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        document.body.appendChild(textArea)
        textArea.select()
        try {
          document.execCommand('copy')
          console.log('Domain copied to clipboard (fallback):', server.value.name)
          
          // Show checkmark for 1 second
          showCheckmark.value = true
          setTimeout(() => {
            showCheckmark.value = false
          }, 1000)
        } catch (err) {
          console.error('Failed to copy to clipboard (fallback):', err)
        }
        document.body.removeChild(textArea)
      }
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }
}

const startServer = () => {
  console.log('Starting server:', server.value?.id)
  isActionLoading.value = true
  // TODO: Implement server start functionality
  // Simulate loading for demo
  setTimeout(() => {
    isActionLoading.value = false
  }, 1000)
}

const restartServer = () => {
  console.log('Restarting server:', server.value?.id)
  isActionLoading.value = true
  // TODO: Implement server restart functionality
  // Simulate loading for demo
  setTimeout(() => {
    isActionLoading.value = false
  }, 1000)
}

const stopServer = () => {
  console.log('Stopping server:', server.value?.id)
  isActionLoading.value = true
  // TODO: Implement server stop functionality
  // Simulate loading for demo
  setTimeout(() => {
    isActionLoading.value = false
  }, 1000)
}

const killServer = () => {
  showKillDialog.value = true
}

const confirmKill = () => {
  showKillDialog.value = false
  console.log('Killing server:', server.value?.id)
  isActionLoading.value = true
  // TODO: Implement server kill functionality
  // Simulate loading for demo
  setTimeout(() => {
    isActionLoading.value = false
  }, 1000)
}

const cancelKill = () => {
  showKillDialog.value = false
}

const minimizeTerminal = () => {
  isTerminalMaximized.value = false
  isTerminalMinimized.value = true
}

const maximizeTerminal = () => {
  isTerminalMaximized.value = true
  isTerminalMinimized.value = false
}

const executeCommand = () => {
  if (currentCommand.value.trim()) {
    terminalHistory.value.push(currentCommand.value)
    currentCommand.value = ''
  }
}

const focusInput = () => {
  if (terminalInput.value) {
    terminalInput.value.focus()
  }
}

const executeOp = () => {
  if (opPlayerName.value.trim()) {
    const command = `/op ${opPlayerName.value.trim()}`
    terminalHistory.value.push(command)
    opPlayerName.value = ''
  }
}

const executeTp = () => {
  if (tpPlayer.value.trim() && tpTarget.value.trim()) {
    const command = `/tp ${tpPlayer.value.trim()} ${tpTarget.value.trim()}`
    terminalHistory.value.push(command)
    tpPlayer.value = ''
    tpTarget.value = ''
  }
}

const executeWeather = (weather: string) => {
  const command = `/weather ${weather}`
  terminalHistory.value.push(command)
}

onMounted(() => {
  loadServer()
})
</script>

<style scoped>
.server-manage {
}

.main-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  margin-bottom: 2rem;
  border-bottom: none;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-content h2 {
  display: flex;
  align-items: center;
}

.header-content h2 {
  margin: 0;
  border: none;
  border-bottom: none !important;
  box-shadow: none;
}

.manage-text {
  font-weight: 300;
}

.subdomain {
  font-weight: 700;
}

.domain {
  font-weight: 300;
}

.tool-icon {
  margin-right: 0.5rem;
}

.server-name {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.server-name svg {
  margin-left: 0.25rem;
}

.domain-text {
  display: inline;
}

.domain-item .subdomain,
.domain-item .domain {
  display: inline;
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

.manage-container {
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
}

.manage-container legend {
  padding: 0 0.7rem;
}

.console-container {
  margin-top: 2rem;
}

.files-container {
  margin-top: 2rem;
}

.terminal-wrapper {
  background: #1e1e1e;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  max-width: 600px;
  transition: all 0.3s ease;
}

.terminal-wrapper.terminal-maximized {
  max-width: 100%;
  width: 100%;
}

.terminal-wrapper.terminal-maximized .terminal-body {
  min-height: 200px;
}

.terminal-wrapper.terminal-minimized {
  max-width: 60%;
  width: 60%;
}

.terminal-header {
  background: #1e1e1e;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #1a1a1a;
}

.terminal-controls {
  display: flex;
  gap: 8px;
}

.terminal-button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  cursor: pointer;
  background: #6b6b6b;
  transition: background-color 0.2s ease;
}

.terminal-button.close:hover {
  background: #ff5f56;
}

.terminal-button.minimize:hover {
  background: #ffbd2e;
}

.terminal-button.maximize:hover {
  background: #27ca3f;
}

.terminal-title {
  color: #ffffff;
  font-size: 12px;
  font-weight: 500;
  opacity: 0.8;
}

.terminal-body {
  background: #1e1e1e;
  padding: 12px 16px;
  min-height: 200px;
  max-height: 20rem;
  font-family: 'Courier New', 'Lucida Console', 'Monaco', 'Consolas', monospace;
  transition: all 0.3s ease;
  overflow-y: auto;
}

.terminal-scroll-area {
  padding-bottom: 0.5rem;
}

.terminal-content {
  color: #ffffff;
  font-size: 14px;
  line-height: 1.5;
}

.terminal-prompt {
  display: flex;
  align-items: baseline;
  gap: 8px;
  color: #ffffff;
}

.prompt-chevron {
  color: #27ca3f;
  font-weight: bold;
  font-size: 14px;
  line-height: 14px;
}

.terminal-input {
  background: transparent;
  border: none;
  outline: none;
  color: #ffffff;
  font-family: inherit;
  font-size: 14px;
  flex: 1;
  padding: 0;
  line-height: 14px;
}

.terminal-input::placeholder {
  color: #888888;
  opacity: 0.7;
}

.terminal-line {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 4px;
}

.command-text {
  color: #ffffff;
  font-size: 14px;
}

.console-layout {
  display: flex;
  gap: 1rem;
  align-items: stretch;
}

.console-layout-minimized .terminal-wrapper {
  flex: 1;
}

.console-layout-maximized {
  flex-direction: column;
}

.console-layout-maximized .quick-tools {
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
}

.console-layout-maximized .quick-tool-box {
  flex: 1;
}

.quick-tools {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
}

.quick-tool-box {
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 1rem;
  flex: 1;
}

.quick-tool-box h4 {
  margin: 0 0 0.75rem 0;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.tool-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tool-input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
}

.tool-input:focus {
  border-color: #999;
}

.tool-button {
  padding: 0.5rem 1rem;
  background: #e9e9ed;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.tool-button:hover {
  background: #f5f5f5;
}

.tool-button-group {
  display: flex;
  gap: 0.5rem;
}

.tool-button-group .tool-button {
  flex: 1;
}

@media (max-width: 768px) {
  .console-layout {
    flex-direction: column;
  }
  
  .quick-tools {
    min-width: 100%;
  }
}

.server-controls-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  align-items: center;
}

.server-controls {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: flex-start;
}

.server-info {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: center;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #333;
  background: #f5f5f5;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
}

.info-item svg {
  flex-shrink: 0;
}

.domain-item {
  cursor: pointer;
}

.domain-item:hover {
  background: #e5e7eb;
}

.control-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  color: white;
  flex-shrink: 0;
  width: auto;
}

.start-button {
  background-color: #22c55e;
}

.start-button:hover {
  background-color: #16a34a;
}

.restart-button {
  background-color: #3b82f6;
}

.restart-button:hover {
  background-color: #2563eb;
}

.stop-button {
  background-color: #eab308;
}

.stop-button:hover {
  background-color: #ca8a04;
}

.kill-button {
  background-color: #ef4444;
}

.kill-button:hover {
  background-color: #dc2626;
}

.loading-state {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.loading-spinner {
  width: 12px;
  height: 12px;
  border: 6px solid transparent;
  border-top: 6px solid #6b7280;
  border-right: 6px solid rgba(107, 114, 128, 0.7);
  border-bottom: 6px solid rgba(107, 114, 128, 0.4);
  border-left: 6px solid rgba(107, 114, 128, 0.1);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.back-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  text-decoration: none;
  color: inherit;
}

.back-button:hover {
  background: transparent;
}

.back-button svg {
  transition: transform 0.2s ease;
}

.back-button:hover svg {
  transform: translateX(-2px);
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog {
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 1.5rem;
  max-width: 280px;
  width: 90%;
}

.dialog p {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 0.875rem;
  text-align: center;
}

.dialog-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.dialog-button {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  background: white;
}

.cancel-button {
  background-color: #e9e9ed;
  color: #333;
}

.cancel-button:hover {
  background: #f5f5f5;
}

.confirm-button {
  background-color: #e9e9ed;
  color: red;
  border-color: red;
}

.confirm-button:hover {
  background: #f5f5f5;
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }
  
  .manage-container {
    padding: 1rem;
  }

  .server-controls-container {
    flex-direction: column;
    gap: 1.5rem;
    align-items: flex-start;
  }

  .server-controls {
    justify-content: center;
    width: 100%;
  }

  .server-info {
    width: 100%;
    justify-content: center;
    max-width: 100%;
  }

  .info-item {
    flex: 1 1 calc(50% - 0.375rem);
    min-width: 0;
    justify-content: center;
    padding: 0.375rem 0.5rem;
    font-size: 0.75rem;
  }

  .dialog {
    margin: 1rem;
  }
  
  .dialog-actions {
    flex-direction: column;
  }
  
  .dialog-button {
    width: 100%;
  }
}
</style>