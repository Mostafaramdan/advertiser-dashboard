<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import type { AdSpaceRequestLog } from '../interfaces/AdsSpace'
import { adsSpacesService } from '../services/AdsSpacesService'
/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(defineProps<{ showModal: boolean; activeId: number }>(), {
  showModal: false,
})

// #endregion

/***************************************
 **** Section Emits Declaration ********
 **************************************/
// #region Emits
const emit = defineEmits<{
  (e: 'update:showModal', value: boolean): void
}>()

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const showModal = useVModel(props, 'showModal', emit)
const { formatDateTime } = UseGeneralHelpers()
const params = reactive({
  page: 1,
  itemPerPage: 10,
  keyword: '',
  user_id: null,
})

const { tableData, metaData, IsLoadingData } = UseCrudHelpers<AdSpaceRequestLog>(null, null, '')

const headers: any = [
  {
    title: 'رقم الحركة',
    key: 'id',
  },
  {
    title: 'صاحب الحركة',
    key: 'user',
  },
  {
    title: 'اسم الحركة',
    key: 'action_type_trans',
  },
  {
    title: 'تاريخ الحركة',
    key: 'created_at',
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
  IsLoadingData.value = true
  adsSpacesService
    .getRequestLogs({ id: props.activeId, params })
    .then((res: any) => {
      const { data, meta } = res.data
      tableData.value = data
      metaData.value = meta
    })
    .finally(() => {
      IsLoadingData.value = false
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
// #endregion
</script>

<template>
  <VDialog
    v-model="showModal"
    fullscreen
    :scrim="false"
    scrollable
    transition="dialog-bottom-transition"
  >
    <!-- Dialog Content -->
    <VCard>
      <div>
        <!-- Toolbar -->
        <VToolbar
          density="compact"
          title="سجل الطلب"
          style="position: sticky; z-index: 1; inline-size: 100%; inset-block-start: 0"
          elevation="2"
          color="grey-200"
        >
          <VBtn icon @click="showModal = false" color="dark" size="40">
            <VIcon icon="tabler-x" size="24" />
          </VBtn>
        </VToolbar>

        <!-- tabs -->
        <VCardText class="pa-4">
          <div>
            <PageActions
              :items-per-page="params.itemPerPage"
              @update:items-per-page="onChangeItemsPerPage"
              @update:search="onChangeSearch"
              @reload-data="reloadPageData"
            />

            <VDataTableServer
              v-loading="IsLoadingData"
              :headers="headers"
              :items="tableData"
              :items-length="metaData?.total || 0"
              class="app-table"
              :no-data-text="IsLoadingData ? t('general.loading') : t('general.no_data')"
            >
              <template #item.action_type_trans="{ item }">
                <div style="min-inline-size: 100px">
                  {{ item.action_type_trans }}
                </div>
              </template>
              <template #item.user="{ item }">
                <div style="min-inline-size: 200px">
                  {{ item.user.username }}
                </div>
              </template>
              <template #item.created_at="{ item }">
                <div class="text-no-wrap">
                  {{ formatDateTime(item.created_at) }}
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
        </VCardText>
      </div>
    </VCard>
  </VDialog>
</template>
