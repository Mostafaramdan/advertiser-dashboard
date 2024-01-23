import type { User } from '@/interfaces/Auth'
import { authService } from '@/services/AuthService'
interface State {
  authUser: User | null
  fcmToken: string | null
}

export const useAuthStore = defineStore('authStore', {
  state: (): State => {
    return {
      authUser: JSON.parse(localStorage.getItem('authUser') as string) || null,
      fcmToken: localStorage.getItem('fcmToken') || null,
    }
  },
  getters: {
    isAuthUser(state): boolean {
      return !!state.authUser
    },
    getToken(state: State) {
      return state.authUser?.token
    },
    selectedApp(state: State) {
      return state.authUser?.selectedApp
    },
    hasPermission(state): (permission: string) => boolean {
      return (permission: string): boolean => {
        return !!state.authUser?.permissions?.includes(permission)
      }
    },
    hasPermissions(state): (permissions: string[]) => boolean {
      return (permissions: string[]): boolean => {
        return permissions.every((permission) => {
          return state.authUser?.permissions?.includes(permission)
        })
      }
    },
    hasAtLeaseOnePermission(state): (permissions: string[]) => boolean {
      return (permissions: string[]) => {
        return permissions.some((permission) => {
          return state.authUser?.permissions?.includes(permission)
        })
      }
    },
  },
  actions: {
    saveUserDataInLocalStorage() {
      localStorage.setItem('authUser', JSON.stringify(this.authUser))
    },
    setAuthUser(user: any) {
      if (user) user.selectedApp = user.apps[0]
      this.authUser = user
      this.saveUserDataInLocalStorage()
    },
    setSelectedApp(app: string) {
      if (!this.authUser) return
      this.authUser.selectedApp = app
      this.saveUserDataInLocalStorage()
    },
    setUserApps(apps: string[]) {
      if (this.authUser) this.authUser.apps = apps
      if (!apps.includes(this.authUser?.selectedApp as string)) this.setSelectedApp(apps[0])
      this.saveUserDataInLocalStorage()
    },
    clearAuthUser() {
      this.authUser = null
      localStorage.removeItem('authUser')
      localStorage.removeItem('fcmToken')
    },
    setUserPermissions(permissions: string[]) {
      if (this.authUser) this.authUser.permissions = permissions
      this.saveUserDataInLocalStorage()
    },
    setFcmToken(fcm_token: string) {
      console.log('fcm_token', fcm_token)
      this.fcmToken = fcm_token
      localStorage.setItem('fcmToken', fcm_token)
      authService.setFcmToken(fcm_token)
    },
    deleteFcmToken() {
      if (!this.fcmToken) return
      authService.deleteFcmToken(this.fcmToken).then(() => {
        localStorage.removeItem('fcmToken')
        this.fcmToken = null
      })
    },
    getPermissions() {
      return new Promise((resolve) => {
        authService.getPermissions().then((res) => {
          const { apps, permissions } = res.data.data

          this.setUserPermissions(permissions)
          this.setUserApps(apps)
          resolve(permissions)
        })
      })
    },
  },
})
