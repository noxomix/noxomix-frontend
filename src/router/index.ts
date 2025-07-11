import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import LoginForm from '../components/LoginForm.vue'
import AppLayout from '../components/AppLayout.vue'
import Servers from '../components/Servers.vue'
import ServerManage from '../components/ServerManage.vue'
import UserManagement from '../components/UserManagement.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginForm,
    meta: { requiresGuest: true }
  },
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/servers'
      },
      {
        path: 'servers',
        name: 'Servers',
        component: Servers
      },
      {
        path: 'server/:id/manage',
        name: 'ServerManage',
        component: ServerManage
      },
      {
        path: 'users',
        name: 'UserManagement',
        component: UserManagement,
        meta: { requiresAdmin: true }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const { isAuthenticated, getCurrentUser, token, user } = useAuth()
  
  // If we have a token but no user data, try to restore the user
  if (token.value && !isAuthenticated.value) {
    await getCurrentUser()
  }
  
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next('/login')
  } else if (to.meta.requiresGuest && isAuthenticated.value) {
    next('/servers')
  } else if (to.meta.requiresAdmin && (!isAuthenticated.value || user.value?.role !== 'admin')) {
    // Redirect non-admin users away from admin routes
    next('/servers')
  } else {
    next()
  }
})

export default router