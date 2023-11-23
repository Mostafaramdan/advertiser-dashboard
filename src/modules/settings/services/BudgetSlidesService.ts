import type { AxiosPromise } from 'axios'
import axios from 'axios'
import type { BudgetSlide, BudgetSlideBase } from './../interfaces/BudgetSlide'

class BudgetSlidesService {
  contextPath = 'budget_slides'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }

  /** **************** post ******************/
  createItem(data: BudgetSlideBase): AxiosPromise {
    return axios.post(`${this.contextPath}`, data)
  }

  /** **************** put ******************/
  editItem(data: BudgetSlide): AxiosPromise {
    return axios.put(`${this.contextPath}/${data.id}`, data)
  }

  /** **************** delete ******************/
  deleteItem(id: number): AxiosPromise {
    return axios.delete(`${this.contextPath}/${id}`)
  }
}

export const budgetSlidesService = new BudgetSlidesService()
