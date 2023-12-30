<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import type { AdSpaceShare } from '../interfaces/AdsSpace'
import { adsSpacesService } from '../services/AdsSpacesService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const route = useRoute()
const { formatDateTime } = UseGeneralHelpers()
const adSpaceId = +route.params.id
const params = reactive({
  page: 1,
  itemPerPage: 10,
  keyword: '',
  user_id: null,
})

const { tableData, metaData, IsLoadingData } = UseCrudHelpers<AdSpaceShare>(null, null, '')
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
function getPageData(): void {
  IsLoadingData.value = true
  adsSpacesService
    .getShares({ id: adSpaceId, params })
    .then((res: any) => {
      const { data, meta } = res.data
      tableData.value = data
      metaData.value = meta
    })
    .finally(() => {
      IsLoadingData.value = false
    })
}

/**
 * @description reload page data
 * @return  {void}
 */
function reloadPageData(): void {
  params.page = 1
  getPageData()
}

/**
 * @description update search keyword and reload page data
 * @param  {string} value
 * @return  {void}
 */
function onChangeSearch(value: string): void {
  params.keyword = value
  reloadPageData()
}

/**
 * @description update items per page and reload page data
 * @param  {number} value
 * @return  {void}
 */
function onChangeItemsPerPage(value: number): void {
  params.itemPerPage = value
  reloadPageData()
}

function getUpdatedRequestDetails(item: AdSpaceShare, index: number): void {
  IsLoadingData.value = true
  adsSpacesService
    .getUpdatedRequestDetails(item.id)
    .then((res) => {
      const response = { ...res.data.data }
      item = {
        ...item,
        channels: response.channels,
        shares_watches_count: response.shares_watches_count,
      }
      tableData.value.splice(index, 1, item)
    })
    .finally(() => {
      IsLoadingData.value = false
    })
}

// #endregion
</script>

<template>
  <section>
    <div>
      <PageActions
        :items-per-page="params.itemPerPage"
        @update:items-per-page="onChangeItemsPerPage"
        @update:search="onChangeSearch"
        @reload-data="reloadPageData"
      />

      <div v-if="tableData">
        <VRow v-loading="IsLoadingData" style="min-block-size: 200px">
          <VCol cols="12" md="6" v-for="(item, index) of tableData" :key="item.id">
            <VCard elevation="1" class="h-100 border">
              <VCardText class="pa-3">
                <VListItemTitle class="d-flex justify-space-between gap-3 mb-2 flex-wrap">
                  <span>
                    <VIcon icon="tabler-hash" class="me-2"></VIcon>
                    <span class="text-disabled">{{ item.id }}</span>
                  </span>
                  <span>
                    <VIcon icon="tabler-clock" class="me-2"></VIcon>
                    <span class="text-disabled">{{ formatDateTime(item.created_at) }}</span>
                  </span>
                </VListItemTitle>
                <div class="d-flex align-start">
                  <div class="d-flex flex-column align-center me-3 py-1">
                    <VAvatar size="38" variant="tonal" cover>
                      <VImg v-if="item.user.image_path" :src="item.user.image_path" cover />
                      <span v-else>!</span>
                    </VAvatar>
                  </div>
                  <div style="word-wrap: break-word">
                    {{ item.user.account_name }}
                    <span class="text-sm text-disabled d-block"
                      >{{ item.user.country }} - {{ item.user.area_name }}</span
                    >
                  </div>
                </div>
                <div class="d-flex justify-space-between gap-3 mb-2 align-center">
                  <span>
                    <VIcon icon="tabler-eye" class="me-2"></VIcon>
                    <span class="text-disabled">{{ item.shares_watches_count }}</span>
                  </span>
                  <VBtn
                    size="small"
                    height="35"
                    width="35"
                    variant="outlined"
                    class="rounded-circle"
                    icon="tabler-refresh"
                    @click="getUpdatedRequestDetails(item, index)"
                  >
                  </VBtn>
                </div>
                <div class="d-flex flex-wrap gap-2 mt-2" v-if="item.channels?.length">
                  <a
                    :href="channel.url"
                    target="_blank"
                    class="rounded border pa-1 d-flex align-center flex-grow-1 text-sm"
                    v-for="channel in item.channels"
                    :key="channel.id"
                  >
                    <VAvatar size="33" variant="outlined" cover class="me-3">
                      <VImg
                        v-if="channel.channel.image_path"
                        :src="channel.channel.image_path"
                        cover
                      />
                      <span v-else>!</span>
                    </VAvatar>
                    <div class="flex-grow-1">
                      <div class="d-flex flex-wrap gap-2 justify-space-between">
                        {{ channel.channel.label }}
                        <VTooltip location="top">
                          <template v-slot:activator="{ props }">
                            <VIcon
                              v-bind="props"
                              :icon="
                                channel.is_confirmed
                                  ? 'tabler-circle-check'
                                  : 'tabler-playstation-x'
                              "
                              :color="channel.is_confirmed ? 'success' : 'error'"
                            />
                          </template>
                          <span> {{ channel.is_confirmed ? 'مؤكد' : 'غير مؤكد' }}</span>
                        </VTooltip>
                      </div>
                      <span class="text-sm text-disabled">{{ channel.watches_count }}</span>
                    </div>
                  </a>
                </div>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
        <PagePagination
          v-model:page="params.page"
          :meta-data="metaData"
          :get-page-data="getPageData"
          class="d-flex"
        />
        <p v-if="!IsLoadingData && tableData.length === 0" class="text-body-1 mb-0">
          لا يوجد بيانات
        </p>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
