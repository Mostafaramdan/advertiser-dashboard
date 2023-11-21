import type { DashboardNotification } from '@/interfaces/Notifications'
import { useNotificationsStore } from '@/stores/Notifications'
import { useToast } from 'vue-toastification'

export function UseNotificationsHelpers() {
  /***************************************
   **** Section Variables Declaration ****
   **************************************/
  // #region Variables
  const router = useRouter()
  const toast = useToast()
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
      // subscriptions types
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
          query: { user_id: modelId, advertiser_name: model?.username },
        })
        break

      // users profile types
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

      case 'change_status_account':
      case 'delete_account_by_admin':
        router.push({
          name: model?.role === 'advertiser' ? 'advertisers-profile-page' : 'user-profile-page',
          params: { id: modelId },
          query: { tab: 'details' },
        })
        break

      // advertiser profile types
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

      // ads types
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

      // ads requests types
      case 'delete_ads_request_by_admin':
      case 'cancel_ads_request_by_admin':
        router.push({
          name: 'ads-request-details-page',
          params: { id: modelId },
          query: { tab: 'details' },
        })
        break

      // platform coupons types
      case 'create_platform_coupon_by_admin':
      case 'update_platform_coupon_by_admin':
      case 'change_status_platform_coupon_by_admin':
      case 'select_coupon':
      case 'deselect_coupon':
        router.push({
          name: 'platform-coupon-details-page',
          params: { id: modelId },
          query: { tab: 'details' },
        })
        break

      // advertisers coupons types
      case 'create_advertiser_coupon_by_admin':
      case 'update_advertiser_coupon':
      case 'change_status_advertiser_coupon':
        router.push({
          name: 'advertiser-coupon-details-page',
          params: { id: modelId },
        })
        break

      // users coupons types
      case 'create_ads_request_coupon':
      case 'update_ads_request_coupon':
      case 'change_status_ads_request_coupon':
        router.push({
          name: 'user-coupon-details-page',
          params: { id: modelId },
        })
        break

      // stores types
      case 'create_store':
      case 'confirm_store':
      case 'reject_store':
        router.push({
          name: 'store-details-page',
          params: { id: modelId },
        })
        break

      // disputes types
      case 'create_dispute':
      case 'accept_dispute':
      case 'reject_dispute':
      case 'confirm_dispute':
      case 'finish_dispute':
      case 'rate_dispute':
      case 'edit_rate_dispute':
      case 'enable_rating':
      case 'disable_rating':
        router.push({
          name: 'dispute-details-page',
          params: { id: modelId },
          query: { tab: 'details' },
        })
        break

      case 'message_to_support_dispute':
      case 'reply_to_dispute':
        router.push({
          name: 'dispute-details-page',
          params: { id: modelId },
          query: { tab: 'conversations' },
        })
        break

      case 'accept_support_dispute':
      case 'reject_support_dispute':
      case 'reply_admin_dispute':
      case 'make_procedure_dispute':
      case 'admin_enable_rate_dispute':
      case 'admin_disable_rate_dispute':
        router.push({
          name: 'dispute-details-page',
          params: { id: modelId },
          query: { tab: 'logs' },
        })
        break

      // tickets types
      case 'create_ticket':
      case 'reply_ticket':
        router.push({
          name: 'ticket-details-page',
          params: { id: modelId },
          query: { tab: 'details' },
        })
        break

      // notifications types
      case 'delete_platform_coupon_by_admin':
      case 'delete_advertiser_coupon':
      case 'delete_ads_request_coupon':
      case 'delete_store':
      case 'create_global_notification':
      case 'send_notification_to_a_user':
      case 'delete_notification':
        toast.info('هذا الاشعار للعرض فقط')
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
