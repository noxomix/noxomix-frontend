<template>
  <div class="min-h-screen">
    <div class="p-8 max-w-7xl mx-auto">
      <div class="mb-8">
        <div class="flex items-center gap-4 mb-4">
          <BaseButton variant="ghost" size="sm" @click="$router.push('/admin/domains')" title="Back to Domains">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M15 6l-6 6l6 6" />
            </svg>
            Back to Domains
          </BaseButton>
        </div>
        
        <h2 class="flex items-center gap-2 text-2xl font-semibold text-gray-900">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
            <path d="M3 9h18" />
            <path d="M9 3v18" />
          </svg>
          Subdomain Management
        </h2>
        <p v-if="domain" class="text-gray-600 mt-2">
          Managing subdomains for <strong>{{ domain.name }}</strong>
        </p>
      </div>

      <div class="flex items-center justify-between gap-4 mb-8">
        <div class="relative w-[300px]">
          <BaseInput 
            type="text" 
            class="pr-10" 
            placeholder="Search subdomains..." 
            v-model="searchQuery"
            @input="debouncedSearch"
            size="lg"
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
            <path d="M21 21l-6 -6" />
          </svg>
        </div>

        <div class="flex gap-2">
          <BaseSelect v-model="sortBy" @change="loadSubdomains" size="lg">
            <option value="createdAt">Created Date</option>
            <option value="content">Subdomain</option>
            <option value="enabled">Status</option>
            <option value="updatedAt">Updated Date</option>
          </BaseSelect>
          <BaseSelect v-model="sortOrder" @change="loadSubdomains" size="lg">
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </BaseSelect>
        </div>

        <BaseButton variant="slate" @click="showAddDialog = true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Add Subdomain
        </BaseButton>
      </div>

      <div class="bg-white border border-gray-300 rounded min-h-[400px]">
        <div v-if="loading" class="flex items-center justify-center gap-3 p-16 text-gray-600">
          <div class="w-5 h-5 border-2 border-transparent border-t-gray-600 rounded-full animate-spin"></div>
          <span>Loading subdomains...</span>
        </div>
        
        <div v-else-if="error" class="text-center p-16 text-red-500">
          {{ error }}
        </div>
        
        <div v-else-if="subdomains.length === 0" class="text-center p-16">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400 mb-4 mx-auto">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
            <path d="M3 9h18" />
            <path d="M9 3v18" />
          </svg>
          <h3 class="text-gray-700 m-0 mb-2 text-2xl">No subdomains found</h3>
          <p class="text-gray-600 m-0">{{ searchQuery ? 'Try adjusting your search terms.' : 'No subdomains have been added yet.' }}</p>
        </div>

        <div v-else>
          <div class="overflow-x-auto">
            <table class="w-full border-collapse">
              <thead>
                <tr>
                  <th class="bg-gray-100 font-normal text-left py-3 px-4 text-sm text-gray-600 border-b border-gray-200">ID</th>
                  <th class="bg-gray-100 font-normal text-left py-3 px-4 text-sm text-gray-600 border-b border-gray-200">Subdomain</th>
                  <th class="bg-gray-100 font-normal text-left py-3 px-4 text-sm text-gray-600 border-b border-gray-200">IPv4</th>
                  <th class="bg-gray-100 font-normal text-left py-3 px-4 text-sm text-gray-600 border-b border-gray-200">IPv6</th>
                  <th class="bg-gray-100 font-normal text-left py-3 px-4 text-sm text-gray-600 border-b border-gray-200">IPv4 Record ID</th>
                  <th class="bg-gray-100 font-normal text-left py-3 px-4 text-sm text-gray-600 border-b border-gray-200">IPv6 Record ID</th>
                  <th class="bg-gray-100 font-normal text-left py-3 px-4 text-sm text-gray-600 border-b border-gray-200">Status</th>
                  <th class="bg-gray-100 font-normal text-left py-3 px-4 text-sm text-gray-600 border-b border-gray-200">Created</th>
                  <th class="bg-gray-100 font-normal text-left py-3 px-4 text-sm text-gray-600 border-b border-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="subdomain in subdomains" :key="subdomain.id" class="hover:bg-gray-50">
                  <td class="py-3 px-4 border-b border-gray-100 text-gray-600 text-sm">{{ subdomain.id }}</td>
                  <td class="py-3 px-4 border-b border-gray-100 font-medium text-gray-700">{{ subdomain.content }}</td>
                  <td class="py-3 px-4 border-b border-gray-100 text-gray-600 text-sm">{{ subdomain.ipv4 || '-' }}</td>
                  <td class="py-3 px-4 border-b border-gray-100 text-gray-600 text-sm">{{ subdomain.ipv6 || '-' }}</td>
                  <td class="py-3 px-4 border-b border-gray-100 text-gray-600 text-sm text-center">{{ subdomain.ipv4RecordId || '-' }}</td>
                  <td class="py-3 px-4 border-b border-gray-100 text-gray-600 text-sm text-center">{{ subdomain.ipv6RecordId || '-' }}</td>
                  <td class="py-3 px-4 border-b border-gray-100">
                    <span :class="[
                      'inline-block px-2 py-1 rounded-sm text-xs font-medium capitalize',
                      subdomain.enabled ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
                    ]">
                      {{ subdomain.enabled ? 'Enabled' : 'Disabled' }}
                    </span>
                  </td>
                  <td class="py-3 px-4 border-b border-gray-100 text-gray-600 text-sm">{{ formatDate(subdomain.createdAt) }}</td>
                  <td class="py-3 px-4 border-b border-gray-100 flex gap-2">
                    <BaseButton @click="editSubdomain(subdomain)" variant="primary" size="sm" title="Edit">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
                        <path d="M13.5 6.5l4 4" />
                      </svg>
                    </BaseButton>
                    <BaseButton 
                      @click="deleteSubdomain(subdomain)" 
                      variant="danger" 
                      size="sm" 
                      :title="subdomain.enabled ? 'Cannot delete enabled subdomain' : 'Delete'"
                      :disabled="subdomain.enabled"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M4 7l16 0" />
                        <path d="M10 11l0 6" />
                        <path d="M14 11l0 6" />
                        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                      </svg>
                    </BaseButton>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="flex justify-between items-center p-4 border-t border-gray-200 bg-gray-50" v-if="pagination.totalPages > 1">
            <BaseButton 
              variant="secondary"
              size="sm"
              :disabled="!pagination.hasPrevPage"
              @click="changePage(pagination.page - 1)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M15 6l-6 6l6 6" />
              </svg>
              Previous
            </BaseButton>

            <div class="flex flex-col items-center gap-1">
              <span>Page {{ pagination.page }} of {{ pagination.totalPages }}</span>
              <span class="text-xs text-gray-600">({{ pagination.totalSubdomains }} subdomains total)</span>
            </div>

            <BaseButton 
              variant="secondary"
              size="sm"
              :disabled="!pagination.hasNextPage"
              @click="changePage(pagination.page + 1)"
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M9 6l6 6l-6 6" />
              </svg>
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Subdomain Dialog -->
    <SubdomainDialog 
      v-if="showAddDialog || editingSubdomain"
      :subdomain="editingSubdomain"
      :domain="domain"
      @save="saveSubdomain"
      @close="closeDialog"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import SubdomainDialog from './SubdomainDialog.vue'
