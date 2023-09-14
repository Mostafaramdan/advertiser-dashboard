import type { AdsRequestsDetails } from '@/interfaces/AdsRequest'
import { defineStore } from 'pinia'

interface State {
  adsRequestDetails: AdsRequestsDetails | any
}
export const useAdsRequestsStore = defineStore('adsRequests', {
  state: (): State => {
    return {
      adsRequestDetails: null,
    }
  },
  actions: {
    setAdsRequestDetails(payload: any) {
      this.adsRequestDetails = payload
    },
  },
})
