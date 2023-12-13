import type { AxiosPromise } from 'axios'
import axios from 'axios'

class LogsService {
  contextPath = 'payments_log'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }

  getLogsStats(): AxiosPromise {
    return axios.get('payments_log_statistics')
  }

  getSingleItem(id: number): AxiosPromise {
    return axios.get(`${this.contextPath}/${id}`)
  }
}

export const logsService = new LogsService()
