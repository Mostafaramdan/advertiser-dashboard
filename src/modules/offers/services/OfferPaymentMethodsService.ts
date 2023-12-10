import type { AxiosPromise } from 'axios'
import axios from 'axios'
import type { OfferPaymentMethod, OfferPaymentMethodBase } from '../interfaces/OfferPaymentMethod'

class OfferPaymentMethodsService {
  contextPath = 'offer_payment_methods'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }

  /** **************** post ******************/
  createItem(data: OfferPaymentMethodBase): AxiosPromise {
    return axios.post(`${this.contextPath}`, data)
  }

  /** **************** put ******************/
  editItem(data: OfferPaymentMethod): AxiosPromise {
    return axios.put(`${this.contextPath}/${data.id}`, data)
  }

  /** **************** delete ******************/
  deleteItem(id: number): AxiosPromise {
    return axios.delete(`${this.contextPath}/${id}`)
  }
}

export const offerPaymentMethodsService = new OfferPaymentMethodsService()
