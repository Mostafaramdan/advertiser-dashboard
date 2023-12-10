<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import type {
  OfferAcceptModalFormData,
  OfferAcceptModalFormPayload,
  OfferAcceptModalProps,
} from '../interfaces/Offer'
import { offersService } from '../services/OffersService'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(defineProps<OfferAcceptModalProps>(), {
  showModal: false,
})

// #endregion

/***************************************
 **** Section Emits Declaration ********
 **************************************/
// #region Emits
const emit = defineEmits<{
  (e: 'update:showModal', value: boolean): void
  (e: 'acceptOffer', value: number): void
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
const formData = reactive<OfferAcceptModalFormData>({
  from_date: null,
})

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function save(payload: OfferAcceptModalFormPayload) {
  isLoading.value = true
  offersService
    .acceptOffer(payload)
    .then((res) => {
      toast.success(res.data.message)
      emit('acceptOffer', props.offerId)
      showModal.value = false
    })
    .finally(() => {
      isLoading.value = false
    })
}

function submit() {
  formRef.value.validate().then(({ valid }: any) => {
    if (!valid) return
    const payload: OfferAcceptModalFormPayload = {
      offerId: props.offerId,
      data: formData,
    }
    save(payload)
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
        <VCard title="الموافقة على العرض">
          <VCardText>
            <VRow>
              <VCol cols="12">
                <VeeField
                  v-slot="{ errorMessage, value, handleChange }"
                  v-model="formData.from_date"
                  name="from_date"
                  label="تاريخ البداية"
                  rules="required"
                >
                  <AppDateTimePicker
                    label="تاريخ البداية"
                    :model-value="value"
                    :error-msg="errorMessage"
                    clearable
                    prepend-inner-icon="tabler-calendar"
                    :config="{ disableMobile: true, minDate: new Date() }"
                    @update:model-value="handleChange"
                  />
                </VeeField>
              </VCol>
            </VRow>
          </VCardText>

          <VCardText class="d-flex justify-end flex-wrap gap-3">
            <VBtn variant="outlined" color="error" @click="showModal = false">
              {{ t('actions.cancel') }}
            </VBtn>
            <VBtn :loading="isLoading" :disabled="isLoading || !meta.valid" @click="submit">
              {{ t('actions.save') }}
            </VBtn>
          </VCardText>
        </VCard>
      </VeeForm>
    </VCard>
  </VDialog>
</template>
