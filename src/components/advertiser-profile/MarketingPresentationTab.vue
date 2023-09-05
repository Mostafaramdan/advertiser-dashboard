<script setup lang="ts">
import type { MarketingPresentationInfo } from '@/interfaces/Advertiser'
import { advertisersService } from '@/services/AdvertisersService'
import { useAuthStore } from '@/stores/AuthStore'
import { useToast } from 'vue-toastification'
/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const toast = useToast()
const route = useRoute()
const { hasPermission } = useAuthStore()
const advertiserId: number = +route.params.id
const formRef = ref<any>(null)
const numberOfUsers = ref<number | null>(null)
const isLoading = reactive({
  data: false,
  submit: false,
})

const formData = reactive<MarketingPresentationInfo>({
  code: '',
  time_in_months: null,
  end_date: '',
  points: null,
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const permissions = computed(() => ({
  edit: hasPermission('convert_to_marketer'),
}))
//#endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
getPageData()
// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function getPageData() {
  isLoading.data = true
  advertisersService
    .getMarketingPresentationInfo(advertiserId)
    .then((res) => {
      const response = res.data
      if (response) {
        numberOfUsers.value = response.number_of_users
        Object.assign(formData, response.data)
      }
    })
    .finally(() => {
      isLoading.data = false
    })
}

function saveData() {
  const payload = {
    id: advertiserId,
    data: formData,
  }
  isLoading.submit = true
  advertisersService
    .updateMarketingPresentationInfo(payload)
    .then((res) => {
      toast.success(res.data.message)
    })
    .finally(() => {
      isLoading.submit = false
    })
}

function submit() {
  formRef.value.validate().then(({ valid }: any) => {
    if (!valid) return
    saveData()
  })
}
// #endregion
</script>

<template>
  <div class="marketing-presentation-tab" v-loading="isLoading.data">
    <router-link to="/" class=""> عددٍ المستخدمين {{ numberOfUsers }} </router-link>
    <VDivider class="my-4" />
    <VeeForm ref="formRef" v-slot="{ meta }" @submit="submit">
      <VRow>
        <VCol cols="12" sm="6">
          <AppTextField
            v-model="formData.code"
            label="كود العرض"
            name="code"
            rules="required|min:3|max:50"
          />
        </VCol>
        <VCol cols="12" sm="6">
          <VeeField
            v-slot="{ errorMessage, value, handleChange }"
            v-model="formData.end_date"
            name="end_date"
            label="تاريخ الانتهاء"
            rules="required"
          >
            <AppDateTimePicker
              label="تاريخ الانتهاء"
              :model-value="value"
              :error-msg="errorMessage"
              clearable
              prepend-inner-icon="tabler-calendar"
              :config="{ minDate: new Date() }"
              @update:model-value="handleChange"
            />
          </VeeField>
        </VCol>
        <VCol cols="12" sm="6">
          <AppTextField
            v-model="formData.time_in_months"
            label="مدة العرض"
            name="time_in_months"
            type="number"
            rules="required|numeric"
          >
            <template #append-inner> شهر </template>
          </AppTextField>
        </VCol>
        <VCol cols="12" sm="6">
          <AppTextField
            v-model="formData.points"
            label="نسبة النقاط"
            name="points"
            type="number"
            rules="required|numeric|max_value:100"
          >
            <template #append-inner> % </template>
          </AppTextField>
        </VCol>
      </VRow>

      <VBtn
        :loading="isLoading.submit"
        :disabled="isLoading.submit || !meta.valid"
        @click="submit"
        class="mt-6 px-9"
        v-if="permissions.edit"
      >
        {{ t('actions.save') }}
      </VBtn>
    </VeeForm>
  </div>
</template>
