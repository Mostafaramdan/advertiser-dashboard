import type { AxiosPromise } from 'axios'
import axios from 'axios'

class ExchangeRecordsService {
  contextPath = 'exchange-record'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }
}

export const exchangeRecordsService = new ExchangeRecordsService()
