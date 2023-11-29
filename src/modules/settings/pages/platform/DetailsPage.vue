<script setup lang="ts">
import GeoLocationModal from '@/components/shared/GeoLocationModal.vue'
import type { Location } from '@/interfaces/Shared'
import { listService } from '@/services/ListService'
import { useAuthStore } from '@/stores/AuthStore'
import { useToast } from 'vue-toastification'
import PlatformDetailsCard from '../../components/PlatformDetailsCard.vue'
import type { PlatformFormData, PlatformInfo } from '../../interfaces/PlatformDetails'
import { platformService } from '../../services/PlatformService'
/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const toast = useToast()
const { t } = useI18n()
const { hasPermission } = useAuthStore()

const SAUDI_ARABIA_ID = 237
const formRef = ref<any>(null)
const selectedCountry = ref<any>(SAUDI_ARABIA_ID)
const showGeoLocationModal = ref<boolean>(false)

const isLoading = reactive({
  countries: false,
  data: false,
  submit: false,
})

const countries = ref([
  {
    id: SAUDI_ARABIA_ID,
    label: 'السعودية',
  },
])

const platformData = ref<PlatformInfo | null>(null)

const formData = reactive<PlatformFormData | any>({
  name_ar: {
    value: '',
    show: true,
  },
  name_en: {
    value: '',
    show: true,
  },
  email: {
    value: '',
    show: true,
  },
  unified_number: {
    value: '',
    show: true,
  },
  location: {
    value: {
      address: '',
      lat: null,
      lng: null,
    },
    show: true,
  },
  fax: {
    value: '',
    show: true,
  },
  whatsapp: {
    value: '',
    show: true,
  },
  tax_registration_number: {
    value: '',
    show: true,
  },
  commercial_registration_number: {
    value: '',
    show: true,
  },
  logo: null,
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const permissions = computed(() => ({
  edit: hasPermission('update_general_settings'),
}))

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
getPageData()
getCountries()

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function toggleShow(field: string): void {
  formData[field].show = !formData[field].show
}

function updateLocation(location: Location) {
  formData.location.value = { ...location }
}

function getCountries() {
  isLoading.countries = true
  listService
    .getCountries()
    .then((res: any) => {
      countries.value = res.data.data
    })
    .finally(() => {
      isLoading.countries = false
    })
}

function getPageData() {
  isLoading.data = true
  platformService
    .getGeneralData(selectedCountry.value)
    .then((res) => {
      const { settings_general_users, data } = res.data

      platformData.value = settings_general_users
      Object.assign(formData, data)
    })
    .finally(() => {
      isLoading.data = false
    })
}

function edit() {
  isLoading.submit = true
  platformService
    .editGeneralData(selectedCountry.value, formData)
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
    edit()
  })
}

// #endregion
</script>

