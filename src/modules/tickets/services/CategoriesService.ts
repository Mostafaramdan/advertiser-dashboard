import type { AxiosPromise } from 'axios'
import axios from 'axios'
import type { Category, CategoryFormData } from './../interfaces/Category'

class CategoriesService {
  contextPath = 'tickets/categories'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }

  /** **************** post ******************/
  createItem(data: CategoryFormData): AxiosPromise {
    return axios.post(`${this.contextPath}`, data)
  }

  /** **************** put ******************/
  editItem(data: Category): AxiosPromise {
    return axios.put(`${this.contextPath}/${data.id}`, data)
  }

  /** **************** delete ******************/
  deleteItem(id: number): AxiosPromise {
    return axios.delete(`${this.contextPath}/${id}`)
  }
}

export const categoriesService = new CategoriesService()
