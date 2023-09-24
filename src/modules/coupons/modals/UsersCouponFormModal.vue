<script setup lang="ts">
import { COUPONS_TYPES } from '@/constants/coupons'
import type { FormModalProps } from '@/interfaces/Forms'
import { listService } from '@/services/ListService'
import { useCouponsStore } from '@/stores/CouponsStore'
import { useVModel } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import type { UserCouponFormProps } from '../interfaces/UsersCoupon'
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
  (e: 'createItem', value: UserCouponFormProps): void
  (e: 'editItem', value: UserCouponFormProps): void
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

const isLoading = reactive({
  categories: false,
  stores: false,
  submit: false,
})

const formData = reactive<any>({
  type: COUPONS_TYPES.ads_request,
  is_active: true,
  category_id: null,
  store_id: null,
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
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
  const { id, is_active, category, store } = props.activeItem
  formData.id = id
  formData.is_active = is_active
  formData.category_id = category.id
  formData.store_id = store.id
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

const submit = () => {
  formRef.value.validate().then(({ valid }: any) => {
    if (!valid) return

    isLoading.submit = true
    edit()
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
        <VCard title="تعديل كوبون" class="overflow-visible">
          <VCardText>
            <VRow>
              <VCol cols="12" md="6">
                <div>
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
                <div>
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
              {{ t('actions.save') }}
            </VBtn>
          </VCardText>
        </VCard>
      </VeeForm>
    </VCard>
  </VDialog>
</template>
