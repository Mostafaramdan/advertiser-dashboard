import { defineStore } from 'pinia'
interface State {
  adminsList: { id: string; label: string }[]
  proceduresList: { id: string; label: string }[]
}
export const useDisputesStore = defineStore('disputes', {
  state: (): State => {
    return {
      adminsList: [],
      proceduresList: [],
    }
  },
  actions: {
    setAdminsList(adminsList: any) {
      this.adminsList = adminsList
    },
    setProceduresList(proceduresList: any) {
      this.proceduresList = proceduresList
    },
  },
})
