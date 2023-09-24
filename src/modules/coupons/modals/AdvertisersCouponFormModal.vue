<script setup lang="ts">
import { COUPONS_TYPES } from '@/constants/coupons'
import type { FormModalProps } from '@/interfaces/Forms'
import { listService } from '@/services/ListService'
import { useCouponsStore } from '@/stores/CouponsStore'
import { useVModel } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import type { AdvertiserCoupon, AdvertiserCouponFormProps } from '../interfaces/AdvertiserCoupon'
import { couponsService } from '../services/CouponsService'
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
  (e: 'createItem', value: AdvertiserCoupon): void
  (e: 'editItem', value: AdvertiserCoupon): void
}>()

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const toast = useToast()
const couponsStore = useCouponsStore()
const showModal = useVModel(props, 'showModal', emit)
const formRef = ref<any>(null)
const categoriesSelectRef = ref()
const storesSelectRef = ref()
const advertiserSearchKeyword = ref('')

const isLoading = reactive({
  categories: false,
  stores: false,
  submit: false,
})

const formData = reactive<AdvertiserCouponFormProps>({
  type: COUPONS_TYPES.advertiser,
  code: '',
  is_active: true,
  discount: null,
  uses: null,
  started_at: '',
  ended_at: '',
  description: '',
  link: '',
  category_id: null,
  store_id: null,
  user_id: null,
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const formTitle = computed(() => {
  return props.formAction === 'create'
    ? 'اضافة كوبون'
    : props.formAction === 'edit'
    ? 'تعديل كوبون'
    : 'عرض كوبون'
})

const categoriesList = computed(() => couponsStore.categoriesList)
const storesList = computed(() => couponsStore.storesList)

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
getCategories()
getStores()

if (props.activeItem) {
  prepareEditData()
}
// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function getCategories() {
  if (categoriesList.value.length) return
  isLoading.categories = true
  listService
    .getCategories({ type: 'coupons' })
    .then((res: any) => {
      couponsStore.setCategoriesList(res.data.data)
    })
    .finally(() => {
      isLoading.categories = false
    })
}

function getStores() {
  if (storesList.value.length) return
  isLoading.stores = true
  listService
    .getStores()
    .then((res: any) => {
      couponsStore.setStoresList(res.data.data)
    })
    .finally(() => {
      isLoading.stores = false
    })
}

function prepareEditData() {
  const {
    id,
    code,
    discount,
    is_active,
    uses,
    started_at,
    ended_at,
    description,
    link,
    category,
    advertiser,
    store,
  } = props.activeItem
  formData.id = id
  formData.code = code
  formData.discount = discount
  formData.is_active = is_active
  formData.uses = uses
  formData.started_at = started_at
  formData.ended_at = ended_at
  formData.description = description
  formData.link = link
  formData.category_id = category.id
  formData.store_id = store.id
  formData.user_id = advertiser.id
  advertiserSearchKeyword.value = advertiser.username
}

function edit() {
  couponsService
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
  couponsService
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
  <VDialog v-model="showModal" max-width="700" persistent scrollable class="form-modal">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="showModal = !showModal" />

    <!-- Dialog Content -->
    <VCard>
      <VeeForm ref="formRef" v-slot="{ meta }" @submit="submit">
        <VCard :title="formTitle">
          <VCardText>
            <VRow>
              <VCol cols="12" md="6">
                <AppTextField
                  v-model="formData.code"
                  label="كود الكوبون"
                  name="code"
                  rules="required|min:3|max:20"
                />
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField
                  v-model="formData.discount"
                  label="نسبة الخصم"
                  name="discount"
                  rules="required|numeric|min_value:0|max_value:100"
                  type="number"
                  :max="100"
                >
                  <template #append-inner> % </template>
                </AppTextField>
              </VCol>
              <VCol cols="12">
                <VeeField
                  v-slot="{ errorMessage, value, handleChange, handleBlur }"
                  v-model="formData.user_id"
                  name="user_id"
                  label="المعلن"
                  rules="required"
                >
                  <UsersSelectFilter
                    label="المعلن"
                    userRole="advertiser"
                    :model-value="value"
                    :error-messages="errorMessage"
                    :error="!!errorMessage"
                    id="advertisers-select-filter"
                    class="mt-2"
                    :keyword="advertiserSearchKeyword"
                    @update:model-value="handleChange"
                    @blur="handleBlur"
                    clearable
                  />
                </VeeField>
              </VCol>
              <VCol cols="12" md="6">
                <div ref="categoriesSelectRef" class="select-container" style="z-index: 4">
                  <AppAutocomplete
                    v-model="formData.category_id"
                    name="category_id"
                    :items="categoriesList"
                    item-title="label"
                    item-value="id"
                    :loading="isLoading.categories"
                    :disabled="isLoading.categories"
                    label="القسم"
                    rules="required"
                    clearable
                    :menu-props="{
                      attach: categoriesSelectRef,
                      'location-strategy': 'static',
                      maxHeight: '250px',
                    }"
                  >
                    <template #selection="{ item }">
                      <span v-if="item.raw.label">{{ item.raw.label }}</span>
                    </template>
                  </AppAutocomplete>
                </div>
              </VCol>
              <VCol cols="12" md="6">
                <div ref="storesSelectRef" class="select-container">
                  <AppAutocomplete
                    v-model="formData.store_id"
                    name="store_id"
                    :items="storesList"
                    item-title="label"
                    item-value="id"
                    :loading="isLoading.stores"
                    :disabled="isLoading.stores"
                    label="المتجر"
                    rules="required"
                    clearable
                    :menu-props="{
                      attach: storesSelectRef,
                      'location-strategy': 'static',
                      maxHeight: '250px',
                    }"
                    hint="صورة الكوبون ستحدد بناء علي صورة المتجر"
                    persistent-hint
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item
                        v-bind="props"
                        :prepend-avatar="item.raw.image_path"
                        density="compact"
                      ></v-list-item>
                    </template>
                    <template #selection="{ item }">
                      <VChip size="large" label class="px-3">
                        <VAvatar
                          start
                          :image="item.raw.image_path"
                          size="30"
                          cover
                          class="ms-0 me-1"
                          variant="outlined"
                        />
                        <small>{{ item.raw.label }}</small>
                      </VChip>
                    </template>
                  </AppAutocomplete>
                </div>
              </VCol>
              <VCol cols="12" sm="6">
                <VeeField
                  v-slot="{ errorMessage, value, handleChange }"
                  v-model="formData.started_at"
                  name="started_at"
                  label="تاريخ البداية"
                  rules="required"
                >
                  <AppDateTimePicker
                    label="تاريخ البداية"
                    :model-value="value"
                    :error-msg="errorMessage"
                    clearable
                    prepend-inner-icon="tabler-calendar"
                    :config="{ minDate: formAction === 'create' ? new Date() : null }"
                    @update:model-value="handleChange"
                  />
                </VeeField>
              </VCol>
              <VCol cols="12" sm="6">
                <VeeField
                  v-slot="{ errorMessage, value, handleChange }"
                  v-model="formData.ended_at"
                  name="ended_at"
                  label="تاريخ النهاية"
                  :rules="{ required: true, minDate: formData.started_at }"
                >
                  <AppDateTimePicker
                    label="تاريخ النهاية"
                    :key="formData.started_at"
                    :model-value="value"
                    :error-msg="errorMessage"
                    clearable
                    prepend-inner-icon="tabler-calendar"
                    :config="{
                      minDate: formData.started_at
                        ? new Date(formData.started_at)
                        : formAction === 'create'
                        ? new Date()
                        : null,
                    }"
                    @update:model-value="handleChange"
                  />
                </VeeField>
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField
                  v-model="formData.uses"
                  label="مرات الاستخدام"
                  name="uses"
                  rules="required|numeric|max_value:99999"
                  type="number"
                  :max="5"
                />
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField
                  v-model="formData.link"
                  label="الرابط"
                  name="link"
                  rules="required|url"
                />
              </VCol>
              <VCol cols="12">
                <AppTextarea
                  v-model="formData.description"
                  label="الوصف"
                  name="description"
                  rules="required|min:3|max:100"
                  rows="2"
                />
              </VCol>
              <VCol cols="12" class="pt-0">
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

<style lang="scss" scoped>
.select-container {
  position: relative;
  z-index: 3;

  :deep(.v-menu > .v-overlay__content) {
    inline-size: 100%;
    inset-block-start: 70px;
    inset-inline-start: 0;
  }
}
</style>
