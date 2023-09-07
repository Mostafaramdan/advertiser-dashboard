import type { AxiosPromise } from 'axios'
import axios from 'axios'

class SubscriptionsLogsService {
  contextPath = 'subscription_requests_logs'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }

  getLogsStats(): AxiosPromise {
    return axios.get(`subscription_requests_logs_statistics`)
  }
}

export const subscriptionsLogsService = new SubscriptionsLogsService()
