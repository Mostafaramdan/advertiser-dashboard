<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import { EMPLOYEES_TYPES } from '@/constants/team'
import type { pageAction } from '@/interfaces/Shared'
import { useAuthStore } from '@/stores/AuthStore'
import type { Employee } from '../interfaces/Employee'
import { employeesService } from '../services/EmployeesService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const router = useRouter()
const { hasPermission } = useAuthStore()
const { formatDateTime } = UseGeneralHelpers()
const MODEL_NAME = 'admins'

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
} = UseCrudHelpers<Employee>(employeesService, params, MODEL_NAME)

const headers: any = [
  {
    title: 'الاسم/البريد الالكتروني',
    key: 'name',
  },
  {
    title: 'تاريخ الاضافة/رقم الجوال',
    key: 'created_at',
  },
  {
    title: 'النوع/الكود',
    key: 'type',
  },
  {
    title: 'الوظيفة/القسم',
    key: 'role_category_name',
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
  create: hasPermission('create_admin'),
  edit: hasPermission('update_admin'),
  delete: hasPermission('delete_admin'),
  changeStatus: hasPermission('change_status_admin'),
  viewDetails: hasPermission('view_admin_details'),
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
  router.push({ name: 'employees-create-page' })
}

function gotoDetailsPage(item: Employee) {
  router.push({ name: 'employees-details-page', params: { id: item.id } })
}
// #endregion
</script>

<template>
  <ConfirmModal ref="confirmModal" />
  <VCard title="الموظفين" class="page-card">
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
            <div style="min-inline-size: 205px">
              {{ item.name }}
              <span class="text-sm text-disabled d-block">{{ item.email }}</span>
            </div>
          </div>
        </template>
        <template #item.created_at="{ item }">
          <div class="text-no-wrap">
            {{ formatDateTime(item.created_at) }}
            <span class="text-sm text-disabled d-block"> {{ item.phone }}</span>
          </div>
        </template>
        <template #item.type="{ item }">
          <div class="text-no-wrap">
            {{ EMPLOYEES_TYPES[item.type] }}
            <span class="text-sm text-disabled d-block"> {{ item.code }}</span>
          </div>
        </template>
        <template #item.role_category_name="{ item }">
          <div style="min-inline-size: 150px">
            <span>{{ item.role?.label }}</span>
            <span class="text-sm text-disabled d-block"> {{ item.role_category_name }}</span>
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
            <IconBtn :disabled="!permissions.viewDetails" @click="gotoDetailsPage(item)">
              <VIcon icon="tabler-eye" />
            </IconBtn>

            <VBtn icon variant="text" size="small" color="medium-emphasis">
              <VIcon size="24" icon="tabler-dots-vertical" />

              <VMenu activator="parent">
                <VList>
                  <VListItem :disabled="!permissions.delete" @click="showConfirmDeleteItem(item)">
                    <template #prepend>
                      <VIcon icon="tabler-trash" />
                    </template>

                    <VListItemTitle>حذف</VListItemTitle>
                  </VListItem>
                  <VListItem
                    :disabled="!permissions.edit"
                    :to="{ name: 'employees-edit-page', params: { id: item.id } }"
                  >
                    <template #prepend>
                      <VIcon icon="tabler-edit" />
                    </template>

                    <VListItemTitle>تعديل</VListItemTitle>
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
