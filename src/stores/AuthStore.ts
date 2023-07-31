const router = useRouter()

interface State {
  authUser: any
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
    getAuthToken(state: any) {
      return state.isAuthUser && state.authUser.token
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
      router.push({ name: 'login-page' })
    },
  },
})
