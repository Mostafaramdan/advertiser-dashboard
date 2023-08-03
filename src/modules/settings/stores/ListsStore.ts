import { defineStore } from 'pinia'

export const useListsStore = defineStore('lists', {
  state: () => ({
    categories: []
  }),
  actions: {
    setCategories(value: []): void {
      this.categories = [...value]
    }
  },
  getters: {
    getCategories(state) {
      return state.categories
    }
  }
})
