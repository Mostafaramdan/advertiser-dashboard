<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import type { OfferQtyAvailabilityReminder, User } from '@/interfaces/Offer'
import { MetaData } from '@/interfaces/Shared'
import { offersService } from '@/services/OffersService'
import { useAuthStore } from '@/stores/AuthStore'
import OfferStartReminderDetailsModal from './OfferStartReminderDetailsModal.vue'
/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const route = useRoute()
const { formatDateTime } = UseGeneralHelpers()
const { hasPermission } = useAuthStore()
const offerId = +route.params.id
const tableData = ref<OfferQtyAvailabilityReminder[]>([])
const metaData = ref<MetaData | null>(null)
const isLoadingData = ref<boolean>(false)
const showNotificationModal = ref<boolean>(false)
const showDetailsModal = ref<boolean>(false)
const activeUser = ref<User | null>(null)
const activeItem: Ref<OfferQtyAvailabilityReminder | null> = ref(null)
const params = reactive({
  page: 1,
  itemPerPage: 10,
  keyword: '',
})

const headers: any = [
  {
    title: 'صاحب الطلب',
    key: 'user',
  },
  {
    title: 'الكمية من/الكمية الي',
    key: 'from_quantity',
  },
  {
    title: 'تاريخ الطلب/رقم الجوال',
    key: 'created_at',
  },
  {
    title: 'العمليات',
    key: 'actions',
    align: 'center',
  },
]

// #endregion

const permissions = computed(() => ({
  sendNotification: hasPermission('notify_users'),
}))

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
  isLoadingData.value = true
  offersService
    .getOfferQtyAvailabilityReminders(offerId, params)
    .then((res: any) => {
      const { data, meta } = res.data
      tableData.value = data
      metaData.value = meta
    })
    .finally(() => {
      isLoadingData.value = false
    })
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

function openNotificationModal(user: User) {
  activeUser.value = user
  showNotificationModal.value = true
}

function DetailsModal(item: OfferQtyAvailabilityReminder): void {
  activeItem.value = item
  showDetailsModal.value = true
}

// #endregion
</script>

<template>
  <section>
    <div>
      <OfferStartReminderDetailsModal
        v-model:showModal="showDetailsModal"
        :active-item="activeItem"
      />
      <NotificationModal
        v-if="activeUser && showNotificationModal"
        v-model:showModal="showNotificationModal"
        :user="activeUser"
      />
      <PageActions
        :items-per-page="params.itemPerPage"
        @update:items-per-page="onChangeItemsPerPage"
        @update:search="onChangeSearch"
        @reload-data="reloadPageData"
      />
      <VDataTableServer
        v-loading="isLoadingData"
        :headers="headers"
        :items="tableData"
        :items-length="metaData?.total || 0"
        class="app-table"
        :no-data-text="isLoadingData ? t('general.loading') : t('general.no_data')"
      >
        <template #item.user="{ item }">
          <div class="d-flex align-center">
            <div class="d-flex flex-column align-center me-3 py-1">
              <VAvatar size="38" variant="tonal" cover>
                <VImg v-if="item.user.image_path" :src="item.user.image_path" cover />
                <span v-else>!</span>
              </VAvatar>
            </div>
            <div style="min-inline-size: 205px">
              <span>{{ item.user.account_name }}</span>
              <span class="text-sm text-disabled d-block">{{ item.user.email }}</span>
            </div>
          </div>
        </template>
        <template #item.from_quantity="{ item }">
          <div class="text-no-wrap">
            {{ item.from_quantity }}
            <span class="text-sm text-disabled d-block">{{ item.to_quantity }}</span>
          </div>
        </template>
        <template #item.created_at="{ item }">
          <div class="text-no-wrap">
            {{ formatDateTime(item.created_at) }}
            <span class="text-sm text-disabled d-block"> {{ item.user.phone ?? '-' }}</span>
          </div>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex justify-center">
            <IconBtn @click="DetailsModal(item)">
              <VIcon icon="tabler-eye" />
            </IconBtn>
            <IconBtn
              :disabled="!permissions.sendNotification"
              @click="openNotificationModal(item.user)"
            >
              <VIcon icon="tabler-mail" />
            </IconBtn>
          </div>
        </template>

        <template #bottom>
          <PagePagination
            v-model:page="params.page"
            :meta-data="metaData"
            :get-page-data="getPageData"
          />
        </template>
      </VDataTableServer>
    </div>
  </section>
</template>

<style lang="scss" scoped>
:deep(.v-data-table .v-table__wrapper > table td) {
  max-inline-size: 250px;
  word-wrap: break-word;

  span {
    @include max-lines(2);
  }
}
</style>
