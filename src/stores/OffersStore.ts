import type { OfferDetails } from '@/modules/offers/interfaces/Offer'
import { defineStore } from 'pinia'

interface State {
  offerDetails: OfferDetails | any
}
export const useOffersStore = defineStore('offers', {
  state: (): State => {
    return {
      offerDetails: null,
    }
  },
  actions: {
    setOfferDetails(payload: any) {
      this.offerDetails = payload
    },
    updateOfferStatus(status: string) {
      this.offerDetails.status = status
    },
  },
})
