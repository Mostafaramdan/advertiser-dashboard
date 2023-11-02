import type { AxiosPromise } from 'axios'
import axios from 'axios'

class DashboardNotificationsService {
  contextPath = 'admin_notifications'

  /** **************** get ******************/
  getNotifications(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }

  /** **************** post ******************/
  markAllAsSeen(): AxiosPromise {
    return axios.post(`${this.contextPath}/mark_all_as_seen`)
  }

  /** **************** delete ******************/
  deleteItem(id: string): AxiosPromise {
    return axios.delete(`${this.contextPath}/${id}`)
  }

  /** **************** patch ******************/
  toggleSeen(id: string): AxiosPromise {
    return axios.patch(`${this.contextPath}/toggle_seen`, {
      notification_id: id,
    })
  }
}

export const dashboardNotificationsService = new DashboardNotificationsService()
