<template>
  <div>
    <div class="p-8 max-w-6xl mx-auto md:p-4">
      <div class="mb-8">
        <div class="flex items-center gap-2">
          <router-link to="/servers" class="flex items-center justify-center w-10 h-10 border-none bg-transparent no-underline text-inherit hover:bg-transparent transition-transform hover:-translate-x-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-left transition-transform duration-200">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M15 6l-6 6l6 6" />
            </svg>
          </router-link>
          <h2 class="flex items-center gap-2 m-0 text-2xl font-semibold">
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

      <div>
        <fieldset class="p-8 rounded bg-white">
          <legend class="px-3 font-medium">Server Configuration</legend>
          
          <div class="mb-8">
            <label for="hostname" class="block mb-2 font-medium text-gray-700">Hostname</label>
            <div class="relative">
              <BaseInput 
                id="hostname"
                v-model="hostname"
                class="pr-32"
                placeholder="myserver"
                maxlength="32"
                pattern="[a-z0-9-]+"
                @input="validateHostname"
                size="lg"
              />
              <span class="absolute right-3 top-3 text-sm text-gray-600 pointer-events-none">.craftlite.de</span>
            </div>
            <div v-if="hostnameError" class="mt-2 text-red-500 text-sm">{{ hostnameError }}</div>
            <div class="mt-2 text-gray-600 text-sm">Only lowercase letters, numbers, and hyphens allowed. Must be unique.</div>
          </div>

          <div class="mb-8">
            <label class="block mb-2 font-medium text-gray-700">Server Type & Version</label>
            <div class="flex gap-8 mt-2 flex-wrap">
              <div class="flex flex-col gap-4 flex-1 min-w-[300px]">
                <div 
                  v-for="serverType in serverTypes.slice(0, 3)" 
                  :key="serverType.id"
                  class="relative p-6 border border-gray-300 rounded bg-white cursor-pointer transition-all hover:bg-gray-50 overflow-hidden"
                  :class="{ 
                    'border-green-500 bg-green-50': selectedServerType === serverType.id
                  }"
                  @click="selectServerType(serverType.id)"
                >
                  <!-- Corner Triangle with Checkmark -->
                  <div v-if="selectedServerType === serverType.id" class="absolute top-0 right-0">
                    <div class="relative">
                      <div class="absolute top-0 right-0 w-0 h-0 border-t-[32px] border-t-green-500 border-l-[32px] border-l-transparent"></div>
                      <svg xmlns="http://www.w3.org/2000/svg" 
                           class="absolute top-0.5 right-0.5 w-4 h-4 text-white z-10" 
                           viewBox="0 0 24 24" 
                           fill="none" 
                           stroke="currentColor" 
                           stroke-width="3" 
                           stroke-linecap="round" 
                           stroke-linejoin="round">
                        <path d="M5 12l5 5L20 7"/>
                      </svg>
                    </div>
                  </div>
                  <div class="text-center">
                    <div class="mb-4">
                      <img :src="serverType.icon" alt="" class="w-12 h-12 object-contain" />
                    </div>
                    <div class="text-center">
                      <h3 class="m-0 mb-2 text-2xl text-gray-700">{{ serverType.name }}</h3>
                      <div class="flex justify-center gap-2 flex-wrap">
                        <div class="inline-block px-3 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-xl uppercase tracking-wide"
                             :class="{ 'bg-green-500 text-white': selectedServerType === serverType.id }">
                          {{ serverType.label }}
                        </div>
                        <div v-if="serverType.id === 'forge' || serverType.id === 'fabric'" class="inline-block px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-xl uppercase tracking-wide">PRO</div>
                      </div>
                    </div>
                    
                    <div v-if="selectedServerType === serverType.id" class="mt-4 pt-4" @click.stop>
                      <label class="block mb-2 text-sm font-medium text-gray-700">Minecraft Version</label>
                      <BaseSelect 
                        v-model="selectedMinecraftVersion"
                        @click.stop
                        size="md"
                      >
                        <option 
                          v-for="version in availableVersions" 
                          :key="version.id"
                          :value="version.id"
                        >
                          {{ version.name }}
                        </option>
                      </BaseSelect>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="flex flex-col gap-4 flex-1 min-w-[300px]">
                <div 
                  v-for="serverType in serverTypes.slice(3, 6)" 
                  :key="serverType.id"
                  class="relative p-6 border border-gray-300 rounded bg-white cursor-pointer transition-all hover:bg-gray-50 overflow-hidden"
                  :class="{ 
                    'border-green-500 bg-green-50': selectedServerType === serverType.id
                  }"
                  @click="selectServerType(serverType.id)"
                >
                  <!-- Corner Triangle with Checkmark -->
                  <div v-if="selectedServerType === serverType.id" class="absolute top-0 right-0">
                    <div class="relative">
                      <div class="absolute top-0 right-0 w-0 h-0 border-t-[32px] border-t-green-500 border-l-[32px] border-l-transparent"></div>
                      <svg xmlns="http://www.w3.org/2000/svg" 
                           class="absolute top-0.5 right-0.5 w-4 h-4 text-white z-10" 
                           viewBox="0 0 24 24" 
                           fill="none" 
                           stroke="currentColor" 
                           stroke-width="3" 
                           stroke-linecap="round" 
                           stroke-linejoin="round">
                        <path d="M5 12l5 5L20 7"/>
                      </svg>
                    </div>
                  </div>
                  <div class="text-center">
                    <div class="mb-4">
                      <img :src="serverType.icon" alt="" class="w-12 h-12 object-contain" />
                    </div>
                    <div class="text-center">
                      <h3 class="m-0 mb-2 text-2xl text-gray-700">{{ serverType.name }}</h3>
                      <div class="flex justify-center gap-2 flex-wrap">
                        <div class="inline-block px-3 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-xl uppercase tracking-wide"
                             :class="{ 'bg-green-500 text-white': selectedServerType === serverType.id }">
                          {{ serverType.label }}
                        </div>
                        <div v-if="serverType.id === 'forge' || serverType.id === 'fabric'" class="inline-block px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-xl uppercase tracking-wide">PRO</div>
                      </div>
                    </div>
                    
                    <div v-if="selectedServerType === serverType.id" class="mt-4 pt-4" @click.stop>
                      <label class="block mb-2 text-sm font-medium text-gray-700">Minecraft Version</label>
                      <BaseSelect 
                        v-model="selectedMinecraftVersion"
                        @click.stop
                        size="md"
                      >
                        <option 
                          v-for="version in availableVersions" 
                          :key="version.id"
                          :value="version.id"
                        >
                          {{ version.name }}
                        </option>
                      </BaseSelect>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div class="mb-8">
            <label class="block mb-2 font-medium text-gray-700">Server Resources</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
              <div 
                v-for="resource in resourceOptions" 
                :key="resource.id"
                class="relative p-6 border border-gray-300 rounded bg-white cursor-pointer transition-all hover:bg-gray-50 overflow-hidden"
                :class="{ 
                  'border-blue-500 bg-blue-50': selectedResource === resource.id,
                  'opacity-50 cursor-not-allowed bg-gray-100': resource.id === 'free' && isFreeDisabled
                }"
                @click="resource.id === 'free' && isFreeDisabled ? null : selectResource(resource.id)"
              >
                <!-- Corner Triangle with Checkmark -->
                <div v-if="selectedResource === resource.id && !(resource.id === 'free' && isFreeDisabled)" class="absolute top-0 right-0">
                  <div class="relative">
                    <div class="absolute top-0 right-0 w-0 h-0 border-t-[32px] border-t-blue-500 border-l-[32px] border-l-transparent"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" 
                         class="absolute top-0.5 right-0.5 w-4 h-4 text-white z-10" 
                         viewBox="0 0 24 24" 
                         fill="none" 
                         stroke="currentColor" 
                         stroke-width="3" 
                         stroke-linecap="round" 
                         stroke-linejoin="round">
                      <path d="M5 12l5 5L20 7"/>
                    </svg>
                  </div>
                </div>
                <div class="flex justify-between items-center mb-4">
                  <h4 class="m-0 text-gray-700 text-lg">{{ resource.name }}</h4>
                  <span class="font-semibold text-blue-500 text-lg">
                    <template v-if="resource.price === 0">FREE</template>
                    <template v-else>€{{ resource.price.toFixed(2) }}/hour</template>
                  </span>
                </div>
                <div class="flex flex-col gap-2">
                  <div class="flex items-center gap-2 text-gray-600 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="flex-shrink-0 text-gray-400">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M18 3a3 3 0 0 1 2.995 2.824l.005 .176v12a3 3 0 0 1 -2.824 2.995l-.176 .005h-12a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-12a3 3 0 0 1 2.824 -2.995l.176 -.005h12zm0 2h-12a1 1 0 0 0 -.993 .883l-.007 .117v9h14v-9a1 1 0 0 0 -.883 -.993l-.117 -.007z" />
                    </svg>
                    {{ resource.ram }}MB RAM
                  </div>
                  <div class="flex items-center gap-2 text-gray-600 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 text-gray-400">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M12 6m-8 0a8 3 0 1 0 16 0a8 3 0 1 0 -16 0" />
                      <path d="M4 6v6a8 3 0 0 0 16 0v-6" />
                      <path d="M4 12v6a8 3 0 0 0 16 0v-6" />
                    </svg>
                    {{ resource.storage }}GB Storage
                  </div>
                  <div class="flex items-center gap-2 text-gray-600 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 text-gray-400">
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

          <div class="flex gap-4 justify-end mt-12 pt-8 border-t border-gray-200">
            <BaseButton to="/servers" size="lg">Cancel</BaseButton>
            <BaseButton 
              variant="success" 
              size="lg"
              :disabled="!canCreateServer"
              @click="createServer"
            >
              Create Server
            </BaseButton>
          </div>
        </fieldset>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from './BaseButton.vue'
import BaseSelect from './BaseSelect.vue'
import BaseInput from './BaseInput.vue'

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
/* All styles converted to Tailwind CSS */

/* Corner triangle styles handled by Tailwind border utilities */

/* Mobile responsive adjustments */
@media (max-width: 768px) {
  .grid-cols-1.sm\:grid-cols-2.lg\:grid-cols-4 {
    grid-template-columns: 1fr;
  }
  
  .flex.gap-4.justify-end {
    flex-direction: column;
  }
  
  .px-6.py-3 {
    width: 100%;
    text-align: center;
  }
}
</style>