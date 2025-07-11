<template>
  <div class="server-create">
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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-cube-plus">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M21 12.5v-4.509a1.98 1.98 0 0 0 -1 -1.717l-7 -4.008a2.016 2.016 0 0 0 -2 0l-7 4.007c-.619 .355 -1 1.01 -1 1.718v8.018c0 .709 .381 1.363 1 1.717l7 4.008a2.016 2.016 0 0 0 2 0" />
              <path d="M12 22v-10" />
              <path d="M12 12l8.73 -5.04" />
              <path d="M3.27 6.96l8.73 5.04" />
              <path d="M16 19h6" />
              <path d="M19 16v6" />
            </svg>
            Create New Server
          </h2>
        </div>
      </div>

      <div class="create-form">
        <fieldset class="form-section">
          <legend>Server Configuration</legend>
          
          <div class="form-group">
            <label for="hostname">Hostname</label>
            <div class="hostname-input-group">
              <input 
                type="text" 
                id="hostname"
                v-model="hostname"
                class="hostname-input"
                placeholder="myserver"
                maxlength="32"
                pattern="[a-z0-9-]+"
                @input="validateHostname"
              />
              <span class="hostname-suffix">.craftlite.de</span>
            </div>
            <div v-if="hostnameError" class="error-message">{{ hostnameError }}</div>
            <div class="help-text">Only lowercase letters, numbers, and hyphens allowed. Must be unique.</div>
          </div>

          <div class="form-group">
            <label>Server Type & Version</label>
            <div class="server-types-container">
              <div class="server-column">
                <div 
                  v-for="serverType in serverTypes.slice(0, 3)" 
                  :key="serverType.id"
                  class="server-type-card"
                  :class="{ 'selected': selectedServerType === serverType.id }"
                  @click="selectServerType(serverType.id)"
                >
                  <div class="card-content">
                    <div class="server-type-icon">
                      <img :src="serverType.icon" alt="" />
                    </div>
                    <div class="server-type-header">
                      <h3>{{ serverType.name }}</h3>
                      <div class="server-type-labels">
                        <div class="server-type-label">{{ serverType.label }}</div>
                        <div v-if="serverType.id === 'forge' || serverType.id === 'fabric'" class="server-type-pro-label">PRO</div>
                      </div>
                    </div>
                    
                    <div v-if="selectedServerType === serverType.id" class="version-select-container" @click.stop>
                      <label class="version-label">Minecraft Version</label>
                      <select 
                        v-model="selectedMinecraftVersion"
                        class="version-select"
                        @click.stop
                      >
                        <option 
                          v-for="version in availableVersions" 
                          :key="version.id"
                          :value="version.id"
                        >
                          {{ version.name }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="server-column">
                <div 
                  v-for="serverType in serverTypes.slice(3, 6)" 
                  :key="serverType.id"
                  class="server-type-card"
                  :class="{ 'selected': selectedServerType === serverType.id }"
                  @click="selectServerType(serverType.id)"
                >
                  <div class="card-content">
                    <div class="server-type-icon">
                      <img :src="serverType.icon" alt="" />
                    </div>
                    <div class="server-type-header">
                      <h3>{{ serverType.name }}</h3>
                      <div class="server-type-labels">
                        <div class="server-type-label">{{ serverType.label }}</div>
                        <div v-if="serverType.id === 'forge' || serverType.id === 'fabric'" class="server-type-pro-label">PRO</div>
                      </div>
                    </div>
                    
                    <div v-if="selectedServerType === serverType.id" class="version-select-container" @click.stop>
                      <label class="version-label">Minecraft Version</label>
                      <select 
                        v-model="selectedMinecraftVersion"
                        class="version-select"
                        @click.stop
                      >
                        <option 
                          v-for="version in availableVersions" 
                          :key="version.id"
                          :value="version.id"
                        >
                          {{ version.name }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div class="form-group">
            <label>Server Resources</label>
            <div class="resource-options">
              <div 
                v-for="resource in resourceOptions" 
                :key="resource.id"
                class="resource-option"
                :class="{ 
                  'selected': selectedResource === resource.id,
                  'disabled': resource.id === 'free' && isFreeDisabled
                }"
                @click="resource.id === 'free' && isFreeDisabled ? null : selectResource(resource.id)"
              >
                <div class="resource-header">
                  <h4>{{ resource.name }}</h4>
                  <span class="resource-price">
                    <template v-if="resource.price === 0">FREE</template>
                    <template v-else>€{{ resource.price.toFixed(2) }}/hour</template>
                  </span>
                </div>
                <div class="resource-specs">
                  <div class="spec-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="icon">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M18 3a3 3 0 0 1 2.995 2.824l.005 .176v12a3 3 0 0 1 -2.824 2.995l-.176 .005h-12a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-12a3 3 0 0 1 2.824 -2.995l.176 -.005h12zm0 2h-12a1 1 0 0 0 -.993 .883l-.007 .117v9h14v-9a1 1 0 0 0 -.883 -.993l-.117 -.007z" />
                    </svg>
                    {{ resource.ram }}MB RAM
                  </div>
                  <div class="spec-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M12 6m-8 0a8 3 0 1 0 16 0a8 3 0 1 0 -16 0" />
                      <path d="M4 6v6a8 3 0 0 0 16 0v-6" />
                      <path d="M4 12v6a8 3 0 0 0 16 0v-6" />
                    </svg>
                    {{ resource.storage }}GB Storage
                  </div>
                  <div class="spec-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
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
                    <template v-if="typeof resource.cpu === 'string'">{{ resource.cpu }} CPU</template>
                    <template v-else>{{ resource.cpu }} vCores</template>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <router-link to="/servers" class="cancel-button">Cancel</router-link>
            <button 
              type="button" 
              class="create-button"
              :disabled="!canCreateServer"
              @click="createServer"
            >
              Create Server
            </button>
          </div>
        </fieldset>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

interface ServerType {
  id: string
  name: string
  description: string
  label: string
  icon: string
}

interface MinecraftVersion {
  id: string
  name: string
  type: string
}

interface ResourceOption {
  id: string
  name: string
  ram: number
  storage: number
  cpu: number | string
  price: number
}

const router = useRouter()

const hostname = ref('')
const hostnameError = ref('')
const selectedServerType = ref('paper')
const selectedMinecraftVersion = ref('1.20.4')
const selectedResource = ref('free')

const serverTypes: ServerType[] = [
  {
    id: 'paper',
    name: 'Paper',
    description: 'Most popular server software with performance optimizations and plugin support',
    label: 'Recommended',
    icon: '/icons/paper.png'
  },
  {
    id: 'spigot',
    name: 'Spigot',
    description: 'High performance server with plugin support and extensive customization',
    label: 'Classic',
    icon: '/icons/spigot.png'
  },
  {
    id: 'craftbukkit',
    name: 'CraftBukkit',
    description: 'Original modded server software with basic plugin support',
    label: 'Legacy',
    icon: '/icons/bukkit.png'
  },
  {
    id: 'vanilla',
    name: 'Vanilla',
    description: 'Official Minecraft server without modifications or plugins',
    label: 'Simple',
    icon: '/icons/minecraft.png'
  },
  {
    id: 'forge',
    name: 'Forge',
    description: 'Modded server software for Minecraft Forge mods',
    label: 'Modded',
    icon: '/icons/forge.png'
  },
  {
    id: 'fabric',
    name: 'Fabric',
    description: 'Lightweight modded server for Fabric mods',
    label: 'Fabric',
    icon: '/icons/fabric.png'
  }
]

const availableVersions = computed<MinecraftVersion[]>(() => {
  if (!selectedServerType.value) return []
  
  // Mock versions - in real app this would be fetched based on server type
  return [
    { id: '1.20.4', name: '1.20.4 (Latest)', type: 'release' },
    { id: '1.20.3', name: '1.20.3', type: 'release' },
    { id: '1.20.2', name: '1.20.2', type: 'release' },
    { id: '1.20.1', name: '1.20.1', type: 'release' },
    { id: '1.19.4', name: '1.19.4', type: 'release' },
    { id: '1.19.3', name: '1.19.3', type: 'release' },
    { id: '1.18.2', name: '1.18.2', type: 'release' },
    { id: '1.17.1', name: '1.17.1', type: 'release' }
  ]
})

const resourceOptions: ResourceOption[] = [
  {
    id: 'free',
    name: 'Free',
    ram: 2048,
    storage: 2,
    cpu: 'Shared',
    price: 0
  },
  {
    id: 'basic',
    name: 'Basic',
    ram: 3072,
    storage: 3,
    cpu: 1,
    price: 0.03
  },
  {
    id: 'standard',
    name: 'Standard',
    ram: 4096,
    storage: 4,
    cpu: 2,
    price: 0.05
  },
  {
    id: 'premium',
    name: 'Premium',
    ram: 6144,
    storage: 5,
    cpu: 3,
    price: 0.07
  }
]

const isFreeDisabled = computed(() => {
  return selectedServerType.value === 'forge' || selectedServerType.value === 'fabric'
})

const canCreateServer = computed(() => {
  return hostname.value && 
         !hostnameError.value && 
         selectedServerType.value && 
         selectedMinecraftVersion.value && 
         selectedResource.value
})

const validateHostname = () => {
  const value = hostname.value.toLowerCase()
  hostname.value = value
  
  if (!value) {
    hostnameError.value = ''
    return
  }
  
  if (value.length < 3) {
    hostnameError.value = 'Hostname must be at least 3 characters long'
    return
  }
  
  if (value.length > 32) {
    hostnameError.value = 'Hostname must be at most 32 characters long'
    return
  }
  
  if (!/^[a-z0-9-]+$/.test(value)) {
    hostnameError.value = 'Only lowercase letters, numbers, and hyphens allowed'
    return
  }
  
  if (value.startsWith('-') || value.endsWith('-')) {
    hostnameError.value = 'Hostname cannot start or end with a hyphen'
    return
  }
  
  if (value.includes('--')) {
    hostnameError.value = 'Hostname cannot contain consecutive hyphens'
    return
  }
  
  hostnameError.value = ''
}

const selectServerType = (typeId: string) => {
  selectedServerType.value = typeId
  // Auto-select latest version when changing server type
  const versions = availableVersions.value
  if (versions.length > 0) {
    selectedMinecraftVersion.value = versions[0].id // Select first (latest) version
  }
  
  // Auto-select basic if free is not available for modded servers
  if ((typeId === 'forge' || typeId === 'fabric') && selectedResource.value === 'free') {
    selectedResource.value = 'basic'
  }
}

const selectResource = (resourceId: string) => {
  selectedResource.value = resourceId
}

const createServer = () => {
  if (!canCreateServer.value) return
  
  console.log('Creating server:', {
    hostname: hostname.value,
    serverType: selectedServerType.value,
    minecraftVersion: selectedMinecraftVersion.value,
    resource: selectedResource.value
  })
  
  // TODO: Implement server creation API call
  // For now, just redirect back to servers
  router.push('/servers')
}
</script>

<style scoped>
.server-create {
}

.main-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  margin-bottom: 2rem;
  border-bottom: none !important;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-content h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
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

.create-form {
}

.form-section {
  padding: 2rem;
  border-radius: 4px;
  background: white;
}

.form-section legend {
  padding: 0 0.7rem;
  font-weight: 500;
}

.form-group {
  margin-bottom: 2rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.hostname-input-group {
  position: relative;
}

.hostname-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  font-size: 14px;
  padding-right: 120px;
}

.hostname-input:focus {
  border-color: #22c55e;
}

.hostname-suffix {
  position: absolute;
  right: 12px;
  top: 0.75rem;
  font-size: 14px;
  color: #666;
  pointer-events: none;
}

.error-message {
  margin-top: 0.5rem;
  color: #ef4444;
  font-size: 14px;
}

.help-text {
  margin-top: 0.5rem;
  color: #666;
  font-size: 14px;
}

.server-types-container {
  display: flex;
  gap: 2rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}

.server-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
  min-width: 300px;
}

