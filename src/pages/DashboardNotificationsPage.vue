<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { UseNotificationsHelpers } from '@/composables/UseNotificationsHelpers'
import type { DashboardNotification } from '@/interfaces/Notifications'
import { pageAction } from '@/interfaces/Shared'
import { dashboardNotificationsService } from '@/services/DashboardNotificationsService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const {
  confirmModal,
  isLoading,
  unSeenCount,
  notificationStore,
  markAllAsSeen,
  toggleNotificationSeen,
  handleNotificationClick,
  showConfirmDeleteItem,
} = UseNotificationsHelpers()
const { formatDateTime } = UseGeneralHelpers()
const params = reactive({
  page: 1,
  itemPerPage: 10,
  keyword: '',
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const tableData = computed(() => notificationStore.notificationsList)
const metaData = computed(() => notificationStore.notificationsListMeta)

const pageActionsButtons = computed<pageAction[]>(() => {
  return [
    {
      icon: 'tabler-mail-check',
      show: true,
      handler: markAllAsSeen,
      disabled: !unSeenCount.value,
    },
    {
      icon: 'tabler-filter',
      show: true,
      handler: handleShowFilter,
    },
  ]
})
// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
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
  // remove the listener and clear notifications data
  unsubscribe()
  notificationStore.setNotificationsList([])
})
// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function getPageData(): void {
  isLoading.value = true
  if (params.page === 1) notificationStore.setNotificationsList([])
  dashboardNotificationsService
    .getNotifications(params)
    .then((res) => {
      const { data, meta, unseen_count } = res.data
      notificationStore.setNotificationsList(data)
      notificationStore.setNotificationsListMeta(meta)
      notificationStore.setUnseenCount(unseen_count)
    })
    .finally(() => {
      isLoading.value = false
    })
}

function reloadPageData(): void {
  params.page = 1
  getPageData()
}

function onChangeSearch(value: string): void {
  params.keyword = value
  reloadPageData()
}

function onChangeItemsPerPage(value: number): void {
  params.itemPerPage = value
  reloadPageData()
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
    if (tableData.value.length === 0 && metaData.value.current_page > 1) {
      params.page = metaData.value.current_page - 1
      getPageData()
    }

    // handle it for first page
    else if (tableData.value.length === 0 && metaData.value.current_page === 1) {
      getPageData()
    }
  }
}

function handleShowFilter(): void {
  console.log('filter')
}

// #endregion
</script>

<template>
  <section>
    <ConfirmModal ref="confirmModal" />
    <VCard title="اشعارات لوحة التحكم" class="page-card">
      <VCardText>
        <PageActions
          :page-actions-buttons="pageActionsButtons"
          :items-per-page="params.itemPerPage"
          @update:items-per-page="onChangeItemsPerPage"
          @update:search="onChangeSearch"
          @reload-data="reloadPageData"
        />

        <div v-loading="isLoading" style="min-block-size: 150px">
          <VList :lines="false" class="notifications-list rounded-0 py-0 border">
            <template v-for="(notification, index) in tableData" :key="notification.uuid">
              <VDivider v-if="index > 0" />
              <VListItem
                class="notifications-list__item align-start pa-2"
                :class="{ new: !notification.is_seen }"
                @click="handleNotificationClick(notification)"
              >
                <template #prepend>
                  <VAvatar size="45" variant="outlined">
                    <VImg
                      v-if="notification.action_by.image_path"
                      :src="notification.action_by.image_path"
                      cover
                    />
                    <span v-else>!</span>
                  </VAvatar>
                </template>

                <VListItemTitle class="font-weight-medium">{{ notification.title }}</VListItemTitle>
                <VListItemSubtitle class="my-1">{{ notification.body }}</VListItemSubtitle>
                <span class="text-sm text-disabled">{{
                  formatDateTime(notification.created_at)
                }}</span>

                <!-- Slot: Append -->
                <template #append>
                  <div class="d-flex flex-column align-center gap-2">
                    <IconBtn size="small" @click.stop="toggleNotificationSeen(notification)">
                      <VIcon
                        size="15"
                        icon="tabler-circle-filled"
                        :color="notification.is_seen ? 'success' : 'error'"
                      />
                    </IconBtn>
                    <IconBtn size="small" @click.stop="showConfirmDeleteItem(notification)">
                      <VIcon size="20" icon="tabler-trash" />
                    </IconBtn>
                  </div>
                </template>
              </VListItem>
            </template>

            <VListItem
              v-show="!tableData.length && !isLoading"
              class="text-center text-medium-emphasis"
              style="block-size: 56px"
            >
              <VListItemTitle> لا توجد اشعارات</VListItemTitle>
            </VListItem>
          </VList>
        </div>
        <PagePagination
          v-model:page="params.page"
          :meta-data="metaData"
          :get-page-data="getPageData"
        />
      </VCardText>
    </VCard>
  </section>
</template>
