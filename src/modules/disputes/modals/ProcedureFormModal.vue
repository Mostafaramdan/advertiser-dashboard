<script setup lang="ts">
import { DISPUTES_STATUSES } from '@/constants/disputes'
import { cloneItem } from '@/helpers/index'
import type { FormModalProps } from '@/interfaces/Forms'
import { useVModel } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import type { Procedure, ProcedureBase } from '../interfaces/Procedure'
import { proceduresService } from '../services/ProceduresService'

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
  (e: 'createItem', value: Procedure): void
  (e: 'editItem', value: Procedure): void
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

const formData = reactive<Procedure | ProcedureBase>({
  name: '',
  status: null,
  is_active: true,
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const formTitle = computed(() => {
  return props.formAction === 'create'
    ? 'اضافة إجراء'
    : props.formAction === 'edit'
      ? 'تعديل إجراء'
      : 'عرض إجراء'
})

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
if (props.activeItem) {
  Object.assign(formData, cloneItem(props.activeItem))
}

// #endregion

/***************************************
 **** Section Functions  *********
 **************************************/
// #region Functions
function edit() {
  proceduresService
    .editItem(formData as Procedure)
    .then((res) => {
      toast.success(res.data.message)
      emit('editItem', res.data.data)
      showModal.value = false
    })
    .finally(() => {
      isLoading.value = false
    })
}

function create() {
  proceduresService
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

const submit = () => {
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
                  v-model="formData.name"
                  label="الاسم"
                  name="name"
                  rules="required|min:3|max:50"
                />
              </VCol>
              <VCol cols="12">
                <AppSelect
                  v-model="formData.status"
                  :items="
                    Array.from(DISPUTES_STATUSES, ([key, value]) => ({
                      id: key,
                      label: value.label,
                    }))
                  "
                  item-title="label"
                  item-value="id"
                  name="status"
                  label="الحالة المتغير اليها طلب التنازع"
                  clearable
                  rules="required"
                />
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
