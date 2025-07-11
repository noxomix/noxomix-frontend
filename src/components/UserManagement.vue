<template>
  <div class="user-management">
    <div class="main-content">
      <div class="header">
        <h2>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-users">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
            <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
          </svg>
          User Management
        </h2>
      </div>

      <div class="controls">
        <div class="search-container">
          <input 
            type="text" 
            class="search-input" 
            placeholder="Search users by name or email..." 
            v-model="searchQuery"
            @input="debouncedSearch"
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
            <path d="M21 21l-6 -6" />
          </svg>
        </div>

        <div class="sort-container">
          <select v-model="sortBy" @change="loadUsers" class="sort-select">
            <option value="createdAt">Created Date</option>
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="role">Role</option>
            <option value="updatedAt">Updated Date</option>
          </select>
          <select v-model="sortOrder" @change="loadUsers" class="sort-select">
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      <div class="users-container">
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <span>Loading users...</span>
        </div>
        
        <div v-else-if="error" class="error-state">
          {{ error }}
        </div>
        
        <div v-else-if="users.length === 0" class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="empty-icon">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
            <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
          </svg>
          <h3>No users found</h3>
          <p>{{ searchQuery ? 'Try adjusting your search terms.' : 'No users are registered yet.' }}</p>
        </div>

        <div v-else>
          <div class="users-table-container">
            <table class="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created</th>
                  <th>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id" class="user-row">
                  <td class="user-id">{{ user.id }}</td>
                  <td class="user-name">{{ user.name }}</td>
                  <td class="user-email">{{ user.email }}</td>
                  <td class="user-role">
                    <span :class="['role-badge', `role-${user.role}`]">
                      {{ user.role }}
                    </span>
                  </td>
                  <td class="user-created">{{ formatDate(user.createdAt) }}</td>
                  <td class="user-updated">{{ formatDate(user.updatedAt) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="pagination" v-if="pagination.totalPages > 1">
            <button 
              class="pagination-button" 
              :disabled="!pagination.hasPrevPage"
              @click="changePage(pagination.page - 1)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M15 6l-6 6l6 6" />
              </svg>
              Previous
            </button>

            <div class="pagination-info">
              <span>Page {{ pagination.page }} of {{ pagination.totalPages }}</span>
              <span class="user-count">({{ pagination.totalUsers }} users total)</span>
            </div>

            <button 
              class="pagination-button" 
              :disabled="!pagination.hasNextPage"
              @click="changePage(pagination.page + 1)"
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M9 6l6 6l-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'customer'
  createdAt: string
  updatedAt: string
}

interface Pagination {
  page: number
  limit: number
  totalUsers: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

const users = ref<User[]>([])
const loading = ref(true)
const error = ref('')
const searchQuery = ref('')
const sortBy = ref('createdAt')
const sortOrder = ref('desc')
const pagination = ref<Pagination>({
  page: 1,
  limit: 10,
  totalUsers: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPrevPage: false,
})

const { apiCall } = useAuth()

const loadUsers = async (page: number = 1) => {
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
    
    const response = await apiCall(`/api/admin/users?${params}`)
    users.value = response.users
    pagination.value = response.pagination
  } catch (err: any) {
    console.error('Failed to load users:', err)
    if (err.message?.includes('403') || err.message?.includes('Admin access required')) {
      error.value = 'Admin access required to view user management'
    } else {
      error.value = 'Failed to load users'
    }
  } finally {
    loading.value = false
  }
}

const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    loadUsers(page)
  }
}

// Debounced search
let searchTimeout: number
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadUsers(1) // Reset to first page on search
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

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.user-management {
}

.main-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  align-items: center;
}

.search-container {
  position: relative;
  flex: 1;
  min-width: 250px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
}

.search-input:focus {
  border-color: #999;
}

.search-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  pointer-events: none;
}

.sort-container {
  display: flex;
  gap: 0.5rem;
}

.sort-select {
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  background: white;
}

.sort-select:focus {
  border-color: #999;
}

.users-container {
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-height: 400px;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 4rem;
  color: #666;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid #666;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error-state {
  text-align: center;
  padding: 4rem;
  color: #ef4444;
  font-style: italic;
}

.empty-state {
  text-align: center;
  padding: 4rem;
  color: #666;
}

.empty-icon {
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  color: #333;
}

.empty-state p {
  margin: 0;
  opacity: 0.8;
}

.users-table-container {
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th {
  background: #f5f5f5;
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #ccc;
  font-weight: 500;
  font-size: 14px;
  color: #333;
}

.users-table td {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
}

.user-row:hover {
  background: #f9f9f9;
}

.user-id {
  font-weight: 500;
  color: #666;
  width: 80px;
}

.user-name {
  font-weight: 500;
  color: #333;
}

.user-email {
  color: #666;
}

.role-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.role-admin {
  background: #fef3c7;
  color: #92400e;
}

.role-customer {
  background: #e0f2fe;
  color: #0369a1;
}

.user-created,
.user-updated {
  color: #666;
  white-space: nowrap;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
}

.pagination-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.pagination-button:hover:not(:disabled) {
  background: #f5f5f5;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  text-align: center;
  color: #666;
  font-size: 14px;
}

.user-count {
  display: block;
  margin-top: 0.25rem;
  font-size: 12px;
  opacity: 0.8;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }
  
  .controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-container {
    min-width: 100%;
  }
  
  .sort-container {
    justify-content: space-between;
  }
  
  .sort-select {
    flex: 1;
  }
  
  .users-table th,
  .users-table td {
    padding: 0.75rem 0.5rem;
  }
  
  .pagination {
    flex-direction: column;
    gap: 1rem;
  }
  
  .pagination-button {
    width: 100%;
    justify-content: center;
  }
}
</style>