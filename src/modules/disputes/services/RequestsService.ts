import type { AxiosPromise } from 'axios'
import axios from 'axios'
import type { DisputeRequestProcedureForm } from '../interfaces/DisputeRequest'

class RequestsService {
  contextPath = 'disputes'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }

  /** **************** post ******************/
  takeProcedure(payload: { id: number; data: DisputeRequestProcedureForm }): AxiosPromise {
    return axios.post(`${this.contextPath}/${payload.id}/make_procedure`, payload.data)
  }
}

export const requestsService = new RequestsService()
