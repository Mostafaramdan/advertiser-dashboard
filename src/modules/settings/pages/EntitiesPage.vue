<script setup lang="ts">
import { useToast } from 'vue-toastification'
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import type { Entity } from '../interfaces/Entity'
import EntitiesFormModal from '../modals/EntitiesFormModal.vue'
import EntityDetailsModal from '../modals/EntityDetailsModal.vue'
import { entitiesService } from '../services/EntitiesService'
import { useAuthStore } from '@/stores/AuthStore'
import { sharedService } from '@/services/SharedService'
import type { MetaData, pageAction } from '@/interfaces/Shared'
import type { FormActionType } from '@/interfaces/Forms'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const toast = useToast()
const { hasPermission } = useAuthStore()

const MODEL_NAME = 'entities'
const selectedItems = ref<number[]>([])
const tableData = ref<Entity[]>([])
const metaData = ref<MetaData | null>(null)
const showFormModal = ref<boolean>(false)
const showDetailsModal = ref<boolean>(false)
const FormAction = ref<FormActionType>('create')
const activeItem = ref<Entity | null>(null)
const confirmModal = ref<any>()

const isLoading = reactive({
  tableData: false,
})

const params = reactive({
  page: 1,
  itemPerPage: 10,
  keyword: '',
})

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
  create: hasPermission('Create Entity'),
  edit: hasPermission('Edit Entity'),
  delete: hasPermission('Delete Entity'),
  changeStatus: hasPermission('ChangeStatus Entity'),
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

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions

function getPageData() {
  isLoading.tableData = true
  entitiesService.getEntities(params)
    .then(res => {
      const { data, meta } = res.data

      tableData.value = data
      metaData.value = meta
    }).finally(() => {
      isLoading.tableData = false
    })
}

function reloadPageData() {
  params.page = 1
  getPageData()
}

function onChangeItemsPerPage(value: number): void {
  params.itemPerPage = value
  reloadPageData()
}

function onChangeSearch(value: string): void {
  params.keyword = value
  getPageData()
}

function onReloadData(): void {
  reloadPageData()
  selectedItems.value = []
}

function deleteItem(item: Entity) {
  console.log('delete')

  const targetItemIndex = selectedItems.value.findIndex((i: number) => i === item.id)
  if (targetItemIndex !== -1) selectedItems.value.splice(targetItemIndex, 1)

  isLoading.tableData = true
  entitiesService.deleteEntity(item.id as number).then(res => {
    console.log(res)
    toast.success(res.data.message)

    const targetIndex = tableData.value.findIndex((i: Entity) => i.id === item.id)

    if (targetIndex === -1) return
    tableData.value.splice(targetIndex, 1)

    // handle meta data and pagination after delete
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
  }).finally(() => {
    isLoading.tableData = false
  })
}

async function showConfirmDeleteItem(item: Entity) {
  const confirm = await confirmModal.value.open('يرجي التاكيد', 'هل انت متاكد من الحذف')
  if (confirm)
    deleteItem(item)
}
function showCrateModal() {
  activeItem.value = null
  FormAction.value = 'create'
  showFormModal.value = true
}

function showEditModal(item: Entity) {
  activeItem.value = item
  FormAction.value = 'edit'
  showFormModal.value = true
}

function showViewModal(item: Entity) {
  activeItem.value = item
  showDetailsModal.value = true
}
function onCreateItem(item: Entity) {
  console.log('created', item)

  reloadPageData()
}

function onEditItem(item: Entity) {
  console.log('edited', item)

  const targetIndex = tableData.value.findIndex((i: Entity) => i.id === item.id)

  if (targetIndex === -1) return
  tableData.value.splice(targetIndex, 1, item)
}

function sortItems(target_id: number) {
  const payload = {
    target_id,
    ids: selectedItems.value,
    model: MODEL_NAME,
  }

  isLoading.tableData = true
  sharedService.sortBulk(payload).then(res => {
    console.log(res)
    toast.success(res.data.message)
    onReloadData()
  }).catch(() => {
    isLoading.tableData = false
  })
}

// #endregion
</script>

<template>
  <ConfirmModal ref="confirmModal" />
  <EntitiesFormModal
    v-if="showFormModal"
    v-model:showModal="showFormModal"
    :form-action="FormAction"
    :active-item="activeItem"
    @create-item="onCreateItem"
    @edit-item="onEditItem"
  />
  <EntityDetailsModal v-model:showModal="showDetailsModal" :active-item="activeItem" />
  <VCard title="الكيانات">
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
        v-loading="isLoading.tableData"
        :headers="headers"
        :items="tableData"
        show-select
        :items-length="metaData?.total || 0"
        item-value="id"
        class="app-table"
        no-data-text="لا يوجد بيانات"
      >
        <template #item.name.ar="{ item }">
          <span>
            {{ item.raw.name.ar }}
          </span>
        </template>
        <template #item.name.en="{ item }">
          <span>
            {{ item.raw.name.en }}
          </span>
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

                  <VListItem :disabled="!selectedItems.length || selectedItems.includes(item.raw.id)" @click="sortItems(item.raw.id)">
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
          <VPagination
            v-if="metaData && metaData.last_page > 1"
            v-model="params.page"
            total-visible="4"
            :length="metaData.last_page"
            class="pt-5 pb-0"
            @update:model-value="getPageData"
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
