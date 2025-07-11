import { ref, computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'

const API_BASE = 'http://localhost:3000'

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'customer'
  createdAt: string
  updatedAt: string
}

interface AuthState {
  user: User | null
  token: string | null
}

const token = useLocalStorage<string | null>('auth_token', null)
const user = ref<User | null>(null)

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Login failed')
      }

      const data = await response.json()
      token.value = data.token
      user.value = data.user
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      }
    }
  }

  const register = async (name: string, email: string, password: string, role?: 'admin' | 'customer') => {
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Registration failed')
      }

      const data = await response.json()
      token.value = data.token
      user.value = data.user
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      }
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
  }

  const getCurrentUser = async () => {
    if (!token.value) return

    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token.value}`,
        },
      })

      if (!response.ok) {
        logout()
        return
      }

      const data = await response.json()
      user.value = data.user
    } catch (error) {
      console.error('Failed to get current user:', error)
      logout()
    }
  }

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    if (!token.value) {
      throw new Error('Not authenticated')
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}`,
        ...options.headers,
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        logout()
        throw new Error('Session expired')
      }
      const error = await response.json()
      throw new Error(error.error || 'API call failed')
    }

    return response.json()
  }

  return {
    user: computed(() => user.value),
    token: computed(() => token.value),
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    getCurrentUser,
    apiCall,
  }
}