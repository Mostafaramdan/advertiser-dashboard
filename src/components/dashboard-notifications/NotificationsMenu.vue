<script lang="ts" setup>
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { UseNotificationsHelpers } from '@/composables/UseNotificationsHelpers'
import { initFirebase } from '@/firebase/index'
import type { DashboardNotification } from '@/interfaces/Notifications'
import { dashboardNotificationsService } from '@/services/DashboardNotificationsService'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const router = useRouter()
const {
  confirmModal,
  isLoading,
  unSeenCount,
  notificationStore,
  showMenu,
  markAllAsSeen,
  toggleNotificationSeen,
  handleNotificationClick,
  showConfirmDeleteItem,
} = UseNotificationsHelpers()
const { formatDateTime } = UseGeneralHelpers()
const params = reactive({
  page: 1,
  itemPerPage: 5,
  keyword: '',
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const tableData = computed(() => notificationStore.latestNotifications)
const metaData = computed(() => notificationStore.latestNotificationsMeta)
// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
initFirebase()
getPageData()

// handle delete item on action deleteItem is completed
const unsubscribe = notificationStore.$onAction(({ name, after, args }) => {
  if (name === 'deleteItem') {
    after(() => {
      deleteItemFromTableData(args[0])
    })
  }
})

onUnmounted(() => {
  // remove the listener
  unsubscribe()
})
// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function getPageData(): void {
  isLoading.value = true
  dashboardNotificationsService
    .getNotifications(params)
    .then((res) => {
      const { data, meta, unseen_count } = res.data
      notificationStore.setLatestNotifications(data)
      notificationStore.setLatestNotificationsMeta(meta)
      notificationStore.setUnseenCount(unseen_count)
    })
    .finally(() => {
      isLoading.value = false
    })
}

/**
 * @description delete item from table data after delete from server and update meta data
 * @param  {DashboardNotification} item
 * @return  {void}
 */
function deleteItemFromTableData(item: DashboardNotification): void {
  const targetIndex = tableData.value.findIndex((i: any) => i.uuid === item.uuid)

  if (targetIndex === -1) return
  tableData.value.splice(targetIndex, 1)

  if (metaData.value) {
    metaData.value.total -= 1
    metaData.value.last_page = Math.ceil(metaData.value.total / params.itemPerPage)

    if (tableData.value.length === 0 && metaData.value.current_page === 1) {
      getPageData()
    }
  }
}

function goToNotificationsPage() {
  router.push({ name: 'dashboard-notifications-page' })
  showMenu.value = false
}
// #endregion
</script>

<template>
  <div>
    <ConfirmModal ref="confirmModal" />
    <IconBtn id="notification-btn" class="me-4">
      <VBadge
        :model-value="!!unSeenCount"
        color="error"
        :content="unSeenCount > 50 ? '50+' : unSeenCount"
        class="notification-badge"
      >
        <VIcon size="26" icon="tabler-bell" />
      </VBadge>

      <VMenu
        activator="parent"
        width="380px"
        location="bottom end"
        offset="14px"
        :close-on-content-click="false"
        v-model="showMenu"
      >
        <VCard class="d-flex flex-column">
          <!-- 👉 Header -->
          <VCardItem class="pa-2">
            <VCardTitle class="text-subtitle-1 font-weight-medium"> الاشعارات </VCardTitle>

            <template #append v-if="unSeenCount">
              <IconBtn @click="markAllAsSeen">
                <VIcon icon="tabler-mail-check" />

                <VTooltip activator="parent" location="start"> تحديد الكل كمقروء </VTooltip>
              </IconBtn>
            </template>
          </VCardItem>

          <VDivider />

          <!-- 👉 Notifications list -->
          <PerfectScrollbar :options="{ wheelPropagation: false }" style="max-block-size: 23.75rem">
            <VList
              class="notifications-list rounded-0 py-0"
              v-loading="isLoading"
              style="min-block-size: 100px"
            >
              <template v-for="(notification, index) in tableData" :key="notification.uuid">
                <VDivider v-if="index > 0" />
                <VListItem
                  lines="one"
                  min-height="66px"
                  class="notifications-list__item"
                  :class="{ new: !notification.is_seen }"
                  @click="handleNotificationClick(notification)"
                >
                  <!-- Slot: Prepend -->
                  <template #prepend>
                    <VListItemAction start>
                      <VAvatar size="40" variant="outlined">
                        <VImg
                          v-if="notification.action_by.image_path"
                          :src="notification.action_by.image_path"
                          cover
                        />
                        <span v-else>!</span>
                      </VAvatar>
                    </VListItemAction>
                  </template>

                  <VListItemTitle class="text-sm font-weight-medium">{{
                    notification.title
                  }}</VListItemTitle>
                  <VListItemSubtitle class="text-sm">{{ notification.body }}</VListItemSubtitle>
                  <span class="text-xs text-disabled">{{
                    formatDateTime(notification.created_at)
                  }}</span>

                  <!-- Slot: Append -->
                  <template #append>
                    <div class="d-flex flex-column align-center gap-4">
                      <VBadge
                        dot
                        :color="notification.is_seen ? 'success' : 'error'"
                        :class="`${notification.is_seen ? 'visible-in-hover' : ''} ms-1`"
                        @click.stop="toggleNotificationSeen(notification)"
                      />

                      <div style="block-size: 28px; inline-size: 28px">
                        <IconBtn
                          size="small"
                          class="visible-in-hover"
                          @click.stop="showConfirmDeleteItem(notification)"
                        >
                          <VIcon size="20" icon="tabler-trash" />
                        </IconBtn>
                      </div>
                    </div>
                  </template>
                </VListItem>
              </template>

              <VListItem
                v-if="!tableData.length && !isLoading"
                class="text-center text-medium-emphasis"
                style="block-size: 56px"
              >
                <VListItemTitle>لا توجد اشعارات</VListItemTitle>
              </VListItem>
            </VList>
          </PerfectScrollbar>

          <VDivider />

          <!-- 👉 Footer -->
          <VCardActions v-show="tableData.length" class="pa-1">
            <VBtn block @click="goToNotificationsPage"> عرض جميع الاشعارات </VBtn>
          </VCardActions>
        </VCard>
      </VMenu>
    </IconBtn>
  </div>
</template>

<style lang="scss">
.notifications-list__item {
  .visible-in-hover {
    display: none;
  }

  &:hover {
    .visible-in-hover {
      display: block;
    }
  }
}

.notifications-list.v-list {
  .v-list-item {
    border-radius: 0 !important;
    margin: 0 !important;
  }
}

// Badge Style Override for Notification Badge
.notification-badge {
  .v-badge__badge {
    line-height: normal;
    min-inline-size: 24px;
    padding-block: 2px;
    padding-inline: 4px;
  }
}
</style>
