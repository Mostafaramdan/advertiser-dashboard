<script setup lang="ts">
import { OFFER_DEADLINES_TIMES } from '@/constants/offers'
import { cloneItem, getOptionsArrayFromObject } from '@/helpers/index'
import type { FormModalProps } from '@/interfaces/Forms'
import { useVModel } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import type { OfferDeadline, OfferDeadlineBase } from '../interfaces/OfferDeadline'
import { offerDeadlinesService } from '../services/OfferDeadlinesService'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(defineProps<FormModalProps>(), {
  showModal: false,
})

// #endregion

/***************************************
 **** Section Emits Declaration ********
 **************************************/
// #region Emits
const emit = defineEmits<{
  (e: 'update:showModal', value: boolean): void
  (e: 'createItem', value: OfferDeadlineBase): void
  (e: 'editItem', value: OfferDeadlineBase): void
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

const formData = reactive<OfferDeadlineBase | OfferDeadline>({
  hours: null,
  from_time: null,
  is_active: true,
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const formTitle = computed(() => {
  return props.formAction === 'create'
    ? 'اضافة مهلة دفع'
    : props.formAction === 'edit'
      ? 'تعديل مهلة دفع'
      : 'عرض مهلة دفع'
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
function edit() {
  offerDeadlinesService
    .editItem(formData as OfferDeadline)
    .then((res) => {
      toast.success(res.data.message)
      emit('editItem', formData as OfferDeadline)
      showModal.value = false
    })
    .finally(() => {
      isLoading.value = false
    })
}

function create() {
  offerDeadlinesService
    .createItem(formData)
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
    props.formAction === 'create' ? create() : edit()
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
                <AppTextField
                  v-model="formData.hours"
                  label="عدد الساعات"
                  name="hours"
                  rules="required|numeric|max_value:999999"
                  type="number"
                >
                  <template #append-inner> ساعة </template>
                </AppTextField>
              </VCol>
              <VCol cols="12">
                <AppSelect
                  v-model="formData.from_time"
                  label="من وقت"
                  name="from_time"
                  rules="required"
                  clearable
                  :items="getOptionsArrayFromObject(OFFER_DEADLINES_TIMES)"
                  item-title="label"
                  item-value="value"
                >
                </AppSelect>
              </VCol>
              <VCol cols="12">
                <AppSwitch v-model="formData.is_active" label="الحالة" name="is_active" />
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
