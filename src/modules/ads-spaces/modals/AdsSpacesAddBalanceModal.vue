<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import { adsSpacesService } from '../services/AdsSpacesService'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(defineProps<{ showModal: boolean; adSpaceId: number }>(), {
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
  watches_count: null,
})

// #endregion

/***************************************
 **** Section Functions  *********
 **************************************/
// #region Functions
function save() {
  const payload = {
    id: props.adSpaceId,
    data: formData,
  }
  isLoading.value = true
  adsSpacesService
    .addBalance(payload)
    .then((res) => {
      toast.success(res.data.message)
      emit('editItem', res.data.data)
      showModal.value = false
    })
    .finally(() => {
      isLoading.value = false
    })
}

function submit() {
  formRef.value.validate().then(({ valid }: any) => {
    if (!valid) return
    save()
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
        <VCard title="إضافة رصيد المشاهدات">
          <VCardText>
            <VRow>
              <VCol cols="12">
                <AppTextField
                  v-model="formData.watches_count"
                  label="عدد المشاهدات"
                  name="hours"
                  rules="required|numeric|min_value:1|max_value:1000000"
                  type="number"
                >
                  <template #append-inner> مشاهدة </template>
                </AppTextField>
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
