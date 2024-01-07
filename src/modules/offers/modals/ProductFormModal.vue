<script setup lang="ts">
import {
  OFFER_DEADLINES_TIMES,
  OFFER_PAYMENT_METHODS,
  PRODUCT_PRICING_TYPES,
  PRODUCT_STATUSES,
  PRODUCT_WARRANTY_DURATION_TYPES,
  PRODUCT_WEIGHT_UNITS,
} from '@/constants/offers'
import { cloneItem } from '@/helpers/index'
import type { FormModalProps } from '@/interfaces/Forms'
import type { File } from '@/interfaces/Shared'
import { DropdownMenuItem } from '@/interfaces/Shared'
import { listService } from '@/services/ListService'
import { productsService } from '@/services/ProductsService'
import { useVModel } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import ModalAlert from '../components/ModalAlert.vue'
import type {
  OfferStoreType,
  ProductFormData,
  ProductPrice,
  ProductPricingType,
} from '../interfaces/Offer'
import { OfferDeadline } from '../interfaces/OfferDeadline'
import { OfferPaymentMethod } from '../interfaces/OfferPaymentMethod'
import type { Responsible } from '../interfaces/Responsible'
import ResponsibleFormModal from '../modals/ResponsibleFormModal.vue'

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
const showResponsibleFormModal = ref<boolean>(false)
const showBranchesFormModal = ref<boolean>(false)
const formRef = ref<any>(null)
const unitsList = ref<DropdownMenuItem[]>([])
const categoriesList = ref<DropdownMenuItem[]>([])
const countriesList = ref<DropdownMenuItem[]>([])
const areasList = ref<DropdownMenuItem[]>([])
const responsiblesList = ref<Responsible[]>([])
const deadlinesList = ref<DropdownMenuItem[]>([])
const paymentMethodsList = ref<DropdownMenuItem[]>([])
const pricesList = ref<ProductPrice[]>([])
const branchesList = ref<DropdownMenuItem[]>([])
const usersKeyword = ref('')
const selectedProduct = ref(null)
const selectedResponsible = ref<null | Responsible>(null)
const selectedPrice = ref<null | ProductPrice>(null)
const selectedBranch = ref<null | DropdownMenuItem>(null)
const pricingType = ref<ProductPricingType>(null)
const isLoading = reactive({
  data: false,
  submit: false,
  countries: false,
  areas: false,
  categories: false,
  units: false,
  responsibles: false,
  deadlines: false,
  paymentMethods: false,
  prices: false,
  branches: false,
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
  preferences: {
    payment_method_id: null,
    deadline_id: null,
    responsibles: [],
    preferences: {
      show_available_quantity: false,
      create_instant_invoice: false,
      show_product_quantity: false,
      hide_contact_data: false,
      api_connection: false,
      print_invoice: false,
      qr: false,
    },
    request_acceptance_method: {
      manually: false,
      automatically: false,
      min_manually: null,
      max_manually: null,
      min_automatically: null,
      max_automatically: null,
    },
  },
  pricing: {
    fixed: {
      main_price: null,
      discount_price: null,
      minimum_quantity: null,
      maximum_quantity: null,
    },
    prices: [],
  },
  shipping_range: {
    countries: [],
    areas: [],
    branches: [],
    has_delivery: false,
    has_branches: false,
  },
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

const arePriceRangesOverlapping = computed(() => {
  if (!formData.pricing.prices) return false
  for (let i = 0; i < formData.pricing.prices.length; i++) {
    for (let j = i + 1; j < formData.pricing.prices.length; j++) {
      const min1 = formData.pricing.prices[i].minimum_quantity
      const max1 = formData.pricing.prices[i].maximum_quantity
      const min2 = formData.pricing.prices[j].minimum_quantity
      const max2 = formData.pricing.prices[j].maximum_quantity
      if (!min1 || !max1 || !min2 || !max2) continue

      if ((min1 >= min2 && min1 <= max2) || (max1 >= min2 && max1 <= max2)) {
        return true
      }
    }
  }
  return false // No overlap found
})

const minimumExpirationDate = computed(() => {
  const productionDate = formData.product_data.warranty_and_expiration.production_date
  if (!productionDate) return null

  const date = new Date(productionDate)
  return date.setDate(date.getDate() + 1)
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
  if (selectedProduct.value) getItemDetails(selectedProduct.value)
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
  if (!formData.shipping_range.countries.length) {
    formData.shipping_range.areas = []
    return
  }
  getAreas(true)
}

function checkExistingAreas() {
  formData.shipping_range.areas = formData.shipping_range.areas.filter((id: number) =>
    areasList.value.some((area: DropdownMenuItem) => area.id === id),
  )
}

function getAreas(checkAreas?: boolean) {
  isLoading.areas = true
  listService
    .getCountriesAreas({ countries: formData.shipping_range.countries })
    .then((res: any) => {
      areasList.value = res.data.data
      if (checkAreas) checkExistingAreas()
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

function getResponsibles() {
  if (!formData.user_id) return
  isLoading.responsibles = true
  listService
    .getResponsibles({
      user_id: formData.user_id,
    })
    .then((res: any) => {
      responsiblesList.value = res.data.data
    })
    .finally(() => {
      isLoading.responsibles = false
    })
}

function getDeadlines() {
  isLoading.deadlines = true
  listService
    .getOfferDeadlines()
    .then((res: any) => {
      deadlinesList.value = res.data.data.map((item: OfferDeadline) => ({
        id: item.id,
        label: `${item.hours} (ساعة) من وقت ${
          OFFER_DEADLINES_TIMES[item.from_time as keyof typeof OFFER_DEADLINES_TIMES]
        }`,
      }))
    })
    .finally(() => {
      isLoading.deadlines = false
    })
}

function getPaymentMethods() {
  isLoading.deadlines = true
  listService
    .getOfferPaymentMethods()
    .then((res: any) => {
      paymentMethodsList.value = res.data.data.map((item: OfferPaymentMethod) => {
        const { down_payment_percentage, down_payment_delivering, remaining_payment_delivering } =
          item
        const remainingPaymentText =
          OFFER_PAYMENT_METHODS[remaining_payment_delivering as keyof typeof OFFER_PAYMENT_METHODS]
        const downPaymentText =
          OFFER_PAYMENT_METHODS[down_payment_delivering as keyof typeof OFFER_PAYMENT_METHODS]

        let label = `${down_payment_percentage}% `

        if (down_payment_percentage == 0) {
          label += `و الباقي ${remainingPaymentText}`
        } else if (down_payment_percentage == 100) {
          label += `و تسليم المقدم ${downPaymentText}`
        } else {
          label += `وتسليم المقدم ${downPaymentText} و الباقي ${remainingPaymentText}`
        }
        return {
          id: item.id,
          label,
        }
      })
    })
    .finally(() => {
      isLoading.deadlines = false
    })
}

function getPrices() {
  if (!formData.user_id) return
  isLoading.prices = true
  listService
    .getProductPrices({
      user_id: formData.user_id,
    })
    .then((res: any) => {
      pricesList.value = res.data.data.map((item: ProductPrice) => ({
        ...item,
        label: `من ${item.minimum_quantity} الي ${item.maximum_quantity} بقيمة ${item.price}`,
      }))
    })
    .finally(() => {
      isLoading.prices = false
    })
}

function getBranches() {
  if (!formData.user_id) return
  isLoading.branches = true
  listService
    .getProductBranches({
      user_id: formData.user_id,
    })
    .then((res: any) => {
      branchesList.value = res.data.data
    })
    .finally(() => {
      isLoading.branches = false
    })
}

async function validateLastPrice() {
  if (formData.pricing.prices.length) {
    const lastIndex = formData.pricing.prices.length - 1
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
  formData.pricing.prices?.push({
    minimum_quantity: null,
    maximum_quantity: null,
    price: null,
  })
}

function onSelectedPrice() {
  if (!selectedPrice.value) return
  formData.pricing.prices.push(selectedPrice.value)
  selectedPrice.value = null
}

function onProductStatusChange() {
  formData.product_data.warranty_and_expiration.expire_date = ''
}

function prepareFormData(data: any) {
  data.shipping_range.countries = data.shipping_range.countries.map(
    (country: DropdownMenuItem) => country.id,
  )
  data.shipping_range.areas = data.shipping_range.areas.map(
    (country: DropdownMenuItem) => country.id,
  )
  data.shipping_range.branches =
    data.shipping_range.branches?.map((branch: DropdownMenuItem) => branch.id) || []
  data.product_data.unit_details.main_unit_id = data.product_data.unit_details.main_unit.id
  data.product_data.unit_details.sub_unit_id = data.product_data.unit_details.sub_unit.id
  data.preferences.payment_method_id = data.preferences.payment_method.id
  data.preferences.deadline_id = data.preferences.deadline.id
  data.category_id = data.category.id
  data.attachmentsFiles = data.attachments.map((attachment: File) => attachment)
  if (data.pricing.fixed) pricingType.value = 'fixed'
  else {
    pricingType.value = 'range'
    data.pricing.fixed = {}
  }
  // data.user_id = data.user.id
  // usersKeyword.value = data.user.username

  Object.assign(formData, data)
  if (data.shipping_range.countries.length) getAreas()
}

function getItemDetails(id: any) {
  isLoading.data = true
  productsService
    .getSingleItem(id)
    .then((res) => {
      prepareFormData(res.data.data)
    })
    .finally(() => {
      isLoading.data = false
    })
}

function initData() {
  getCountries()
  getCategories()
  getUnits()
  getResponsibles()
  getDeadlines()
  getPaymentMethods()
  getPrices()
  getBranches()
  if (props.formAction !== 'create') getItemDetails(props.activeItem.id)
}

function onUserChange() {
  console.log('onUserChange', formData.user_id)
  getResponsibles()
}

function onSelectResponsible() {
  if (!selectedResponsible.value) return
  formData.preferences.responsibles[0] = {
    ...selectedResponsible.value,
    hide_email: false,
    hide_phone: false,
    hide_name: false,
  }
  selectedResponsible.value = null
}

function addNewResponsible() {
  showResponsibleFormModal.value = true
}

function onCreateResponsible(responsible: Responsible) {
  formData.preferences.responsibles[0] = responsible
  responsiblesList.value.push(responsible)
}

function updateResponsibleVisibility(visibility: boolean, responsible: any) {
  responsible.hide_name = responsible.hide_phone = responsible.hide_email = !visibility
}

function addNewBranch() {
  showBranchesFormModal.value = true
}

function edit(payload: ProductFormData) {
  productsService
    .editItem(payload)
    .then((res) => {
      toast.success(res.data.message)
      emit('editItem', res.data.data)
      showModal.value = false
    })
    .finally(() => {
      isLoading.submit = false
    })
}

function create(payload: ProductFormData) {
  productsService
    .createItem(payload)
    .then((res) => {
      toast.success(res.data.message)
      emit('createItem', res.data.data)
      showModal.value = false
    })
    .finally(() => {
      isLoading.submit = false
    })
}

function dragStart(event: DragEvent, index: number) {
  // Set the data being dragged
  event!.dataTransfer!.setData('text/plain', `${index}`)
}
function dragOver(event: DragEvent) {
  // Prevent the default behavior to allow dropping
  event.preventDefault()
}
function drop(event: DragEvent, newIndex: number) {
  // Get the index of the item being dragged
  const oldIndex = event!.dataTransfer!.getData('text/plain')

  // Reorder the items array
  formData.attachmentsFiles.splice(newIndex, 0, formData.attachmentsFiles.splice(+oldIndex, 1)[0])
}

function getFormData() {
  const payload = cloneItem(formData)
  payload.attachments = payload.attachmentsFiles.map((attachment: File) => attachment.id)
  delete payload.attachmentsFiles
  if (pricingType.value === 'fixed') delete payload.pricing.prices
  else delete payload.pricing.fixed
  if (!payload.product_data.warranty_and_expiration.expire_date)
    delete payload.product_data.warranty_and_expiration.expire_date
  delete payload.shipping_segments

  return payload
}

function submit() {
  formRef.value.validate().then(({ errors }: any) => {
    const errorsArr = Object.values(errors)
    if (errorsArr.length) {
      toast.error(errorsArr.slice(0, 2).join('\n'))
    }
    if (errorsArr.length || arePriceRangesOverlapping.value) return

    isLoading.submit = true
    const payload = getFormData()
    props.formAction === 'create' ? create(payload) : edit(payload)
  })
}
// #endregion
</script>

<template>
  <div>
    <ResponsibleFormModal
      v-if="showResponsibleFormModal && formData?.user_id"
      :user-id="formData.user_id"
      :active-item="null"
      v-model:showModal="showResponsibleFormModal"
      form-action="create"
      @create-item="onCreateResponsible"
    />
    <VDialog v-model="showModal" max-width="1000" persistent scrollable class="form-modal">
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="showModal = !showModal" />

      <!-- Dialog Content -->
      <VCard v-loading="isLoading.data" :disabled="isLoading.data">
        <VeeForm ref="formRef" v-slot="{ meta }" @submit="submit">
          <VCard :title="formTitle" :disabled="formAction === 'view'">
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
                    @update:model-value="onUserChange"
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
                <VCol
                  cols="12"
                  v-if="formData.user_id && formAction === 'create'"
                  :key="formData.user_id"
                >
                  <VLabel class="text-body-2 text-high-emphasis mb-1" text="المنتج" />
                  <ProductsSelectFilter
                    label=""
                    :user-id="formData.user_id"
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
                    <div
                      v-for="(attachment, index) in formData.attachmentsFiles"
                      :key="index"
                      draggable="true"
                      @dragstart="dragStart($event, index)"
                      @dragover="dragOver"
                      @drop="drop($event, index)"
                    >
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
                      :key="formData.product_data.warranty_and_expiration.production_date"
                      prepend-inner-icon="tabler-calendar"
                      :config="{
                        disableMobile: true,
                        minDate: minimumExpirationDate,
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
                  <ModalAlert text="الإختيارات والتفضيلات" />
                </VCol>
                <VCol cols="12">
                  <VLabel
                    class="text-body-2 text-high-emphasis mb-3"
                    text="بيانات المسؤول (اختياري)"
                  />
                  <AppAutocomplete
                    v-model="selectedResponsible"
                    name="selectedResponsible"
                    :items="responsiblesList"
                    item-title="name"
                    label="اختر مسؤول"
                    return-object
                    hide-default-label
                    :loading="isLoading.responsibles"
                    :disabled="
                      isLoading.responsibles ||
                      !formData.user_id ||
                      formData.preferences.responsibles.length > 0
                    "
                    clearable
                    @update:model-value="onSelectResponsible"
                  >
                    <template #append v-if="formData.user_id">
                      <VBtn
                        variant="outlined"
                        @click="addNewResponsible"
                        height="40"
                        width="40"
                        size="small"
                        icon="tabler-plus"
                        rounded="sm"
                      />
                    </template>
                  </AppAutocomplete>

                  <VRow
                    class="border mx-0 mt-5 list-card py-1 px-2"
                    v-for="(responsible, index) in formData.preferences.responsibles"
                    :key="index"
                  >
                    <VCol cols="12" class="d-flex justify-space-between align-center">
                      <VCheckbox
                        density="compact"
                        label="اظهار بيانات المسؤول"
                        :model-value="
                          !responsible.hide_name &&
                          !responsible.hide_phone &&
                          !responsible.hide_email
                        "
                        @update:model-value="
                          updateResponsibleVisibility($event as boolean, responsible)
                        "
                      />
                      <VBtn
                        variant="outlined"
                        color="error"
                        @click="formData.preferences.responsibles?.splice(index, 1)"
                        class="py-2 d-block"
                        height="auto"
                        size="small"
                      >
                        حذف
                        <VIcon end icon="tabler-trash" />
                      </VBtn>
                    </VCol>
                    <VCol cols="12" md="4" class="d-flex gap-3">
                      <VTextField :model-value="responsible.name" label="الاسم" readonly disabled>
                      </VTextField>
                      <VBtn
                        size="38"
                        variant="outlined"
                        @click="responsible.hide_name = !responsible.hide_name"
                      >
                        <VIcon
                          :icon="responsible.hide_name ? 'tabler-eye-off' : 'tabler-eye'"
                          size="22"
                        />
                      </VBtn>
                    </VCol>
                    <VCol cols="12" md="4" class="d-flex gap-3">
                      <VTextField
                        :model-value="responsible.email"
                        label="البريد الالكتروني"
                        readonly
                        disabled
                      />
                      <VBtn
                        size="38"
                        variant="outlined"
                        @click="responsible.hide_email = !responsible.hide_email"
                      >
                        <VIcon
                          :icon="responsible.hide_email ? 'tabler-eye-off' : 'tabler-eye'"
                          size="22"
                        />
                      </VBtn>
                    </VCol>
                    <VCol cols="12" md="4" class="d-flex gap-3">
                      <VTextField
                        :model-value="responsible.phone"
                        label="الهاتف"
                        readonly
                        disabled
                      />

                      <VBtn
                        size="38"
                        variant="outlined"
                        @click="responsible.hide_phone = !responsible.hide_phone"
                      >
                        <VIcon
                          :icon="responsible.hide_phone ? 'tabler-eye-off' : 'tabler-eye'"
                          size="22"
                        />
                      </VBtn>
                    </VCol>
                  </VRow>
                </VCol>
                <VCol cols="12" md="6">
                  <AppAutocomplete
                    v-model="formData.preferences.deadline_id"
                    name="deadline_id"
                    :items="deadlinesList"
                    item-title="label"
                    item-value="id"
                    label="مهلة الدفع"
                    rules="required"
                    :loading="isLoading.deadlines"
                    :disabled="isLoading.deadlines"
                    clearable
                  />
                </VCol>

                <VCol cols="12" md="6">
                  <AppAutocomplete
                    v-model="formData.preferences.payment_method_id"
                    name="payment_method_id"
                    :items="paymentMethodsList"
                    item-title="label"
                    item-value="id"
                    label="طريقة الدفع"
                    rules="required"
                    :loading="isLoading.paymentMethods"
                    :disabled="isLoading.paymentMethods"
                    clearable
                    :menu-props="{ contentClass: 'payment-method-select' }"
                  />
                </VCol>
                <VCol cols="12" sm="6" md="3" class="pt-0">
                  <VCheckbox
                    v-model="formData.preferences.preferences.show_available_quantity"
                    label="إظهار الكيمة المتبقية"
                  />
                </VCol>
                <VCol cols="12" sm="6" md="3" class="pt-0">
                  <VCheckbox
                    v-model="formData.preferences.preferences.show_product_quantity"
                    label="إظهار كمية المنتج"
                    name="show_product_quantity"
                  />
                </VCol>
                <VCol cols="12" sm="6" md="3" class="pt-0">
                  <VCheckbox
                    v-model="formData.preferences.preferences.hide_contact_data"
                    label="اخفاء بيانات التواصل"
                  />
                </VCol>
                <VCol cols="12" sm="6" md="3" class="pt-0">
                  <VCheckbox
                    v-model="formData.preferences.preferences.qr"
                    label="قراءة الباركود للعميل"
                  />
                </VCol>
                <VCol cols="12" sm="6" md="3" class="pt-0">
                  <VCheckbox
                    v-model="formData.preferences.preferences.print_invoice"
                    label="طباعة فواتير الطلبات"
                  />
                </VCol>
                <VCol cols="12" sm="6" md="3" class="pt-0">
                  <VCheckbox
                    v-model="formData.preferences.preferences.create_instant_invoice"
                    label="إنشاء فواتير فورية"
                  />
                </VCol>
                <VCol cols="12" sm="6" md="3" class="pt-0">
                  <VCheckbox
                    v-model="formData.preferences.preferences.api_connection"
                    label="ربط ببرنامج محاسبي API"
                  />
                </VCol>

                <VCol cols="12" class="py-0">
                  <ModalAlert text="أليه الموافقة على الطلب" />
                </VCol>

                <VCol cols="12" md="4" class="pb-0">
                  <VCheckbox
                    v-model="formData.preferences.request_acceptance_method.automatically"
                    label="الموافقة الالية علي التحويل والدفع"
                  />
                </VCol>
                <VCol cols="12" md="4">
                  <AppTextField
                    v-model="formData.preferences.request_acceptance_method.min_automatically"
                    label="الحد الادنى"
                    hide-default-label
                    name="min_automatically"
                    :rules="{
                      required: formData.preferences.request_acceptance_method.automatically,
                      numeric: true,
                    }"
                    type="number"
                  />
                </VCol>
                <VCol cols="12" md="4">
                  <AppTextField
                    v-model="formData.preferences.request_acceptance_method.max_automatically"
                    label="الحد الاعلي"
                    hide-default-label
                    name="max_automatically"
                    :rules="{
                      required: formData.preferences.request_acceptance_method.automatically,
                      numeric: true,
                      min_value: formData.preferences.request_acceptance_method.min_automatically,
                    }"
                    type="number"
                  />
                </VCol>

                <VCol cols="12" md="4" class="pb-0">
                  <VCheckbox
                    v-model="formData.preferences.request_acceptance_method.manually"
                    label="الموافقة اليدوية علي الطلب قبل الدفع"
                  />
                </VCol>

                <VCol cols="12" md="4">
                  <AppTextField
                    v-model="formData.preferences.request_acceptance_method.min_manually"
                    label="الحد الادنى"
                    hide-default-label
                    name="min_manually"
                    :rules="{
                      required: formData.preferences.request_acceptance_method.manually,
                      numeric: true,
                    }"
                    type="number"
                  />
                </VCol>
                <VCol cols="12" md="4">
                  <AppTextField
                    v-model="formData.preferences.request_acceptance_method.max_manually"
                    label="الحد الاعلي"
                    hide-default-label
                    name="max_manually"
                    :rules="{
                      required: formData.preferences.request_acceptance_method.manually,
                      numeric: true,
                      min_value: formData.preferences.request_acceptance_method.min_manually,
                    }"
                    type="number"
                  />
                </VCol>

                <VCol cols="12" class="py-0">
                  <ModalAlert text="التسعيير" />
                </VCol>

                <VCol cols="12" class="pb-0">
                  <AppRadio
                    v-model="pricingType"
                    :options="
                      Array.from(PRODUCT_PRICING_TYPES, ([key, value]) => ({
                        id: key,
                        label: value.label,
                      }))
                    "
                    name="pricingType"
                    label="نوع التسعيير"
                    rules="required"
                    option-label="label"
                    option-value="id"
                    inline
                  />
                </VCol>
                <template v-if="pricingType === 'fixed'">
                  <VCol cols="12" md="6">
                    <AppTextField
                      v-model="formData.pricing.fixed.main_price"
                      label="السعر الأساسي"
                      name="main_price"
                      rules="required|numeric"
                      type="number"
                    />
                  </VCol>
                  <VCol cols="12" md="6">
                    <AppTextField
                      v-model="formData.pricing.fixed.discount_price"
                      label="السعر بعد الخصم"
                      name="discount_price"
                      type="number"
                      :rules="{
                        required: true,
                        numeric: true,
                        lessThanValue: formData.pricing.fixed.main_price,
                      }"
                    />
                  </VCol>
                  <VCol cols="12" md="6">
                    <AppTextField
                      v-model="formData.pricing.fixed.minimum_quantity"
                      label="أقل كمية مسموحة للعميل"
                      name="minimum_quantity"
                      rules="required|numeric"
                      type="number"
                    />
                  </VCol>
                  <VCol cols="12" md="6">
                    <AppTextField
                      v-model="formData.pricing.fixed.maximum_quantity"
                      label="أعلى كمية مسموحة للعميل"
                      name="maximum_quantity"
                      :rules="{
                        required: true,
                        numeric: true,
                        greaterThanValue: formData.pricing.fixed.minimum_quantity,
                      }"
                      type="number"
                    />
                  </VCol>
                </template>
                <VCol cols="12" v-else-if="pricingType === 'range'">
                  <VLabel class="text-body-2 text-high-emphasis mb-1" text="تسعير شرائح البيع" />
                  <VRow
                    v-for="(price, index) in formData.pricing.prices"
                    :key="index"
                    class="border ma-0 list-card py-1 px-2"
                  >
                    <VCol cols="12" md="4" class="px-1">
                      <AppTextField
                        v-model="price.minimum_quantity"
                        label="من"
                        hide-default-label
                        :name="`prices-from-${index}`"
                        rules="required|numeric"
                        type="number"
                      >
                        <template #append-inner v-if="mainUnitName"> {{ mainUnitName }} </template>
                      </AppTextField>
                    </VCol>
                    <VCol cols="12" md="4" class="px-1">
                      <AppTextField
                        v-model="price.maximum_quantity"
                        label="إلي"
                        hide-default-label
                        :name="`prices-to-${index}`"
                        :rules="{
                          required: true,
                          numeric: true,
                          greaterThanValue: price.minimum_quantity,
                        }"
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
                    <div class="list-card__actions d-flex gap-2">
                      <VBtn
                        icon
                        color="error"
                        size="30"
                        @click="formData.pricing.prices?.splice(index, 1)"
                      >
                        <VIcon icon="tabler-trash" />
                      </VBtn>
                    </div>
                  </VRow>
                  <div v-if="arePriceRangesOverlapping" class="text-error my-2">
                    يجب ان لا يكون هناك تداخل في الشرائح
                  </div>
                  <AppTextField
                    :model-value="formData.pricing.prices.length ? formData.pricing.prices : ''"
                    hide-label
                    name="prices"
                    label="شرائح البيع"
                    rules="required"
                    type="hidden"
                  />

                  <div class="mt-3">
                    <AppAutocomplete
                      v-model="selectedPrice"
                      name="selectedPrice"
                      :items="pricesList"
                      item-title="label"
                      label="اختر شريحة"
                      return-object
                      hide-default-label
                      :loading="isLoading.prices"
                      :disabled="isLoading.prices || !formData.user_id"
                      clearable
                      @update:model-value="onSelectedPrice"
                    >
                      <template #append v-if="formData.user_id">
                        <VBtn
                          variant="outlined"
                          @click="addNewPrice"
                          height="40"
                          width="40"
                          size="small"
                          icon="tabler-plus"
                          rounded="sm"
                        />
                      </template>
                    </AppAutocomplete>
                  </div>
                </VCol>

                <VCol cols="12" class="py-0">
                  <ModalAlert text="بيانات الأستلام والتسلم" />
                </VCol>

                <VCol cols="12" md="4" class="pb-0">
                  <VCheckbox
                    v-model="formData.shipping_range.has_delivery"
                    label="التسليم لعنوان العميل"
                  />
                </VCol>

                <VCol cols="12" md="4">
                  <AppAutocomplete
                    v-model="formData.shipping_range.countries"
                    name="countries"
                    :items="countriesList"
                    item-title="label"
                    item-value="id"
                    label="الدول"
                    hide-default-label
                    :rules="{ required: formData.shipping_range.has_delivery }"
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
                        (+{{ formData.shipping_range.countries.length - 1 }} اخري)
                      </span>
                    </template>
                  </AppAutocomplete>
                </VCol>
                <VCol cols="12" md="4">
                  <AppAutocomplete
                    v-model="formData.shipping_range.areas"
                    name="areas"
                    :items="areasList"
                    item-title="label"
                    item-value="id"
                    label="المدن"
                    hide-default-label
                    :rules="{
                      required:
                        formData.shipping_range.has_delivery &&
                        formData.shipping_range.countries.length,
                    }"
                    :loading="isLoading.areas"
                    :disabled="isLoading.areas || !formData.shipping_range.countries.length"
                    clearable
                    multiple
                  >
                    <template #selection="{ item, index }">
                      <VChip v-if="index < 1">
                        <span>{{ item.title }}</span>
                      </VChip>
                      <span v-if="index === 1" class="text-grey text-caption align-self-center">
                        (+{{ formData.shipping_range.areas.length - 1 }} اخري)
                      </span>
                    </template>
                  </AppAutocomplete>
                </VCol>
                <VCol cols="12" md="4" class="pb-0">
                  <VCheckbox
                    v-model="formData.shipping_range.has_branches"
                    label="الاستلام من منفذ بيع"
                  />
                </VCol>
                <VCol cols="12" md="8">
                  <AppAutocomplete
                    v-model="formData.shipping_range.branches"
                    name="branches"
                    :items="branchesList"
                    item-title="label"
                    item-value="id"
                    label="اختر الفروع"
                    multiple
                    hide-default-label
                    :loading="isLoading.branches"
                    :disabled="isLoading.branches || !formData.user_id"
                    clearable
                    :rules="{ required: formData.shipping_range.has_branches }"
                  >
                    <template #selection="{ item, index }">
                      <VChip v-if="index < 1">
                        <span>{{ item.title }}</span>
                      </VChip>
                      <span v-if="index === 1" class="text-grey text-caption align-self-center">
                        (+{{ formData.shipping_range.branches.length - 1 }} اخري)
                      </span>
                    </template>
                    <template #append v-if="formData.user_id">
                      <VBtn
                        variant="outlined"
                        @click="addNewBranch"
                        height="40"
                        width="40"
                        size="small"
                        icon="tabler-plus"
                        rounded="sm"
                      />
                    </template>
                  </AppAutocomplete>
                </VCol>
                <VCol cols="12" class="py-0">
                  <ModalAlert text="TODO: Add shippig data" />
                </VCol>
              </VRow>
            </VCardText>

            <VCardText v-if="formAction !== 'view'" class="d-flex justify-end flex-wrap gap-3">
              <VBtn variant="outlined" color="error" @click="showModal = false">
                {{ t('actions.cancel') }}
              </VBtn>
              <VBtn
                :loading="isLoading.submit"
                :disabled="isLoading.submit || isLoading.data"
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
:deep(.v-text-field.v-input--disabled .v-field) {
  background: rgb(var(--v-theme-grey-200), 0.5);
  opacity: 1;
}

:deep(.v-autocomplete__selection) {
  max-inline-size: calc(100% - 4px);
}

.categories-select {
  position: relative;
  z-index: 1;
}

.list-card {
  position: relative;

  &:not(:last-of-type) {
    margin-block-end: 20px;
  }

  &:last-of-type {
    margin-block-end: 10px;
  }

  &__actions {
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

<style lang="scss">
.payment-method-select .v-list-item-title {
  white-space: normal;
}
</style>
