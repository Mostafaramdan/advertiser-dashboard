import type { AxiosPromise } from 'axios'
import axios from 'axios'

class AdsService {
  contextPath = 'ads'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }

  getDetails(id: number): AxiosPromise {
    return axios.get(`${this.contextPath}/${id}`)
  }

  /** **************** delete ******************/
  deleteItem(id: number): AxiosPromise {
    return axios.delete(`${this.contextPath}/${id}`)
  }
}

export const adsService = new AdsService()