.server-type-card {
  position: relative;
  padding: 1.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.server-type-card:hover {
  background: #f9f9f9;
}

.server-type-card.selected {
  border-color: #22c55e;
  background: #f0fdf4;
}

.server-type-card.selected::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 30px;
  height: 30px;
  background: #22c55e;
  clip-path: polygon(100% 0%, 0% 0%, 100% 100%);
}

.server-type-card.selected::after {
  content: '✓';
  position: absolute;
  top: 3px;
  right: 5px;
  color: white;
  font-size: 12px;
  font-weight: bold;
  pointer-events: none;
}

.card-content {
  text-align: center;
}

.server-type-icon {
  margin-bottom: 1rem;
}

.server-type-icon img {
  width: 48px;
  height: 48px;
  object-fit: contain;
}


.server-type-label {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #f3f4f6;
  color: #374151;
  font-size: 12px;
  font-weight: 500;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.server-type-card.selected .server-type-label {
  background: #22c55e;
  color: white;
}

.server-type-header {
  text-align: center;
}

.server-type-header h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  color: #333;
}

.server-type-labels {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.server-type-pro-label {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #3b82f6;
  color: white;
  font-size: 12px;
  font-weight: 500;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.version-select-container {
  margin-top: 1rem;
  padding-top: 1rem;
}

.version-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.version-select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  background: white;
}

.version-select:focus {
  border-color: #22c55e;
}


.minecraft-version-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  background: white;
}

