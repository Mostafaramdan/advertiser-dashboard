<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import type { OfferProduct } from '../interfaces/Offer'
import { productsService } from '../services/ProductsService'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(defineProps<{ showModal: boolean; product: OfferProduct }>(), {
  showModal: false,
})

// #endregion

/***************************************
 **** Section Emits Declaration ********
 **************************************/
// #region Emits
const emit = defineEmits<{
  (e: 'update:showModal', value: boolean): void
  (e: 'postProduct', value: any): void
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
  from_date: '',
})

// #endregion

/***************************************
 **** Section Functions  *********
 **************************************/
// #region Functions
function edit() {
  const productId = props.product.id
  isLoading.value = true
  productsService
    .post(productId, formData)
    .then((res) => {
      toast.success(res.data.message)
      emit('postProduct', productId)
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
        <VCard title="نشر المنتج">
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
