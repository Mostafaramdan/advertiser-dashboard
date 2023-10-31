import type { AxiosPromise } from 'axios'
import axios from 'axios'

const contextPath = 'users'
class UsersService {
  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${contextPath}/users`, { params })
  }

  getBasicInfo(id: number): AxiosPromise {
    return axios.get(`${contextPath}/users/${id}/basic_data`)
  }

  getDetails(id: number): AxiosPromise {
    return axios.get(`${contextPath}/users/${id}/details`)
  }

  getAdsRequestsLogs({ id, params }: { id: number; params: any }): AxiosPromise {
    return axios.get(`${contextPath}/users/${id}/ads_request_logs`, { params })
  }

  getLicensesDocuments(id: number): AxiosPromise {
    return axios.get(`${contextPath}/${id}/attachments`)
  }

  getLicenseDocumentNotifications(id: number, params: any): AxiosPromise {
    return axios.get(`${contextPath}/attachments/${id}/notification_logs`, { params })
  }

  getLicenseDocumentNotes(id: number, params: any): AxiosPromise {
    return axios.get(`${contextPath}/attachments/${id}/note_logs`, { params })
  }

  getLogsHistory(id: number, params: any): AxiosPromise {
    return axios.get(`${contextPath}/attachments/${id}/logs`, { params })
  }

  getChatBlockLogs(id: number, params: any): AxiosPromise {
    return axios.get(`${contextPath}/${id}/chat_blocks_logs`, { params })
  }

  /** **************** delete ******************/
  deleteItem(id: number): AxiosPromise {
    return axios.delete(`${contextPath}/users/${id}`)
  }

  /** **************** post ******************/
  sendLicensesDocumentsNote(payload: { id: number; data: object }): AxiosPromise {
    return axios.post(`${contextPath}/attachments/${payload.id}/send_note`, payload.data)
  }
}

export const usersService = new UsersService()
export const API_SEND_NOTIFICATION = (id: number) => `${contextPath}/${id}/send_notification`
export const API_SEND_ATTACHMENT_NOTIFICATION = (id: number) =>
  `${contextPath}/attachments/${id}/send_notification`
