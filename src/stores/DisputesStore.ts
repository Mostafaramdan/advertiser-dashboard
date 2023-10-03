import { defineStore } from 'pinia'

interface State {
  adminsList: { id: string; label: string }[]
}
export const useDisputesStore = defineStore('disputes', {
  state: (): State => {
    return {
      adminsList: [],
    }
  },
  actions: {
    setAdminsList(adminsList: any) {
      this.adminsList = adminsList
    },
  },
})
