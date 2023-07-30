import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home-page',
      component: HomePage,
      meta: {
        layout: 'default',
      },
    },
    {
      path: '/test-form',
      name: 'test-form',
      component: () => import('@/pages/TestForm.vue'),
      meta: {
        layout: 'default',
      },
    },
    {
      path: '/login',
      name: 'login-page',
      component: () => import('@/pages/LoginPage.vue'),
      meta: {
        layout: 'blank',
      },
    },
    {
      path: '/forget-password',
      name: 'forget-password-page',
      component: () => import('@/pages/ForgetPasswordPage.vue'),
      meta: {
        layout: 'blank',
      },
    },
    {
      path: '/reset-password',
      name: 'reset-password-page',
      component: () => import('@/pages/ResetPasswordPage.vue'),
      meta: {
        layout: 'blank',
      },
    },
  ],
})

// Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards

export default router
