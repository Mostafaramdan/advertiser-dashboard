<script setup lang="ts">
import { OFFER_DATE_TYPES, OFFER_TYPES, STORES_TYPES } from '@/constants/offers'
import { cloneItem, getOptionsArrayFromObject } from '@/helpers/index'
import type { FormActionType } from '@/interfaces/Forms'
import type { File } from '@/interfaces/Shared'
import { useToast } from 'vue-toastification'
import type { OfferFormData } from '../interfaces/Offer'
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
  user_id: 94, // TODO: Reset to null
  is_active: true,
  products: [
    {
      id: 1,
      image:
        'https://images.unsplash.com/photo-1682686581413-0a0ec9bb35bb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      name: 'Product 1',
      main_price: 500,
      discount_price: 200,
    },
  ],
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
function openProductFormModal(): void {
  activeProduct.value = null
  productFormAction.value = 'create'
  showProductFormModal.value = true
}

function onCreateProduct(product: any) {
  console.log('onCreateProduct', product)
}
function onEditProduct(product: any) {
  console.log('onCreateProduct', product)
}

function prepareFormData(data: any) {
  data.user_id = data.user.id
  usersKeyword.value = data.user.username

  if (data.from_date && data.to_date) {
    dateType.value = 'dynamic'
  } else dateType.value = 'fixed'
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
  formData.to_date = ''
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
  payload.attachments = payload.attachmentsFiles.map((attachment: File) => attachment.id)
  delete payload.attachmentsFiles
  if (!payload.expire_date) delete payload.expire_date

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
                  @click="openProductFormModal"
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
                            <VImg v-if="product.image" :src="product.image" cover />
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
                        <IconBtn>
                          <VIcon icon="tabler-eye" />
                        </IconBtn>
                        <IconBtn>
                          <VIcon icon="tabler-trash" />
                        </IconBtn>

                        <IconBtn>
                          <VIcon icon="tabler-edit" />
                        </IconBtn>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </VTable>
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
</style>
