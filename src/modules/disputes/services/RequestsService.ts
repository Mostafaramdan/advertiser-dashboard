import type { AxiosPromise } from 'axios'
import axios from 'axios'
import type { DisputeRequestProcedureForm } from '../interfaces/DisputeRequest'

class RequestsService {
  contextPath = 'disputes'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }

  getSingleItem(id: number): AxiosPromise {
    return axios.get(`${this.contextPath}/${id}`)
  }

  getDetails(id: number): AxiosPromise {
    return axios.get(`${this.contextPath}/${id}/details`)
  }

  getRequestLogs({ id, params }: { id: number; params: any }): AxiosPromise {
    return axios.get(`${this.contextPath}/${id}/logs`, { params })
  }

  getConversations({ id, params }: { id: number; params: any }): AxiosPromise {
    return axios.get(`${this.contextPath}/${id}/conversations`, { params })
  }

  sendMessage({ id, data }: { id: number; data: any }): AxiosPromise {
    return axios.post(`${this.contextPath}/${id}/conversations`, data)
  }

  getRequestsStats(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}/statistics`, { params })
  }

  /** **************** post ******************/
  takeProcedure(payload: { id: number; data: DisputeRequestProcedureForm }): AxiosPromise {
    return axios.post(`${this.contextPath}/${payload.id}/make_procedure`, payload.data)
  }
}

export const requestsService = new RequestsService()
