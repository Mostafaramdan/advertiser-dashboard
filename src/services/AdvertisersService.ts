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

  getMarketingPresentationInfo(id: number): AxiosPromise {
    return axios.get(`${this.contextPath}/${id}/marketer_info`)
  }

  getAccountSettingsData(id: number): AxiosPromise {
    return axios.get(`${this.contextPath}/${id}/account_settings`)
  }

  getStatistics(id: number): AxiosPromise {
    return axios.get(`${this.contextPath}/${id}/statistics`)
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

  /** **************** put ******************/
  updateMarketingPresentationInfo(payload: { id: number; data: object }): AxiosPromise {
    return axios.put(`${this.contextPath}/${payload.id}/marketer_info`, payload.data)
  }
}

export const advertisersService = new AdvertisersService()
