import type { AxiosPromise } from 'axios'
import axios from 'axios'
import type { Distance, DistanceBase } from '../interfaces/Distance'

class ViewsPricesService {
  contextPath = 'entities'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }

  /** **************** post ******************/
  createItem(data: DistanceBase): AxiosPromise {
    return axios.post(`${this.contextPath}`, data)
  }

  /** **************** put ******************/
  editItem(data: Distance): AxiosPromise {
    return axios.put(`${this.contextPath}/${data.id}`, data)
  }

  /** **************** delete ******************/
  deleteItem(id: number): AxiosPromise {
    return axios.delete(`${this.contextPath}/${id}`)
  }
}

export const viewsPricesService = new ViewsPricesService()
