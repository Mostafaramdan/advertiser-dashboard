import { DashboardNotification } from '@/interfaces/Notifications'
import { dashboardNotificationsService } from '@/services/DashboardNotificationsService'
import { defineStore } from 'pinia'

interface State {
  notificationsList: DashboardNotification[]
  latestNotifications: DashboardNotification[]
  unseenCount: number
}
export const useNotificationsStore = defineStore('notifications', {
  state: (): State => {
    return {
      notificationsList: [],
      latestNotifications: [],
      unseenCount: 0,
    }
  },
  actions: {
    setNotificationsList(list: DashboardNotification[]) {
      this.notificationsList = list
    },
    setLatestNotifications(list: DashboardNotification[]) {
      this.latestNotifications = list
    },
    setUnseenCount(count: number) {
      this.unseenCount = count
    },
    resetUnseenCount() {
      this.unseenCount = 0
    },
    increaseUnseenCount() {
      this.unseenCount += 1
    },
    decreaseUnseenCount() {
      this.unseenCount -= 1
    },
    toggleSeenForListItem(list: DashboardNotification[], notificationId: number) {
      if (!list.length) return

      const targetNotification = list.find((item) => item.id === notificationId)
      if (targetNotification) {
        targetNotification.is_seen = !targetNotification.is_seen
        if (targetNotification.is_seen) this.decreaseUnseenCount()
        else this.increaseUnseenCount()
      }
    },
    toggleNotificationSeen(notification: DashboardNotification) {
      const notificationId = notification.id
      this.toggleSeenForListItem(this.latestNotifications, notificationId)
      this.toggleSeenForListItem(this.notificationsList, notificationId)

      dashboardNotificationsService.toggleSeen(notificationId).catch(() => {
        this.toggleSeenForListItem(this.latestNotifications, notificationId)
        this.toggleSeenForListItem(this.notificationsList, notificationId)
      })
    },
    markListAsSeen(list: DashboardNotification[]) {
      if (!list.length) return
      list.forEach((notification) => {
        notification.is_seen = true
      })
    },
    markAllAsSeen() {
      return new Promise<void>((resolve) => {
        dashboardNotificationsService.markAllAsSeen().then(() => {
          this.resetUnseenCount()
          this.markListAsSeen(this.latestNotifications)
          this.markListAsSeen(this.notificationsList)
          resolve()
        })
      })
    },
    deleteItem(item: DashboardNotification) {
      return new Promise<void>((resolve) => {
        dashboardNotificationsService.deleteItem(item.id).then(() => {
          if (!item.is_seen) this.decreaseUnseenCount()
          resolve()
        })
      })
    },
  },
})
