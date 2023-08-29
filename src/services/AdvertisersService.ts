import type { AxiosPromise } from 'axios'
import axios from 'axios'

class AdvertisersService {
  contextPath = 'users/advertisers'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }

  /** **************** delete ******************/
  deleteItem(id: number): AxiosPromise {
    return axios.delete(`${this.contextPath}/${id}`)
  }
}

export const advertisersService = new AdvertisersService()
