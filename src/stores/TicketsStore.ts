import { SupportTicket } from '@/modules/tickets/interfaces/SupportTicket'
import { defineStore } from 'pinia'
interface State {
  adminsList: { id: string; label: string }[]
  ticketBasicData: SupportTicket | any
}
export const useTicketsStore = defineStore('tickets', {
  state: (): State => {
    return {
      adminsList: [],
      ticketBasicData: null,
    }
  },
  actions: {
    setAdminsList(adminsList: any) {
      this.adminsList = adminsList
    },
    setTicketBasicData(payload: any) {
      this.ticketBasicData = payload
    },
    toggleFavorite() {
      this.ticketBasicData.is_starred = !this.ticketBasicData.is_starred
    },
    updateTicketDate() {
      const currentDate = new Date().toString()
      this.ticketBasicData.last_update = currentDate
    },
  },
})
