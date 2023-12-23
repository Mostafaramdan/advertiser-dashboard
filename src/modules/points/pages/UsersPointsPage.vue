<script setup lang="ts">
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import { USERS_ROLES } from '@/constants/index'
import { getOptionsArrayFromObject } from '@/helpers/index'
import { useAuthStore } from '@/stores/AuthStore'
import type { UserPoint } from '../interfaces/UserPoint'
import { usersPointsService } from '../services/UsersPointsService'
/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const { hasPermission } = useAuthStore()
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
} = UseCrudHelpers<UserPoint>(usersPointsService, params, '')

const headers: any = [
  {
    title: 'المستخدم',
    key: 'user',
  },
  {
    title: 'نقاط حالية/قيمة النقاط الحالية',
    key: 'current_points',
  },
  {
    title: 'نقاط مكتسبة/قيمة مكتسبة',
    key: 'earned_points',
  },
  {
    title: 'نقاط معلقة/نقاط قابلة للتحويل',
    key: 'pending_points',
  },
  {
    title: 'معادلة النقاط/م/النقاط المحولة',
    key: 'equation',
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
  viewLogs: hasPermission('view_points_logs'),
}))
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
    <VCard class="page-card" title="نقاط المستخدمين">
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
          <template #item.current_points="{ item }">
            <div class="text-no-wrap" style="min-inline-size: 80px">
              {{ item.current_points }}
              <span class="text-sm text-disabled d-block">
                {{ item.points_value }} {{ item.currency }}</span
              >
            </div>
          </template>
          <template #item.earned_points="{ item }">
            <div class="text-no-wrap" style="min-inline-size: 80px">
              {{ item.earned_points }}
              <span class="text-sm text-disabled d-block">
                {{ item.earned_points_value }} {{ item.currency }}</span
              >
            </div>
          </template>
          <template #item.pending_points="{ item }">
            <div class="text-no-wrap" style="min-inline-size: 80px">
              {{ item.pending_points }}
              <span class="text-sm text-disabled d-block"> {{ item.available_points }}</span>
            </div>
          </template>
          <template #item.equation="{ item }">
            <div style="min-inline-size: 100px">
              {{ item.equation }}
              <span class="text-sm text-disabled d-block"> {{ item.transformed_points }}</span>
            </div>
          </template>
          <template #item.actions="{ item }">
            <div class="d-flex justify-center">
              <VBtn icon variant="text" size="small" color="medium-emphasis">
                <VIcon size="24" icon="tabler-dots-vertical" />

                <VMenu activator="parent">
                  <VList>
                    <VListItem
                      :to="{
                        name: 'points-logs-page',
                        query: { user_id: item.user.id, username: item.user.username },
                      }"
                      :disabled="!permissions.viewLogs"
                    >
                      <template #prepend>
                        <VIcon icon="tabler-history" />
                      </template>
                      <VListItemTitle>سجل العمليات</VListItemTitle>
                    </VListItem>
                    <!-- TODO: Add action -->
                    <VListItem>
                      <template #prepend>
                        <VIcon icon="tabler-arrows-transfer-down" />
                      </template>
                      <VListItemTitle>سجل التحويلات</VListItemTitle>
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
