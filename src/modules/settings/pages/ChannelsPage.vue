<script setup lang="ts">
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import type { Channel } from '../interfaces/Channel'
import ChannelDetailsModal from '../modals/ChannelDetailsModal.vue'
import ChannelFormModal from '../modals/ChannelFormModal.vue'
import { channelsService } from '../services/ChannelsService'
import { useAuthStore } from '@/stores/AuthStore'
import type { pageAction } from '@/interfaces/Shared'
import { CHANNEL_TYPES } from '@/constants/settings'
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const { hasPermission } = useAuthStore()
const MODEL_NAME = 'channels'

const params = reactive({
  page: 1,
  itemPerPage: 10,
  keyword: '',
})

const {
  selectedItems,
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
} = UseCrudHelpers<Channel>(channelsService, params, MODEL_NAME)

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
    title: 'نسبة المتابعين',
    key: 'followers_percentage',
    align: 'center',
  },
  {
    title: 'النوع',
    key: 'channel_type',
    align: 'center',
  },
  {
    title: 'الحالة',
    key: 'blocked_at',
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
  create: hasPermission('create_channel'),
  edit: hasPermission('update_channel'),
  delete: hasPermission('delete_channel'),
  changeStatus: hasPermission('change_status_channel'),
  sort: hasPermission('sort_channel'),
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
  <ChannelFormModal
    v-if="showFormModal"
    v-model:showModal="showFormModal"
    :form-action="FormAction"
    :active-item="activeItem"
    @edit-item="onEditItem"
    @create-item="onCreateItem"
  />
  <ChannelDetailsModal v-model:showModal="showDetailsModal" :active-item="activeItem" />
  <VCard title="القنوات" class="page-card">
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
          <div class="d-flex align-center">
            <VAvatar
              size="38"
              variant="tonal"
              class="me-3"
              cover
            >
              <VImg
                v-if="item.raw.image"
                :src="item.raw.image.path"
                cover
              />
              <span v-else>!</span>
            </VAvatar>
            <span>
              {{ item.raw.name.ar }}
            </span>
          </div>
        </template>
        <template #item.name.en="{ item }">
          <span>
            {{ item.raw.name.en }}
          </span>
        </template>

        <template #item.channel_type="{ item }">
          <VChip
            variant="outlined"
            color="primary"
            label
          >
            {{ CHANNEL_TYPES[item.raw.channel_type as 1 | 2] }}
          </VChip>
        </template>

        <template #item.blocked_at="{ item }">
          <ToggleActivationSwitch
            :id="item.raw.id"
            v-model="item.raw.blocked_at"
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

            <VBtn
              icon
              variant="text"
              size="small"
              color="medium-emphasis"
            >
              <VIcon
                size="24"
                icon="tabler-dots-vertical"
              />

              <VMenu activator="parent">
                <VList>
                  <VListItem @click="showViewModal(item.raw)">
                    <template #prepend>
                      <VIcon icon="tabler-eye" />
                    </template>

                    <VListItemTitle>عرض</VListItemTitle>
                  </VListItem>

                  <VListItem v-if="permissions.sort" :disabled="!selectedItems.length || selectedItems.includes(item.raw.id)" @click="sortItems(item.raw.id)">
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

  .v-img__img--contain {
    object-fit: cover;
  }
}
</style>
