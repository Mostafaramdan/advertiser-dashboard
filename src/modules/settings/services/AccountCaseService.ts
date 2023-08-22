import type { AxiosPromise } from 'axios'
import axios from 'axios'
import type { AccountCase } from './../interfaces/AccountCase'

class AccountCaseService {
  contextPath = 'account_cases'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }

  /** **************** post ******************/
  createItem(data: AccountCase): AxiosPromise {
    return axios.post(`${this.contextPath}`, data)
  }

  /** **************** put ******************/
  editItem(data: AccountCase): AxiosPromise {
    return axios.put(`${this.contextPath}/${data.id}`, data)
  }

  /** **************** delete ******************/
  deleteItem(id: number): AxiosPromise {
    return axios.delete(`${this.contextPath}/${id}`)
  }
}

export const accountCaseService = new AccountCaseService()
