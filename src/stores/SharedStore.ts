import { defineStore } from 'pinia'

interface State {
  loading: boolean
}
export const useSharedStore = defineStore('shared', {
  state: (): State => {
    return {
      loading: false,
    }
  },
  actions: {
    setLoading(value: boolean) {
      this.loading = value
    },
  },
})
