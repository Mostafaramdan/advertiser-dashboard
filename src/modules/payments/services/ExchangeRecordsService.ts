import type { AxiosPromise } from 'axios'
import axios from 'axios'
import type { ExchangeRecordFormData } from '../interfaces/ExchangeRecord'

class ExchangeRecordsService {
  contextPath = 'exchange-record'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }

  getSingleItem(id: number): AxiosPromise {
    return axios.get(`${this.contextPath}/${id}`)
  }

  getWithdrawData(userId: number): AxiosPromise {
    return axios.get(`create-exchange-process-form?user_id=${userId}`)
  }

  /** **************** post ******************/
  createWithdrawRequest(data: ExchangeRecordFormData): AxiosPromise {
    return axios.post(`create-exchange-process`, data)
  }
}

export const exchangeRecordsService = new ExchangeRecordsService()
