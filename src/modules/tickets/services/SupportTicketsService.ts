import type { AxiosPromise } from 'axios'
import axios from 'axios'

class SupportTicketsService {
  contextPath = 'tickets'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }

  getRequestsStats(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}/statistics`, { params })
  }

  /** **************** delete ******************/
  deleteItem(id: number): AxiosPromise {
    return axios.delete(`${this.contextPath}/${id}`)
  }
}

export const supportTicketsService = new SupportTicketsService()
