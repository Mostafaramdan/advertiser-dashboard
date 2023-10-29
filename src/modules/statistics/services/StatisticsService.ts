import type { AxiosPromise } from 'axios'
import axios from 'axios'

class StatisticsService {
  contextPath = 'statistics'

  /** **************** get ******************/
  getSubscriptionsStats(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}/subscriptions`, { params })
  }

  getPackagesStats(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}/plans`, { params })
  }

  getSubscribersStats(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}/subscribers`, { params })
  }

  getUsersStats(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}/clients`, { params })
  }

  getGuestsStats(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}/guests`, { params })
  }

  getVisitsStats(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}/visits`, { params })
  }

  getAdsStats(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}/ads`, { params })
  }

  getCouponsStats(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}/coupons`, { params })
  }

  getRequestsStats(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}/requests`, { params })
  }

  getDocumentsStats(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}/attachments`, { params })
  }

  getDailyStats(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}/general/daily_statistics`, { params })
  }

  getMonthlyStats(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}/general/monthly_statistics`, { params })
  }

  getGeneralStats(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}/general/general_statistics`, { params })
  }
}

export const statisticsService = new StatisticsService()
