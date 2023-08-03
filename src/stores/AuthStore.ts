import type { User } from '@/interfaces/Auth'

interface State {
  authUser: User | null
}

export const useAuthStore = defineStore('authStore', {
  state: (): State => {
    return {
      authUser: JSON.parse(localStorage.getItem('authUser') as string) || null,
    }
  },
  getters: {
    isAuthUser(state): boolean {
      return !!state.authUser
    },
    getToken(state: any) {
      return state.authUser?.token
    },
    hasPermission(state) {
      return (permission: string) => {
        return state.authUser?.permissions?.actions.includes(permission)
      }
    },
    hasPermissions(state) {
      return (permissions: string[]) => {
        return permissions.every(permission => {
          return state.authUser?.permissions?.actions.includes(permission)
        })
      }
    },
    hasAtLeaseOnePermission(state) {
      return (permissions: string[]) => {
        return permissions.some(permission => {
          return state.authUser?.permissions?.actions.includes(permission)
        })
      }
    },
    canAccessPage(state) {
      return (page: string) => {
        return state.authUser?.permissions?.accessible_pages.includes(page)
      }
    },
  },
  actions: {
    setAuthUser(user: any) {
      this.authUser = user
      localStorage.setItem('authUser', JSON.stringify(user))
    },
    clearAuthUser() {
      this.authUser = null
      localStorage.removeItem('authUser')
    },
    setUserPermissions(permissions: any) {
      if (this.authUser)
        this.authUser.permissions = permissions
    },
  },
})
