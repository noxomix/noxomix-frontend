<template>
  <div class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[1000] p-4" @click="$emit('close')">
    <div class="relative bg-white rounded-lg w-[90%] max-w-[600px] max-h-[90vh] overflow-y-auto shadow-[0_20px_25px_-5px_rgb(0_0_0_/_0.1)]" @click.stop>
      <div class="p-6 border-b border-gray-200">
        <h3 class="m-0 text-2xl font-semibold text-gray-900 pr-8">{{ subdomain ? 'Edit Subdomain' : 'Add New Subdomain' }}</h3>
        <BaseButton variant="ghost" size="sm" class="absolute top-6 right-6 !p-1" @click="$emit('close')">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </BaseButton>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6">
        <div class="mb-6" v-if="!subdomain">
          <label for="subdomain-prefix" class="block mb-2 text-sm font-medium text-gray-700">Subdomain Prefix *</label>
          <div class="flex items-center gap-2">
            <BaseInput
              id="subdomain-prefix"
              v-model="formData.subdomainPrefix"
              type="text"
              placeholder="mc"
              required
              size="lg"
              class="flex-1"
            />
            <span class="text-gray-600 font-medium">.{{ domain?.name || 'example.com' }}</span>
          </div>
          <span class="block mt-1.5 text-xs text-gray-500">
            Enter only the subdomain part (e.g., "mc" for mc.{{ domain?.name || 'example.com' }})
          </span>
        </div>

        <div class="mb-6" v-else>
          <label class="block mb-2 text-sm font-medium text-gray-700">Subdomain</label>
          <div class="px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-medium">
            {{ formData.content }}
          </div>
          <span class="block mt-1.5 text-xs text-gray-500">
            Subdomain cannot be changed after creation
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label for="ipv4" class="block mb-2 text-sm font-medium text-gray-700">IPv4 Address</label>
            <BaseInput
              id="ipv4"
              v-model="formData.ipv4"
              type="text"
              placeholder="192.168.1.1"
              size="lg"
            />
            <span class="block mt-1.5 text-xs text-gray-500">Optional: IPv4 address for this subdomain</span>
          </div>

          <div>
            <label for="ipv6" class="block mb-2 text-sm font-medium text-gray-700">IPv6 Address</label>
            <BaseInput
              id="ipv6"
              v-model="formData.ipv6"
              type="text"
              placeholder="2001:db8::1"
              size="lg"
            />
            <span class="block mt-1.5 text-xs text-gray-500">Optional: IPv6 address for this subdomain</span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label for="ipv4-record-id" class="block mb-2 text-sm font-medium text-gray-700">IPv4 Record ID</label>
            <BaseInput
              id="ipv4-record-id"
              v-model="formData.ipv4RecordId"
              type="text"
              placeholder="Optional Record ID"
              size="lg"
            />
            <span class="block mt-1.5 text-xs text-gray-500">Optional: Bunny CDN IPv4 record ID</span>
          </div>

          <div>
            <label for="ipv6-record-id" class="block mb-2 text-sm font-medium text-gray-700">IPv6 Record ID</label>
            <BaseInput
              id="ipv6-record-id"
              v-model="formData.ipv6RecordId"
              type="text"
              placeholder="Optional Record ID"
              size="lg"
            />
            <span class="block mt-1.5 text-xs text-gray-500">Optional: Bunny CDN IPv6 record ID</span>
          </div>
        </div>

        <div class="mb-6">
          <label class="block mb-2 text-sm font-medium text-gray-700">Status</label>
          <BaseToggle
            v-model="formData.enabled"
            label="Subdomain enabled"
            color="green"
          />
          <span class="block mt-1.5 text-xs text-gray-500">
            {{ formData.enabled ? 'Subdomain is active and accessible' : 'Subdomain is disabled' }}
          </span>
        </div>

        <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm mb-4">
          {{ error }}
        </div>

        <div class="flex gap-3 justify-end pt-4 mt-6 border-t border-gray-200">
          <BaseButton type="button" variant="secondary" @click="$emit('close')">
            Cancel
          </BaseButton>
          <BaseButton type="submit" variant="success" :disabled="saving" :loading="saving">
            {{ saving ? 'Saving...' : (subdomain ? 'Update Subdomain' : 'Add Subdomain') }}
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import BaseButton from './BaseButton.vue'
import BaseInput from './BaseInput.vue'
import BaseToggle from './BaseToggle.vue'

interface Domain {
  id: number
  name: string
  bunnyId?: number | null
  enabled: 'enabled' | 'disabled'
  createdAt: string
  updatedAt: string
}

interface Subdomain {
  id: number
  domainId: number
  content: string
  ipv4?: string | null
  ipv6?: string | null
  ipv4RecordId?: number | null
  ipv6RecordId?: number | null
  enabled: boolean
  createdAt: string
  updatedAt: string
}

interface Props {
  subdomain?: Subdomain | null
  domain?: Domain | null
}

const props = defineProps<Props>()
const emit = defineEmits(['save', 'close'])

const formData = reactive({
  content: '',
  subdomainPrefix: '',
  ipv4: '',
  ipv6: '',
  ipv4RecordId: '',
  ipv6RecordId: '',
  enabled: true
})

