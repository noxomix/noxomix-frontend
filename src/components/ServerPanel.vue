<template>
  <div class="min-h-screen bg-white text-black p-6">
    <header class="flex justify-between items-center mb-6 pb-6 border-b">
      <h1 class="text-3xl font-bold">Server Management Panel</h1>
      <div class="text-right">
        <p class="mb-2">
          <strong>{{ user?.name }}</strong> 
          (<em class="text-gray-600">{{ user?.role }}</em>)
        </p>
        <button @click="handleLogout" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>
    </header>
    
    <main class="max-w-7xl mx-auto">
      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Server Statistics</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="border border-gray-300 p-4 rounded">
            <h3 class="text-lg font-medium mb-2">Status</h3>
            <p class="text-2xl"><strong>🟢 Online</strong></p>
          </div>
          
          <div class="border border-gray-300 p-4 rounded">
            <h3 class="text-lg font-medium mb-2">Users</h3>
            <p class="text-2xl font-bold">{{ users.length }}</p>
          </div>
          
          <div class="border border-gray-300 p-4 rounded">
            <h3 class="text-lg font-medium mb-2">Posts</h3>
            <p class="text-2xl font-bold">{{ posts.length }}</p>
          </div>
          
          <div class="border border-gray-300 p-4 rounded">
            <h3 class="text-lg font-medium mb-2">Uptime</h3>
            <p class="text-2xl font-bold">24h</p>
          </div>
        </div>
      </section>
      
      <section class="mb-8">
        <details open class="border border-gray-300 rounded">
          <summary class="p-4 cursor-pointer hover:bg-gray-50 font-semibold text-xl">
            Users ({{ users.length }})
          </summary>
          <div class="p-4 border-t overflow-x-auto">
            <table class="w-full border-collapse border border-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th class="border border-gray-300 p-2 text-left">ID</th>
                  <th class="border border-gray-300 p-2 text-left">Name</th>
                  <th class="border border-gray-300 p-2 text-left">Email</th>
                  <th class="border border-gray-300 p-2 text-left">Role</th>
                  <th class="border border-gray-300 p-2 text-left">Created</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
                  <td class="border border-gray-300 p-2">{{ user.id }}</td>
                  <td class="border border-gray-300 p-2">{{ user.name }}</td>
                  <td class="border border-gray-300 p-2">{{ user.email }}</td>
                  <td class="border border-gray-300 p-2">
                    <span class="px-2 py-1 rounded text-sm font-medium"
                          :class="user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'">
                      {{ user.role }}
                    </span>
                  </td>
                  <td class="border border-gray-300 p-2">{{ formatDate(user.createdAt) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </details>
      </section>
      
      <section class="mb-8">
        <details open class="border border-gray-300 rounded">
          <summary class="p-4 cursor-pointer hover:bg-gray-50 font-semibold text-xl">
            Posts ({{ posts.length }})
          </summary>
          <div class="p-4 border-t overflow-x-auto">
            <table class="w-full border-collapse border border-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th class="border border-gray-300 p-2 text-left">ID</th>
                  <th class="border border-gray-300 p-2 text-left">Title</th>
                  <th class="border border-gray-300 p-2 text-left">Author</th>
                  <th class="border border-gray-300 p-2 text-left">Created</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="post in posts" :key="post.id" class="hover:bg-gray-50">
                  <td class="border border-gray-300 p-2">{{ post.id }}</td>
                  <td class="border border-gray-300 p-2">{{ post.title }}</td>
                  <td class="border border-gray-300 p-2">{{ getUserName(post.authorId) }}</td>
                  <td class="border border-gray-300 p-2">{{ formatDate(post.createdAt) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </details>
      </section>
    </main>
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

interface Post {
  id: number
  title: string
  content?: string
  authorId: number
  createdAt: string
}

const { user, logout, apiCall } = useAuth()

const users = ref<User[]>([])
const posts = ref<Post[]>([])

const handleLogout = () => {
  logout()
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getUserName = (userId: number) => {
  const user = users.value.find(u => u.id === userId)
  return user?.name || 'Unknown'
}

const loadData = async () => {
  try {
    const [usersData, postsData] = await Promise.all([
      apiCall('/users'),
      apiCall('/posts')
    ])
    
    users.value = usersData
    posts.value = postsData
  } catch (error) {
    console.error('Failed to load data:', error)
  }
}

onMounted(() => {
  loadData()
})
</script>

