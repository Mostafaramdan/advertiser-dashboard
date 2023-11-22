<script setup lang="ts">
import GeoLocationModal from '@/components/shared/GeoLocationModal.vue'
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { GENDER_TYPES } from '@/constants/index'
import { EMPLOYEES_TYPES } from '@/constants/team'
import { cloneItem, getOptionsArrayFromObject } from '@/helpers/index'
import type { FormActionType } from '@/interfaces/Forms'
import type { DropdownMenuItem, File, Location } from '@/interfaces/Shared'
import { listService } from '@/services/ListService'
import { useAuthStore } from '@/stores/AuthStore'
import { useToast } from 'vue-toastification'
import type { EmployeeDetails, EmployeeFormProps } from '../interfaces/Employee'
import { employeesService } from '../services/EmployeesService'

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
const { authUser, getPermissions } = useAuthStore()
const { formatDateTime } = UseGeneralHelpers()
const formRef = ref<any>(null)
const showGeoLocationModal = ref<boolean>(false)
let employeeId: number = +route.params.id
const categoriesList = ref<DropdownMenuItem[]>([])
const countriesList = ref<DropdownMenuItem[]>([])
const areasList = ref<DropdownMenuItem[]>([])
const rolesList = ref<DropdownMenuItem[]>([])

const isLoading = reactive({
  data: false,
  submit: false,
  countries: false,
  areas: false,
  categories: false,
  roles: false,
  code: false,
})