const saving = ref(false)
const error = ref('')

// Initialize form data when subdomain prop changes
watch(() => props.subdomain, (newSubdomain) => {
  if (newSubdomain) {
    formData.content = newSubdomain.content
    // Extract subdomain prefix for display (not editable in edit mode)
    if (props.domain && newSubdomain.content.endsWith('.' + props.domain.name)) {
      formData.subdomainPrefix = newSubdomain.content.slice(0, -(props.domain.name.length + 1))
    } else {
      formData.subdomainPrefix = newSubdomain.content
    }
    formData.ipv4 = newSubdomain.ipv4 || ''
    formData.ipv6 = newSubdomain.ipv6 || ''
    formData.ipv4RecordId = newSubdomain.ipv4RecordId ? newSubdomain.ipv4RecordId.toString() : ''
    formData.ipv6RecordId = newSubdomain.ipv6RecordId ? newSubdomain.ipv6RecordId.toString() : ''
    formData.enabled = newSubdomain.enabled
  } else {
    formData.content = ''
    formData.subdomainPrefix = ''
    formData.ipv4 = ''
    formData.ipv6 = ''
    formData.ipv4RecordId = ''
    formData.ipv6RecordId = ''
    formData.enabled = true
  }
  error.value = ''
  saving.value = false
}, { immediate: true })

const validateIPv4 = (ip: string): boolean => {
  if (!ip) return true // Optional field
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  return ipv4Regex.test(ip)
}

const validateIPv6 = (ip: string): boolean => {
  if (!ip) return true // Optional field
  // Simplified IPv6 validation - supports full format and ::1, ::
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$|^([0-9a-fA-F]{1,4}:){1,7}:$|^:([0-9a-fA-F]{1,4}:){1,7}$/
  return ipv6Regex.test(ip)
}

const validateSubdomain = (content: string): boolean => {
  if (!content) return false
  const subdomainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/
  return subdomainRegex.test(content)
}

const handleSubmit = async () => {
  error.value = ''
  saving.value = true

  try {
    let fullSubdomain = ''
    
    if (props.subdomain) {
      // Editing existing subdomain - use the stored content
      fullSubdomain = formData.content
    } else {
      // Creating new subdomain - construct from prefix
      if (!formData.subdomainPrefix.trim()) {
        error.value = 'Subdomain prefix is required'
        saving.value = false
        return
      }
      
      // Validate subdomain prefix format (no dots, valid characters)
      const prefixRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/
      if (!prefixRegex.test(formData.subdomainPrefix.trim())) {
        error.value = 'Invalid subdomain prefix. Use only letters, numbers and hyphens (not at start/end)'
        saving.value = false
        return
      }
      
      if (!props.domain) {
        error.value = 'Domain information missing'
        saving.value = false
        return
      }
      
      // Construct full subdomain
      fullSubdomain = `${formData.subdomainPrefix.trim()}.${props.domain.name}`.toLowerCase()
    }

    // Validate full subdomain format
    if (!validateSubdomain(fullSubdomain)) {
      error.value = 'Invalid subdomain format'
      saving.value = false
      return
    }

    // Validate IPv4 if provided
    if (formData.ipv4.trim() && !validateIPv4(formData.ipv4.trim())) {
      error.value = 'Invalid IPv4 address format'
      saving.value = false
      return
    }

    // Validate IPv6 if provided
    if (formData.ipv6.trim() && !validateIPv6(formData.ipv6.trim())) {
      error.value = 'Invalid IPv6 address format'
      saving.value = false
      return
    }

    // Prepare record IDs
    let ipv4RecordId: number | null = null
    if (formData.ipv4RecordId.trim() !== '') {
      const parsedId = parseInt(formData.ipv4RecordId.trim())
      if (isNaN(parsedId) || parsedId < 1) {
        error.value = 'IPv4 Record ID must be a positive integer or left empty'
        saving.value = false
        return
      }
      ipv4RecordId = parsedId
    }

    let ipv6RecordId: number | null = null
    if (formData.ipv6RecordId.trim() !== '') {
      const parsedId = parseInt(formData.ipv6RecordId.trim())
      if (isNaN(parsedId) || parsedId < 1) {
        error.value = 'IPv6 Record ID must be a positive integer or left empty'
        saving.value = false
        return
      }
      ipv6RecordId = parsedId
    }

    const saveData: any = {
      ipv4: formData.ipv4.trim() || null,
      ipv6: formData.ipv6.trim() || null,
      ipv4RecordId: ipv4RecordId,
      ipv6RecordId: ipv6RecordId,
      enabled: formData.enabled
    }

    // Only send content field for new subdomains, not updates
    if (!props.subdomain) {
      saveData.content = formData.subdomainPrefix.trim().toLowerCase()
    }

    await emit('save', saveData)
  } catch (err: any) {
    console.error('Failed to save subdomain:', err)
    if (err.response) {
      const errorData = await err.response.json()
      error.value = errorData.error || 'Failed to save subdomain'
    } else {
      error.value = 'Failed to save subdomain. Please try again.'
    }
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
/* Using Tailwind CSS v4 - all styles are now in the template */
</style>