import BaseButton from './BaseButton.vue'
import BaseInput from './BaseInput.vue'
import BaseSelect from './BaseSelect.vue'

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

interface Pagination {
  page: number
  limit: number
  totalSubdomains: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

const route = useRoute()
const { apiCall } = useAuth()

const subdomains = ref<Subdomain[]>([])
const domain = ref<Domain | null>(null)
const loading = ref(true)
const error = ref('')
const searchQuery = ref('')
const sortBy = ref('createdAt')
const sortOrder = ref('desc')
const showAddDialog = ref(false)
const editingSubdomain = ref<Subdomain | null>(null)
const pagination = ref<Pagination>({
  page: 1,
  limit: 10,
  totalSubdomains: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPrevPage: false,
})

const domainId = parseInt(route.params.domainId as string)

const loadSubdomains = async (page: number = 1) => {
  try {
    loading.value = true
    error.value = ''
    
    const params = new URLSearchParams({
      page: page.toString(),
      limit: pagination.value.limit.toString(),
      search: searchQuery.value,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value,
    })
    
    const response = await apiCall(`/api/admin/domains/${domainId}/subdomains?${params}`)
    subdomains.value = response.subdomains
    domain.value = response.domain
    pagination.value = response.pagination
  } catch (err: any) {
    console.error('Failed to load subdomains:', err)
    if (err.message?.includes('403') || err.message?.includes('Admin access required')) {
      error.value = 'Admin access required to view subdomain management'
    } else if (err.message?.includes('404')) {
      error.value = 'Domain not found'
    } else {
      error.value = 'Failed to load subdomains'
    }
  } finally {
    loading.value = false
  }
}

const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    loadSubdomains(page)
  }
}

// Debounced search
let searchTimeout: number
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadSubdomains(1) // Reset to first page on search
  }, 500)
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const editSubdomain = (subdomain: Subdomain) => {
  editingSubdomain.value = subdomain
}

const deleteSubdomain = async (subdomain: Subdomain) => {
  if (subdomain.enabled) {
    alert('Cannot delete enabled subdomains. Please disable the subdomain first.')
    return
  }

  if (!confirm(`Are you sure you want to delete the subdomain "${subdomain.content}"?`)) {
    return
  }

  try {
    await apiCall(`/api/admin/subdomains/${subdomain.id}`, {
      method: 'DELETE'
    })
    await loadSubdomains(pagination.value.page)
    alert('Subdomain deleted successfully')
  } catch (err) {
    console.error('Failed to delete subdomain:', err)
    alert('Failed to delete subdomain')
  }
}

const saveSubdomain = async (subdomainData: Partial<Subdomain>) => {
  try {
    if (editingSubdomain.value) {
      // Update existing subdomain
      await apiCall(`/api/admin/subdomains/${editingSubdomain.value.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subdomainData)
      })
    } else {
      // Create new subdomain
      await apiCall(`/api/admin/domains/${domainId}/subdomains`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subdomainData)
      })
    }
    
    const isUpdate = !!editingSubdomain.value
    closeDialog()
    await loadSubdomains(pagination.value.page)
    alert(isUpdate ? 'Subdomain updated successfully' : 'Subdomain created successfully')
  } catch (err: any) {
    console.error('Failed to save subdomain:', err)
    throw err // Re-throw to be handled by the dialog
  }
}

const closeDialog = () => {
  showAddDialog.value = false
  editingSubdomain.value = null
}

onMounted(() => {
  if (isNaN(domainId)) {
    error.value = 'Invalid domain ID'
    loading.value = false
    return
  }
  loadSubdomains()
})
</script>

<style scoped>
/* Using Tailwind CSS v4 - all styles are now in the template */
</style>