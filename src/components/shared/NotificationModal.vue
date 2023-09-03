<script setup lang="ts">
import { NOTIFICATIONS_TYPES } from '@/constants'
import type { NotificationModalProps } from '@/interfaces/Shared'
import { API_SEND_NOTIFICATION } from '@/services/UsersService'
import { useVModel } from '@vueuse/core'
import axios from 'axios'
import { useToast } from 'vue-toastification'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(defineProps<NotificationModalProps>(), {
  showModal: false,
  extraData: () => ({}),
  defaultMessage: '',
  showNotificationTypes: true,
  url: null
})

// #endregion

/***************************************
 **** Section Emits Declaration ********
 **************************************/
// #region Emits
const emit = defineEmits<{
  (e: 'update:showModal', value: boolean): void
}>()

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const toast = useToast()
const showModal = useVModel(props, 'showModal', emit)
const isLoading = ref<boolean>(false)
const formRef = ref<any>(null)
const url = props.url || API_SEND_NOTIFICATION(props.user.id)

const formData = reactive<{ message: string; types: string[] }>({
  message: props.defaultMessage,
  types: []
})

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
if (props.defaultSelectedType) formData.types.push(props.defaultSelectedType)

// #endregion
function sendNotification() {
  const payload = {
    message: formData.message,
    types: formData.types,
    ...props.extraData
  }

  isLoading.value = true

  axios
    .post(url, payload)
    .then((res) => {
      toast.success(res.data.message)
      showModal.value = false
    })
    .finally(() => {
      isLoading.value = false
    })
}

function submit() {
  formRef.value.validate().then(({ valid }: any) => {
    if (!valid) return
    sendNotification()
  })
}
</script>

<template>
  <VDialog v-model="showModal" max-width="700" persistent scrollable class="form-modal">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="showModal = !showModal" />

    <!-- Dialog Content -->
    <VCard>
      <VeeForm ref="formRef" v-slot="{ meta }" @submit="submit">
        <VCard title="ارسال تنبيه">
          <VCardText>
            <div class="d-flex align-center">
              <VAvatar size="38" variant="tonal" class="me-3" cover>
                <VImg v-if="user.image" :src="user.image" cover />
                <span v-else>!</span>
              </VAvatar>
              <span>
                {{ user.username }}
              </span>
            </div>
            <VDivider class="mb-5 mt-3" />
            <VRow>
              <VCol cols="12" md="6">
                <VTextField :model-value="user.phone" readonly prepend-inner-icon="tabler-phone" />
              </VCol>
              <VCol cols="12" md="6">
                <VTextField :model-value="user.email" readonly prepend-inner-icon="tabler-mail" />
              </VCol>
              <VCol cols="12">
                <AppTextarea
                  v-model="formData.message"
                  name="message"
                  label="نص الرسالة"
                  rows="4"
                  rules="required|min:10|max:250"
                />
              </VCol>
              <VCol v-if="showNotificationTypes" cols="12">
                <VeeField
                  v-slot="{ errorMessage, value, handleChange }"
                  v-model="formData.types"
                  name="types"
                  label="نوع التنبيه"
                  rules="required"
                >
                  <VLabel class="mb-1 text-body-2 text-high-emphasis d-block" text="نوع التنبيه" />
                  <VBtnToggle
                    :model-value="value"
                    multiple
                    variant="outlined"
                    divided
                    color="primary"
                    rounded="0"
                    class="flex-wrap"
                    @update:model-value="handleChange"
                  >
                    <VBtn
                      v-for="type in NOTIFICATIONS_TYPES"
                      :key="type.value"
                      :value="type.value"
                      size="small"
                      rounded="0"
                    >
                      <VIcon size="28">
                        {{ type.icon }}
                      </VIcon>
                    </VBtn>
                  </VBtnToggle>
                  <AppErrorMessage :error-message="errorMessage" />
                </VeeField>
              </VCol>
            </VRow>
          </VCardText>

          <VCardText class="d-flex justify-end flex-wrap gap-3">
            <VBtn variant="outlined" color="error" @click="showModal = false">
              {{ t('actions.cancel') }}
            </VBtn>
            <VBtn :loading="isLoading" :disabled="isLoading || !meta.valid" @click="submit">
              {{ t('actions.send') }}
            </VBtn>
          </VCardText>
        </VCard>
      </VeeForm>
    </VCard>
  </VDialog>
</template>
