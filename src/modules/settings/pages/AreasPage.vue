<script setup lang="ts">
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import type { Area } from '../interfaces/Area'
import AreaDetailsModal from '../modals/AreaDetailsModal.vue'
import AreaFormModal from '../modals/AreaFormModal.vue'
import { areasService } from '../services/AreasService'
import { useAuthStore } from '@/stores/AuthStore'
import type { pageAction } from '@/interfaces/Shared'
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t, locale } = useI18n()
const { hasPermission } = useAuthStore()
const route = useRoute()
const MODEL_NAME = 'areas'

const params = reactive({
  page: 1,
  itemPerPage: 10,
  keyword: '',
  country_id: route.params.id,
})

const {
  selectedItems,
  responseData,
  tableData,
  metaData,
  showFormModal,
  showDetailsModal,
  FormAction,
  activeItem,
  confirmModal,
  IsLoadingData,
  getPageData,
  onReloadData,
  onChangeItemsPerPage,
  onChangeSearch,
  showCrateModal,
  showEditModal,
  showViewModal,
  onEditItem,
  onCreateItem,
  showConfirmDeleteItem,
  sortItems,
} = UseCrudHelpers<Area>(areasService, params, MODEL_NAME)

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
    title: 'رمز المنطقة',
    key: 'area_code',
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
  create: hasPermission('create_area'),
  edit: hasPermission('update_area'),
  delete: hasPermission('delete_area'),
  changeStatus: hasPermission('change_status_area'),
  sort: hasPermission('sort_area'),
}))

const pageActionsButtons = computed<pageAction[]>(() => {
  return [
    {
      icon: 'tabler-plus',
      show: permissions.value.create as boolean,
      handler: showCrateModal,
    },
  ]
})

const country = computed(() => {
  return responseData.country
})

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
  <AreaFormModal
    v-if="showFormModal"
    v-model:showModal="showFormModal"
    :form-action="FormAction"
    :active-item="activeItem"
    @create-item="onCreateItem"
    @edit-item="onEditItem"
  />
  <AreaDetailsModal v-model:showModal="showDetailsModal" :active-item="activeItem" />
  <VCard class="page-card">
    <template #title>
      <div v-if="country" class="d-flex align-center">
        <PageBackBtn :link="{ name: 'countries-settings' }" />
        <VAvatar size="38" variant="tonal" class="me-3" cover>
          <VImg cover :src="country.image" />
        </VAvatar>
        <div>
          مناطق
          {{ country.name[locale] }}
        </div>
      </div>
    </template>
    <VCardText>
      <PageActions
        :page-actions-buttons="pageActionsButtons"
        :items-per-page="params.itemPerPage"
        :show-multi-delete="permissions.delete"
        :show-multi-activate="permissions.changeStatus"
        :model="MODEL_NAME"
        :selected-items="selectedItems"
        :back-link="{ name: 'countries-settings' }"
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
            :href="item.raw.location_url"
            target="_blank"
            rel="noopener noreferrer"
            class="d-inline-flex align-center"
            style="min-width: 120px"
          >
            <span>
              {{ item.raw.name.ar }}
            </span>
          </a>
        </template>
        <template #item.name.en="{ item }">
          <span style="min-width: 120px">
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
            <IconBtn :disabled="!permissions.delete">
              <VIcon icon="tabler-trash" @click="showConfirmDeleteItem(item.raw)" />
            </IconBtn>

            <IconBtn :disabled="!permissions.edit">
              <VIcon icon="tabler-edit" @click="showEditModal(item.raw)" />
            </IconBtn>

            <VBtn icon variant="text" size="small" color="medium-emphasis">
              <VIcon size="24" icon="tabler-dots-vertical" />

              <VMenu activator="parent">
                <VList>
                  <VListItem @click="showViewModal(item.raw)">
                    <template #prepend>
                      <VIcon icon="tabler-eye" />
                    </template>

                    <VListItemTitle>عرض</VListItemTitle>
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
