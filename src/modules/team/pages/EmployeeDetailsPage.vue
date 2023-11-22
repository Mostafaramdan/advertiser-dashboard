<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { GENDER_TYPES } from '@/constants/index'
import { EMPLOYEES_TYPES } from '@/constants/team'
import { formatUrl } from '@/helpers/index'
import { useAuthStore } from '@/stores/AuthStore'
import { useToast } from 'vue-toastification'
import type { EmployeeDetails } from '../interfaces/Employee'
import { employeesService } from '../services/EmployeesService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { hasPermission } = useAuthStore()
const { formatDate } = UseGeneralHelpers()
const route = useRoute()
const router = useRouter()
const toast = useToast()
const employeeId: number = +route.params.id
const MODEL_NAME = 'admins'
const employee = ref<EmployeeDetails | null>(null)
const confirmModal = ref<any>()
const isLoading = reactive({
  data: false,
  delete: false,
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const permissions = computed(() => ({
  changeStatus: hasPermission('change_status_admin'),
  delete: hasPermission('delete_admin'),
  edit: hasPermission('update_admin'),
  viewRoleDetails: hasPermission('view_role_details'),
}))

const employeeDetails: any = computed(() => {
  if (!employee.value) return []
  const {
    email,
    phone,
    personal_id,
    gender,
    country,
    area,
    location,
    type,
    role_category,
    roles,
    front_id_image,
    back_id_image,
  } = employee.value
  return [
    {
      label: 'البريد الإلكتروني',
      value: email,
    },
    {
      label: 'الهاتف',
      value: phone,
    },
    {
      label: 'رقم الهوية',
      value: personal_id,
    },
    {
      label: 'الجنس',
      value: GENDER_TYPES[gender as 'male' | 'female'],
    },
    {
      label: 'الدولة',
      value: country.label,
    },
    {
      label: 'المدينة',
      value: area.label,
    },
    {
      label: 'العنوان',
      value: location,
      key: 'location',
    },
    {
      label: 'نوع الموظف',
      value: EMPLOYEES_TYPES[type],
    },
    {
      label: 'القسم',
      value: role_category.label,
    },
    {
      label: 'الصلاحيات',
      value: roles,
      key: 'roles',
    },
    {
      label: 'الصورة الشخصية(1)',
      value: front_id_image.path,
      key: 'image',
    },
    {
      label: 'الصورة الشخصية(2)',
      value: back_id_image.path,
      key: 'image',
    },
  ]
})
// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
getBasicInfo()

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function getBasicInfo() {
  isLoading.data = true
  employeesService
    .getSingleItem(employeeId)
    .then((res) => {
      employee.value = res.data.data
    })
    .finally(() => {
      isLoading.data = false
    })
}

function goToEmployeesPage() {
  router.push({ name: 'employees-page' })
}

function deleteEmployee() {
  isLoading.delete = true
  employeesService
    .deleteItem(employeeId)
    .then((res) => {
      toast.success(res.data.message)
      goToEmployeesPage()
    })
    .finally(() => {
      isLoading.delete = false
    })
}

async function showConfirmDeleteModal(): Promise<void> {
  const confirm = await confirmModal.value.open('يرجي التاكيد', 'هل انت متاكد من الحذف')

  if (confirm) deleteEmployee()
}
// #endregion
</script>

<template>
  <div>
    <ConfirmModal ref="confirmModal" />
    <VCard class="page-card" v-loading="isLoading.data">
      <template #title>
        <div class="d-flex align-center">
          <PageBackBtn @click="goToEmployeesPage" />
          <div>تفاصيل الموظف</div>
        </div>
      </template>
      <VCardText>
        <div class="border pa-4">
          <VSkeletonLoader v-if="isLoading.data" type="list-item-avatar-two-line" />
          <div v-else-if="employee" class="profile-card d-flex align-md-center">
            <VAvatar variant="outlined" size="80" class="me-3" cover rounded="0">
              <VImg v-if="employee.image.path" :src="employee.image.path" cover />
              <span v-else>!</span>
            </VAvatar>
            <div class="profile-card__content flex-grow-1">
              <h3 class="d-flex flex-wrap align-center justify-between gap-x-3">
                <span class="me-auto">{{ employee.name }}</span>
                <ToggleActivationSwitch
                  :id="employee.id"
                  v-model="employee.is_active"
                  :model="MODEL_NAME"
                  :disabled="!permissions.changeStatus"
                  :label="employee.is_active ? 'تنشيط' : 'إيقاف'"
                />
              </h3>
              <div class="d-flex flex-wrap gap-x-4 gap-y-2">
                <span class="d-flex align-center"
                  ><strong class="me-3">كود الموظف</strong>
                  {{ employee.code }}
                </span>
                <span v-if="employee.created_at" class="d-flex align-center">
                  <strong class="me-3">تاريخ الاضافة</strong>
                  {{ formatDate(employee.created_at) }}
                </span>
              </div>
              <div class="d-flex flex-wrap gap-3 w-100 mt-2">
                <VBtn
                  variant="outlined"
                  :to="{ name: 'employees-edit-page', params: { id: employee.id } }"
                  :disabled="!permissions.edit"
                >
                  تعديل <VIcon end icon="tabler-edit" />
                </VBtn>
                <VBtn
                  variant="outlined"
                  color="error"
                  @click="showConfirmDeleteModal"
                  class="me-3"
                  :disabled="!permissions.delete"
                >
                  حذف <VIcon end icon="tabler-trash" />
                </VBtn>
              </div>
            </div>
          </div>
        </div>

        <VExpansionPanels
          v-if="employee"
          class="expansion-panels-width-border mt-4"
          :model-value="0"
        >
          <VExpansionPanel elevation="0">
            <VExpansionPanelTitle> بيانات الموظف</VExpansionPanelTitle>
            <VExpansionPanelText>
              <VRow>
                <VCol
                  v-for="(item, index) in employeeDetails"
                  :key="index"
                  class="py-2"
                  cols="12"
                  sm="6"
                  lg="4"
                >
                  <h5 class="text-primary text-subtitle-2 mb-1">
                    {{ item.label }}
                  </h5>
                  <div class="text-body-2">
                    <template v-if="item.key === 'location'">
                      <a
                        v-if="item.value.lat && item.value.lng"
                        class="content-list__link"
                        :href="`https://www.google.com/maps/search/?api=1&query=${item.value.lat},${item.value.lng}`"
                        target="_blank"
                        >{{ item.value.name }}</a
                      >
                      <span v-else>
                        {{ item.value.name }}
                      </span>
                    </template>
                    <template v-else-if="item.key === 'image'">
                      <a
                        :href="formatUrl(item.value)"
                        target="_blank"
                        v-if="item.value"
                        class="mt-2 d-block"
                      >
                        <VAvatar variant="outlined" size="80" cover rounded="0">
                          <VImg :src="item.value" />
                        </VAvatar>
                      </a>
                      <span v-else>-</span>
                    </template>
                    <template v-else-if="item.key === 'roles'">
                      <div class="d-flex gap-2">
                        <VChip
                          variant="outlined"
                          color="primary"
                          label
                          v-for="role in item.value"
                          :key="role.id"
                          :to="{ name: 'roles-details-page', params: { id: role.id } }"
                          :disabled="!permissions.viewRoleDetails"
                        >
                          {{ role.label }}
                        </VChip>
                      </div>
                    </template>
                    <template v-else>
                      {{ item.value ?? '-' }}
                    </template>
                  </div>
                </VCol>
              </VRow>
            </VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>
      </VCardText>
    </VCard>
  </div>
</template>

<style lang="scss" scoped>
.profile-card {
  font-size: 14px;
  word-break: break-word;
}
</style>
