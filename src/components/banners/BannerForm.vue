<script setup lang="ts">
import { LINK_TYPES, LINKABLE_TYPES } from '@/constants/banners'
import { getOptionsArrayFromObject } from '@/helpers/index'
import type { Banner, BannerBase } from '@/interfaces/Banner'
import type { FormActionType } from '@/interfaces/Forms'
import type { File } from '@/interfaces/Shared'
import { bannersService } from '@/services/BannersService'
import { useToast } from 'vue-toastification'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(defineProps<{ formAction: FormActionType }>(), {})

// #endregion

/***************************************
 **** Section Emits Declaration ********
 **************************************/
// #region Emits
const emit = defineEmits<{
  (e: 'update:showModal', value: boolean): void
  (e: 'createItem', value: BannerBase): void
  (e: 'editItem', value: BannerBase): void
}>()

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const toast = useToast()
const route = useRoute()
const router = useRouter()
const formRef = ref<any>(null)
const bannerId: number = +route.params.id

const isLoading = reactive({
  data: false,
  submit: false,
})

const formData = reactive<BannerBase | Banner>({
  name: {
    ar: '',
    en: '',
  },
  from_date: '',
  to_date: '',
  link_type: null,
  external_link: null,
  linkable_type: null,
  linkable_id: null,
  is_active: true,
  file: null,
  file_id: null,
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const formTitle = computed(() => {
  return props.formAction === 'create' ? 'اضافة بنر' : 'تعديل بنر'
})

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
initData()

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function getBannerData() {
  isLoading.data = true
  bannersService
    .getSingleItem(bannerId)
    .then((res) => {
      Object.assign(formData, res.data.data)
    })
    .finally(() => {
      isLoading.data = false
    })
}

function initData() {
  if (props.formAction === 'edit') getBannerData()
}

function goToBannersPage() {
  router.push({ name: 'banners-page' })
}

function updateFileId(file: File) {
  if (file) formData.file_id = file.id
}

function edit() {
  bannersService
    .editItem(formData as Banner)
    .then((res) => {
      toast.success(res.data.message)
      emit('editItem', formData as Banner)
      goToBannersPage()
    })
    .finally(() => {
      isLoading.submit = false
    })
}

function create() {
  bannersService
    .createItem(formData)
    .then((res) => {
      toast.success(res.data.message)
      emit('createItem', res.data)
      goToBannersPage()
    })
    .finally(() => {
      isLoading.submit = false
    })
}

function submit() {
  formRef.value.validate().then(({ valid }: any) => {
    if (!valid) return

    isLoading.submit = true
    props.formAction === 'create' ? create() : edit()
  })
}
// #endregion
</script>

<template>
  <div>
    <VCard class="page-card" v-loading="isLoading.data">
      <template #title>
        <div class="d-flex align-center">
          <PageBackBtn @click="goToBannersPage" />
          <div>
            {{ formTitle }}
          </div>
        </div>
      </template>
      <VCardText class="form-modal">
        <VeeForm ref="formRef" v-slot="{ meta }" @submit="submit">
          <VRow>
            <VCol cols="12">
              <AppUploadFile
                v-model="formData.file"
                name="file"
                label="الصورة/الفيديو"
                rules="required"
                :accepted-types="[
                  'image/jpeg',
                  'image/png',
                  'image/svg+xml',
                  'video/mp4',
                  'video/webm',
                ]"
                width="250px"
                height="150px"
                :max-file-size="350"
                @update:model-value="updateFileId"
              />
            </VCol>
            <VCol cols="12" md="6">
              <AppTextField
                v-model="formData.name.ar"
                label="اسم البنر بالعربي"
                name="name.ar"
                rules="required|min:3|max:50"
              />
            </VCol>
            <VCol cols="12" md="6">
              <AppTextField
                v-model="formData.name.en"
                label="اسم البنر بالانجليزي"
                name="name.en"
                rules="required|min:3|max:50"
              />
            </VCol>
            <VCol cols="12" sm="6">
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
                  :config="{
                    disableMobile: true,
                    minDate: formAction === 'create' ? new Date() : null,
                  }"
                  @update:model-value="handleChange"
                />
              </VeeField>
            </VCol>
            <VCol cols="12" sm="6">
              <VeeField
                v-slot="{ errorMessage, value, handleChange }"
                v-model="formData.to_date"
                name="to_date"
                label="تاريخ النهاية"
                :rules="{ required: true, minDate: formData.from_date }"
              >
                <AppDateTimePicker
                  label="تاريخ النهاية"
                  :key="formData.from_date"
                  :model-value="value"
                  :error-msg="errorMessage"
                  clearable
                  prepend-inner-icon="tabler-calendar"
                  :config="{
                    disableMobile: true,
                    minDate: formData.from_date
                      ? new Date(formData.from_date)
                      : formAction === 'create'
                        ? new Date()
                        : null,
                  }"
                  @update:model-value="handleChange"
                />
              </VeeField>
            </VCol>
            <VCol cols="12">
              <AppSelect
                v-model="formData.link_type"
                :items="getOptionsArrayFromObject(LINK_TYPES)"
                name="link_type"
                label="نوع الرابط"
                rules="required"
                item-title="label"
                item-value="value"
                clearable
              />
            </VCol>

            <VCol cols="12" v-if="formData.link_type === 'external'">
              <AppTextField
                v-model="formData.external_link"
                label="الرابط الخارجي"
                name="external_link"
                rules="required|validUrl"
              />
            </VCol>

            <template v-else-if="formData.link_type === 'internal'">
              <VCol cols="12">
                <AppSelect
                  v-model="formData.linkable_type"
                  :items="getOptionsArrayFromObject(LINKABLE_TYPES)"
                  name="linkable_type"
                  label="نوع الربط"
                  rules="required"
                  item-title="label"
                  item-value="value"
                  clearable
                />
              </VCol>

              <VCol cols="12" v-if="formData.linkable_type === 'users'">
                <VeeField
                  v-slot="{ errorMessage, value, handleChange, handleBlur }"
                  v-model="formData.linkable_id"
                  name="linkable_id"
                  label="المعلن"
                  rules="required"
                >
                  <VLabel class="text-body-2 text-high-emphasis" text="المعلن" />
                  <UsersSelectFilter
                    label=""
                    userRole="advertiser"
                    :model-value="value"
                    :error-messages="errorMessage"
                    :error="!!errorMessage"
                    id="advertisers-select-filter"
                    class="mt-2"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                    clearable
                    location-strategy="connected"
                  />
                </VeeField>
              </VCol>
            </template>

            <VCol cols="12">
              <AppSwitch v-model="formData.is_active" label="الحالة" name="is_active" />
            </VCol>

            <VCol cols="12" class="d-flex flex-wrap gap-3">
              <VBtn class="px-8" variant="outlined" color="error" @click="goToBannersPage">
                {{ t('actions.back') }}
              </VBtn>
              <VBtn
                class="px-8"
                :loading="isLoading.submit"
                :disabled="isLoading.submit"
                @click="submit"
              >
                {{ formAction === 'edit' ? t('actions.save') : t('actions.create') }}
              </VBtn>
            </VCol>
          </VRow>
        </VeeForm>
      </VCardText>
    </VCard>
  </div>
</template>
