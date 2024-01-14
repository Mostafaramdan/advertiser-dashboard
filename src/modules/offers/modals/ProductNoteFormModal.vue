<script setup lang="ts">
import { cloneItem } from '@/helpers/index'
import { useVModel } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import type {
  OfferNoteCreteData,
  OfferNoteModalPayload,
  OfferNoteModalProps,
  OfferNoteUpdateData,
} from '../interfaces/Offer'
import { productsService } from '../services/ProductsService'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(defineProps<OfferNoteModalProps>(), {
  showModal: false,
})

// #endregion

/***************************************
 **** Section Emits Declaration ********
 **************************************/
// #region Emits
const emit = defineEmits<{
  (e: 'update:showModal', value: boolean): void
  (e: 'createItem', value: OfferNoteUpdateData): void
  (e: 'editItem', value: OfferNoteUpdateData): void
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

const formData = reactive<OfferNoteCreteData | OfferNoteUpdateData>({
  note: '',
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const formTitle = computed(() => {
  return props.formAction === 'create'
    ? 'اضافة ملاحظة'
    : props.formAction === 'edit'
      ? 'تعديل ملاحظة'
      : 'عرض ملاحظة'
})

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
if (props.activeItem) Object.assign(formData, cloneItem(props.activeItem))

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function edit(payload: OfferNoteModalPayload) {
  productsService
    .editNote(payload)
    .then((res) => {
      toast.success(res.data.message)
      emit('editItem', formData as OfferNoteUpdateData)
      showModal.value = false
    })
    .finally(() => {
      isLoading.value = false
    })
}

function create(payload: OfferNoteModalPayload) {
  productsService
    .createNote(payload)
    .then((res) => {
      toast.success(res.data.message)
      emit('createItem', res.data)
      showModal.value = false
    })
    .finally(() => {
      isLoading.value = false
    })
}

function submit() {
  formRef.value.validate().then(({ valid }: any) => {
    if (!valid) return

    isLoading.value = true
    const payload: OfferNoteModalPayload = {
      productId: props.productId,
      data: formData,
    }
    props.formAction === 'create' ? create(payload) : edit(payload)
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
        <VCard :title="formTitle">
          <VCardText>
            <VRow>
              <VCol cols="12">
                <AppTextarea
                  v-model="formData.note"
                  name="note"
                  label="الوصف"
                  rows="4"
                  rules="required|min:10|max:250"
                />
              </VCol>
            </VRow>
          </VCardText>

          <VCardText v-if="formAction !== 'view'" class="d-flex justify-end flex-wrap gap-3">
            <VBtn variant="outlined" color="error" @click="showModal = false">
              {{ t('actions.cancel') }}
            </VBtn>
            <VBtn :loading="isLoading" :disabled="isLoading || !meta.valid" @click="submit">
              {{ formAction === 'edit' ? t('actions.save') : t('actions.create') }}
            </VBtn>
          </VCardText>
        </VCard>
      </VeeForm>
    </VCard>
  </VDialog>
</template>
