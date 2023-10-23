<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { NOTIFICATIONS_TYPES } from '@/constants'
import { MetaData } from '@/interfaces/Shared'
import { LicenseDocumentNotification } from '@/interfaces/User'
import { usersService } from '@/services/UsersService'
import { VDataTableServer } from 'vuetify/labs/VDataTable'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = defineProps({
  activeId: {
    type: Number,
    required: true,
  },
})
// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const { formatDateTime } = UseGeneralHelpers()
const isLoading = ref<boolean>(false)
const tableData = ref<LicenseDocumentNotification[]>([])
const metaData = ref<MetaData | null>(null)
const params = ref({
  page: 1,
  itemPerPage: 10,
})
const headers: any = [
  {
    title: 'رقم الحركة',
    key: 'id',
  },
  {
    title: 'المرسل',
    key: 'admin_name',
  },
  {
    title: 'تاريخ الاسال',
    key: 'created_at',
  },
  {
    title: 'قنوات الارسال',
    key: 'channels',
  },
  {
    title: 'الرسالة / التنبيه',
    key: 'message',
  },
]

//#endregion

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
function getPageData() {
  isLoading.value = true
  usersService
    .getLicenseDocumentNotifications(props.activeId, params.value)
    .then((res) => {
      const { data, meta } = res.data
      tableData.value = data
      metaData.value = meta
    })
    .finally(() => {
      isLoading.value = false
    })
}
// #endregion
</script>

<template>
  <div class="notifications-history">
    <VDataTableServer
      v-loading="isLoading"
      :headers="headers"
      :items="tableData"
      :items-length="tableData.length"
      class="app-table"
      :no-data-text="isLoading ? t('general.loading') : t('general.no_data')"
    >
      <template #item.admin_name="{ item }">
        <div style="min-inline-size: 100px">
          {{ item.raw.admin_name }}
        </div>
      </template>
      <template #item.created_at="{ item }">
        <div class="text-no-wrap">
          {{ formatDateTime(item.raw.created_at) }}
        </div>
      </template>
      <template #item.channels="{ item }">
        <div class="d-flex gap-2">
          <VChip
            :color="item.raw.channels.includes(type.value) ? 'primary' : 'secondary'"
            v-for="type in NOTIFICATIONS_TYPES"
            :key="type.value"
            style="block-size: auto"
            class="pa-1"
            label
          >
            <VIcon size="24">
              {{ type.icon }}
            </VIcon>
          </VChip>
        </div>
      </template>
      <template #item.message="{ item }">
        <div style="min-inline-size: 300px">
          {{ item.raw.message }}
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
</template>
