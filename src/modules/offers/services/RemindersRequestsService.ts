import type { AxiosPromise } from 'axios'
import axios from 'axios'

class RemindersRequestsService {
  contextPath = 'remind_requests'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }
  getStats(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}/statistics`, { params })
  }

  /** **************** post ******************/

  /** **************** put ******************/
  toggleArchived(id: number, type: string): AxiosPromise {
    return axios.put(`${this.contextPath}/${id}/toggle_archived?type=${type}`)
  }

  /** **************** delete ******************/
}

export const remindersRequestsService = new RemindersRequestsService()
