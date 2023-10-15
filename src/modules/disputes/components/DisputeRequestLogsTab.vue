<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import type { MetaData } from '@/interfaces/Shared'
import type { DisputeRequestLogsItem } from '../interfaces/DisputeRequest'
import { requestsService } from '../services/RequestsService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const route = useRoute()
const { formatDateTime } = UseGeneralHelpers()
const isLoading = ref<boolean>(false)
const metaData = ref<MetaData | null>(null)
const logs = ref<DisputeRequestLogsItem[]>([])
const disputeRequestId = +route.params.id
const params = reactive({
  page: 1,
  itemPerPage: 10,
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
  isLoading.value = true
  requestsService
    .getRequestLogs({ id: disputeRequestId, params })
    .then((res) => {
      const { data, meta } = res.data
      metaData.value = meta
      logs.value = data
    })
    .finally(() => {
      isLoading.value = false
    })
}

// #endregion
</script>

<template>
  <section class="logs-tab" v-loading="isLoading" style="min-height: 100px">
    <div v-if="logs">
      <VList :lines="false" class="py-0">
        <template v-for="(item, index) of logs" :key="item.id">
          <VListItem class="px-0 py-2">
            <VListItemTitle class="d-flex justify-space-between gap-x-4 flex-column flex-md-row">
              <span class="font-weight-bold">{{ item.username }}</span>
              <span>
                <VIcon icon="tabler-clock" class="me-2"></VIcon>
                <span class="text-disabled">{{ formatDateTime(item.created_at) }}</span>
              </span>
            </VListItemTitle>
            <div class="mt-1">{{ item.action }}</div>
            <div class="attachments">
              <a
                class="attachments__item d-flex align-center gap-2 mt-2"
                v-for="attachment of item.attachments"
                :key="attachment.id"
                :href="attachment.path"
                target="_blank"
                download
              >
                <VIcon icon="tabler-file-description"></VIcon>
                <span>{{ attachment.name }}</span>
              </a>
            </div>
          </VListItem>
          <VDivider v-if="index !== logs.length - 1" />
        </template>
      </VList>
      <PagePagination
        v-model:page="params.page"
        :meta-data="metaData"
        :get-page-data="getPageData"
        class="d-flex"
      />
      <p v-if="!isLoading && logs.length === 0" class="text-body-1 mb-0">لا يوجد بيانات</p>
    </div>
  </section>
</template>

<style lang="scss" scoped>
:deep(.v-list-item-title) {
  white-space: wrap;
}

.attachments {
  &__item {
    svg {
      min-inline-size: 20px;
    }

    span {
      @include max-lines(1);
    }
  }
}
</style>
