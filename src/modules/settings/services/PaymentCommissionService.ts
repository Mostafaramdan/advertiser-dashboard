import type { AxiosPromise } from 'axios'
import axios from 'axios'
import type { PaymentCommission, PaymentCommissionBase } from './../interfaces/PaymentCommission'

class PaymentCommissionService {
  contextPath = 'payment_commission'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }

  /** **************** post ******************/
  createItem(data: PaymentCommissionBase): AxiosPromise {
    return axios.post(`${this.contextPath}`, data)
  }

  /** **************** put ******************/
  editItem(data: PaymentCommission): AxiosPromise {
    return axios.put(`${this.contextPath}/${data.id}`, data)
  }

  /** **************** delete ******************/
  deleteItem(id: number): AxiosPromise {
    return axios.delete(`${this.contextPath}/${id}`)
  }
}

export const paymentCommissionService = new PaymentCommissionService()
