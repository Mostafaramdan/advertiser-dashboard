<script setup lang="ts">
import { PACKAGE_EDIT_TYPES } from '@/constants/subscriptions'
import { getOptionsArrayFromObject } from '@/helpers/index'
import type { FormActionType } from '@/interfaces/Forms'
import { File } from '@/interfaces/Shared'
import { useToast } from 'vue-toastification'
import type {
  SubscriptionPackageFeature,
  SubscriptionPackageFormProps,
} from '../interfaces/SubscriptionPackage'
import { subscriptionsPackagesService } from '../services/SubscriptionsPackagesService'

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
let packageId: number | 'create' = +route.params.id

const isLoading = reactive({
  data: false,
  submit: false,
})

const formData = reactive<SubscriptionPackageFormProps>({
  name: {
    ar: '',
    en: '',
  },
  image: null,
  image_id: null,
  periods: [],
  features: [],
  save_type: null,
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const formTitle = computed(() => {
  return props.formAction === 'create'
    ? 'اضافة باقة'
    : props.formAction === 'edit'
      ? 'تعديل باقة'
      : 'عرض باقة'
})

// at least one period must be active
const validPeriods = computed(() => {
  return formData.periods.some((item: any) => item.is_active)
})

// at least one feature must be selected
const validSubscriptionsFeatures = computed(() => {
  return formData.features
    ?.find((item: any) => item.key === 'subscription_settings')
    ?.items.some((item: any) => item.checked)
})

// at least one feature must be selected
const validAdvertiserFeatures = computed(() => {
  return formData.features
    ?.find((item: any) => item.key === 'advertiser_settings')
    ?.items.some((item: any) => item.checked)
})

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
if (props.formAction === 'create') packageId = 'create'
getFormData()
// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions

function getFormData() {
  isLoading.data = true
  subscriptionsPackagesService
    .getSingleItem(packageId)
    .then((res) => {
      if (props.formAction === 'create') Object.assign(formData, res.data)
      else Object.assign(formData, res.data.data)
    })
    .finally(() => {
      isLoading.data = false
    })
}

function goToPackagesPage() {
  router.push({ name: 'subscriptions-packages-page' })
}

function updateImageId(image: File) {
  if (image) formData.image_id = image.id
}

function edit(payload: SubscriptionPackageFormProps) {
  subscriptionsPackagesService
    .editItem(payload)
    .then((res) => {
      toast.success(res.data.message)
      goToPackagesPage()
    })
    .finally(() => {
      isLoading.submit = false
    })
}

function create(payload: SubscriptionPackageFormProps) {
  subscriptionsPackagesService
    .createItem(payload)
    .then((res) => {
      toast.success(res.data.message)
      goToPackagesPage()
    })
    .finally(() => {
      isLoading.submit = false
    })
}

function getMappedData() {
  let advertiser_settings: SubscriptionPackageFeature[] = []
  let subscription_settings: SubscriptionPackageFeature[] = []
  let extra_settings: SubscriptionPackageFeature[] = []

  formData.features?.forEach((item: any) => {
    if (item.key === 'advertiser_settings') advertiser_settings = item.items
    if (item.key === 'subscription_settings') subscription_settings = item.items
    if (item.key === 'extra_settings') extra_settings = item.items
  })

  formData.periods.forEach((item: any) => {
    if (item.free_days) item.free_days = +item.free_days
    if (item.months_count) item.months_count = +item.months_count
    if (item.price) item.price = +item.price
    if (item.price_after_discount) item.price_after_discount = +item.price_after_discount
    if (item.stop_temp_days) item.stop_temp_days = +item.stop_temp_days
  })

  const payload: SubscriptionPackageFormProps = {
    ...formData,
    advertiser_settings,
    subscription_settings,
    extra_settings,
  }
  delete payload.features

  return payload
}

function submit() {
  formRef.value.validate().then(({ errors }: any) => {
    const errorsArr = Object.values(errors)
    if (!validPeriods.value) errorsArr.push('يجب تفعيل فترة واحدة علي الاقل')
    if (!validSubscriptionsFeatures.value && !validAdvertiserFeatures.value)
      errorsArr.push(
        'يجب تفعيل ميزة واحدة علي الاقل من اعدادات حسابات باقات الاشتراكات او اعدادات تحكم المعلن',
      )
    if (errorsArr.length) {
      toast.error(errorsArr.join('\n'))
    }
    if (errorsArr.length) return

    isLoading.submit = true
    const payload = getMappedData()
    props.formAction === 'create' ? create(payload) : edit(payload)
  })
}

function toggleGroupItems($event: boolean, key: string, items: any) {
  items.forEach((item: any) => {
    item[key] = $event
  })
}

function dragStart(event: DragEvent, listIndex: string, itemIndex: number) {
  // Set the data being dragged
  event!.dataTransfer!.setData('text/plain', JSON.stringify({ listIndex, itemIndex }))
}

function dragOver(event: DragEvent) {
  // Prevent the default behavior to allow dropping
  event.preventDefault()
}

function drop(event: DragEvent, listIndex: string, itemIndex: number, items: any) {
  // Get the source list index and item index from the data being dragged
  const { listIndex: sourceListIndex, itemIndex: sourceItemIndex } = JSON.parse(
    event!.dataTransfer!.getData('text/plain'),
  )

  // Reorder the items within the same list
  if (listIndex === sourceListIndex) {
    const draggedItem = items[sourceItemIndex]
    items.splice(sourceItemIndex, 1)
    items.splice(itemIndex, 0, draggedItem)
  }
}
// #endregion
</script>

<template>
  <VCard class="page-card" v-loading="isLoading.data">
    <template #title>
      <div class="d-flex align-center">
        <PageBackBtn @click="goToPackagesPage" />
        <div>
          {{ formTitle }}
        </div>
      </div>
    </template>
    <VCardText v-if="!isLoading.data" class="form-modal">
      <VCard flat :disabled="formAction === 'view'">
        <VeeForm ref="formRef" @submit="submit">
          <VRow class="my-0">
            <VCol cols="12">
              <AppUploadFile
                v-model="formData.image"
                name="image"
                label="صورة الباقة"
                :accepted-types="['image/jpeg', 'image/png', 'image/svg+xml']"
                width="150px"
                height="150px"
                @update:model-value="updateImageId"
                rules="required"
              />
            </VCol>
            <VCol cols="12" md="6">
              <AppTextField
                v-model="formData.name.ar"
                label="اسم الباقة عربي"
                name="name.ar"
                rules="required|min:3|max:50"
              />
            </VCol>
            <VCol cols="12" md="6">
              <AppTextField
                v-model="formData.name.en"
                label="اسم الباقة انجليزي"
                name="name.en"
                rules="required|min:3|max:50"
              />
            </VCol>
            <VCol cols="12">
              <v-alert
                icon="tabler-info-circle"
                text="يجب تفعيل فترة واحدة علي الاقل"
                type="error"
                variant="tonal"
                density="compact"
                class="mb-2"
                v-if="!validPeriods && formData.periods.length"
              ></v-alert>
              <VRow
                class="border rounded pa-1 d-flex ma-0 mb-1"
                v-for="(period, index) in formData.periods"
                :key="index"
              >
                <VCol class="pa-1">
                  <span class="bg-grey-200 pa-2 text-sm rounded d-block text-center text-no-wrap"
                    >المدة {{ period.months_count }} أشهر</span
                  >
                </VCol>
                <VCol class="pa-1" cols="12" md="2">
                  <AppTextField
                    v-model="period.price"
                    label="السعر قبل"
                    :name="`price-${index}`"
                    type="number"
                    :rules="{ required: period.is_active, numeric: true }"
                    hide-default-label
                  />
                </VCol>
                <VCol class="pa-1" cols="12" md="2">
                  <AppTextField
                    v-model="period.price_after_discount"
                    label="السعر بعد"
                    :name="`price_after_discount-${index}`"
                    type="number"
                    :rules="{ max_value: period.price, numeric: true }"
                    hide-default-label
                  />
                </VCol>
                <VCol class="pa-1" cols="12" md="3">
                  <AppTextField
                    v-model="period.free_days"
                    label="مدة مجانية لكل شهر"
                    :name="`free_days-${index}`"
                    type="number"
                    rules="numeric|min_value:0|max_value:15"
                    hide-default-label
                  >
                    <template #append-inner> يوم </template>
                  </AppTextField>
                </VCol>
                <VCol class="pa-1" cols="12" md="3">
                  <AppTextField
                    v-model="period.stop_temp_days"
                    label="مدة الايقاف المؤقت"
                    :name="`stop_temp_days-${index}`"
                    type="number"
                    rules="numeric|min_value:0|max_value:88"
                    hide-default-label
                  >
                    <template #append-inner> يوم </template>
                  </AppTextField>
                </VCol>
                <VCol class="pa-1 d-flex flex-column align-center">
                  <VSwitch v-model="period.is_active" :inset="false" />
                </VCol>
              </VRow>
            </VCol>
            <v-alert
              icon="tabler-info-circle"
              text="يجب تفعيل ميزة واحدة علي الاقل من اعدادات حسابات باقات الاشتراكات او اعدادات تحكم المعلن"
              type="error"
              variant="tonal"
              density="compact"
              class="mb-0"
              v-if="
                formData.features?.length && !validSubscriptionsFeatures && !validAdvertiserFeatures
              "
            ></v-alert>
            <VCol
              cols="12"
              v-for="group in formData.features"
              :key="group.key"
              :class="`features-list-box text-${group.color}`"
            >
              <div class="features-header">
                <span class="features-header__title">{{ group.name }}</span>
                <div class="d-flex flex-wrap gap-x-5 gap-y-3">
                  <VCheckbox
                    label="تفعيل الكل"
                    :model-value="group.items.every((item: any) => item.checked)"
                    @update:model-value="
                      toggleGroupItems($event as boolean, 'checked', group.items)
                    "
                  />
                  <VCheckbox
                    label="اظهار الكل"
                    :model-value="group.items.every((item: any) => item.is_visible)"
                    @update:model-value="
                      toggleGroupItems($event as boolean, 'is_visible', group.items)
                    "
                  />
                </div>
              </div>
              <VRow class="mt-0 pt-3">
                <VCol
                  cols="12"
                  md="6"
                  class="py-2"
                  v-for="(item, index) in group.items"
                  :key="`${group.key}-${index}`"
                >
                  <div
                    class="features-item gap-2 px-md-3"
                    :draggable="true"
                    @dragstart="dragStart($event, group.key, index)"
                    @dragover="dragOver"
                    @drop="drop($event, group.key, index, group.items)"
                  >
                    <span v-if="formAction !== 'view'" class="features-item__number">{{
                      index + 1
                    }}</span>
                    <div class="flex-grow-1 d-flex gap-1">
                      <v-checkbox v-model="item.checked" :ripple="false"></v-checkbox>
                      <div class="flex-grow-1">
                        {{ item.name }}
                        <div v-if="item.has_input" class="features-item__input ms-auto mt-1">
                          <AppTextField
                            v-model="item.value"
                            label="القيمة"
                            placeholder="القيمة"
                            :name="`value-${group.key}-${index}`"
                            type="number"
                            :rules="{
                              required: item.checked,
                              min_value: item.min_value,
                              max_value: item.max_value,
                            }"
                          >
                            <template #append-inner> {{ item.label }} </template>
                          </AppTextField>
                        </div>
                      </div>
                    </div>
                    <VBtn
                      size="35"
                      variant="outlined"
                      class="ms-3"
                      :style="{ opacity: item.checked ? 1 : 0 }"
                      @click="item.is_visible = !item.is_visible"
                    >
                      <VIcon :icon="item.is_visible ? 'tabler-eye' : 'tabler-eye-off'" size="22" />
                    </VBtn>
                  </div>
                </VCol>
              </VRow>
            </VCol>
            <VCol cols="12" v-if="formAction === 'edit'">
              <AppRadio
                v-model="formData.save_type"
                :options="getOptionsArrayFromObject(PACKAGE_EDIT_TYPES)"
                name="save_type"
                label="نوع التعديل"
                rules="required"
                option-label="label"
                option-value="value"
                inline
              />
            </VCol>
            <VCol cols="12" v-if="formAction !== 'view'" class="d-flex flex-wrap gap-3">
              <VBtn class="px-8" variant="outlined" color="error" @click="goToPackagesPage">
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
      </VCard>
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.features-list-box {
  .features-header {
    display: flex;
    justify-content: space-between;
    border-width: 1px 0;
    border-style: solid;
    border-color: currentcolor;
    gap: 10px;
    padding-block: 2px;
    padding-inline: 8px;

    @include responsive-down('sm') {
      flex-direction: column;
    }

    &__title {
      padding-block-start: 5px;
    }
  }

  .features-item {
    display: flex;
    font-size: 14px;

    :deep(.v-selection-control) {
      align-items: flex-start;
    }

    :deep(.v-selection-control__wrapper),
    :deep(.v-selection-control__input) {
      block-size: auto;
    }

    &__number {
      cursor: move;
      min-inline-size: 15px;
    }

    &__input :deep(.v-label),
    :deep(.v-selection-control__input::before) {
      display: none;
    }
  }
}
</style>
