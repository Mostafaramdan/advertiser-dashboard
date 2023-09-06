import type { AxiosPromise } from 'axios'
import axios from 'axios'

class SubscriptionsRequestsService {
  contextPath = 'subscription_requests'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }

  /** **************** put ******************/
  editItem(data: any): AxiosPromise {
    return axios.put(`${this.contextPath}/${data.id}`, data)
  }

  /** **************** delete ******************/
  deleteItem(id: number): AxiosPromise {
    return axios.delete(`${this.contextPath}/${id}`)
  }
}

export const subscriptionsRequestsService = new SubscriptionsRequestsService()
