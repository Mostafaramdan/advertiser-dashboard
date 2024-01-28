import type { AxiosPromise } from 'axios'
import axios from 'axios'
import type { ReportReason, ReportReasonBase } from './../interfaces/ReportReason'

class OffersReportsReasonsService {
  contextPath = 'offers_report_reasons'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }

  /** **************** post ******************/
  createItem(data: ReportReasonBase): AxiosPromise {
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

export const offersReportsReasonsService = new OffersReportsReasonsService()
