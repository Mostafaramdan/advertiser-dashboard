import type { AxiosPromise } from 'axios'
import axios from 'axios'
import type { Distance, DistanceBase } from '../interfaces/Distance'

class AdsSpacesService {
  contextPath = 'ad_spaces'
  settingsPath = 'ad_space_settings'
  requestsPath = 'requests'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }

  getSingleItem(id: number): AxiosPromise {
    return axios.get(`${this.contextPath}/${id}`)
  }

  getDetails(id: number): AxiosPromise {
    return axios.get(`${this.contextPath}/${id}/details`)
  }

  getStats(id: number): AxiosPromise {
    return axios.get(`${this.contextPath}/${id}/statistics`)
  }

  getRequests({ id, params }: { id: number; params: any }): AxiosPromise {
    return axios.get(`${this.contextPath}/${id}/${this.requestsPath}`, { params })
  }

  getRequestDetails(id: number): AxiosPromise {
    return axios.get(`${this.contextPath}/${this.requestsPath}/${id}`)
  }

  getUpdatedRequestDetails(id: number): AxiosPromise {
    return axios.get(`${this.contextPath}/${this.requestsPath}/${id}/channel_views`)
  }

  getRequestLogs({ id, params }: { id: number; params: any }): AxiosPromise {
    return axios.get(`${this.contextPath}/${this.requestsPath}/${id}/logs`, { params })
  }

  getShares({ id, params }: { id: number; params: any }): AxiosPromise {
    return axios.get(`${this.contextPath}/${id}/shares`, { params })
  }

  getSettings(): AxiosPromise {
    return axios.get(`${this.settingsPath}`)
  }

  /** **************** post ******************/
  createItem(data: DistanceBase): AxiosPromise {
    return axios.post(`${this.contextPath}`, data)
  }

  addBalance(payload: { id: number; data: any }): AxiosPromise {
    return axios.post(`${this.contextPath}/${payload.id}/add_balance`, payload.data)
  }

  /** **************** put ******************/
  editItem(data: Distance): AxiosPromise {
    return axios.put(`${this.contextPath}/${data.id}`, data)
  }

  editSettings(data: any): AxiosPromise {
    return axios.patch(`${this.settingsPath}/update_all`, data)
  }

  /** **************** delete ******************/
  deleteItem(id: number): AxiosPromise {
    return axios.delete(`${this.contextPath}/${id}`)
  }
}

export const adsSpacesService = new AdsSpacesService()
