<script setup lang="ts">
import GeoLocationModal from '@/components/shared/GeoLocationModal.vue'
import { cloneItem } from '@/helpers/index'
import { useVModel } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import type { Branch, BranchFormModalProps } from '../interfaces/Branch'
import { branchesService } from '../services/BranchesService'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(defineProps<BranchFormModalProps>(), {
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
  (e: 'createItem', value: Branch): void
  (e: 'editItem', value: Branch): void
}>()

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const toast = useToast()
const showModal = useVModel(props, 'showModal', emit)
const showGeoLocationModal = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const formRef = ref<any>(null)
const usersKeyword = ref('')

const formData = reactive<Branch>({
  user_id: props.userId,
  name: '',
  address: {
    name: '',
    description: '',
    location: {
      address: '',
      lat: 0,
      lng: 0,
    },
    apartment_details: {
      building_number: '',
      floor_number: '',
      apartment_number: '',
    },
  },
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const formTitle = computed(() => {
  return props.formAction === 'create'
    ? 'اضافة فرع'
    : props.formAction === 'edit'
      ? 'تعديل فرع'
      : 'عرض فرع'
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
function updateLocation(location: any) {
  formData.address.location = { ...location }
}

function edit() {
  branchesService
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
  branchesService
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
  <div>
    <GeoLocationModal
      v-if="showGeoLocationModal"
      v-model:showModal="showGeoLocationModal"
      :location="{ ...formData.address.location }"
      @update:location="updateLocation"
    />
    <VDialog v-model="showModal" max-width="800" persistent scrollable class="form-modal">
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
                <VCol cols="12" sm="6">
                  <AppTextField
                    v-model="formData.name"
                    label="الاسم"
                    name="name"
                    rules="required|min:3|max:50"
                  />
                </VCol>
                <VCol cols="12" sm="6">
                  <AppTextField
                    v-model="formData.address.name"
                    label="العنوان"
                    name="address.name"
                    rules="required|min:3"
                  />
                </VCol>
                <VCol cols="12">
                  <AppTextarea
                    v-model="formData.address.description"
                    name="address.description"
                    label="الوصف (اختياري)"
                    rows="4"
                    rules="min:10|max:500"
                  />
                </VCol>
                <VCol cols="12">
                  <AppTextField
                    v-model="formData.address.location.address"
                    label="الموقع (اختياري)"
                    placeholder="الموقع"
                    name="location"
                    rules="min:3"
                    prepend-inner-icon="tabler-current-location"
                  >
                    <template #append-inner>
                      <VIcon
                        icon="tabler-map-pin"
                        size="30"
                        color="primary"
                        class="mt-0"
                        @click="showGeoLocationModal = true"
                      />
                    </template>
                  </AppTextField>
                </VCol>
                <VCol cols="12">
                  <VLabel
                    class="text-body-2 text-high-emphasis mb-1"
                    text="بيانات الشقة (اختياري)"
                  />
                  <VRow class="border ma-0 py-1 px-1">
                    <VCol cols="12" sm="4">
                      <AppTextField
                        v-model="formData.address.apartment_details.building_number"
                        label="رقم المبنى"
                        hide-default-label
                        name="building_number"
                      />
                    </VCol>
                    <VCol cols="12" sm="4">
                      <AppTextField
                        v-model="formData.address.apartment_details.floor_number"
                        label="رقم الطابق"
                        hide-default-label
                        name="floor_number"
                      />
                    </VCol>
                    <VCol cols="12" sm="4">
                      <AppTextField
                        v-model="formData.address.apartment_details.apartment_number"
                        label="رقم الشقة"
                        hide-default-label
                        name="apartment_number"
                      />
                    </VCol>
                  </VRow>
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
  </div>
</template>
