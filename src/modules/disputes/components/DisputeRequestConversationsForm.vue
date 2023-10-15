<script setup lang="ts">
import ReadyRepliesSelectionModal from '@/components/shared/ReadyRepliesSelectionModal.vue'
import type { File } from '@/interfaces/Shared'
import { useDisputesStore } from '@/stores/DisputesStore'
import type { ConversationForm, ConversationsListItem } from '../interfaces/DisputeRequest'
import { requestsService } from '../services/RequestsService'

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
const disputesStore = useDisputesStore()
const disputeRequestId = +route.params.id
const showUploadBox = ref<boolean>(false)
const showUsersBox = ref<boolean>(false)
const showRepliesModal = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const formData = reactive<ConversationForm>({
  details: '',
  file: null,
  file_id: null,
  for_user_id: null,
})
// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const requestDetails = computed(() => disputesStore.requestDetails)

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

function resetUsersBox() {
  showUsersBox.value = false
  formData.for_user_id = null
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
  requestsService
    .sendMessage(payload)
    .then((res) => {
      formData.details = ''
      resetUploadBox()
      resetUsersBox()
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
      type="dispute"
      @select:reply="onSelectReply"
    />
    <div class="chat-form mt-5 px-3 py-2" v-if="requestDetails && showUsersBox">
      <div class="d-flex flex-wrap gap-x-5 gap-y-2">
        <span>ارسال الي</span>
        <VBtn
          size="35"
          variant="outlined"
          class="ms-auto"
          icon="tabler-x"
          @click="resetUsersBox"
        ></VBtn>
      </div>
      <div class="d-flex flex-wrap gap-x-5 gap-y-2">
        <template v-for="user in [requestDetails.disputer, requestDetails.disputed]" :key="user.id">
          <v-checkbox v-model="formData.for_user_id" :true-value="user.id" :false-value="null">
            <template v-slot:label>
              <div class="d-flex align-center">
                <VAvatar size="38" variant="tonal" cover class="me-3">
                  <VImg v-if="user.image_path" :src="user.image_path" cover />
                  <span v-else>!</span>
                </VAvatar>
                <div style="max-width: 205px" class="username">
                  {{ user.username }}
                </div>
              </div>
            </template>
          </v-checkbox>
        </template>
      </div>
    </div>
    <VForm class="chat-form mt-3 px-3 py-2" @submit.prevent="sendMessage">
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

          <IconBtn @click="showUsersBox = true" class="me-1">
            <VIcon icon="tabler-users" />
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

<style lang="scss" scoped>
.chat-form {
  border-radius: 8px;
  background: rgba(var(--v-theme-grey-300), 0.3);

  :deep(.v-field__append-inner[class]) {
    padding-block-start: 0;
  }

  .username {
    @include max-lines(1);
  }
}
</style>
