<script setup lang="ts">
import { OFFER_STATUSES } from '@/constants/offers'
import { useVModel } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import type { Offer } from '../interfaces/Offer'
import { offersService } from '../services/OffersService'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(defineProps<{ showModal: boolean; offer: Offer }>(), {
  showModal: false,
})

// #endregion

/***************************************
 **** Section Emits Declaration ********
 **************************************/
// #region Emits
const emit = defineEmits<{
  (e: 'update:showModal', value: boolean): void
  (e: 'editItem', value: any): void
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
const formData = reactive({
  status: null,
})

// #endregion

/***************************************
 **** Section Functions  *********
 **************************************/
// #region Functions

function getOfferStatuses() {
  return Array.from(OFFER_STATUSES, ([key, value]) => ({
    id: key,
    label: value.label,
  })).filter((item) => {
    if (item.id === 'cancelled' && !['pending', 'processing'].includes(props.offer.status))
      return false
    return true
  })
}

function edit() {
  isLoading.value = true
  offersService
    .editOfferStatus(props.offer.id, formData)
    .then((res) => {
      toast.success(res.data.message)
      emit('editItem', formData.status)
      showModal.value = false
    })
    .finally(() => {
      isLoading.value = false
    })
}

function submit() {
  formRef.value.validate().then(({ valid }: any) => {
    if (!valid) return
    edit()
  })
}

// #endregion
</script>

<template>
  <VDialog v-model="showModal" max-width="650" persistent scrollable class="form-modal">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="showModal = !showModal" />

    <!-- Dialog Content -->
    <VCard>
      <VeeForm ref="formRef" v-slot="{ meta }" @submit="submit">
        <VCard title="تعديل حالة العرض">
          <VCardText>
            <VRow>
              <VCol cols="12">
                <AppSelect
                  v-model="formData.status"
                  :items="getOfferStatuses()"
                  item-title="label"
                  item-value="id"
                  name="status"
                  label="حالة العرض"
                  clearable
                  rules="required"
                  :hint="`الحالة السابقة هي ${OFFER_STATUSES.get(offer.status)?.label}`"
                  persistent-hint
                />
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
