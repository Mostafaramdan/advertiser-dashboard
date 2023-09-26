import type { NotificationCreateModalProps } from '@/interfaces/Notifications'
import type { AxiosPromise } from 'axios'
import axios from 'axios'

class NotificationsService {
  contextPath = 'notifications'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }

  /** **************** delete ******************/
  deleteItem(id: number): AxiosPromise {
    return axios.delete(`${this.contextPath}/${id}`)
  }

  /** **************** post ******************/
  /** **************** post ******************/
  createItem(data: NotificationCreateModalProps): AxiosPromise {
    return axios.post(`${this.contextPath}`, data)
  }
}

export const notificationsService = new NotificationsService()
