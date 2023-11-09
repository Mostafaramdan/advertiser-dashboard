<script setup lang="ts">
import type { MetaData } from '@/interfaces/Shared'
import { avatarText } from '@core/utils/formatters'
import { useVModel } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import type { SupportTicket, SupportTicketAdminRole } from '../interfaces/SupportTicket'
import { supportTicketsService } from '../services/SupportTicketsService'
/* @ts-expect-error for lodash */
import { debounce } from 'lodash'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(
  defineProps<{
    showModal: boolean
    ticketId: number
    transferTicketRole: SupportTicketAdminRole
  }>(),
  {
    showModal: false,
  },
)

// #endregion

/***************************************
 **** Section Emits Declaration ********
 **************************************/
// #region Emits
const emit = defineEmits<{
  (e: 'update:showModal', value: boolean): void
  (e: 'transfer:ticket', value: SupportTicket): void
}>()

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const toast = useToast()
const showModal = useVModel(props, 'showModal', emit)
const selectedAdminId = ref<number | null>(null)
const adminsList = ref<any>([])
const metaData = ref<MetaData | null>(null)
const params = reactive({
  page: 1,
  itemPerPage: 10,
  keyword: '',
})
const isLoading = reactive({
  data: false,
  submit: false,
})

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
getData()
// #endregion

/***************************************
 **** Section Functions  *********
 **************************************/
// #region Functions
function submit() {
  if (!selectedAdminId.value) return
  const payload = {
    id: props.ticketId,
    data: {
      admin_id: selectedAdminId.value,
      role_type: props.transferTicketRole,
    },
  }

  isLoading.submit = true
  supportTicketsService
    .transferTicketToAdmin(payload)
    .then((res) => {
      const { message, data } = res.data
      toast.success(message)
      emit('transfer:ticket', data)
      showModal.value = false
    })
    .finally(() => {
      isLoading.submit = false
    })
}

function getData() {
  isLoading.data = true
  supportTicketsService
    .getAvailableAdmins({ id: props.ticketId, params })
    .then((res) => {
      const { data, meta } = res.data

      metaData.value = meta
      if (params.page === 1) {
        adminsList.value = data
      } else adminsList.value = adminsList.value.concat(data)
    })
    .finally(() => {
      isLoading.data = false
    })
}

function handleScroll(event: any) {
  const wrapper = event.target
  const { scrollTop } = wrapper
  if (
    scrollTop <= 20 &&
    !isLoading.data &&
    metaData.value &&
    adminsList.value.length < metaData.value.total
  ) {
    params.page++
    getData()
  }
}

const handleDebounceSearch = debounce((value: any) => {
  selectedAdminId.value = null
  params.keyword = value
  params.page = 1
  getData()
}, 500)

// #endregion
</script>

<template>
  <VDialog v-model="showModal" max-width="600" persistent>
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="showModal = !showModal" />

    <!-- Dialog Content -->
    <VCard>
      <VCardTitle class="pb-0 pt-3">تحويل التذكرة</VCardTitle>
      <VCardText class="pa-0 overflow-visible">
        <div class="chat-list-header my-3 px-4">
          <VTextField
            clearable
            placeholder="بحث"
            @update:model-value="handleDebounceSearch"
            :model-value="params.keyword"
          >
            <template #prepend-inner>
              <VIcon size="22" icon="tabler-search" />
            </template>
          </VTextField>
        </div>
      </VCardText>
      <VDivider />
      <div style="block-size: 2px">
        <VProgressLinear
          v-if="isLoading.data"
          indeterminate
          color="primary"
          height="2"
        ></VProgressLinear>
      </div>
      <VCardText style="block-size: 400px; overflow-y: auto" class="pa-0" @scroll="handleScroll">
        <VRadioGroup v-model="selectedAdminId">
          <VList lines="two" class="py-0 users-list">
            <template v-for="(contact, index) in adminsList" :key="contact.id">
              <VListItem
                class="users-list__card"
                :class="{ active: selectedAdminId === contact.id }"
                @click="selectedAdminId = contact.id"
              >
                <template #prepend>
                  <VRadio color="primary" :value="contact.id"></VRadio>
                  <VAvatar size="40" variant="outlined">
                    <VImg v-if="contact.image_path" :src="contact.image_path" alt="admin image" />
                    <span v-else>{{ avatarText(contact.name) }}</span>
                  </VAvatar>
                </template>
                <VListItemTitle>
                  {{ contact.name }}
                </VListItemTitle>
                <VListItemSubtitle>
                  <span class="text-xs text-medium-emphasis">{{ contact.email }}</span>
                </VListItemSubtitle>
              </VListItem>
              <VDivider v-if="index !== adminsList.length - 1" />
            </template>
          </VList>
        </VRadioGroup>

        <VCardText v-if="!isLoading.data && adminsList.length === 0" class="text-body-1">
          لا يوجد بيانات
        </VCardText>
      </VCardText>

      <VDivider />
      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn variant="outlined" color="error" @click="showModal = false">
          {{ t('actions.cancel') }}
        </VBtn>
        <VBtn
          :loading="isLoading.submit"
          :disabled="isLoading.submit || !selectedAdminId"
          @click="submit"
        >
          تحويل
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style lang="scss" scoped>
.users-list {
  &__card {
    transition: all 0.3s;

    &:hover,
    &.active {
      background: rgba(var(--v-theme-secondary), 15%);
    }
  }
}

:deep(.v-radio-group .v-selection-control-group .v-radio:not(:last-child)) {
  margin-inline-end: 5px;
}

:deep(.v-list-item__prepend > .v-avatar ~ .v-list-item__spacer) {
  inline-size: 10px;
}
</style>
