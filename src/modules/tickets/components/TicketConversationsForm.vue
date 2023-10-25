<script setup lang="ts">
import ReadyRepliesSelectionModal from '@/components/shared/ReadyRepliesSelectionModal.vue'
import type { File } from '@/interfaces/Shared'
import type { ConversationForm, ConversationsListItem } from '../interfaces/SupportTicket'
import { supportTicketsService } from '../services/SupportTicketsService'

/***************************************
 **** Section Emits Declaration ********
 **************************************/
// #region Emits
const emit = defineEmits<{
  (e: 'message:sent', value: ConversationsListItem): void
}>()

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const route = useRoute()
const disputeRequestId = +route.params.id
const showUploadBox = ref<boolean>(false)
const showRepliesModal = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const formData = reactive<ConversationForm>({
  details: '',
  file: null,
  file_id: null,
})
// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
let isValid = computed(() => formData.details.trim() || formData.file?.id)
// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function updateFileId(file: File) {
  if (file) formData.file_id = file.id
}

function resetUploadBox() {
  formData.file = null
  formData.file_id = null
  showUploadBox.value = false
}

function onSelectReply(reply: string) {
  formData.details = reply
}

function sendMessage() {
  const payload = {
    data: { ...formData },
    id: disputeRequestId,
  }
  delete payload.data.file
  isLoading.value = true
  supportTicketsService
    .sendMessage(payload)
    .then((res) => {
      formData.details = ''
      resetUploadBox()
      emit('message:sent', res.data.data)
    })
    .finally(() => {
      isLoading.value = false
    })
}
// #endregion
</script>

<template>
  <div>
    <ReadyRepliesSelectionModal
      v-model:showModal="showRepliesModal"
      type="ticket"
      @select:reply="onSelectReply"
    />
    <VForm class="conversations-form mt-3 px-3 py-2" @submit.prevent="sendMessage">
      <div class="d-flex flex-wrap gap-2" v-if="showUploadBox">
        <div :class="{ border: formData.file }">
          <AppUploadFile
            v-model="formData.file"
            name="file"
            label="المرفق"
            @update:model-value="updateFileId"
            hide-label
            width="200px"
            height="150px"
          />
        </div>
        <VBtn
          size="35"
          variant="outlined"
          class="ms-auto"
          icon="tabler-x"
          @click="resetUploadBox"
        ></VBtn>
      </div>
      <VTextField v-model="formData.details" variant="plain" placeholder="اكتب رسالتك ...">
        <template #append-inner>
          <IconBtn @click="showRepliesModal = true">
            <VIcon icon="tabler-message-plus" />
          </IconBtn>
          <IconBtn @click="showUploadBox = true">
            <VIcon icon="tabler-link" />
          </IconBtn>

          <VBtn
            size="40"
            rounded="circle"
            :disabled="isLoading || !isValid"
            :loading="isLoading"
            @click="sendMessage"
          >
            <VIcon icon="tabler-brand-telegram" size="20" class="ma-0" />
          </VBtn>
        </template>
      </VTextField>
    </VForm>
  </div>
</template>
