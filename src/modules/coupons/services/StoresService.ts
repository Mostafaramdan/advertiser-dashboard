import type { AxiosPromise } from 'axios'
import axios from 'axios'
import type { Store } from './../interfaces/Store'

class StoresService {
  contextPath = 'stores'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }

  /** **************** post ******************/
  createItem(data: Store): AxiosPromise {
    return axios.post(`${this.contextPath}`, data)
  }

  /** **************** put ******************/
  editItem(data: Store): AxiosPromise {
    return axios.put(`${this.contextPath}/${data.id}`, data)
  }

  /** **************** delete ******************/
  deleteItem(id: number): AxiosPromise {
    return axios.delete(`${this.contextPath}/${id}`)
  }
}

export const storesService = new StoresService()
