import type { AxiosPromise } from 'axios'
import axios from 'axios'

class SupportTicketsService {
  contextPath = 'tickets'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }

  getSingleItem(id: number): AxiosPromise {
    return axios.get(`${this.contextPath}/${id}`)
  }

  getTicketDetails(id: number): AxiosPromise {
    return axios.get(`${this.contextPath}/${id}/details`)
  }

  getRequestsStats(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}/statistics`, { params })
  }

  getConversations({ id, params }: { id: number; params: any }): AxiosPromise {
    return axios.get(`${this.contextPath}/${id}/conversations`, { params })
  }

  getLogs({ id, params }: { id: number; params: any }): AxiosPromise {
    return axios.get(`${this.contextPath}/${id}/logs`, { params })
  }

  getAvailableAdmins({ id, params }: { id: number; params: any }): AxiosPromise {
    return axios.get(`${this.contextPath}/${id}/filter_admins`, { params })
  }

  /** **************** post ******************/
  sendMessage({ id, data }: { id: number; data: any }): AxiosPromise {
    return axios.post(`${this.contextPath}/${id}/conversations`, data)
  }

  transferTicketToAdmin({ id, data }: { id: number; data: any }): AxiosPromise {
    return axios.post(`${this.contextPath}/${id}/assign_ticket_to_admin`, data)
  }

  editTicketStatus({ id, data }: { id: number; data: any }): AxiosPromise {
    return axios.post(`${this.contextPath}/${id}/change_status`, data)
  }

  /** **************** delete ******************/
  deleteItem(id: number): AxiosPromise {
    return axios.delete(`${this.contextPath}/${id}`)
  }
}

export const supportTicketsService = new SupportTicketsService()
