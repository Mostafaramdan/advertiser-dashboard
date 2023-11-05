import type { DashboardNotification } from '@/interfaces/Notifications'
import { useNotificationsStore } from '@/stores/Notifications'

export function UseNotificationsHelpers() {
  /***************************************
   **** Section Variables Declaration ****
   **************************************/
  // #region Variables
  const router = useRouter()
  const notificationStore = useNotificationsStore()
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
    isLoading.value = true
    notificationStore.toggleNotificationSeen(notification).then(() => {
      isLoading.value = false
    })
  }
  function handleNotificationClick(notification: DashboardNotification): void {
    console.log('click', notification)
    const { type, model_id, is_seen, action_by } = notification
    if (!is_seen) toggleNotificationSeen(notification)
    switch (type) {
      case 'new_subscription_request':
        router.push({ name: 'subscriptions-requests-page', query: { id: model_id } })
        break
      case 'active_temp':
      case 'active_once':
      case 'extend_subscription':
      case 'renew_subscription':
      case 'stop_temp_subscription':
      case 'vacation_subscription':
      case 'end_stop_temp_subscription':
      case 'end_vacation_subscription':
        router.push({
          name: 'subscriptions-logs-page',
          query: { user_id: action_by.id, advertiser_name: action_by.username },
        })
        break
      case 'change_account_data':
      case 'delete_account':
        router.push({
          name: action_by.role === 'advertiser' ? 'advertisers-profile-page' : 'user-profile-page',
          params: { id: action_by.id },
          query: { tab: 'details' },
        })
        break
    }
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