const formData = reactive<EmployeeFormProps>({
  name: '',
  email: '',
  password: '',
  phone: '',
  code: '',
  personal_id: '',
  image: null,
  image_id: null,
  front_id_image: null,
  front_id_image_id: null,
  back_id_image: null,
  back_id_image_id: null,
  country_id: null,
  area_id: null,
  type: null,
  gender: null,
  role_category_id: null,
  roles: [],
  location: {
    name: '',
    lat: 0,
    lng: 0,
  },
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const formTitle = computed(() => {
  return props.formAction === 'create' ? 'اضافة موظف' : 'تعديل موظف'
})

const authUserData = computed(() => authUser)
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

function getAreas() {
  if (!formData.country_id) return
  isLoading.areas = true
  listService
    .getAreas(formData.country_id)
    .then((res: any) => {
      areasList.value = res.data.data
      if (!areasList.value.find((area) => area.id === formData.area_id)) formData.area_id = null
    })
    .finally(() => {
      isLoading.areas = false
    })
}

function getCategories() {
  isLoading.categories = true
  listService
    .getEmployeesRolesCategories()
    .then((res: any) => {
      categoriesList.value = res.data.data
    })
    .finally(() => {
      isLoading.categories = false
    })
}

function getRoles() {
  isLoading.roles = true
  listService
    .getEmployeesRoles()
    .then((res: any) => {
      rolesList.value = res.data.data
    })
    .finally(() => {
      isLoading.roles = false
    })
}

function getUniqueCode() {
  isLoading.code = true
  employeesService
    .getUniqueCode()
    .then((res) => {
      formData.code = res.data.data.code
    })
    .finally(() => {
      isLoading.code = false
    })
}

function initData() {
  getCountries()
  getCategories()
  getRoles()
  if (props.formAction === 'create') getUniqueCode()
  else getEmployeeData()
}

function getEmployeeData() {
  isLoading.data = true
  employeesService
    .getSingleItem(employeeId)
    .then((res) => {
      // get employee data
      const data: any = res.data.data as EmployeeDetails
      data.image_id = data.image?.id
      data.front_id_image_id = data.front_id_image?.id
      data.back_id_image_id = data.back_id_image?.id
      data.role_id = data.role?.id
      data.role_category_id = data.role_category?.id
      data.country_id = data.country?.id
      data.area_id = data.area?.id
      data.roles = data.roles.map((role: DropdownMenuItem) => role.id)

      delete data.image?.id
      delete data.front_id_image?.id
      delete data.back_id_image?.id
      delete data.role_category
      delete data.role
      delete data.country
      delete data.area
      Object.assign(formData, res.data.data)

      // get areas
      getAreas()
    })
    .finally(() => {
      isLoading.data = false
    })
}

function goToEmployeesPage() {
  router.push({ name: 'employees-page' })
}

function updateImageId(image: File, target: string) {
  if (image) formData[target as 'front_id_image_id' | 'back_id_image_id' | 'image_id'] = image.id
}

function updateLocation(location: Location) {
  formData.location = { ...location }
}

function getAuthUserPermissions() {
  isLoading.data = true
  getPermissions().then(() => {
    isLoading.data = false
  })
}

function edit(payload: EmployeeFormProps) {
  employeesService
    .editItem(payload)
    .then((res) => {
      // if it was the auth user we need to get new permissions
      if (authUserData.value?.id === employeeId) {
        getAuthUserPermissions()
      }
      toast.success(res.data.message)
      goToEmployeesPage()
    })
    .finally(() => {
      isLoading.submit = false
    })
}

function create(payload: EmployeeFormProps) {
  employeesService
    .createItem(payload)
    .then((res) => {
      toast.success(res.data.message)
      goToEmployeesPage()
    })
    .finally(() => {
      isLoading.submit = false
    })
}

function getFormData() {
  const payload = cloneItem(formData)
  delete payload.image
  delete payload.front_id_image
  delete payload.back_id_image
  delete payload.created_at

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
          <PageBackBtn @click="goToEmployeesPage" />
          <div>
            {{ formTitle }}
          </div>
        </div>
      </template>
      <VCardText class="form-modal">
        <VCard flat>
          <VeeForm ref="formRef" @submit="submit">
            <h4 class="mt-3" v-if="formData.created_at">
              تاريخ الاضافة:
              {{ formatDateTime(formData.created_at) }}
            </h4>
            <VRow class="my-0">
              <VCol cols="12">
                <AppTextField
                  v-model="formData.code"
                  label="كود الموظف"
                  placeholder="كود الموظف"
                  type="text"
                  name="code"
                  rules="required"
                  prepend-inner-icon="tabler-hash"
                  readonly
                  disabled
                  :loading="isLoading.code"
                />
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField
                  v-model="formData.name"
                  label="اسم الموظف"
                  placeholder="اسم الموظف"
                  type="text"
                  name="name"
                  rules="required|min:3|max:50"
                  prepend-inner-icon="tabler-user"
                />
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField
                  v-model="formData.email"
                  label="البريد الإلكتروني"
                  placeholder="البريد الإلكتروني"
                  type="email"
                  name="email"
                  rules="required|min:6|email"
                  prepend-inner-icon="tabler-mail"
                />
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField
                  v-model="formData.phone"
                  name="phone"
                  label="الهاتف"
                  placeholder="الهاتف"
                  type="number"
                  rules="required|numeric|min:6|max:14"
                  prepend-inner-icon="tabler-phone"
                />
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField
                  v-model="formData.password"
                  name="password"
                  label="كلمة المرور"
                  placeholder="كلمة المرور"
                  type="password"
                  :rules="{ required: formAction === 'create', min: 6 }"
                  prepend-inner-icon="tabler-lock"
                />
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField
                  v-model="formData.personal_id"
                  name="personal_id"
                  label="رقم الهوية"
                  placeholder="رقم الهوية"
                  type="number"
                  rules="required|numeric"
                  prepend-inner-icon="tabler-id"
                />
              </VCol>
              <VCol cols="12" md="6">
                <AppAutocomplete
                  v-model="formData.gender"
                  name="gender"
                  :items="getOptionsArrayFromObject(GENDER_TYPES)"
                  item-title="label"
                  item-value="value"
                  label="الجنس"
                  placeholder="الجنس"
                  rules="required"
                  clearable
                  prepend-inner-icon="tabler-gender-genderfluid"
                />
              </VCol>
              <VCol cols="12" md="6">
                <AppAutocomplete
                  v-model="formData.country_id"
                  name="country_id"
                  :items="countriesList"
                  item-title="label"
                  item-value="id"
                  label="الدولة"
                  placeholder="الدولة"
                  rules="required"
                  :loading="isLoading.countries"
                  :disabled="isLoading.countries"
                  clearable
                  prepend-inner-icon="tabler-flag"
                  @update:model-value="getAreas"
                />
              </VCol>
              <VCol cols="12" md="6">
                <AppAutocomplete
                  v-model="formData.area_id"
                  name="area_id"
                  :items="areasList"
                  item-title="label"
                  item-value="id"
                  label="المدينة"
                  placeholder="المدينة"
                  rules="required"
                  :loading="isLoading.areas"
                  :disabled="isLoading.areas || !formData.country_id"
                  clearable
                  prepend-inner-icon="tabler-map-2"
                >
                  <template #selection="{ item }">
                    <span v-if="item.title && areasList.length">{{ item.title }}</span>
                  </template>
                </AppAutocomplete>
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField
                  v-model="formData.location.name"
                  label="العنوان"
                  placeholder="العنوان"
                  name="location"
                  rules="required|min:3"
                  prepend-inner-icon="tabler-current-location"
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
                  v-model="formData.type"
                  name="type"
                  :items="getOptionsArrayFromObject(EMPLOYEES_TYPES)"
                  item-title="label"
                  item-value="value"
                  label="نوع الموظف"
                  placeholder="نوع الموظف"
                  rules="required"
                  clearable
                  prepend-inner-icon="tabler-user-exclamation"
                />
              </VCol>
              <VCol cols="12" md="6">
                <AppAutocomplete
                  v-model="formData.role_category_id"
                  name="role_category_id"
                  :items="categoriesList"
                  item-title="label"
                  item-value="id"
                  label="القسم"
                  placeholder="القسم"
                  rules="required"
                  :loading="isLoading.categories"
                  :disabled="isLoading.categories"
                  clearable
                  prepend-inner-icon="tabler-category"
                />
              </VCol>
              <VCol cols="12" md="6">
                <AppAutocomplete
                  v-model="formData.roles"
                  name="roles"
                  :items="rolesList"
                  item-title="label"
                  item-value="id"
                  label="الصلاحيات"
                  placeholder="الصلاحيات"
                  rules="required"
                  :loading="isLoading.roles"
                  :disabled="isLoading.roles"
                  clearable
                  multiple
                  prepend-inner-icon="tabler-key"
                >
                  <template #selection="{ item, index }">
                    <VChip v-if="index < 1">
                      <span>{{ item.title }}</span>
                    </VChip>
                    <span v-if="index === 1" class="text-grey text-caption align-self-center">
                      (+{{ formData.roles.length - 1 }} اخري)
                    </span>
                  </template>
                </AppAutocomplete>
              </VCol>
              <VCol cols="12" class="d-flex flex-wrap gap-4">
                <div>
                  <AppUploadFile
                    v-model="formData.image"
                    name="image"
                    label="صورة الموظف"
                    :accepted-types="['image/jpeg', 'image/png', 'image/svg+xml']"
                    width="150px"
                    height="150px"
                    @update:model-value="(image: File) => updateImageId(image, 'image_id')"
                    rules="required"
                  />
                </div>
                <div>
                  <AppUploadFile
                    v-model="formData.front_id_image"
                    id="front_id_image"
                    name="front_id_image"
                    label="الصورة الشخصية(1)"
                    :accepted-types="['image/jpeg', 'image/png', 'image/svg+xml']"
                    width="150px"
                    height="150px"
                    @update:model-value="(image: File) => updateImageId(image, 'front_id_image_id')"
                    rules="required"
                  />
                </div>
                <div>
                  <AppUploadFile
                    v-model="formData.back_id_image"
                    id="back_id_image"
                    name="back_id_image"
                    label="الصورة الشخصية(2)"
                    :accepted-types="['image/jpeg', 'image/png', 'image/svg+xml']"
                    width="150px"
                    height="150px"
                    @update:model-value="(image: File) => updateImageId(image, 'back_id_image_id')"
                    rules="required"
                  />
                </div>
              </VCol>
              <VCol cols="12" v-if="formAction !== 'view'" class="d-flex flex-wrap gap-3">
                <VBtn class="px-8" variant="outlined" color="error" @click="goToEmployeesPage">
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
