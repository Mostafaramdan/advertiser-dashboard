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

  getUsersStats(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}/clients`, { params })
  }

  getGuestsStats(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}/guests`, { params })
  }
}

export const statisticsService = new StatisticsService()
