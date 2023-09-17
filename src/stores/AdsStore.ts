import type { AdDetails } from '@/interfaces/Ads'
import { defineStore } from 'pinia'

interface State {
  adDetails: AdDetails | any
}
export const useAdsStore = defineStore('ads', {
  state: (): State => {
    return {
      adDetails: null,
    }
  },
  actions: {
    setAdDetails(payload: any) {
      this.adDetails = payload
    },
  },
})
