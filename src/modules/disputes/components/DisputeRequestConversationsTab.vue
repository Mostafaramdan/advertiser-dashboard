<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import type { MetaData } from '@/interfaces/Shared'
import { useDisputesStore } from '@/stores/DisputesStore'
import type { ConversationsListItem } from '../interfaces/DisputeRequest'
import { requestsService } from '../services/RequestsService'
import DisputeRequestConversationsForm from './DisputeRequestConversationsForm.vue'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const route = useRoute()
const { formatDateTime } = UseGeneralHelpers()
const disputesStore = useDisputesStore()
const isLoading = ref<boolean>(false)
const metaData = ref<MetaData | null>(null)
const messages = ref<ConversationsListItem[]>([])
const disputeRequestId = +route.params.id
const messagesContainerRef = ref()

const params = reactive({
  page: 1,
  itemPerPage: 10,
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const requestDetails = computed(() => disputesStore.requestDetails)
const sortedMessages = computed(() => {
  return messages.value.sort((a: any, b: any) => {
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  })
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
    .getConversations({ id: disputeRequestId, params })
    .then((res) => {
      const { data, meta } = res.data
      metaData.value = meta
      if (params.page === 1) {
        messages.value = data
        scrollToBottom()
      } else messages.value = messages.value.concat(data)
    })
    .finally(() => {
      isLoading.value = false
    })
}

function handleScroll(event: any) {
  const wrapper = event.target
  const { scrollTop } = wrapper
  if (
    scrollTop <= 20 &&
    !isLoading.value &&
    metaData.value &&
    messages.value.length < metaData.value.total
  ) {
    params.page++
    getPageData()
  }
}

function scrollToBottom() {
  const scrollEl = messagesContainerRef.value
  nextTick(() => {
    if (scrollEl) scrollEl.scrollTop = scrollEl.scrollHeight
  })
}

function onMessageSent(message: ConversationsListItem) {
  messages.value.unshift(message)
  if (metaData.value) metaData.value.total++
  scrollToBottom()
}
// #endregion
</script>

<template>
  <section class="chat-tab" v-if="messages">
    <div
      class="messages-container overflow-auto flex-grow-1 pb-2 px-2"
      ref="messagesContainerRef"
      @scroll="handleScroll"
    >
      <div v-if="isLoading" class="text-center mb-2">
        <VProgressCircular :size="30" :width="2" color="primary" indeterminate></VProgressCircular>
      </div>
      <VList :lines="false" class="py-0">
        <template v-for="message of sortedMessages" :key="message.id">
          <VListItem class="px-0 py-2">
            <VListItemTitle class="d-flex justify-space-between gap-x-4 flex-column flex-sm-row">
              <div class="d-flex">
                <VAvatar size="38" variant="tonal" cover class="me-3">
                  <VImg v-if="message.user.image_path" :src="message.user.image_path" cover />
                  <span v-else>!</span>
                </VAvatar>
                <div style="min-width: 205px">
                  <div class="mb-1">{{ message.user.username }}</div>
                  <div v-if="requestDetails" class="d-flex flex-wrap gap-2">
                    <VChip color="primary">
                      {{
                        message.user.id === requestDetails.disputer.id
                          ? 'الشاكي'
                          : message.user.id === requestDetails.disputed.id
                          ? 'المشكي'
                          : 'المنصة'
                      }}
                    </VChip>
                    <template v-if="message.target_user">
                      الي
                      <VChip color="primary">
                        {{ message.target_user.username }}
                      </VChip>
                    </template>
                  </div>
                </div>
              </div>
              <span>
                <VIcon icon="tabler-clock" class="me-2"></VIcon>
                <span class="text-disabled">{{
                  formatDateTime(message.created_at || new Date().toDateString())
                }}</span>
              </span>
            </VListItemTitle>
            <div class="mt-1">{{ message.details }}</div>
            <a
              class="attachment d-flex align-center gap-2 mt-2"
              v-if="message.attachment"
              :href="message.attachment.path"
              target="_blank"
              download
            >
              <VIcon icon="tabler-file-description"></VIcon>
              <span>{{ message.attachment.name }}</span>
            </a>
          </VListItem>
          <VDivider />
        </template>
      </VList>
      <p v-if="!isLoading && messages.length === 0" class="text-body-1 mb-0">لا يوجد بيانات</p>
    </div>
    <DisputeRequestConversationsForm @message:sent="onMessageSent" />
  </section>
</template>

<style lang="scss" scoped>
.chat-tab {
  display: flex;
  flex-direction: column;
  block-size: 80vh;

  :deep(.v-list-item-title) {
    white-space: wrap;
  }

  .attachment {
    svg {
      min-inline-size: 20px;
    }

    span {
      @include max-lines(1);
    }
  }
}
</style>
