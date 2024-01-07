<script setup lang="ts">
import { OFFER_DATE_TYPES, OFFER_TYPES, STORES_TYPES } from '@/constants/offers'
import { cloneItem, getOptionsArrayFromObject } from '@/helpers/index'
import type { FormActionType } from '@/interfaces/Forms'
import { productsService } from '@/services/ProductsService'
import { useToast } from 'vue-toastification'
import type { OfferFormData, OfferProduct } from '../interfaces/Offer'
import ProductFormModal from '../modals/ProductFormModal.vue'
import { offersService } from '../services/OffersService'

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
const showProductFormModal = ref<boolean>(false)
const productFormAction = ref<FormActionType>('create')
const activeProduct = ref<any>(null)
const offerId: number = +route.params.id
const usersKeyword = ref('')
const dateType = ref<any>(null)
const confirmModal = ref<any>()
const afterTomorrowDate: Date = new Date(new Date().setDate(new Date().getDate() + 2))

const isLoading = reactive({
  data: false,
  submit: false,
})

const formData = reactive<OfferFormData>({
  offer_type: null,
  from_date: '',
  to_date: '',
  store: {
    name: '',
    type: null,
  },
  user_id: null,
  is_active: true,
  products: [],
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const formTitle = computed(() => {
  return props.formAction === 'create' ? 'اضافة عرض' : 'تعديل عرض'
})

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
if (props.formAction === 'edit') getOfferData()
// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function openProductFormModal(
  product: OfferProduct | null = null,
  action: FormActionType = 'create',
): void {
  activeProduct.value = product
  productFormAction.value = action
  showProductFormModal.value = true
}

function onCreateProduct(product: any) {
  console.log('onCreateProduct', product)
  formData.products.push(product)
}
function onEditProduct(product: any) {
  console.log('onEditProduct', product)
  const targetIndex = formData.products.findIndex((p: any) => p.id === product.id)
  formData.products.splice(targetIndex, 1, product)
}

function deleteProduct(product: OfferProduct) {
  isLoading.data = true
  productsService
    .deleteItem(product.id)
    .then((res) => {
      const targetIndex = formData.products.findIndex((p: any) => p.id === product.id)
      formData.products.splice(targetIndex, 1)
      toast.success(res.data.message)
    })
    .finally(() => {
      isLoading.data = false
    })
}

async function showConfirmDeleteItem(product: OfferProduct): Promise<void> {
  const confirm = await confirmModal.value.open('يرجي التاكيد', 'هل انت متاكد من الحذف')

  if (confirm) deleteProduct(product)
}

function prepareFormData(data: any) {
  data.user_id = data.user.id
  usersKeyword.value = data.user.username

  if (data.from_date && data.to_date) {
    dateType.value = 'dynamic'
  } else dateType.value = 'fixed'

  Object.assign(formData, data)
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

function onDateTypeChange() {
  if (props.formAction === 'create') {
    formData.to_date = ''
  }
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
  payload.products = payload.products.map((product: any) => product.id)
  if (formData.store.type === 'marketplace') delete payload.store.name
  if (!payload.to_date) delete payload.to_date
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
    <ConfirmModal ref="confirmModal" />
    <ProductFormModal
      v-if="showProductFormModal"
      v-model:showModal="showProductFormModal"
      :form-action="productFormAction"
      :active-item="activeProduct"
      @create-item="onCreateProduct"
      @edit-item="onEditProduct"
      :storeType="formData.store.type"
      :user-id="formData.user_id"
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
                label="نوع العرض"
                rules="required"
                clearable
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
                label="نوع المنفذ"
                rules="required"
                clearable
              />
            </VCol>
            <VCol cols="12" v-if="formData.store.type === 'website'">
              <AppTextField
                v-model="formData.store.name"
                label="اسم المتجر"
                type="text"
                name="store.name"
                rules="required|min:2|max:255"
              />
            </VCol>
            <VCol cols="12" md="6">
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
              <AppAutocomplete
                v-model="dateType"
                name="dateType"
                :items="getOptionsArrayFromObject(OFFER_DATE_TYPES)"
                item-title="label"
                item-value="value"
                label="نوع التاريخ"
                rules="required"
                clearable
                @update:model-value="onDateTypeChange"
              />
            </VCol>

            <template v-if="dateType">
              <VCol cols="12" :md="dateType === 'fixed' ? 12 : 6">
                <VeeField
                  v-slot="{ errorMessage, value, handleChange }"
                  v-model="formData.from_date"
                  name="from_date"
                  :label="dateType === 'fixed' ? 'التاريخ' : 'تاريخ البداية'"
                  rules="required"
                >
                  <AppDateTimePicker
                    :key="dateType"
                    :label="dateType === 'fixed' ? 'التاريخ' : 'تاريخ البداية'"
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
              <VCol cols="12" md="6" v-if="dateType === 'dynamic'">
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
            </template>

            <VCol cols="12" md="6" class="pb-0">
              <AppSwitch v-model="formData.is_active" label="الحالة" name="is_active" />
            </VCol>

            <VCol cols="12">
              <div class="d-flex gap-3 flex-wrap align-center justify-space-between">
                <h3 class="text-h5">المنتجات</h3>
                <VBtn
                  variant="outlined"
                  @click="openProductFormModal(null, 'create')"
                  class="py-2 d-block"
                  height="auto"
                  size="small"
                  :disabled="!formData.user_id"
                >
                  اضافة منتج
                  <VIcon end icon="tabler-plus" />
                </VBtn>
              </div>
              <VTable density="compact" class="mt-3" v-if="formData.products.length">
                <thead>
                  <tr class="bg-background">
                    <th class="text-uppercase">الاسم</th>
                    <th class="text-uppercase">السعر بعد</th>
                    <th class="text-uppercase">السعر قبل</th>
                    <th class="text-uppercase">العمليات</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="product in formData.products" :key="product.id">
                    <td>
                      <div class="d-flex align-center gap-3">
                        <div class="d-flex flex-column align-center py-1">
                          <VAvatar size="38" variant="tonal" cover>
                            <VImg v-if="product.image_path" :src="product.image_path" cover />
                            <span v-else>!</span>
                          </VAvatar>
                        </div>
                        <div style="word-wrap: break-word">
                          {{ product.name }}
                        </div>
                      </div>
                    </td>
                    <td>
                      {{ product.discount_price }}
                    </td>
                    <td>
                      {{ product.main_price }}
                    </td>
                    <td>
                      <div class="d-flex">
                        <IconBtn @click="openProductFormModal(product, 'view')">
                          <VIcon icon="tabler-eye" />
                        </IconBtn>
                        <IconBtn @click="showConfirmDeleteItem(product)">
                          <VIcon icon="tabler-trash" />
                        </IconBtn>

                        <IconBtn @click="openProductFormModal(product, 'edit')">
                          <VIcon icon="tabler-edit" />
                        </IconBtn>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </VTable>
              <div v-else class="text-disabled">لا يوجد منتجات</div>
              <AppTextField
                :model-value="formData.products.length ? formData.products : ''"
                hide-label
                name="products"
                label="المنتجات"
                rules="required"
                type="hidden"
              />
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
</style>
