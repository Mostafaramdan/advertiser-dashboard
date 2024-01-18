<script setup lang="ts">
import { cloneItem } from '@/helpers/index'
import { useVModel } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import type { Responsible, ResponsibleFormModalProps } from '../interfaces/Responsible'
import { responsiblesService } from '../services/ResponsiblesService'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(defineProps<ResponsibleFormModalProps>(), {
  showModal: false,
  userId: null,
})

// #endregion

/***************************************
 **** Section Emits Declaration ********
 **************************************/
// #region Emits
const emit = defineEmits<{
  (e: 'update:showModal', value: boolean): void
  (e: 'createItem', value: Responsible): void
  (e: 'editItem', value: Responsible): void
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
const usersKeyword = ref('')

const formData = reactive<Responsible>({
  name: '',
  email: '',
  phone: '',
  user_id: props.userId,
  is_active: true,
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const formTitle = computed(() => {
  return props.formAction === 'create'
    ? 'اضافة مسؤول'
    : props.formAction === 'edit'
      ? 'تعديل مسؤول'
      : 'عرض مسؤول'
})

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
if (props.activeItem) {
  const user = props.activeItem.user
  usersKeyword.value = user?.username
  Object.assign(formData, { ...cloneItem(props.activeItem), user_id: user?.id })
}

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function edit() {
  responsiblesService
    .editItem(formData)
    .then((res) => {
      toast.success(res.data.message)
      emit('editItem', formData)
      showModal.value = false
    })
    .finally(() => {
      isLoading.value = false
    })
}

function create() {
  responsiblesService
    .createItem(formData)
    .then((res) => {
      toast.success(res.data.message)
      emit('createItem', res.data.data)
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
              <VCol cols="12" v-if="!props.userId">
                <VeeField
                  v-slot="{ errorMessage, value, handleChange, handleBlur }"
                  v-model="formData.user_id"
                  name="user_id"
                  label="المستخدم"
                  rules="required"
                >
                  <VLabel class="text-body-2 text-high-emphasis mb-1" text="المستخدم" />
                  <UsersSelectFilter
                    label=""
                    :userRole="null"
                    :model-value="value"
                    :error-messages="errorMessage"
                    :error="!!errorMessage"
                    id="users-select-filter"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                    clearable
                    :keyword="usersKeyword"
                  />
                </VeeField>
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField
                  v-model="formData.name"
                  label="الاسم"
                  name="name"
                  rules="required|min:3|max:50"
                />
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField
                  v-model="formData.phone"
                  name="phone"
                  label="الهاتف"
                  placeholder="الهاتف"
                  type="number"
                  :rules="{
                    required: !formData.email,
                    numeric: true,
                    min: 6,
                    max: 14,
                  }"
                />
              </VCol>
              <VCol cols="12">
                <AppTextField
                  v-model="formData.email"
                  label="البريد الالكتروني"
                  name="email"
                  :rules="{
                    required: !formData.phone,
                    email: true,
                    min: 6,
                  }"
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
