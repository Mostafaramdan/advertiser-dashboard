import type { AxiosPromise } from 'axios'
import axios from 'axios'

class AdvertisersReportsService {
  contextPath = 'reports/advertiser'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }
}

export const advertisersReportsService = new AdvertisersReportsService()
