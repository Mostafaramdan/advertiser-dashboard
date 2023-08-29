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
    getToken(state: State) {
      return state.authUser?.token
    },
    hasPermission(state): (permission: string) => boolean {
      return (permission: string): boolean => {
        return !!state.authUser?.permissions?.actions?.includes(permission)
      }
    },
    hasPermissions(state): (permissions: string[]) => boolean {
      return (permissions: string[]): boolean => {
        return permissions.every(permission => {
          return state.authUser?.permissions?.actions.includes(permission)
        })
      }
    },
    hasAtLeaseOnePermission(state): (permissions: string[]) => boolean {
      return (permissions: string[]) => {
        return permissions.some(permission => {
          return state.authUser?.permissions?.actions.includes(permission)
        })
      }
    },
    canAccessPage(state): (page: string) => boolean {
      return (page: string) => {
        return !!state.authUser?.permissions?.accessible_pages.includes(page)
      }
    },
    canAccessAtLeastOnePage(state): (pages: string[]) => boolean {
      return (pages: string[]) => {
        return pages.some(page => {
          return state.authUser?.permissions?.accessible_pages.includes(page)
        })
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
