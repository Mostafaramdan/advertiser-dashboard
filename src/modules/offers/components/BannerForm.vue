<script setup lang="ts">
import { BANNER_LINK_TYPES, BANNER_LINKABLE_TYPES } from '@/constants/offers'
import { cloneItem, getOptionsArrayFromObject } from '@/helpers/index'
import type { FormActionType } from '@/interfaces/Forms'
import type { File } from '@/interfaces/Shared'
import { useToast } from 'vue-toastification'
import type { Banner, BannerBase } from '../interfaces/Banner'
import { bannersService } from '../services/BannersService'

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
const linkableKeyword = ref('')

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
      prepareFormData(res.data.data)
    })
    .finally(() => {
      isLoading.data = false
    })
}

function initData() {
  if (props.formAction === 'edit') getBannerData()
}

function prepareFormData(data: any) {
  if (data.file) {
    data.file_id = data.file?.id
    delete data.file.id
  }
  if (data.model) {
    data.linkable_id = data.model.id
    linkableKeyword.value = data.model.name || data.model.username
    delete data.model
  }

  Object.assign(formData, data)
  // reset linkable keyword
  nextTick(() => {
    linkableKeyword.value = ''
  })
}

function goToBannersPage() {
  router.push({ name: 'offers-banners' })
}

function updateFileId(file: File) {
  if (file) formData.file_id = file.id
}

function getFormData(): BannerBase | Banner {
  const payload = cloneItem(formData)
  if (!payload.linkable_type) delete payload.linkable_type
  if (!payload.linkable_id) delete payload.linkable_id
  if (!payload.external_link) delete payload.external_link
  return payload
}

function resetLinkableData() {
  formData.linkable_id = null
  formData.external_link = null
}

function edit(payload: Banner) {
  bannersService
    .editItem(payload)
    .then((res) => {
      toast.success(res.data.message)
      emit('editItem', payload)
      goToBannersPage()
    })
    .finally(() => {
      isLoading.submit = false
    })
}

function create(payload: BannerBase) {
  bannersService
    .createItem(payload)
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
    const payload = getFormData()
    props.formAction === 'create' ? create(payload) : edit(payload as Banner)
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
                :items="getOptionsArrayFromObject(BANNER_LINK_TYPES)"
                name="link_type"
                label="نوع الرابط"
                rules="required"
                item-title="label"
                item-value="value"
                clearable
                @update:model-value="resetLinkableData"
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
                  :items="getOptionsArrayFromObject(BANNER_LINKABLE_TYPES)"
                  name="linkable_type"
                  label="نوع الربط"
                  rules="required"
                  item-title="label"
                  item-value="value"
                  clearable
                  @update:model-value="resetLinkableData"
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
                    :keyword="linkableKeyword"
                  />
                </VeeField>
              </VCol>

              <VCol cols="12" v-else-if="formData.linkable_type === 'offers'">
                <VeeField
                  v-slot="{ errorMessage, value, handleChange, handleBlur }"
                  v-model="formData.linkable_id"
                  name="linkable_id"
                  label="العرض"
                  rules="required"
                >
                  <VLabel class="text-body-2 text-high-emphasis" text="العرض" />
                  <OffersSelectFilter
                    label=""
                    :model-value="value"
                    :error-messages="errorMessage"
                    :error="!!errorMessage"
                    id="offers-select-filter"
                    class="mt-2"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                    clearable
                    location-strategy="connected"
                    :keyword="linkableKeyword"
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
