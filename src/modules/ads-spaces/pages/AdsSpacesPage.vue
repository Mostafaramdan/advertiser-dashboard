<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import { USERS_ROLES } from '@/constants/index'
import type { pageAction } from '@/interfaces/Shared'
import { useAuthStore } from '@/stores/AuthStore'
import type { AdsSpace } from '../interfaces/AdsSpace'
import { adsSpacesService } from '../services/AdsSpacesService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const FilterComponent = defineAsyncComponent(() => import('../components/AdsSpacesFilter.vue'))
const { t } = useI18n()
const { hasPermission } = useAuthStore()
const { formatDate } = UseGeneralHelpers()
const MODEL_NAME = 'ad_spaces'
const showFilter = ref<boolean>(false)
const loadFilter = ref<boolean>(false)
const params = reactive({
  page: 1,
  itemPerPage: 10,
  keyword: '',
})

const {
  selectedItems,
  tableData,
  metaData,
  confirmModal,
  IsLoadingData,
  getPageData,
  onReloadData,
  onChangeItemsPerPage,
  onChangeSearch,
  showConfirmDeleteItem,
} = UseCrudHelpers<AdsSpace>(adsSpacesService, params, MODEL_NAME)

const headers: any = [
  {
    title: 'اسم المساحة/رقم المساحة',
    key: 'name',
  },
  {
    title: 'صاحب المساحة',
    key: 'user',
  },
  {
    title: 'المشاهدات الأساسية/المشاهدات المتبقية',
    key: 'watches_count',
  },
  {
    title: 'الرصيد الحالي/تاريخ الانشاء',
    key: 'balance',
  },
  {
    title: 'الحالة',
    key: 'is_active',
  },
  {
    title: 'العمليات',
    key: 'actions',
    align: 'center',
  },
]

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const permissions = computed(() => ({
  create: hasPermission('create_ad_space'),
  edit: hasPermission('update_ad_space'),
  delete: hasPermission('delete_ad_space'),
  changeStatus: hasPermission('change_status_ad_space'),
  addBalance: hasPermission('add_balance_to_ad_space'),
}))

const pageActionsButtons = computed<pageAction[]>(() => {
  return [
    {
      icon: 'tabler-plus',
      show: permissions.value.create as boolean,
      handler: gotoCreatePage,
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

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function gotoCreatePage() {
  console.log('gotoCreatePage')
}

function handleShowFilter() {
  showFilter.value = !showFilter.value
  if (!loadFilter.value) loadFilter.value = true
}

function onApplyFilter(filters: any) {
  Object.assign(params, { ...filters, page: 1 })
  getPageData()
}
// #endregion
</script>

<template>
  <section>
    <ConfirmModal ref="confirmModal" />
    <Component
      :is="FilterComponent"
      v-if="loadFilter"
      v-model:showFilter="showFilter"
      @apply-filter="onApplyFilter"
      :init-filters="params"
    />
    <Component
      :is="FilterComponent"
      v-if="loadFilter"
      v-model:showFilter="showFilter"
      @apply-filter="onApplyFilter"
      :init-filters="params"
    />
    <VCard title="المساحات" class="page-card">
      <VCardText>
        <PageActions
          :page-actions-buttons="pageActionsButtons"
          :items-per-page="params.itemPerPage"
          :show-multi-delete="permissions.delete"
          :show-multi-activate="permissions.changeStatus"
          :model="MODEL_NAME"
          :selected-items="selectedItems"
          @update:items-per-page="onChangeItemsPerPage"
          @update:search="onChangeSearch"
          @reload-data="onReloadData"
        />
        <VDataTableServer
          v-model="selectedItems"
          v-loading="IsLoadingData"
          :headers="headers"
          :items="tableData"
          show-select
          :items-length="metaData?.total || 0"
          item-value="id"
          class="app-table"
          :no-data-text="IsLoadingData ? t('general.loading') : t('general.no_data')"
        >
          <template #item.name="{ item }">
            <div class="d-flex align-center">
              <div class="d-flex flex-column align-center me-3 py-1">
                <VAvatar size="38" variant="tonal" cover>
                  <VImg v-if="item.image_path" :src="item.image_path" cover />
                  <span v-else>!</span>
                </VAvatar>
              </div>
              <span style="min-inline-size: 150px">
                <span>{{ item.name }}</span>
                <span class="text-sm text-disabled d-block">{{ item.id }}</span>
              </span>
            </div>
          </template>
          <template #item.user="{ item }">
            <router-link
              :to="{
                name:
                  item.user.role === 'advertiser'
                    ? 'advertisers-profile-page'
                    : 'user-profile-page',
                params: { id: item.user.id },
                query: { tab: 'details' },
              }"
              class="d-flex align-center"
            >
              <div class="d-flex flex-column align-center me-3 py-1">
                <VAvatar size="38" variant="tonal" cover>
                  <VImg v-if="item.user.image_path" :src="item.user.image_path" cover />
                  <span v-else>!</span>
                </VAvatar>
              </div>
              <span>
                <span style="min-inline-size: 150px">{{ item.user.username }}</span>
                <span class="text-sm text-disabled d-block">{{ USERS_ROLES[item.user.role] }}</span>
              </span>
            </router-link>
          </template>
          <template #item.watches_count="{ item }">
            <div class="text-no-wrap" style="min-inline-size: 115px">
              {{ item.watches_count }}
              <span class="text-sm text-disabled d-block"> {{ item.remaining_watches_count }}</span>
            </div>
          </template>
          <template #item.balance="{ item }">
            <div class="text-no-wrap" style="min-inline-size: 80px">
              {{ item.balance }}
              <span class="text-sm text-disabled d-block"> {{ formatDate(item.created_at) }}</span>
            </div>
          </template>
          <template #item.is_active="{ item }">
            <ToggleActivationSwitch
              :id="item.id"
              v-model="item.is_active"
              :model="MODEL_NAME"
              :disabled="!permissions.changeStatus"
            />
          </template>

          <template #item.actions="{ item }">
            <div class="d-flex justify-center">
              <IconBtn :disabled="!permissions.delete" @click="showConfirmDeleteItem(item)">
                <VIcon icon="tabler-trash" />
              </IconBtn>

              <VBtn icon variant="text" size="small" color="medium-emphasis">
                <VIcon size="24" icon="tabler-dots-vertical" />

                <VMenu activator="parent">
                  <VList>
                    <VListItem>
                      <template #prepend>
                        <VIcon icon="tabler-eye" />
                      </template>

                      <VListItemTitle>عرض</VListItemTitle>
                    </VListItem>
                    <VListItem :disabled="!permissions.edit">
                      <template #prepend>
                        <VIcon icon="tabler-edit" />
                      </template>

                      <VListItemTitle>تعديل</VListItemTitle>
                    </VListItem>
                    <VListItem :disabled="!permissions.addBalance">
                      <template #prepend>
                        <VIcon icon="tabler-circle-plus" />
                      </template>

                      <VListItemTitle>إضافة رصيد</VListItemTitle>
                    </VListItem>
                  </VList>
                </VMenu>
              </VBtn>
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
      </VCardText>
    </VCard>
  </section>
</template>

<style lang="scss" scoped>
:deep(.v-data-table .v-table__wrapper > table) {
  td {
    max-inline-size: 200px;
    word-wrap: break-word;

    span {
      @include max-lines(2);
    }
  }
}
</style>
