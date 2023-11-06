import type { AxiosPromise } from 'axios'
import axios from 'axios'

class LogsService {
  contextPath = 'logs'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }
}

export const logsService = new LogsService()
