<template>
  <div class="login-container">
    <div class="login-form">
      <h1>CheapSheep</h1>
      
      <form @submit.prevent="handleSubmit">
        <fieldset :disabled="loading">
          <legend>Login</legend>
          
          <div class="form-group">
            <label for="email">Email:</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              size="30"
              placeholder="Enter your email"
            />
          </div>
          
          <div class="form-group">
            <label for="password">Password:</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              size="30"
              placeholder="Enter your password"
            />
          </div>
          
          <button type="submit" :disabled="loading">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </fieldset>
        
        <div v-if="error" class="form-group">
          <strong>Error:</strong> {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'

const { login, register } = useAuth()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const showRegister = ref(false)
const registerForm = ref({
  name: '',
  email: '',
  password: '',
  role: 'customer' as 'admin' | 'customer'
})
const registerLoading = ref(false)
const registerError = ref('')

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  
  const result = await login(email.value, password.value)
  
  if (!result.success) {
    error.value = result.error || 'Login failed'
  }
  
  loading.value = false
}

const handleRegister = async () => {
  registerLoading.value = true
  registerError.value = ''
  
  const result = await register(
    registerForm.value.name,
    registerForm.value.email,
    registerForm.value.password,
    registerForm.value.role
  )
  
  if (result.success) {
    showRegister.value = false
  } else {
    registerError.value = result.error || 'Registration failed'
  }
  
  registerLoading.value = false
}
</script>

