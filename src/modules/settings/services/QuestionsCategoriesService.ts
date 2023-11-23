import type { AxiosPromise } from 'axios'
import axios from 'axios'
import type { QuestionCategory, QuestionCategoryBase } from './../interfaces/QuestionCategory'

class QuestionsCategoriesService {
  contextPath = 'support_categories'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }

  /** **************** post ******************/
  createItem(data: QuestionCategoryBase): AxiosPromise {
    return axios.post(`${this.contextPath}`, data)
  }

  /** **************** put ******************/
  editItem(data: QuestionCategory): AxiosPromise {
    return axios.put(`${this.contextPath}/${data.id}`, data)
  }

  /** **************** delete ******************/
  deleteItem(id: number): AxiosPromise {
    return axios.delete(`${this.contextPath}/${id}`)
  }
}

export const questionsCategoriesService = new QuestionsCategoriesService()
