import { defineStore } from 'pinia'

interface State {
  categoriesList: { id: string; label: string }[]
  storesList: { id: string; label: string; image_path: string }[]
}
export const useCouponsStore = defineStore('coupons', {
  state: (): State => {
    return {
      categoriesList: [],
      storesList: [],
    }
  },
  actions: {
    setCategoriesList(categoriesList: any) {
      this.categoriesList = categoriesList
    },
    setStoresList(storesList: any) {
      this.storesList = storesList
    },
  },
})
