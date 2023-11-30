<script setup lang="ts">
import GeoLocationModal from '@/components/shared/GeoLocationModal.vue'
import { OFFER_TYPES, PRODUCT_STATUSES, STORES_TYPES } from '@/constants/offers'
import { cloneItem } from '@/helpers/index'
import type { FormActionType } from '@/interfaces/Forms'
import type { OfferFormData } from '@/interfaces/Offer'
import type { DropdownMenuItem, File, Location } from '@/interfaces/Shared'
import { listService } from '@/services/ListService'
import { offersService } from '@/services/OffersService'
import { useToast } from 'vue-toastification'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(defineProps<{ formAction: FormActionType }>(), {
  formAction: 'view',
})

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const toast = useToast()
const router = useRouter()
const route = useRoute()
const formRef = ref<any>(null)
const showGeoLocationModal = ref<boolean>(false)
const offerId: number = +route.params.id
const unitsList = ref<DropdownMenuItem[]>([])
const categoriesList = ref<DropdownMenuItem[]>([])
const countriesList = ref<DropdownMenuItem[]>([])
const areasList = ref<DropdownMenuItem[]>([])
const usersKeyword = ref('')
const afterTomorrowDate: Date = new Date(new Date().setDate(new Date().getDate() + 2))

const isLoading = reactive({
  data: false,
  submit: false,
  countries: false,
  areas: false,
  categories: false,
  units: false,
})

