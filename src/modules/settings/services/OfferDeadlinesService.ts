import type { AxiosPromise } from 'axios'
import axios from 'axios'
import type { OfferDeadline, OfferDeadlineBase } from '../interfaces/OfferDeadline'

class OfferDeadlinesService {
  contextPath = 'offer_deadlines'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }

  /** **************** post ******************/
  createItem(data: OfferDeadlineBase): AxiosPromise {
    return axios.post(`${this.contextPath}`, data)
  }

  /** **************** put ******************/
  editItem(data: OfferDeadline): AxiosPromise {
    return axios.put(`${this.contextPath}/${data.id}`, data)
  }

  /** **************** delete ******************/
  deleteItem(id: number): AxiosPromise {
    return axios.delete(`${this.contextPath}/${id}`)
  }
}

export const offerDeadlinesService = new OfferDeadlinesService()