.minecraft-version-select:focus {
  border-color: #999;
}

.resource-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 0.5rem;
}

.resource-option {
  position: relative;
  padding: 1.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.resource-option:hover:not(.disabled) {
  background: #f9f9f9;
}

.resource-option.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #f5f5f5;
}

.resource-option.selected {
  border-color: #3b82f6;
  background: #eff6ff;
}

.resource-option.selected::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 30px;
  height: 30px;
  background: #3b82f6;
  clip-path: polygon(100% 0%, 0% 0%, 100% 100%);
}

.resource-option.selected::after {
  content: '✓';
  position: absolute;
  top: 3px;
  right: 5px;
  color: white;
  font-size: 12px;
  font-weight: bold;
  pointer-events: none;
}

.resource-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.resource-header h4 {
  margin: 0;
  color: #333;
  font-size: 1.125rem;
}

.resource-price {
  font-weight: 600;
  color: #3b82f6;
  font-size: 1.125rem;
}

.resource-specs {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.spec-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 14px;
}

.spec-item .icon {
  flex-shrink: 0;
  color: #999;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.cancel-button {
  padding: 0.75rem 1.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  color: #333;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-button:hover {
  background: #f5f5f5;
}

.create-button {
  padding: 0.75rem 1.5rem;
  border: 1px solid #22c55e;
  border-radius: 4px;
  background: #22c55e;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.create-button:hover:not(:disabled) {
  background: #16a34a;
}

.create-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }
  
  .form-section {
    padding: 1rem;
  }
  
  .server-types {
    grid-template-columns: 1fr;
  }
  
  .resource-options {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .cancel-button,
  .create-button {
    width: 100%;
    text-align: center;
  }
}
</style>