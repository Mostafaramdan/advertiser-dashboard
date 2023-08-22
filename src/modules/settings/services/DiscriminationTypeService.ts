import type { AxiosPromise } from 'axios'
import axios from 'axios'
import type { DiscriminationType } from './../interfaces/DiscriminationType'

class DiscriminationTypeService {
  contextPath = 'discrimination_types'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }

  /** **************** post ******************/
  createItem(data: DiscriminationType): AxiosPromise {
    return axios.post(`${this.contextPath}`, data)
  }

  /** **************** put ******************/
  editItem(data: DiscriminationType): AxiosPromise {
    return axios.put(`${this.contextPath}/${data.id}`, data)
  }

  /** **************** delete ******************/
  deleteItem(id: number): AxiosPromise {
    return axios.delete(`${this.contextPath}/${id}`)
  }
}

export const discriminationTypeService = new DiscriminationTypeService()
