import { DashboardNotification } from '@/interfaces/Notifications'
import type { MetaData } from '@/interfaces/Shared'
import { dashboardNotificationsService } from '@/services/DashboardNotificationsService'
import { defineStore } from 'pinia'
interface State {
  notificationsList: DashboardNotification[]
  notificationsListMeta: MetaData | null
  latestNotifications: DashboardNotification[]
  latestNotificationsMeta: MetaData | null
  unseenCount: number
}
export const useNotificationsStore = defineStore('notifications', {
  state: (): State => {
    return {
      notificationsList: [],
      notificationsListMeta: null,
      latestNotifications: [],
      latestNotificationsMeta: null,
      unseenCount: 0,
    }
  },
  actions: {
    setNotificationsList(list: DashboardNotification[]) {
      this.notificationsList = list
    },
    setNotificationsListMeta(meta: MetaData) {
      this.notificationsListMeta = meta
    },
    setLatestNotifications(list: DashboardNotification[]) {
      this.latestNotifications = list
    },
    setLatestNotificationsMeta(meta: MetaData) {
      this.latestNotificationsMeta = meta
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
    toggleNotificationsListItemSeen(notificationId: string) {
      if (!this.notificationsList.length) return
      const targetNotification = this.notificationsList.find((item) => item.uuid === notificationId)
      if (targetNotification) targetNotification.is_seen = !targetNotification.is_seen
    },
    toggleLatestNotificationsListItemSeen(notificationId: string) {
      if (!this.latestNotifications.length) return
      const targetNotification = this.latestNotifications.find(
        (item) => item.uuid === notificationId,
      )
      if (targetNotification) targetNotification.is_seen = !targetNotification.is_seen
    },
    toggleNotificationSeen(notification: DashboardNotification) {
      return new Promise<void>((resolve) => {
        const notificationId = notification.uuid

        dashboardNotificationsService.toggleSeen(notificationId).then(() => {
          if (notification.is_seen) this.increaseUnseenCount()
          else this.decreaseUnseenCount()
          this.toggleNotificationsListItemSeen(notificationId)
          this.toggleLatestNotificationsListItemSeen(notificationId)
          resolve()
        })
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
        dashboardNotificationsService.deleteItem(item.uuid).then(() => {
          if (!item.is_seen) this.decreaseUnseenCount()
          resolve()
        })
      })
    },
    playNotificationSound() {
      let audio = new Audio(
        'https://notificationsounds.com/storage/sounds/file-sounds-1125-insight.mp3',
      )
      audio.play()
    },
    addNotificationToList(
      notification: DashboardNotification,
      list: DashboardNotification[],
      metaData: MetaData | null,
    ) {
      if (!metaData) return
      metaData.total++
      metaData.last_page = Math.ceil(metaData.total / metaData.per_page)
      if (metaData.current_page === 1) {
        list.unshift(notification)
        if (list.length > metaData.per_page) list.pop()
      }
    },
    receiveNotification(notification: DashboardNotification) {
      this.playNotificationSound()
      this.increaseUnseenCount()
      this.addNotificationToList(
        notification,
        this.latestNotifications,
        this.latestNotificationsMeta,
      )
      this.addNotificationToList(notification, this.notificationsList, this.notificationsListMeta)
    },
  },
})
