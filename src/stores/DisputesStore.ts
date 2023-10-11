import { DisputeRequest } from '@/modules/disputes/interfaces/DisputeRequest'
import { defineStore } from 'pinia'
interface State {
  adminsList: { id: string; label: string }[]
  proceduresList: { id: string; label: string }[]
  requestDetails: DisputeRequest | any
}
export const useDisputesStore = defineStore('disputes', {
  state: (): State => {
    return {
      adminsList: [],
      proceduresList: [],
      requestDetails: null,
    }
  },
  actions: {
    setAdminsList(adminsList: any) {
      this.adminsList = adminsList
    },
    setProceduresList(proceduresList: any) {
      this.proceduresList = proceduresList
    },
    setRequestDetails(payload: any) {
      this.requestDetails = payload
    },
  },
})
