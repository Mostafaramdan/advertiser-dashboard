<script setup lang="ts">
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import { useAuthStore } from '@/stores/AuthStore'
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import type { Country } from '../interfaces/Country'
import CountryDetailsModal from '../modals/CountryDetailsModal.vue'
import { countriesService } from '../services/CountriesService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const { hasPermission } = useAuthStore()
const MODEL_NAME = 'countries'

const params = reactive({
  page: 1,
  itemPerPage: 10,
  keyword: '',
})

const {
  selectedItems,
  tableData,
  metaData,
  showDetailsModal,
  activeItem,
  confirmModal,
  IsLoadingData,
  getPageData,
  onReloadData,
  onChangeItemsPerPage,
  onChangeSearch,
  showViewModal,
  sortItems,
} = UseCrudHelpers<Country>(countriesService, params, MODEL_NAME)

const headers: any = [
  {
    title: '#',
    key: 'sort',
  },
  {
    title: 'الاسم عربي',
    key: 'name.ar',
  },
  {
    title: 'الاسم انجليزي',
    key: 'name.en',
  },
  {
    title: 'رمز الدولة',
    key: 'iso_name',
    align: 'center',
  },
  {
    title: 'عدد المناطق',
    key: 'areas_count',
    align: 'center',
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
  changeStatus: hasPermission('change_status_country'),
  sort: hasPermission('sort_country'),
  viewAreas: hasPermission('view_areas'),
}))

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
getPageData()

// #endregion
</script>

<template>
  <ConfirmModal ref="confirmModal" />
  <CountryDetailsModal v-model:showModal="showDetailsModal" :active-item="activeItem" />
  <VCard title="الدول" class="page-card">
    <VCardText>
      <PageActions
        :items-per-page="params.itemPerPage"
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
        <template #item.name.ar="{ item }">
          <a
            :href="item.raw.google_map"
            target="_blank"
            rel="noopener noreferrer"
            class="d-inline-flex align-center"
            style="min-inline-size: 120px"
          >
            <VAvatar size="38" variant="tonal" class="me-3" cover>
              <VImg v-if="item.raw.image" :src="item.raw.image" cover />
              <span v-else>!</span>
            </VAvatar>
            <span>
              {{ item.raw.name.ar }}
            </span>
          </a>
        </template>
        <template #item.name.en="{ item }">
          <span style="min-inline-size: 120px">
            {{ item.raw.name.en }}
          </span>
        </template>
        <template #item.is_active="{ item }">
          <ToggleActivationSwitch
            :id="item.raw.id"
            v-model="item.raw.is_active"
            :model="MODEL_NAME"
            :disabled="!permissions.changeStatus"
          />
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex justify-center">
            <IconBtn>
              <VIcon icon="tabler-eye" @click="showViewModal(item.raw)" />
            </IconBtn>

            <VBtn icon variant="text" size="small" color="medium-emphasis">
              <VIcon size="24" icon="tabler-dots-vertical" />

              <VMenu activator="parent">
                <VList>
                  <VListItem
                    v-if="permissions.viewAreas"
                    :to="{ name: 'areas-settings', params: { id: item.raw.id } }"
                  >
                    <template #prepend>
                      <VIcon icon="tabler-view-360" />
                    </template>

                    <VListItemTitle>عرض المناطق</VListItemTitle>
                  </VListItem>

                  <VListItem
                    v-if="permissions.sort"
                    :disabled="!selectedItems.length || selectedItems.includes(item.raw.id)"
                    @click="sortItems(item.raw.id)"
                  >
                    <template #prepend>
                      <VIcon icon="tabler-transfer-in" />
                    </template>
                    <VListItemTitle>نقل</VListItemTitle>
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
