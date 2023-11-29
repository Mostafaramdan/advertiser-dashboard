<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import { USERS_ROLES } from '@/constants/index'
import { OFFER_STATUSES, OFFER_TYPES } from '@/constants/offers'
import type { Offer, User } from '@/interfaces/Offer'
import type { pageAction } from '@/interfaces/Shared'
import { offersService } from '@/services/OffersService'
import { useAuthStore } from '@/stores/AuthStore'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const router = useRouter()
const { hasPermission } = useAuthStore()
const { formatDateTime } = UseGeneralHelpers()
const MODEL_NAME = 'offers'
const showNotificationModal = ref<boolean>(false)
const activeUser = ref<User | null>(null)

const params: any = reactive({
  page: 1,
  itemPerPage: 10,
  keyword: '',
  packages: [],
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
} = UseCrudHelpers<Offer>(offersService, params, MODEL_NAME)

const headers: any = [
  {
    title: 'الاسم/حالة العرض',
    key: 'name',
  },
  {
    title: 'المستخدم',
    key: 'user',
  },
  {
    title: 'تاريخ البداية/تاريخ النهاية',
    key: 'from_date',
  },
  {
    title: 'النوع/القسم',
    key: 'offer_type',
  },
  {
    title: 'السعر بعد الخصم/قبل الخصم',
    key: 'discount_price',
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
  sendNotification: hasPermission('notify_users'),
  create: hasPermission('create_offer'),
  edit: hasPermission('update_offer'),
  delete: hasPermission('delete_offer'),
  changeStatus: hasPermission('change_status_offer'),
}))

const pageActionsButtons = computed<pageAction[]>(() => {
  return [
    {
      icon: 'tabler-plus',
      show: permissions.value.create as boolean,
      handler: goToCreatePage,
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
function goToCreatePage() {
  router.push({ name: 'offer-create-page' })
}

function openNotificationModal(user: User) {
  activeUser.value = user
  showNotificationModal.value = true
}
// #endregion
</script>

<template>
  <section>
    <ConfirmModal ref="confirmModal" />
    <NotificationModal
      v-if="activeUser && showNotificationModal"
      v-model:showModal="showNotificationModal"
      :user="activeUser"
    />
    <VCard title="العروض" class="page-card">
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
              <div style="min-inline-size: 150px">
                {{ item.name }}
                <span class="text-sm text-disabled d-block">{{
                  OFFER_STATUSES.get(item.status)?.label
                }}</span>
              </div>
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
              style="min-inline-size: 205px"
            >
              <span>{{ item.user.username }}</span>
              <span class="text-sm text-disabled d-block">{{ USERS_ROLES[item.user.role] }}</span>
            </router-link>
          </template>
          <template #item.from_date="{ item }">
            <div class="text-no-wrap" style="min-inline-size: 80px">
              {{ formatDateTime(item.from_date) }}
              <span class="text-sm text-disabled d-block"> {{ formatDateTime(item.to_date) }}</span>
            </div>
          </template>
          <template #item.offer_type="{ item }">
            <div style="min-inline-size: 120px">
              <span>{{ OFFER_TYPES.get(item.offer_type)?.label }}</span>
              <span class="text-sm text-disabled d-block">{{ item.category_name }}</span>
            </div>
          </template>
          <template #item.discount_price="{ item }">
            <div class="text-no-wrap" style="min-inline-size: 100px">
              {{ item.discount_price }}
              <span class="text-sm text-disabled d-block"> {{ item.main_price }}</span>
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
              <IconBtn
                :to="{
                  name: 'offer-details-page',
                  params: { id: item.id },
                }"
              >
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
                      :to="{ name: 'offer-edit-page', params: { id: item.id } }"
                    >
                      <template #prepend>
                        <VIcon icon="tabler-edit" />
                      </template>

                      <VListItemTitle>تعديل</VListItemTitle>
                    </VListItem>
                    <VListItem
                      v-if="permissions.sendNotification"
                      @click="openNotificationModal(item.user)"
                    >
                      <template #prepend>
                        <VIcon icon="tabler-mail" />
                      </template>
                      <VListItemTitle>ارسال اشعار للمستخدم</VListItemTitle>
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
:deep(.v-data-table .v-table__wrapper > table td) {
  max-inline-size: 250px;
  word-wrap: break-word;

  span {
    @include max-lines(2);
  }
}
</style>
