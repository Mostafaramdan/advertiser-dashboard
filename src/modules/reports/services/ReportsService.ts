import type { AxiosPromise } from 'axios'
import axios from 'axios'

class ReportsService {
  contextPath = 'reports'

  /** **************** get ******************/
  getAdsReports(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}/ads`, { params })
  }

  getAdsReportsDetails({ id, params }: { id: number; params: any }): AxiosPromise {
    return axios.get(`reports/ads/${id}`, { params })
  }

  getAdvertisersReports(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}/advertiser`, { params })
  }

  getAdvertisersReportsDetails({ id, params }: { id: number; params: any }): AxiosPromise {
    return axios.get(`reports/advertiser/${id}`, { params })
  }

  /** **************** delete ******************/
  deleteItem(id: number): AxiosPromise {
    return axios.delete(`${this.contextPath}/${id}`)
  }

  deleteAdsReport(id: number): AxiosPromise {
    return axios.delete(`reports/ads/${id}`)
  }

  deleteAdvertisersReport(id: number): AxiosPromise {
    return axios.delete(`reports/advertiser/${id}`)
  }
}

export const reportsService = new ReportsService()
