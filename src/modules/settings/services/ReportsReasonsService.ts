import type { AxiosPromise } from 'axios'
import axios from 'axios'
import type { ReportReason } from './../interfaces/ReportReason'

class ReportsReasonsService {
  contextPath = 'report_reasons'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }

  /** **************** post ******************/
  createItem(data: ReportReason): AxiosPromise {
    return axios.post(`${this.contextPath}`, data)
  }

  /** **************** put ******************/
  editItem(data: ReportReason): AxiosPromise {
    return axios.put(`${this.contextPath}/${data.id}`, data)
  }

  /** **************** delete ******************/
  deleteItem(id: number): AxiosPromise {
    return axios.delete(`${this.contextPath}/${id}`)
  }
}

export const reportsReasonsService = new ReportsReasonsService()
