<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import { FILES_TYPES } from '@/constants/index'
import { BANNER_LINK_TYPES } from '@/constants/offers'
import { getFileType } from '@/helpers/file'
import type { pageAction } from '@/interfaces/Shared'
import { useAuthStore } from '@/stores/AuthStore'
import type { Banner } from '../interfaces/Banner'
import BannerDetailsModal from '../modals/BannerDetailsModal.vue'
import { bannersService } from '../services/BannersService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const router = useRouter()
const { hasPermission } = useAuthStore()
const { formatDate } = UseGeneralHelpers()
const MODEL_NAME = 'banners'

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
  showConfirmDeleteItem,
  sortItems,
} = UseCrudHelpers<Banner>(bannersService, params, MODEL_NAME)

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
    title: 'تاريخ البداية/تاريخ النهاية',
    key: 'from_date',
  },
  {
    title: 'نوع الملف',
    key: 'file_type',
  },
  {
    title: 'نوع الرابط',
    key: 'link_type',
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
  create: hasPermission('create_banner'),
  edit: hasPermission('update_banner'),
  delete: hasPermission('delete_banner'),
  changeStatus: hasPermission('change_status_banner'),
  sort: hasPermission('sort_banner'),
}))

const pageActionsButtons = computed<pageAction[]>(() => {
  return [
    {
      icon: 'tabler-plus',
      show: permissions.value.create as boolean,
      handler: gotoCreatePage,
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
  router.push({ name: 'banners-create-page' })
}

// #endregion
</script>

<template>
  <ConfirmModal ref="confirmModal" />
  <BannerDetailsModal v-model:showModal="showDetailsModal" :active-item="activeItem" />
  <VCard title="البنرات" class="page-card">
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
        <template #item.name.ar="{ item }">
          <a
            :href="item.file?.path"
            target="_blank"
            rel="noopener noreferrer"
            class="d-flex align-center"
          >
            <VAvatar size="38" variant="outlined" class="me-3" cover>
              <VImg v-if="item.file" :src="item.file.thumbnail" cover />
              <span v-else>!</span>
            </VAvatar>
            <span style="min-inline-size: 100px">
              {{ item.name.ar }}
            </span>
          </a>
        </template>
        <template #item.name.en="{ item }">
          <span style="min-inline-size: 150px">
            {{ item.name.en }}
          </span>
        </template>
        <template #item.from_date="{ item }">
          <div class="text-no-wrap" style="min-inline-size: 80px">
            {{ formatDate(item.from_date) }}
            <span class="text-sm text-disabled d-block"> {{ formatDate(item.to_date) }}</span>
          </div>
        </template>
        <template #item.file_type="{ item }">
          <div class="d-flex">
            <VChip variant="outlined" color="primary" label v-if="item.file">
              {{ getFileType(item.file.mimetype) === FILES_TYPES.image ? 'صورة' : 'فيديو' }}
            </VChip>
          </div>
        </template>

        <template #item.link_type="{ item }">
          <div class="d-flex">
            <VChip variant="outlined" color="primary" label>
              {{ BANNER_LINK_TYPES[item.link_type as keyof typeof BANNER_LINK_TYPES] }}
            </VChip>
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

            <IconBtn
              :disabled="!permissions.edit"
              :to="{ name: 'banners-edit-page', params: { id: item.id } }"
            >
              <VIcon icon="tabler-edit" />
            </IconBtn>

            <VBtn icon variant="text" size="small" color="medium-emphasis">
              <VIcon size="24" icon="tabler-dots-vertical" />

              <VMenu activator="parent">
                <VList>
                  <VListItem @click="showViewModal(item)">
                    <template #prepend>
                      <VIcon icon="tabler-eye" />
                    </template>

                    <VListItemTitle>عرض</VListItemTitle>
                  </VListItem>

                  <VListItem
                    :disabled="
                      !selectedItems.length || selectedItems.includes(item.id) || !permissions.sort
                    "
                    @click="sortItems(item.id)"
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
