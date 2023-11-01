import type { MetaData } from '@/interfaces/Shared'
import type { DashboardNotification } from '@/interfaces/Notifications'
import { useNotificationsStore } from '@/stores/Notifications'

export function UseNotificationsHelpers() {
  /***************************************
   **** Section Variables Declaration ****
   **************************************/
  // #region Variables
  const notificationStore = useNotificationsStore()
  const metaData = ref<MetaData | null>(null)
  const confirmModal = ref<any>()
  const isLoading = ref<boolean>(false)
  // #endregion

  /***************************************
   **** Section Computed Variables  ******
   **************************************/
  // #region Computed
  const unSeenCount = computed(() => notificationStore.unseenCount)

  // #endregion

  /***************************************
   **** Section Functions Declaration ****
   **************************************/
  // #region Functions
  function markAllAsSeen(): void {
    isLoading.value = true
    notificationStore.markAllAsSeen().then(() => {
      isLoading.value = false
    })
  }

  function toggleNotificationSeen(notification: DashboardNotification): void {
    notificationStore.toggleNotificationSeen(notification)
  }
  function handleNotificationClick(notification: DashboardNotification): void {
    console.log('click', notification)
    if (!notification.is_seen) toggleNotificationSeen(notification)
  }

  function deleteItem(item: DashboardNotification): void {
    isLoading.value = true
    notificationStore.deleteItem(item).then(() => {
      isLoading.value = false
    })
  }

  async function showConfirmDeleteItem(item: DashboardNotification): Promise<void> {
    const confirm = await confirmModal.value.open('يرجي التاكيد', 'هل انت متاكد من الحذف')

    if (confirm) deleteItem(item)
  }

  // #endregion

  return {
    metaData,
    confirmModal,
    isLoading,
    notificationStore,
    unSeenCount,
    markAllAsSeen,
    toggleNotificationSeen,
    handleNotificationClick,
    showConfirmDeleteItem,
  }
}