<template>
  <section class="platform-settings-details">
    <GeoLocationModal
      v-if="showGeoLocationModal"
      v-model:showModal="showGeoLocationModal"
      :location="{ ...formData.location.value }"
      @update:location="updateLocation"
    />
    <VRow>
      <VCol col="12" md="6" lg="5" class="mb-4">
        <VSelect
          v-model="selectedCountry"
          :items="countries"
          item-value="id"
          item-title="label"
          prepend-inner-icon="tabler-flag"
          label="الدولة"
          :loading="isLoading.countries"
          :disabled="isLoading.countries"
          @update:model-value="getPageData"
        />
      </VCol>
    </VRow>
    <VCard v-loading="isLoading.data" flat :disabled="!permissions.edit">
      <PlatformDetailsCard :platform-data="platformData" />

      <VeeForm ref="formRef" v-slot="{ meta }" @submit="submit">
        <VRow>
          <VCol col="12" lg="9">
            <VRow>
              <VCol cols="12" md="6">
                <AppTextField
                  v-model="formData.name_ar.value"
                  label="اسم المنصة عربي"
                  name="name_ar"
                  rules="required|min:3"
                >
                  <template #append>
                    <VBtn size="38" variant="outlined" @click="toggleShow('name_ar')">
                      <VIcon
                        :icon="formData.name_ar.show ? 'tabler-eye' : 'tabler-eye-off'"
                        size="22"
                      />
                    </VBtn>
                  </template>
                </AppTextField>
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField
                  v-model="formData.name_en.value"
                  label="اسم المنصة انجليزي"
                  name="name_en"
                  rules="required|min:3"
                >
                  <template #append>
                    <VBtn size="38" variant="outlined" @click="toggleShow('name_en')">
                      <VIcon
                        :icon="formData.name_en.show ? 'tabler-eye' : 'tabler-eye-off'"
                        size="22"
                      />
                    </VBtn>
                  </template>
                </AppTextField>
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField
                  v-model="formData.email.value"
                  label="البريد الالكتروني"
                  name="email"
                  rules="required|email"
                  type="email"
                >
                  <template #append>
                    <VBtn size="38" variant="outlined" @click="toggleShow('email')">
                      <VIcon
                        :icon="formData.email.show ? 'tabler-eye' : 'tabler-eye-off'"
                        size="22"
                      />
                    </VBtn>
                  </template>
                </AppTextField>
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField
                  v-model="formData.unified_number.value"
                  label="الرقم الموحد"
                  name="unified_number"
                  rules="required|numeric|min:10"
                  type="number"
                >
                  <template #append>
                    <VBtn size="38" variant="outlined" @click="toggleShow('unified_number')">
                      <VIcon
                        :icon="formData.unified_number.show ? 'tabler-eye' : 'tabler-eye-off'"
                        size="22"
                      />
                    </VBtn>
                  </template>
                </AppTextField>
              </VCol>
              <VCol cols="12">
                <AppTextField
                  v-model="formData.location.value.address"
                  label="العنوان"
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
                  <template #append>
                    <VBtn size="38" variant="outlined" @click="toggleShow('location')">
                      <VIcon
                        :icon="formData.location.show ? 'tabler-eye' : 'tabler-eye-off'"
                        size="22"
                      />
                    </VBtn>
                  </template>
                </AppTextField>
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField
                  v-model="formData.tax_registration_number.value"
                  label="السجل الضريبي"
                  name="tax_registration_number"
                  rules="required|numeric|min:10"
                  type="number"
                >
                  <template #append>
                    <VBtn
                      size="38"
                      variant="outlined"
                      @click="toggleShow('tax_registration_number')"
                    >
                      <VIcon
                        :icon="
                          formData.tax_registration_number.show ? 'tabler-eye' : 'tabler-eye-off'
                        "
                        size="22"
                      />
                    </VBtn>
                  </template>
                </AppTextField>
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField
                  v-model="formData.commercial_registration_number.value"
                  label="السجل التجاري"
                  name="commercial_registration_number"
                  rules="required|numeric|min:10"
                  type="number"
                >
                  <template #append>
                    <VBtn
                      size="38"
                      variant="outlined"
                      @click="toggleShow('commercial_registration_number')"
                    >
                      <VIcon
                        :icon="
                          formData.commercial_registration_number.show
                            ? 'tabler-eye'
                            : 'tabler-eye-off'
                        "
                        size="22"
                      />
                    </VBtn>
                  </template>
                </AppTextField>
              </VCol>
            </VRow>
          </VCol>
          <VCol cols="12" lg="3">
            <AppUploadFile
              v-model="formData.logo"
              :accepted-types="['image/jpeg', 'image/png', 'image/svg+xml']"
              name="logo"
              label="شعار المنصة"
              rules="required"
            />
          </VCol>
        </VRow>
        <VBtn
          v-if="permissions.edit"
          :loading="isLoading.submit"
          :disabled="isLoading.submit || !meta.valid"
          class="mt-6 px-10"
          @click="submit"
        >
          {{ t('actions.save') }}
        </VBtn>
      </VeeForm>
    </VCard>
  </section>
</template>

<style lang="scss" scoped>
.platform-settings-details {
  :deep(.v-input--horizontal .v-input__append) {
    padding: 0;
    margin-inline-start: 10px;
  }
}
</style>
