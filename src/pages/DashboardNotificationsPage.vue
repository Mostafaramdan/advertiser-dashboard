<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { formatDateTime } = UseGeneralHelpers()
const tableData = ref<any>([])
const params = reactive({
  page: 1,
  itemPerPage: 10,
  keyword: '',
})

tableData.value = [
  {
    id: '1',
    title: 'Lorem Ipsum 1',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    notification_type: 'Type A',
    created_at: '2023-10-10T08:30:00.000Z',
    action_by: {
      id: '101',
      role: 'Admin',
      account_name: 'admin_user1',
      image_path: 'https://picsum.photos/200/300/?random=1',
    },
    is_seen: true,
  },
  {
    id: '2',
    title: 'Lorem Ipsum 2',
    body: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    notification_type: 'Type B',
    created_at: '2023-10-11T14:45:00.000Z',
    action_by: {
      id: '102',
      role: 'User',
      account_name: 'user123',
      image_path: 'https://picsum.photos/200/300/?random=2',
    },
    is_seen: false,
  },
  {
    id: '3',
    title: 'Lorem Ipsum 3',
    body: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    notification_type: 'Type C',
    created_at: '2023-10-12T10:15:00.000Z',
    action_by: {
      id: '103',
      role: 'Manager',
      account_name: 'manager456',
      image_path: 'https://picsum.photos/200/300/?random=3',
    },
    is_seen: true,
  },
  {
    id: '4',
    title: 'Lorem Ipsum 4',
    body: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.',
    notification_type: 'Type A',
    created_at: '2023-10-13T19:20:00.000Z',
    action_by: {
      id: '104',
      role: 'Admin',
      account_name: 'admin_user2',
      image_path: 'https://picsum.photos/200/300/?random=4',
    },
    is_seen: false,
  },
  {
    id: '5',
    title: 'Lorem Ipsum 5',
    body: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.',
    notification_type: 'Type B',
    created_at: '2023-10-14T16:10:00.000Z',
    action_by: {
      id: '105',
      role: 'User',
      account_name: 'user789',
      image_path: 'https://picsum.photos/200/300/?random=5',
    },
    is_seen: true,
  },
  {
    id: '6',
    title: 'Lorem Ipsum 6',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    notification_type: 'Type C',
    created_at: '2023-10-15T07:55:00.000Z',
    action_by: {
      id: '106',
      role: 'Manager',
      account_name: 'manager789',
      image_path: 'https://picsum.photos/200/300/?random=6',
    },
    is_seen: false,
  },
  {
    id: '7',
    title: 'Lorem Ipsum 7',
    body: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    notification_type: 'Type A',
    created_at: '2023-10-16T12:30:00.000Z',
    action_by: {
      id: '107',
      role: 'Admin',
      account_name: 'admin_user3',
      image_path: 'https://picsum.photos/200/300/?random=7',
    },
    is_seen: true,
  },
  {
    id: '8',
    title: 'Lorem Ipsum 8',
    body: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    notification_type: 'Type B',
    created_at: '2023-10-17T09:40:00.000Z',
    action_by: {
      id: '108',
      role: 'User',
      account_name: 'user456',
      image_path: 'https://picsum.photos/200/300/?random=8',
    },
    is_seen: false,
  },
  {
    id: '9',
    title: 'Lorem Ipsum 9',
    body: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.',
    notification_type: 'Type C',
    created_at: '2023-10-18T15:20:00.000Z',
    action_by: {
      id: '109',
      role: 'Manager',
      account_name: 'manager123',
      image_path: 'https://picsum.photos/200/300/?random=9',
    },
    is_seen: true,
  },
  {
    id: '10',
    title: 'Lorem Ipsum 10',
    body: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.',
    notification_type: 'Type A',
    created_at: '2023-10-19T11:05:00.000Z',
    action_by: {
      id: '110',
      role: 'Admin',
      account_name: 'admin_user4',
      image_path: 'https://picsum.photos/200/300/?random=10',
    },
    is_seen: false,
  },
]
// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
getPageData()

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function getPageData(): void {
  console.log('TODO')
}

/**
 * @description reload page data
 * @return  {void}
 */
function reloadPageData(): void {
  params.page = 1
  getPageData()
}

/**
 * @description update search keyword and reload page data
 * @param  {string} value
 * @return  {void}
 */
function onChangeSearch(value: string): void {
  params.keyword = value
  reloadPageData()
}

/**
 * @description update items per page and reload page data
 * @param  {number} value
 * @return  {void}
 */
function onChangeItemsPerPage(value: number): void {
  params.itemPerPage = value
  reloadPageData()
}

// #endregion
</script>

<template>
  <section>
    <VCard title="اشعارات لوحة التحكم">
      <VCardText>
        <PageActions
          :items-per-page="params.itemPerPage"
          @update:items-per-page="onChangeItemsPerPage"
          @update:search="onChangeSearch"
          @reload-data="reloadPageData"
        />

        <VList :lines="false" class="notifications-list rounded-0 py-0">
          <template v-for="(notification, index) in tableData" :key="notification.id">
            <VDivider v-if="index > 0" />
            <VListItem class="align-start px-0 pb-2" :class="{ 'mt-3': index > 0 }">
              <template #prepend>
                <VAvatar size="45">
                  <VImg
                    v-if="notification.action_by.image_path"
                    :src="notification.action_by.image_path"
                    cover
                  />
                  <span v-else>!</span>
                </VAvatar>
              </template>

              <VListItemTitle class="font-weight-medium">{{ notification.title }}</VListItemTitle>
              <VListItemSubtitle>{{ notification.body }}</VListItemSubtitle>
              <span class="text-sm text-disabled">{{
                formatDateTime(notification.created_at)
              }}</span>

              <!-- Slot: Append -->
              <template #append>
                <div class="d-flex flex-column align-center gap-4">
                  <VBadge
                    dot
                    :color="notification.is_seen ? 'success' : 'error'"
                    :class="`${notification.is_seen ? 'visible-in-hover' : ''} ms-1`"
                  />

                  <div style="block-size: 28px; inline-size: 28px">
                    <IconBtn size="small" class="visible-in-hover">
                      <VIcon size="20" icon="tabler-trash" />
                    </IconBtn>
                  </div>
                </div>
              </template>
            </VListItem>
          </template>

          <VListItem
            v-show="!tableData.length"
            class="text-center text-medium-emphasis"
            style="block-size: 56px"
          >
            <VListItemTitle> لا توجد اشعارات</VListItemTitle>
          </VListItem>
        </VList>
      </VCardText>
    </VCard>
    <div></div>
  </section>
</template>

<style lang="scss" scoped>
.notifications-list {
  :deep(.v-list-item__prepend, .v-list-item__append) {
    align-self: flex-start;
  }
}
</style>
