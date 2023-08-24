<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import type { TermsConditionsItem } from '../interfaces/TermsConditionsItem'
import { termsConditionsService } from '../services/TermsConditionsService'
import type { FormModalProps } from '@/interfaces/Forms'
import { cloneItem } from '@/helpers/index'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
interface TermsConditionsFormModalProps extends FormModalProps {
  termsConditionsTypes: any[]
}

const props = withDefaults(defineProps<TermsConditionsFormModalProps>(), {
  showModal: false,
})

// #endregion

/***************************************
 **** Section Emits Declaration ********
 **************************************/
// #region Emits
const emit = defineEmits<{
  (e: 'update:showModal', value: boolean): void
  (e: 'createItem', value: TermsConditionsItem): void
  (e: 'editItem', value: TermsConditionsItem): void
}>()

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const toast = useToast()
const showModal = useVModel(props, 'showModal', emit)

const isLoading = reactive({
  data: false,
  submit: false,
})

const formRef = ref<any>(null)
const categoriesSelectRef = ref()

const formData = reactive<TermsConditionsItem>({
  name: '',
  description: '',
  type: null,
  is_active: true,
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const formTitle = computed(() => {
  return props.formAction === 'create'
    ? 'اضافة شرط'
    : props.formAction === 'edit' ? 'تعديل شرط' : 'عرض شرط'
})

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
if (props.activeItem?.id) {
  Object.assign(formData, { ...cloneItem(props.activeItem), type: props.activeItem.type.id })
  getItemDetails(props.activeItem.id)
}

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function getItemDetails(id: any) {
  isLoading.data = true
  termsConditionsService.getSingleItem(id).then(res => {
    const response = res.data.data

    Object.assign(formData, { ...response, type: response.type.id })
  }).finally(() => {
    isLoading.data = false
  })
}
function edit() {
  termsConditionsService.editItem(formData).then(res => {
    toast.success(res.data.message)

    // emit('editItem', res.data)
    emit('editItem', res.data.data)
    showModal.value = false
  }).finally(() => {
    isLoading.submit = false
  })
}

function create() {
  termsConditionsService.createItem(formData).then(res => {
    toast.success(res.data.message)
    emit('createItem', res.data)
    showModal.value = false
  }).finally(() => {
    isLoading.submit = false
  })
}

const submit = () => {
  formRef.value.validate().then(({ valid }: any) => {
    if (!valid)
      return

    isLoading.submit = true
    props.formAction === 'create' ? create() : edit()
  })
}

// #endregion
</script>

<template>
  <VDialog
    v-model="showModal"
    max-width="1000"
    persistent
    scrollable
    class="form-modal"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="showModal = !showModal" />

    <!-- Dialog Content -->
    <VCard v-loading="isLoading.data">
      <VeeForm ref="formRef" v-slot="{ meta }" @submit="submit">
        <VCard :title="formTitle">
          <VCardText>
            <VRow>
              <VCol cols="12" md="6">
                <AppTextField
                  v-model="formData.name"
                  label="العنوان"
                  name="name"
                  rules="required|min:10|max:55"
                />
              </VCol>
              <VCol cols="12" md="6">
                <div ref="categoriesSelectRef" class="categories-select">
                  <AppSelect
                    v-model="formData.type"
                    name="type"
                    :items="termsConditionsTypes"
                    item-title="label"
                    item-value="id"
                    label="النوع"
                    rules="required"
                    clearable
                    :menu-props="{
                      'attach': categoriesSelectRef,
                      'location-strategy': 'static',
                    }"
                  />
                </div>
              </VCol>
              <VCol cols="12">
                <AppTextEditor
                  v-model="formData.description"
                  label="الوصف"
                  name="description"
                  rules="required|min:3"
                />
              </VCol>
              <VCol cols="12">
                <AppSwitch
                  v-model="formData.is_active"
                  label="الحالة"
                  name="is_active"
                />
              </VCol>
            </VRow>
          </VCardText>

          <VCardText v-if="formAction !== 'view'" class="d-flex justify-end flex-wrap gap-3">
            <VBtn
              variant="outlined"
              color="error"
              @click="showModal = false"
            >
              {{ t('actions.cancel') }}
            </VBtn>
            <VBtn :loading="isLoading.submit" :disabled="isLoading.data || isLoading.submit || !meta.valid" @click="submit">
              {{ formAction === 'edit' ? t('actions.save') : t('actions.create') }}
            </VBtn>
          </VCardText>
        </VCard>
      </VeeForm>
    </VCard>
  </VDialog>
</template>

<style lang="scss" scoped>
.categories-select {
  position: relative;
  z-index: 1;

  :deep(.v-menu > .v-overlay__content) {
    inline-size: 100%;
    inset-block-start: 70px;
    inset-inline-start: 0;
  }
}
</style>
