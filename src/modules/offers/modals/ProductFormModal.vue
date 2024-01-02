<script setup lang="ts">
import GeoLocationModal from '@/components/shared/GeoLocationModal.vue'
import {
  PRODUCT_STATUSES,
  PRODUCT_WARRANTY_DURATION_TYPES,
  PRODUCT_WEIGHT_UNITS,
} from '@/constants/offers'
import type { FormModalProps } from '@/interfaces/Forms'
import { DropdownMenuItem } from '@/interfaces/Shared'
import { listService } from '@/services/ListService'
import { productsService } from '@/services/ProductsService'
import { useVModel } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import ModalAlert from '../components/ModalAlert.vue'
import type { OfferStoreType, ProductFormData } from '../interfaces/Offer'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
interface ProductModalProps extends FormModalProps {
  storeType?: OfferStoreType
  userId?: number | null
}
const props = withDefaults(defineProps<ProductModalProps>(), {
  showModal: false,
  storeType: null,
  userId: null,
})

// #endregion

/***************************************
 **** Section Emits Declaration ********
 **************************************/
// #region Emits
const emit = defineEmits<{
  (e: 'update:showModal', value: boolean): void
  (e: 'createItem', value: any): void
  (e: 'editItem', value: any): void
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
const formRef = ref<any>(null)
const unitsList = ref<DropdownMenuItem[]>([])
const categoriesList = ref<DropdownMenuItem[]>([])
const countriesList = ref<DropdownMenuItem[]>([])
const areasList = ref<DropdownMenuItem[]>([])
const usersKeyword = ref('')
const selectedProduct = ref(null)
const isLoading = reactive({
  data: false,
  submit: false,
  countries: false,
  areas: false,
  categories: false,
  units: false,
})

const formData = reactive<ProductFormData>({
  user_id: props.userId,
  name: '',
  category_id: null,
  link: null,
  description: '',
  attachments: [],
  attachmentsFiles: [],
  product_data: {
    warranty_and_expiration: {
      product_condition: null,
      expire_date: '',
      production_date: '',
      warranty_duration: null,
      warranty_duration_type: null,
    },
    unit_details: {
      product_quantity: null,
      available_quantity: null,
      main_unit_id: null,
      sub_unit_id: null,
      sub_unit_value: null,
    },
    dimensions: {
      width: null,
      height: null,
      length: null,
      weight: null,
      weight_unit: null,
    },
  },

  hide_contact_data: false,
  location: {
    address: '',
    lat: 0,
    lng: 0,
  },
  countries: [],
  areas: [],
  main_price: null,
  discount_price: null,
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
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const formTitle = computed(() => {
  return props.formAction === 'create'
    ? 'اضافة منتج'
    : props.formAction === 'edit'
      ? 'تعديل منتج'
      : 'عرض منتج'
})

const mainUnitName = computed(
  () =>
    unitsList.value.find((unit) => unit.id === formData.product_data.unit_details.main_unit_id)
      ?.label,
)

const productSize = computed(() => {
  const { width, height, length } = formData.product_data.dimensions
  return width && height && length ? (width * height * length).toFixed(2) : '-'
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
function onChangeProduct() {
  console.log('onChangeProduct', selectedProduct.value)
}

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

function onProductStatusChange() {
  formData.product_data.warranty_and_expiration.expire_date = ''
}

function updateLocation(location: any) {
  formData.location = { ...location }
}

function getItemDetails(id: any) {
  isLoading.data = true
  productsService
    .getSingleItem(id)
    .then((res) => {
      const data = res.data.data
      data.countries = data.countries.map((country: DropdownMenuItem) => country.id)
      data.areas = data.areas.map((country: DropdownMenuItem) => country.id)
      data.product_data.unit_details.main_unit_id = data.main_unit.id
      data.product_data.unit_details.sub_unit_id = data.sub_unit.id
      data.category_id = data.category.id
      data.attachmentsFiles = data.attachments.map((attachment: File) => attachment)
      data.location = data.location || {
        address: '',
        lat: 0,
        lng: 0,
      }

      data.user_id = data.user.id
      usersKeyword.value = data.user.username

      Object.assign(formData, data)
      if (data.countries.length === 1) {
        getAreas()
      }
    })
    .finally(() => {
      isLoading.data = false
    })
}

function initData() {
  getCountries()
  getCategories()
  getUnits()
  if (props.formAction === 'edit') getItemDetails(props.activeItem.id)
}

function edit() {
  productsService
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
  productsService
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
    <GeoLocationModal
      v-if="showGeoLocationModal"
      v-model:showModal="showGeoLocationModal"
      :location="{ ...formData.location }"
      @update:location="updateLocation"
    />
    <VDialog v-model="showModal" max-width="1000" persistent scrollable class="form-modal">
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="showModal = !showModal" />

      <!-- Dialog Content -->
      <VCard v-loading="isLoading.data">
        <VeeForm ref="formRef" v-slot="{ meta }" @submit="submit">
          <VCard :title="formTitle">
            <VCardText>
              <VRow>
                <VCol cols="12" class="py-0">
                  <ModalAlert text="البيانات الاساسية" />
                </VCol>

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
                <VCol cols="12" v-if="formData.user_id && formAction === 'create'">
                  <VLabel class="text-body-2 text-high-emphasis mb-1" text="المنتج" />
                  <ProductsSelectFilter
                    label=""
                    :user-id="formData.user_id"
                    :userRole="null"
                    v-model="selectedProduct"
                    id="products-select-filter"
                    @update:model-value="onChangeProduct"
                    clearable
                    hint="هذا الحقل لتسهيل اضافة منتج جديد"
                    persistent-hint
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
                <VCol cols="12" v-if="props.storeType === 'website'">
                  <AppTextField
                    v-model="formData.link"
                    label="رابط المتجر"
                    type="text"
                    name="link"
                    rules="required|validUrl"
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
                  <VLabel class="text-body-2 text-high-emphasis mb-1" text="صور المنتج (اختياري)" />
                  <div class="d-flex flex-wrap gap-4" v-if="formData.attachmentsFiles.length">
                    <div v-for="(attachment, index) in formData.attachmentsFiles" :key="index">
                      <AppUploadFile
                        v-model="formData.attachmentsFiles[index]"
                        :name="`صورة-${index + 1}`"
                        label=""
                        width="150px"
                        height="150px"
                        rules="required"
                        :accepted-types="['image/jpeg', 'image/png', 'image/svg+xml', 'image/gif']"
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

                <VCol cols="12" class="py-0">
                  <ModalAlert text="بيانات المنتج" />
                </VCol>
                <VCol cols="12" md="4">
                  <AppAutocomplete
                    v-model="formData.product_data.unit_details.main_unit_id"
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
                <VCol cols="12" md="4">
                  <AppTextField
                    v-model="formData.product_data.unit_details.product_quantity"
                    label="كمية العرض"
                    name="product_quantity"
                    rules="required|numeric"
                    type="number"
                  />
                </VCol>
                <VCol cols="12" md="4">
                  <AppTextField
                    v-model="formData.product_data.unit_details.available_quantity"
                    :disabled="!formData.product_data.unit_details.product_quantity"
                    label="الكمية المتاحة"
                    name="available_quantity"
                    :rules="{
                      required: formData.product_data.unit_details.product_quantity !== null,
                      numeric: true,
                      max_value: formData.product_data.unit_details.product_quantity,
                    }"
                    type="number"
                  />
                </VCol>
                <VCol cols="12" md="4">
                  <AppAutocomplete
                    v-model="formData.product_data.unit_details.sub_unit_id"
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
                <VCol cols="12" md="8">
                  <AppTextField
                    v-model="formData.product_data.unit_details.sub_unit_value"
                    label="قيمة الوحدة الفرعية"
                    name="sub_unit_value"
                    rules="required|numeric"
                    type="number"
                  />
                </VCol>

                <VCol cols="12" class="py-0">
                  <ModalAlert text="الوزن والابعاد" />
                </VCol>

                <VCol cols="12" md="3">
                  <AppTextField
                    v-model="formData.product_data.dimensions.height"
                    label="الطول"
                    name="height"
                    rules="required|numeric"
                    type="number"
                  />
                </VCol>
                <VCol cols="12" md="3">
                  <AppTextField
                    v-model="formData.product_data.dimensions.width"
                    label="العرض"
                    name="width"
                    rules="required|numeric"
                    type="number"
                  />
                </VCol>
                <VCol cols="12" md="3">
                  <AppTextField
                    v-model="formData.product_data.dimensions.length"
                    label="الارتفاع"
                    name="length"
                    rules="required|numeric"
                    type="number"
                  />
                </VCol>
                <VCol cols="12" md="3">
                  <VLabel class="text-body-2 text-high-emphasis mb-1" text="الحجم" />
                  <div class="bg-grey-200 pa-2 rounded">{{ productSize }}</div>
                </VCol>
                <VCol cols="12" md="6">
                  <AppTextField
                    v-model="formData.product_data.dimensions.weight"
                    label="الوزن"
                    name="weight"
                    rules="required|numeric"
                    type="number"
                  />
                </VCol>
                <VCol cols="12" md="6">
                  <AppAutocomplete
                    v-model="formData.product_data.dimensions.weight_unit"
                    name="weight_unit"
                    :items="
                      Array.from(PRODUCT_WEIGHT_UNITS, ([key, value]) => ({
                        id: key,
                        label: value.label,
                      }))
                    "
                    item-title="label"
                    item-value="id"
                    label="وحدة الوزن"
                    rules="required"
                    clearable
                  />
                </VCol>

                <VCol cols="12" class="py-0">
                  <ModalAlert text="الصلاحية والضمان" />
                </VCol>
                <VCol cols="12" md="6">
                  <AppAutocomplete
                    v-model="formData.product_data.warranty_and_expiration.product_condition"
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
                <VCol cols="12" md="6">
                  <VeeField
                    v-slot="{ errorMessage, value, handleChange }"
                    v-model="formData.product_data.warranty_and_expiration.production_date"
                    name="production_date"
                    label="تاريخ الانتاج"
                    rules="required"
                  >
                    <AppDateTimePicker
                      label="تاريخ الانتاج"
                      :model-value="value"
                      :error-msg="errorMessage"
                      clearable
                      prepend-inner-icon="tabler-calendar"
                      :config="{
                        disableMobile: true,
                      }"
                      @update:model-value="handleChange"
                    />
                  </VeeField>
                </VCol>
                <VCol
                  cols="12"
                  v-if="
                    formData.product_data.warranty_and_expiration.product_condition ===
                    'expires_soon'
                  "
                >
                  <VeeField
                    v-slot="{ errorMessage, value, handleChange }"
                    v-model="formData.product_data.warranty_and_expiration.expire_date"
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
                <VCol cols="12" md="6">
                  <AppTextField
                    v-model="formData.product_data.warranty_and_expiration.warranty_duration"
                    label="فترة الصمان (اختياري)"
                    name="warranty_duration"
                    rules="numeric"
                    type="number"
                  />
                </VCol>
                <VCol cols="12" md="6">
                  <AppAutocomplete
                    v-model="formData.product_data.warranty_and_expiration.warranty_duration_type"
                    name="warranty_duration_type"
                    :items="
                      Array.from(PRODUCT_WARRANTY_DURATION_TYPES, ([key, value]) => ({
                        id: key,
                        label: value.label,
                      }))
                    "
                    item-title="label"
                    item-value="id"
                    label="نوع قترة الصمان (اختياري)"
                    clearable
                  />
                </VCol>

                <VCol cols="12" class="py-0">
                  <VAlert
                    text="الإختيارات والتفضيلات"
                    color="primary"
                    border="start"
                    variant="tonal"
                    density="compact"
                  />
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
                    v-model="formData.location.address"
                    label="مكان الشراء والتسليم"
                    name="location"
                    :rules="{ required: props.storeType === 'marketplace', min: 3 }"
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
                    :rules="{ required: formData.countries.length === 1 }"
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
                  <VLabel
                    class="text-body-2 text-high-emphasis mb-1"
                    text="بيانات المسؤول (اختياري)"
                  />
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
                            @click="
                              formData.responsible.hide_name = !formData.responsible.hide_name
                            "
                          >
                            <VIcon
                              :icon="
                                formData.responsible.hide_name ? 'tabler-eye-off' : 'tabler-eye'
                              "
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
                            @click="
                              formData.responsible.hide_email = !formData.responsible.hide_email
                            "
                          >
                            <VIcon
                              :icon="
                                formData.responsible.hide_email ? 'tabler-eye-off' : 'tabler-eye'
                              "
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
                            @click="
                              formData.responsible.hide_phone = !formData.responsible.hide_phone
                            "
                          >
                            <VIcon
                              :icon="
                                formData.responsible.hide_phone ? 'tabler-eye-off' : 'tabler-eye'
                              "
                              size="22"
                            />
                          </VBtn>
                        </template>
                      </AppTextField>
                    </VCol>
                  </VRow>
                </VCol>
              </VRow>
            </VCardText>

            <VCardText v-if="formAction !== 'view'" class="d-flex justify-end flex-wrap gap-3">
              <VBtn variant="outlined" color="error" @click="showModal = false">
                {{ t('actions.cancel') }}
              </VBtn>
              <VBtn
                :loading="isLoading.submit"
                :disabled="isLoading.submit || isLoading.data || !meta.valid"
                @click="submit"
              >
                {{ formAction === 'edit' ? t('actions.save') : t('actions.create') }}
              </VBtn>
            </VCardText>
          </VCard>
        </VeeForm>
      </VCard>
    </VDialog>
  </div>
</template>

<style lang="scss" scoped>
.categories-select {
  position: relative;
  z-index: 1;
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
