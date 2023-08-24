import type { AxiosPromise } from 'axios'
import axios from 'axios'

class TicketsService {
  contextPath = 'tickets/ticket_settings'

  /** **************** get ******************/
  getData(): AxiosPromise {
    return axios.get(`${this.contextPath}`)
  }

  /** **************** patch ******************/
  editData(data: any): AxiosPromise {
    return axios.patch(`${this.contextPath}/all`, data)
  }
}

export const ticketsService = new TicketsService()
