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

  function handleNotificationAction(notification: DashboardNotification) {
    const { type, model, action_by } = notification
    const modelId = model?.id
    switch (type) {
      case 'new_subscription_request':
        router.push({ name: 'subscriptions-requests-page', query: { id: modelId } })
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

      case 'add_new_attachment':
      case 'edit_attachment':
      case 'expire_end_attachment':
      case 'ended_attachment':
      case 'confirm_attachment':
      case 'reject_attachment':
        router.push({
          name: model?.role === 'advertiser' ? 'advertisers-profile-page' : 'user-profile-page',
          params: { id: modelId },
          query: { tab: 'licenses-documents' },
        })
        break

      case 'create_user_channel':
      case 'update_user_channel':
      case 'delete_user_channel':
      case 'change_status_user_channel':
      case 'change_type_user_channel':
      case 'edit_user_categories':
      case 'add_user_categories':
      case 'add_areas':
      case 'edit_areas':
        router.push({
          name: 'advertisers-profile-page',
          params: { id: modelId },
          query: { tab: 'account-settings' },
        })
        break

      case 'add_ma3roof':
      case 'delete_ma3roof':
      case 'add_billing_card':
      case 'edit_billing_card':
      case 'add_tax':
      case 'edit_tax':
      case 'edit_advanced_settings':
      case 'confirm_licensed_at_mawthoq':
      case 'reject_licensed_at_mawthoq':
      case 'confirm_ma3roof_verified':
      case 'reject_ma3roof_verified':
      case 'confirm_trustes_settings':
      case 'reject_trustes_settings':
      case 'confirm_verified':
      case 'reject_verified':
        router.push({
          name: 'advertisers-profile-page',
          params: { id: modelId },
          query: { tab: 'details' },
        })
        break
      case 'create_user_marketer_info':
      case 'edit_user_marketer_info':
      case 'confirm_marketer':
      case 'reject_marketer':
        router.push({
          name: 'advertisers-profile-page',
          params: { id: modelId },
          query: { tab: 'marketing-presentation' },
        })
        break

      case 'change_status_account':
      case 'delete_account_by_admin':
        router.push({
          name: model?.role === 'advertiser' ? 'advertisers-profile-page' : 'user-profile-page',
          params: { id: modelId },
          query: { tab: 'details' },
        })
        break

      case 'change_status_ads_by_admin':
      case 'delete_ads_by_admin':
      case 'restore_ads_by_admin':
        router.push({
          name: 'ad-details-page',
          params: { id: modelId },
          query: { tab: 'details' },
        })
        break

      case 'delete_comment_ads_by_admin':
        router.push({
          name: 'ad-details-page',
          params: { id: modelId },
          query: { tab: 'comments' },
        })
        break

      case 'delete_report_ads_by_admin':
        router.push({
          name: 'ad-details-page',
          params: { id: modelId },
          query: { tab: 'reports' },
        })
        break

      case 'delete_ads_request_by_admin':
      case 'cancel_ads_request_by_admin':
        router.push({
          name: 'ads-request-details-page',
          params: { id: modelId },
          query: { tab: 'details' },
        })
        break
    }
  }

  function handleNotificationClick(notification: DashboardNotification): void {
    const { is_seen } = notification
    if (!is_seen) toggleNotificationSeen(notification)
    handleNotificationAction(notification)
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
    handleNotificationAction,
    showConfirmDeleteItem,
  }
}
