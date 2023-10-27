<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import type { MetaData } from '@/interfaces/Shared'
import { useAuthStore } from '@/stores/AuthStore'
import { useTicketsStore } from '@/stores/TicketsStore'
import type { ConversationsListItem } from '../interfaces/SupportTicket'
import { supportTicketsService } from '../services/SupportTicketsService'
import TicketConversationsForm from './TicketConversationsForm.vue'
/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const route = useRoute()
const { formatDateTime } = UseGeneralHelpers()
const ticketsStore = useTicketsStore()
const { hasPermission } = useAuthStore()
const isLoading = ref<boolean>(false)
const metaData = ref<MetaData | null>(null)
const messages = ref<ConversationsListItem[]>([])
const ticketId = +route.params.id
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
const ticketBasicData = computed(() => ticketsStore.ticketBasicData)

const permissions = computed(() => ({
  sendMessage: hasPermission('reply_ticket'),
}))

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
  supportTicketsService
    .getConversations({ id: ticketId, params })
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
  <section class="conversations-tab" v-if="messages">
    <div
      class="messages-container overflow-auto pb-2 px-2"
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
                <div style="min-inline-size: 205px">
                  <div class="mb-1">{{ message.user.account_name }}</div>
                  <div v-if="ticketBasicData" class="d-flex flex-wrap gap-2">
                    <VChip color="primary">
                      {{ message.user.id === ticketBasicData.user.id ? 'مقدم التذكرة' : 'المنصة' }}
                    </VChip>
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
            <div class="d-flex flex-wrap gap-x-4 gap-y-2" v-if="message.attachments.length">
              <a
                v-for="attachment in message.attachments"
                :key="attachment.id"
                class="attachment d-flex align-center gap-2 mt-2"
                :href="attachment.path"
                target="_blank"
                download
              >
                <VIcon icon="tabler-file-description"></VIcon>
                <span>{{ attachment.name }}</span>
              </a>
            </div>
          </VListItem>
          <VDivider />
        </template>
      </VList>
      <p v-if="!isLoading && messages.length === 0" class="text-body-1 mb-0">لا يوجد بيانات</p>
    </div>
    <VAlert
      class="overflow-visible"
      v-if="!permissions.sendMessage"
      color="error"
      variant="tonal"
      icon="mdi-alert-outline"
    >
      ليس لديك الصلاحيات لإرسال رسالة
    </VAlert>
    <template v-else-if="ticketBasicData">
      <TicketConversationsForm
        @message:sent="onMessageSent"
        v-if="!['cancelled', 'finished'].includes(ticketBasicData.status)"
      />
      <VAlert
        v-else
        class="overflow-visible"
        color="error"
        variant="tonal"
        icon="mdi-alert-outline"
      >
        لا يمكن إرسال رد علي هذه التذكرة . هذه التذكرة غير نشطة الان
      </VAlert>
    </template>
  </section>
</template>
