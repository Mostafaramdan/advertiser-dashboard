import type { AxiosPromise } from 'axios'
import axios from 'axios'

class ReportsService {
  contextPath = 'reports'

  /** **************** get ******************/
  getAdsReports(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}/ads`, { params })
  }

  getAdsReportsDetails({ id, params }: { id: number; params: any }): AxiosPromise {
    return axios.get(`${this.contextPath}/ads/${id}`, { params })
  }

  getAdvertisersReports(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}/advertiser`, { params })
  }

  getAdvertisersReportsDetails({ id, params }: { id: number; params: any }): AxiosPromise {
    return axios.get(`${this.contextPath}/advertiser/${id}`, { params })
  }

  getChatReports(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}/chat`, { params })
  }

  getChatRates(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}/chat_rates`, { params })
  }

  /** **************** delete ******************/
  deleteItem(id: number): AxiosPromise {
    return axios.delete(`${this.contextPath}/${id}`)
  }

  deleteAdsReport(id: number): AxiosPromise {
    return axios.delete(`${this.contextPath}/ads/${id}`)
  }

  deleteAdvertisersReport(id: number): AxiosPromise {
    return axios.delete(`${this.contextPath}/advertiser/${id}`)
  }

  deleteChatReport(id: number): AxiosPromise {
    return axios.delete(`${this.contextPath}/chat/${id}`)
  }
}

export const reportsService = new ReportsService()
