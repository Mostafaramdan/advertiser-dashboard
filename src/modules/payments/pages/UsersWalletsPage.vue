<script setup lang="ts">
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import { USERS_ROLES } from '@/constants/index'
import { getOptionsArrayFromObject } from '@/helpers/index'
import type { UserWallet } from '../interfaces/UserWallet'
import { usersWalletsService } from '../services/UsersWalletsService'
/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const params: any = reactive({
  page: 1,
  itemPerPage: 10,
  keyword: '',
  user_role: null,
})

const {
  tableData,
  metaData,
  IsLoadingData,
  getPageData,
  onReloadData,
  onChangeItemsPerPage,
  onChangeSearch,
} = UseCrudHelpers<UserWallet>(usersWalletsService, params, '')

const headers: any = [
  {
    title: 'المستخدم',
    key: 'user',
  },
  {
    title: 'م.المبيعات/م.السحب',
    key: 'sales_total',
  },
  {
    title: 'م.المشتريات/الرصيد الحالي',
    key: 'purchases_total',
  },
  {
    title: 'رصيد معلق/رصيد قابل للسحب',
    key: 'pending_balance',
  },
  {
    title: 'م.النقاط المحولة/نقاط معلقة',
    key: 'transferred_points',
  },
  {
    title: 'نقاط قابلة للتحويل/كود التسويق',
    key: 'available_points',
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

// #endregion
</script>

<template>
  <section>
    <VCard class="page-card" title="محافظ المستخدمين">
      <VCardText>
        <PageActions
          :items-per-page="params.itemPerPage"
          @update:items-per-page="onChangeItemsPerPage"
          @update:search="onChangeSearch"
          @reload-data="onReloadData"
        >
          <div class="v-col-md-4 pa-0">
            <AppSelect
              v-model="params.user_role"
              :items="getOptionsArrayFromObject(USERS_ROLES)"
              item-title="label"
              item-value="value"
              name="user_role"
              label="نوع المستخدم"
              clearable
              hide-default-label
              @update:model-value="onReloadData"
            />
          </div>
          <span class="me-auto" />
        </PageActions>
        <VDataTableServer
          v-loading="IsLoadingData"
          :headers="headers"
          :items="tableData"
          :items-length="metaData?.total || 0"
          class="app-table"
          :no-data-text="IsLoadingData ? t('general.loading') : t('general.no_data')"
        >
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
                <span>{{ item.user.username }}</span>
                <span class="text-sm text-disabled d-block">{{ USERS_ROLES[item.user.role] }}</span>
              </span>
            </router-link>
          </template>
          <template #item.sales_total="{ item }">
            <div class="text-no-wrap" style="min-inline-size: 80px">
              {{ item.sales_total }}
              <span class="text-sm text-disabled d-block"> {{ item.withdrawn_total }}</span>
            </div>
          </template>
          <template #item.purchases_total="{ item }">
            <div class="text-no-wrap" style="min-inline-size: 80px">
              {{ item.purchases_total }}
              <span class="text-sm text-disabled d-block"> {{ item.current_balance }}</span>
            </div>
          </template>
          <template #item.pending_balance="{ item }">
            <div class="text-no-wrap" style="min-inline-size: 100px">
              {{ item.pending_balance }}
              <span class="text-sm text-disabled d-block"> {{ item.withdrawn_balance }}</span>
            </div>
          </template>
          <template #item.transferred_points="{ item }">
            <div class="text-no-wrap" style="min-inline-size: 100px">
              {{ item.transferred_points }}
              <span class="text-sm text-disabled d-block"> {{ item.pending_points }}</span>
            </div>
          </template>
          <template #item.available_points="{ item }">
            <div class="text-no-wrap" style="min-inline-size: 120px">
              {{ item.available_points }}
              <span class="text-sm text-disabled d-block"> {{ item.shopping_code }}</span>
            </div>
          </template>

          <template #item.actions="{ item }">
            <div class="d-flex justify-center">
              <VBtn icon variant="text" size="small" color="medium-emphasis">
                <VIcon size="24" icon="tabler-dots-vertical" />

                <VMenu activator="parent">
                  <VList>
                    <VListItem>
                      <template #prepend>
                        <VIcon icon="tabler-history" />
                      </template>
                      <VListItemTitle>سجل العمليات</VListItemTitle>
                    </VListItem>
                    <VListItem>
                      <template #prepend>
                        <VIcon icon="tabler-wallet" />
                      </template>
                      <VListItemTitle>سجل الصرف</VListItemTitle>
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
  td,
  th {
    padding-inline: 8px;
  }

  td {
    max-inline-size: 200px;
    word-wrap: break-word;

    span {
      @include max-lines(2);
    }
  }
}

:deep(.search-input) {
  margin: 0 !important;
}
</style>
