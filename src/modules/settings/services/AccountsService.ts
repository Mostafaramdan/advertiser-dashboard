import type { AxiosPromise } from 'axios'
import axios from 'axios'

class AccountsService {
  contextPath = 'financial_settings'

  /** **************** get ******************/
  getData(): AxiosPromise {
    return axios.get(`${this.contextPath}`)
  }

  /** **************** patch ******************/
  editData(data: any): AxiosPromise {
    return axios.patch(`${this.contextPath}/all`, data)
  }
}

export const accountsService = new AccountsService()
