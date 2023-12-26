import { DisputeRequest } from '@/modules/disputes/interfaces/DisputeRequest'
import { defineStore } from 'pinia'
interface State {
  adsSpaceDetails: DisputeRequest | any
}
export const useAdsSpacesStore = defineStore('disputes', {
  state: (): State => {
    return {
      adsSpaceDetails: null,
    }
  },
  actions: {
    setAdsSpaceDetails(payload: any) {
      this.adsSpaceDetails = payload
    },
  },
})
