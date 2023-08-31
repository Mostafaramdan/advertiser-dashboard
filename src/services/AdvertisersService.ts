import type { AxiosPromise } from 'axios'
import axios from 'axios'

class AdvertisersService {
  contextPath = 'users/advertisers'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }

  getBasicInfo(id: number): AxiosPromise {
    return axios.get(`${this.contextPath}/${id}/basic_data`)
  }

  getDetails(id: number): AxiosPromise {
    return axios.get(`${this.contextPath}/${id}/details`)
  }

  /** **************** delete ******************/
  deleteItem(id: number): AxiosPromise {
    return axios.delete(`${this.contextPath}/${id}`)
  }

  /** **************** post ******************/
  takeProcedure(payload: { id: number; type: string }): AxiosPromise {
    return axios.post(`${this.contextPath}/${payload.id}/take_procedure`, {
      type: payload.type,
    })
  }
}

export const advertisersService = new AdvertisersService()
