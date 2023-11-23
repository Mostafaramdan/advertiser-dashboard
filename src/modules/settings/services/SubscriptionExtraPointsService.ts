import type { AxiosPromise } from 'axios'
import axios from 'axios'
import type {
  SubscriptionExtraPoint,
  SubscriptionExtraPointBase,
} from '../interfaces/SubscriptionExtraPoint'

class SubscriptionExtraPointsService {
  contextPath = 'subscription_extra_points'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }

  /** **************** post ******************/
  createItem(data: SubscriptionExtraPointBase): AxiosPromise {
    return axios.post(`${this.contextPath}`, data)
  }

  /** **************** put ******************/
  editItem(data: SubscriptionExtraPoint): AxiosPromise {
    return axios.put(`${this.contextPath}/${data.id}`, data)
  }

  /** **************** delete ******************/
  deleteItem(id: number): AxiosPromise {
    return axios.delete(`${this.contextPath}/${id}`)
  }
}

export const subscriptionExtraPointsService = new SubscriptionExtraPointsService()