const formData = reactive<OfferFormData>({
  image: null,
  image_id: null,
  name: '',
  offer_type: null,
  from_date: '',
  to_date: '',
  user_id: null,
  category_id: null,
  description: '',
  product_condition: null,
  used_description: '',
  expire_date: '',
  is_active: true,
  hide_contact_data: false,
  store: {
    name: '',
    url: '',
    type: null,
  },
  location: {
    address: '',
    lat: 0,
    lng: 0,
  },
  countries: [],
  areas: [],
  main_unit_id: null,
  sub_unit_id: null,
  sub_unit_value: null,
  main_price: null,
  discount_price: null,
  offer_quantity: null,
  show_offer_quantity: true,
  available_quantity: null,
  show_available_quantity: true,
  minimum_quantity: null,
  maximum_quantity: null,
  responsible: {
    name: '',
    email: '',
    phone: '',
    hide_name: false,
    hide_email: false,
    hide_phone: false,
  },
  prices: [],
  attachments: [],
  attachmentsFiles: [],
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const formTitle = computed(() => {
  return props.formAction === 'create' ? 'اضافة عرض' : 'تعديل عرض'
})

const mainUnitName = computed(
  () => unitsList.value.find((unit) => unit.id === formData.main_unit_id)?.label,
)

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
function getCountries() {
  isLoading.countries = true
  listService
    .getCountries()
    .then((res: any) => {
      countriesList.value = res.data.data
    })
    .finally(() => {
      isLoading.countries = false
    })
}

function onChangeCountries() {
  const countriesLength = formData.countries.length
  if (countriesLength !== 1) {
    formData.areas = []
    return
  }
  getAreas()
}

function getAreas() {
  isLoading.areas = true
  listService
    .getAreas(formData.countries[0])
    .then((res: any) => {
      areasList.value = res.data.data
    })
    .finally(() => {
      isLoading.areas = false
    })
}

function getCategories() {
  isLoading.categories = true
  listService
    .getCategories()
    .then((res: any) => {
      categoriesList.value = res.data.data
    })
    .finally(() => {
      isLoading.categories = false
    })
}

function getUnits() {
  isLoading.units = true
  listService
    .getUnits()
    .then((res: any) => {
      unitsList.value = res.data.data
    })
    .finally(() => {
      isLoading.units = false
    })
}

function initData() {
  getCountries()
  getCategories()
  getUnits()
  if (props.formAction === 'edit') getOfferData()
}

function prepareFormData(data: any) {
  data.user_id = data.user.id
  usersKeyword.value = data.user.username
  data.countries = data.countries.map((country: DropdownMenuItem) => country.id)
  data.areas = data.areas.map((country: DropdownMenuItem) => country.id)
  data.main_unit_id = data.main_unit.id
  data.sub_unit_id = data.sub_unit.id
  data.category_id = data.category.id
  data.image_id = data.image.id
  delete data.image.id
  data.attachmentsFiles = data.attachments.map((attachment: File) => attachment)

  Object.assign(formData, data)
  if (data.countries.length === 1) {
    getAreas()
  }
}

function getOfferData() {
  isLoading.data = true
  offersService
    .getSingleItem(offerId)
    .then((res) => {
      prepareFormData(res.data.data)
    })
    .finally(() => {
      isLoading.data = false
    })
}

function goToOffersPage() {
  router.push({ name: 'offers-page' })
}

function onProductStatusChange() {
  formData.used_description = ''
  formData.expire_date = ''
}

function updateImageId(image: File) {
  if (image) formData.image_id = image.id
}

function updateLocation(location: Location) {
  formData.location = { ...location }
}

async function validateLastPrice() {
  if (formData.prices.length) {
    const lastIndex = formData.prices.length - 1
    const validationResults = await Promise.all([
      formRef.value.validateField(`prices-from-${lastIndex}`),
      formRef.value.validateField(`prices-to-${lastIndex}`),
      formRef.value.validateField('prices-value-' + lastIndex),
    ])

    return validationResults.every((result) => result.valid)
  }
  return true
}

async function addNewPrice() {
  const isValidPrice = await validateLastPrice()
  if (!isValidPrice) return
  formData.prices?.push({
    minimum_quantity: null,
    maximum_quantity: null,
    price: null,
  })
}

function edit(payload: OfferFormData) {
  offersService
    .editItem(payload)
    .then((res) => {
      toast.success(res.data.message)
      goToOffersPage()
    })
    .finally(() => {
      isLoading.submit = false
    })
}

function create(payload: OfferFormData) {
  offersService
    .createItem(payload)
    .then((res) => {
      toast.success(res.data.message)
      goToOffersPage()
    })
    .finally(() => {
      isLoading.submit = false
    })
}

function getFormData() {
  const payload = cloneItem(formData)
  delete payload.image
  payload.attachments = payload.attachmentsFiles.map((attachment: File) => attachment.id)
  delete payload.attachmentsFiles

  return payload
}

function submit() {
  formRef.value.validate().then(({ errors }: any) => {
    const errorsArr = Object.values(errors)
    if (errorsArr.length) {
      toast.error(errorsArr.slice(0, 2).join('\n'))
    }
    if (errorsArr.length) return

    isLoading.submit = true
    const payload = getFormData()
    props.formAction === 'create' ? create(payload) : edit(payload)
  })
}
// #endregion
</script>

<template>
  <div>
    <GeoLocationModal
      v-if="showGeoLocationModal"
      v-model:showModal="showGeoLocationModal"
      :location="{ ...formData.location }"
      @update:location="updateLocation"
    />
    <VCard class="page-card" v-loading="isLoading.data">
      <template #title>
        <div class="d-flex align-center">
          <PageBackBtn @click="goToOffersPage" />
          <div>
            {{ formTitle }}
          </div>
        </div>
      </template>
      <VCardText class="form-modal">
        <VeeForm ref="formRef" @submit="submit" v-if="!isLoading.data">
          <VRow class="my-0">
            <VCol cols="12">
              <AppUploadFile
                v-model="formData.image"
                name="image"
                label="الصورة (اختياري)"
                :accepted-types="['image/jpeg', 'image/png', 'image/svg+xml']"
                width="150px"
                height="150px"
                @update:model-value="updateImageId"
              />
            </VCol>
            <VCol cols="12" md="6">
              <AppTextField
                v-model="formData.name"
                label="الاسم"
                type="text"
                name="name"
                rules="required|min:1|max:500"
              />
            </VCol>
            <VCol cols="12" md="6">
              <AppAutocomplete
                v-model="formData.offer_type"
                name="offer_type"
                :items="
                  Array.from(OFFER_TYPES, ([key, value]) => ({
                    id: key,
                    label: value.label,
                  }))
                "
                item-title="label"
                item-value="id"
                label="النوع"
                rules="required"
                clearable
              />
            </VCol>
            <VCol cols="12" md="6">
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
                    minDate: formAction === 'create' ? afterTomorrowDate : null,
                  }"
                  @update:model-value="handleChange"
                />
              </VeeField>
            </VCol>
            <VCol cols="12" md="6">
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
            <VCol cols="12" md="6">
              <VeeField
                v-slot="{ errorMessage, value, handleChange, handleBlur }"
                v-model="formData.user_id"
                name="user_id"
                label="المستخدم"
                rules="required"
              >
                <VLabel class="text-body-2 text-high-emphasis" text="المستخدم" />
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
              <AppAutocomplete
                v-model="formData.category_id"
                name="category_id"
                :items="categoriesList"
                item-title="label"
                item-value="id"
                label="القسم"
                rules="required"
                :loading="isLoading.categories"
                :disabled="isLoading.categories"
                clearable
              />
            </VCol>
            <VCol cols="12">
              <AppTextarea
                v-model="formData.description"
                name="description"
                label="الوصف"
                rows="4"
                rules="required|min:10|max:500"
              />
            </VCol>
            <VCol cols="12">
              <AppAutocomplete
                v-model="formData.product_condition"
                name="product_condition"
                :items="
                  Array.from(PRODUCT_STATUSES, ([key, value]) => ({
                    id: key,
                    label: value.label,
                  }))
                "
                item-title="label"
                item-value="id"
                label="حالة المنتج"
                rules="required"
                clearable
                @update:model-value="onProductStatusChange"
              />
            </VCol>
            <VCol cols="12" v-if="formData.product_condition === 'used_product'">
              <AppTextarea
                v-model="formData.used_description"
                name="used_description"
                label="وصف الاستخدام"
                rows="4"
                rules="required|min:10|max:500"
              />
            </VCol>
            <VCol cols="12" v-else-if="formData.product_condition === 'expires_soon'">
              <VeeField
                v-slot="{ errorMessage, value, handleChange }"
                v-model="formData.expire_date"
                name="expire_date"
                label="تاريخ الانتهاء"
                rules="required"
              >
                <AppDateTimePicker
                  label="تاريخ الانتهاء"
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
            <VCol cols="12" md="6" class="pb-0">
              <AppSwitch v-model="formData.is_active" label="الحالة" name="is_active" />
            </VCol>
            <VCol cols="12" md="6" class="pb-0">
              <AppSwitch
                v-model="formData.hide_contact_data"
                label="اخفاء بيانات التواصل"
                name="hide_contact_data"
              />
            </VCol>
            <VCol cols="12" md="6">
              <AppTextField
                v-model="formData.store.name"
                label="اسم المتجر"
                type="text"
                name="store.name"
                rules="required|min:3|max:50"
              />
            </VCol>
            <VCol cols="12" md="6">
              <AppAutocomplete
                v-model="formData.store.type"
                name="store.type"
                :items="
                  Array.from(STORES_TYPES, ([key, value]) => ({
                    id: key,
                    label: value.label,
                  }))
                "
                item-title="label"
                item-value="id"
                label="نوع المتجر"
                rules="required"
                clearable
              />
            </VCol>
            <VCol cols="12" md="6">
              <AppTextField
                v-model="formData.store.url"
                label="رابط المتجر"
                type="text"
                name="store.url"
                rules="required|validUrl"
              />
            </VCol>
            <VCol cols="12" md="6">
              <AppTextField
                v-model="formData.location.address"
                label="مكان الشراء والتسليم"
                name="location"
                rules="required|min:3"
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
            <VCol cols="12" md="6">
              <AppAutocomplete
                v-model="formData.countries"
                name="countries"
                :items="countriesList"
                item-title="label"
                item-value="id"
                label="الدول"
                rules="required"
                :loading="isLoading.countries"
                :disabled="isLoading.countries"
                clearable
                multiple
                @update:model-value="onChangeCountries"
              >
                <template #selection="{ item, index }">
                  <VChip v-if="index < 1">
                    <span>{{ item.title }}</span>
                  </VChip>
                  <span v-if="index === 1" class="text-grey text-caption align-self-center">
                    (+{{ formData.countries.length - 1 }} اخري)
                  </span>
                </template>
              </AppAutocomplete>
            </VCol>
            <VCol cols="12" md="6">
              <AppAutocomplete
                v-model="formData.areas"
                name="areas"
                :items="areasList"
                item-title="label"
                item-value="id"
                label="المدن"
                rules="required"
                :loading="isLoading.areas"
                :disabled="isLoading.areas || formData.countries.length !== 1"
                clearable
                multiple
              >
                <template #selection="{ item, index }">
                  <VChip v-if="index < 1">
                    <span>{{ item.title }}</span>
                  </VChip>
                  <span v-if="index === 1" class="text-grey text-caption align-self-center">
                    (+{{ formData.areas.length - 1 }} اخري)
                  </span>
                </template>
              </AppAutocomplete>
            </VCol>
            <VCol cols="12">
              <AppAutocomplete
                v-model="formData.main_unit_id"
                name="main_unit_id"
                :items="unitsList"
                item-title="label"
                item-value="id"
                label="الوحدة الرئيسية"
                rules="required"
                :loading="isLoading.units"
                :disabled="isLoading.units"
                clearable
              />
            </VCol>
            <VCol cols="12" md="6">
              <AppAutocomplete
                v-model="formData.sub_unit_id"
                name="sub_unit_id"
                :items="unitsList"
                item-title="label"
                item-value="id"
                label="الوحدة الفرعية"
                rules="required"
                :loading="isLoading.units"
                :disabled="isLoading.units"
                clearable
              />
            </VCol>
            <VCol cols="12" md="6">
              <AppTextField
                v-model="formData.sub_unit_value"
                label="قيمة الوحدة الفرعية"
                name="sub_unit_value"
                rules="required|numeric"
                type="number"
              />
            </VCol>
            <VCol cols="12" md="6">
              <AppTextField
                v-model="formData.main_price"
                label="السعر قبل الخصم"
                name="main_price"
                rules="required|numeric"
                type="number"
              />
            </VCol>
            <VCol cols="12" md="6">
              <AppTextField
                v-model="formData.discount_price"
                label="السعر بعد الخصم"
                name="discount_price"
                type="number"
                :rules="{
                  required: formData.main_price,
                  numeric: true,
                  lessThanValue: formData.main_price,
                }"
                :disabled="!formData.main_price"
              />
            </VCol>
            <VCol cols="12" md="6">
              <AppTextField
                v-model="formData.offer_quantity"
                label="كمية العرض"
                name="offer_quantity"
                rules="required|numeric"
                type="number"
              >
                <template #append>
                  <VBtn
                    size="38"
                    variant="outlined"
                    @click="formData.show_offer_quantity = !formData.show_offer_quantity"
                  >
                    <VIcon
                      :icon="formData.show_offer_quantity ? 'tabler-eye' : 'tabler-eye-off'"
                      size="22"
                    />
                  </VBtn>
                </template>
              </AppTextField>
            </VCol>
            <VCol cols="12" md="6">
              <AppTextField
                v-model="formData.available_quantity"
                :disabled="!formData.offer_quantity"
                label="الكمية المتاحة"
                name="available_quantity"
                :rules="{
                  required: formData.offer_quantity !== null,
                  numeric: true,
                  max_value: formData.offer_quantity,
                }"
                type="number"
              >
                <template #append>
                  <VBtn
                    size="38"
                    variant="outlined"
                    @click="formData.show_available_quantity = !formData.show_available_quantity"
                  >
                    <VIcon
                      :icon="formData.show_available_quantity ? 'tabler-eye' : 'tabler-eye-off'"
                      size="22"
                    />
                  </VBtn>
                </template>
              </AppTextField>
            </VCol>
            <VCol cols="12">
              <VLabel
                class="text-body-2 text-high-emphasis mb-1"
                text="كمية البيع المسموحة للعميل الواحد"
              />
              <VRow class="border ma-0 py-1 px-1">
                <VCol cols="12" md="6">
                  <AppTextField
                    v-model="formData.minimum_quantity"
                    label="أقل كمية"
                    hide-default-label
                    name="minimum_quantity"
                    rules="required|numeric"
                    type="number"
                  />
                </VCol>
                <VCol cols="12" md="6">
                  <AppTextField
                    v-model="formData.maximum_quantity"
                    label="أعلي كمية"
                    hide-default-label
                    name="maximum_quantity"
                    rules="required|numeric"
                    type="number"
                  />
                </VCol>
              </VRow>
            </VCol>
            <VCol cols="12">
              <VLabel
                class="text-body-2 text-high-emphasis mb-1"
                text="تسعير شرائح البيع (اختياري)"
              />
              <VRow
                v-for="(price, index) in formData.prices"
                :key="index"
                class="border ma-0 price-card py-1 px-2"
              >
                <VCol cols="12" md="4" class="px-1">
                  <AppTextField
                    v-model="price.minimum_quantity"
                    label="من"
                    hide-default-label
                    :name="`prices-from-${index}`"
                    rules="required|numeric"
                    type="number"
                  />
                </VCol>
                <VCol cols="12" md="4" class="px-1">
                  <AppTextField
                    v-model="price.maximum_quantity"
                    label="إلي"
                    hide-default-label
                    :name="`prices-to-${index}`"
                    rules="required|numeric"
                    type="number"
                  >
                    <template #append-inner v-if="mainUnitName"> {{ mainUnitName }} </template>
                  </AppTextField>
                </VCol>
                <VCol cols="12" md="4" class="px-1">
                  <AppTextField
                    v-model="price.price"
                    label="السعر"
                    hide-default-label
                    :name="`prices-value-${index}`"
                    rules="required|numeric"
                    type="number"
                  />
                </VCol>
                <VBtn
                  icon
                  color="error"
                  size="30"
                  class="price-card__delete-btn"
                  @click="formData.prices?.splice(index, 1)"
                >
                  <VIcon icon="tabler-trash" />
                </VBtn>
              </VRow>
              <VBtn
                variant="outlined"
                @click="addNewPrice"
                class="mt-3 py-2 d-block"
                height="auto"
                size="small"
              >
                اضافة شريحة
                <VIcon end icon="tabler-plus" />
              </VBtn>
            </VCol>
            <VCol cols="12">
              <VLabel class="text-body-2 text-high-emphasis mb-1" text="بيانات المسؤول (اختياري)" />
              <VRow class="border ma-0 py-1 px-1">
                <VCol cols="12">
                  <AppTextField
                    v-model="formData.responsible.name"
                    label="الاسم"
                    hide-default-label
                    name="responsible.name"
                    rules="min:1|max:20"
                    type="text"
                  >
                    <template #append>
                      <VBtn
                        size="38"
                        variant="outlined"
                        @click="formData.responsible.hide_name = !formData.responsible.hide_name"
                      >
                        <VIcon
                          :icon="formData.responsible.hide_name ? 'tabler-eye-off' : 'tabler-eye'"
                          size="22"
                        />
                      </VBtn>
                    </template>
                  </AppTextField>
                </VCol>
                <VCol cols="12" md="6">
                  <AppTextField
                    v-model="formData.responsible.email"
                    label="البريد الالكتروني"
                    hide-default-label
                    name="responsible.email"
                    rules="min:6|email"
                    type="email"
                  >
                    <template #append>
                      <VBtn
                        size="38"
                        variant="outlined"
                        @click="formData.responsible.hide_email = !formData.responsible.hide_email"
                      >
                        <VIcon
                          :icon="formData.responsible.hide_email ? 'tabler-eye-off' : 'tabler-eye'"
                          size="22"
                        />
                      </VBtn>
                    </template>
                  </AppTextField>
                </VCol>
                <VCol cols="12" md="6">
                  <AppTextField
                    v-model="formData.responsible.phone"
                    label="الهاتف"
                    hide-default-label
                    name="responsible.phone"
                    rules="numeric|min:7|max:20"
                    type="number"
                  >
                    <template #append>
                      <VBtn
                        size="38"
                        variant="outlined"
                        @click="formData.responsible.hide_phone = !formData.responsible.hide_phone"
                      >
                        <VIcon
                          :icon="formData.responsible.hide_phone ? 'tabler-eye-off' : 'tabler-eye'"
                          size="22"
                        />
                      </VBtn>
                    </template>
                  </AppTextField>
                </VCol>
              </VRow>
            </VCol>
            <VCol cols="12">
              <VLabel class="text-body-2 text-high-emphasis mb-1" text="المرفقات (اختياري)" />
              <div class="d-flex flex-wrap gap-4" v-if="formData.attachmentsFiles.length">
                <div v-for="(attachment, index) in formData.attachmentsFiles" :key="index">
                  <AppUploadFile
                    v-model="formData.attachmentsFiles[index]"
                    :name="`ملف-${index + 1}`"
                    label=""
                    width="150px"
                    height="150px"
                    rules="required"
                  />
                  <VBtn
                    @click="formData.attachmentsFiles.splice(index, 1)"
                    v-if="!formData.attachmentsFiles[index]"
                    block
                    size="small"
                    color="error"
                    class="mt-1"
                    variant="outlined"
                  >
                    الغاء
                    <VIcon end icon="tabler-x" />
                  </VBtn>
                </div>
              </div>
              <VDivider class="mt-3" v-if="formData.attachmentsFiles.length" />
              <VBtn
                variant="outlined"
                @click="formData.attachmentsFiles.push(null as any)"
                class="py-2 mt-3 d-block"
                height="auto"
                size="small"
              >
                اضافة مرفق
                <VIcon end icon="tabler-plus" />
              </VBtn>
            </VCol>

            <VCol cols="12" v-if="formAction !== 'view'" class="d-flex flex-wrap gap-3">
              <VBtn class="px-8" variant="outlined" color="error" @click="goToOffersPage">
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

<style lang="scss" scoped>
:deep(.v-card-item) {
  padding-block-end: 10px;
}

:deep(.v-select .v-field .v-field__input > input) {
  block-size: 100%;
}

:deep(.v-text-field.v-input--disabled .v-field) {
  background: rgb(var(--v-theme-grey-200), 0.5);
  opacity: 1;
}

.price-card {
  position: relative;

  &:not(:last-of-type) {
    margin-block-end: 20px;
  }

  &:last-of-type {
    margin-block-end: 10px;
  }

  &__delete-btn {
    position: absolute;
    inset-block-start: -13px;
    inset-inline-end: -13px;
  }

  :deep(.v-field__append-inner) {
    display: block;
    overflow: hidden;
    align-self: center;
    max-inline-size: 100px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
