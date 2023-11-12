<script setup lang="ts">
import { USERS_ROLES } from '@/constants/index'
import { cloneItem, getOptionsArrayFromObject } from '@/helpers/index'
import type { FormModalProps } from '@/interfaces/Forms'
import { listService } from '@/services/ListService'
import { useDisputesStore } from '@/stores/DisputesStore'
import { useVModel } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import type { Type } from '../interfaces/Type'
import { typesService } from '../services/TypesService'

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
  (e: 'createItem', value: Type): void
  (e: 'editItem', value: Type): void
}>()

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const toast = useToast()
const disputesStore = useDisputesStore()
const showModal = useVModel(props, 'showModal', emit)
const formRef = ref<any>(null)

const isLoading = reactive({
  admins: false,
  submit: false,
})

const formData = reactive<Type>({
  name: '',
  user_types: [],
  admins: [],
  is_active: true,
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const formTitle = computed(() => {
  return props.formAction === 'create'
    ? 'اضافة نوع'
    : props.formAction === 'edit'
    ? 'تعديل نوع'
    : 'عرض نوع'
})

const adminsList = computed(() => disputesStore.adminsList)
// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
getAdminsList()

if (props.activeItem) {
  Object.assign(formData, cloneItem(props.activeItem))
  formData.admins = formData.admins.map((admin: any) => admin.id)
}

// #endregion

/***************************************
 **** Section Functions  *********
 **************************************/
// #region Functions
function getAdminsList() {
  if (adminsList.value.length) return
  isLoading.admins = true
  listService
    .getAdmins()
    .then((res: any) => {
      disputesStore.setAdminsList(res.data.data)
    })
    .finally(() => {
      isLoading.admins = false
    })
}

function edit() {
  typesService
    .editItem(formData)
    .then((res) => {
      toast.success(res.data.message)
      emit('editItem', res.data.data)
      showModal.value = false
    })
    .finally(() => {
      isLoading.submit = false
    })
}

function create() {
  typesService
    .createItem(formData)
    .then((res) => {
      toast.success(res.data.message)
      emit('createItem', res.data)
      showModal.value = false
    })
    .finally(() => {
      isLoading.submit = false
    })
}

const submit = () => {
  formRef.value.validate().then(({ valid }: any) => {
    if (!valid) return

    isLoading.submit = true
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
                <AppAutocomplete
                  v-model="formData.admins"
                  name="admins"
                  :items="adminsList"
                  item-title="label"
                  item-value="id"
                  label="الموظفين المسؤولين"
                  rules="required"
                  clearable
                  multiple
                  :loading="isLoading.admins"
                  :disabled="isLoading.admins"
                >
                  <template #selection="{ item, index }">
                    <VChip v-if="index < 1">
                      <span>{{ item.title }}</span>
                    </VChip>
                    <span v-if="index === 1" class="text-grey text-caption align-self-center">
                      (+{{ formData.admins.length - 1 }} اخري)
                    </span>
                  </template>
                </AppAutocomplete>
              </VCol>
              <VCol cols="12">
                <AppAutocomplete
                  v-model="formData.user_types"
                  name="user_types"
                  :items="getOptionsArrayFromObject(USERS_ROLES)"
                  item-title="label"
                  item-value="value"
                  label="نوع المستخدم"
                  rules="required"
                  clearable
                  multiple
                >
                  <template #selection="{ item, index }">
                    <VChip v-if="index < 1">
                      <span>{{ item.title }}</span>
                    </VChip>
                    <span v-if="index === 1" class="text-grey text-caption align-self-center">
                      (+{{ formData.user_types.length - 1 }} اخري)
                    </span>
                  </template>
                </AppAutocomplete>
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
            <VBtn
              :loading="isLoading.submit"
              :disabled="isLoading.submit || !meta.valid"
              @click="submit"
            >
              {{ formAction === 'edit' ? t('actions.save') : t('actions.create') }}
            </VBtn>
          </VCardText>
        </VCard>
      </VeeForm>
    </VCard>
  </VDialog>
</template>
