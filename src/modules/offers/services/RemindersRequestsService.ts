import type { AxiosPromise } from 'axios'
import axios from 'axios'

class RemindersRequestsService {
  contextPath = 'remind_requests'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }

  /** **************** post ******************/

  /** **************** put ******************/

  /** **************** delete ******************/
}

export const remindersRequestsService = new RemindersRequestsService()
