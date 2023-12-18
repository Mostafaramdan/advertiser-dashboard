<script setup lang="ts">
import { NOTIFICATIONS_TYPES } from '@/constants'
import { useVModel } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import type { ExchangeRecordNotifyModalFormData } from '../interfaces/ExchangeRecord'
import { exchangeRecordsService } from '../services/ExchangeRecordsService'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(defineProps<{ showModal: boolean; requestId: number }>(), {
  showModal: false,
})

// #endregion

/***************************************
 **** Section Emits Declaration ********
 **************************************/
// #region Emits
const emit = defineEmits<{
  (e: 'update:showModal', value: boolean): void
  (e: 'notification:sent', value: boolean): void
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

const formData = reactive<ExchangeRecordNotifyModalFormData>({
  message: '',
  type: null,
  request_id: props.requestId,
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

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function sendNotification() {
  isLoading.value = true
  exchangeRecordsService
    .sendNotification(formData)
    .then((res) => {
      toast.success(res.data.message)
      showModal.value = false
      emit('notification:sent', true)
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
// #endregion
</script>

<template>
  <VDialog v-model="showModal" max-width="600" persistent scrollable class="form-modal">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="showModal = !showModal" />

    <!-- Dialog Content -->
    <VCard>
      <VeeForm ref="formRef" v-slot="{ meta }" @submit="submit">
        <VCard title="انشاء تنبيه">
          <VCardText>
            <VRow>
              <VCol cols="12">
                <AppTextarea
                  v-model="formData.message"
                  name="message"
                  label="نص الرسالة"
                  rows="4"
                  rules="required|min:10|max:250"
                />
              </VCol>
              <VCol cols="12">
                <VeeField
                  v-slot="{ errorMessage, value, handleChange }"
                  v-model="formData.type"
                  name="type"
                  label="نوع التنبيه"
                  rules="required"
                >
                  <VLabel class="mb-1 text-body-2 text-high-emphasis d-block" text="نوع التنبيه" />
                  <VBtnToggle
                    :model-value="value"
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
