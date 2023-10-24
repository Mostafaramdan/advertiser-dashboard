import { defineStore } from 'pinia'
interface State {
  adminsList: { id: string; label: string }[]
}
export const useTicketsStore = defineStore('tickets', {
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
