<script setup lang="ts">
import { PERMISSIONS_LIST } from '@/constants/team'
import { cloneItem } from '@/helpers/index'
import type { FormActionType } from '@/interfaces/Forms'
import { useAuthStore } from '@/stores/AuthStore'
import { useToast } from 'vue-toastification'
import type { PermissionListItem, RoleFormData } from '../interfaces/Role'
import { rolesService } from '../services/RolesService'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(defineProps<{ formAction: FormActionType }>(), {})

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
const formRef = ref<any>(null)
const permissionList = ref<PermissionListItem[]>(cloneItem(PERMISSIONS_LIST))
let roleId: number = +route.params.id

const isLoading = reactive({
  data: false,
  submit: false,
})

const formData = reactive<RoleFormData>({
  name: '',
  is_active: true,
  permissions: [],
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const formTitle = computed(() => {
  return props.formAction === 'create' ? 'اضافة صلاحية' : 'تعديل صلاحية'
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

function initData() {
  if (props.formAction === 'edit') getEmployeeData()
}

function checkPermissions() {
  permissionList.value.forEach((item) => {
    item.groups.forEach((group) => {
      group.permissions.forEach((permission) => {
        if (formData.permissions.includes(permission.key)) {
          permission.checked = true
        }
      })
    })
  })
}

function toggleSingleGroupCheck(value: boolean, permissions: any) {
  permissions.forEach((permission: any) => (permission.checked = value))
}

function toggleMultipleGroupCheck(value: boolean, groups: any) {
  groups.forEach((group: any) => {
    toggleSingleGroupCheck(value, group.permissions)
  })
}

function getEmployeeData() {
  isLoading.data = true
  rolesService
    .getSingleItem(roleId)
    .then((res) => {
      Object.assign(formData, res.data.data)
      checkPermissions()
    })
    .finally(() => {
      isLoading.data = false
    })
}

function goToRolesPage() {
  router.push({ name: 'team-roles-page' })
}

function getAuthUserPermissions() {
  isLoading.data = true
  getPermissions().then(() => {
    isLoading.data = false
  })
}

function edit(payload: any) {
  rolesService
    .editItem(payload)
    .then((res) => {
      toast.success(res.data.message)
      if (authUserData.value?.roles.find((role) => role.id === roleId)) {
        getAuthUserPermissions()
      }
      goToRolesPage()
    })
    .finally(() => {
      isLoading.submit = false
    })
}

function create(payload: any) {
  rolesService
    .createItem(payload)
    .then((res) => {
      toast.success(res.data.message)
      goToRolesPage()
    })
    .finally(() => {
      isLoading.submit = false
    })
}

function getFormData(): RoleFormData {
  const selectedPermission: string[] = []
  permissionList.value.forEach((item) => {
    item.groups.forEach((group) => {
      group.permissions.forEach((permission) => {
        if (permission.checked) selectedPermission.push(permission.key)
      })
    })
  })

  formData.permissions = selectedPermission

  return formData
}

function submit() {
  formRef.value.validate().then(({ errors }: any) => {
    const errorsArr = Object.values(errors)
    const payload = getFormData()
    if (payload.permissions.length === 0) errorsArr.push('يجب تحديد صلاحية واحدة على الاقل')
    if (errorsArr.length) {
      toast.error(errorsArr.join('\n'))
    }
    if (errorsArr.length) return

    isLoading.submit = true

    props.formAction === 'create' ? create(payload) : edit(payload)
  })
}
// #endregion
</script>

<template>
  <div>
    <VCard class="page-card" v-loading="isLoading.data">
      <template #title>
        <div class="d-flex align-center">
          <PageBackBtn @click="goToRolesPage" />
          <div>
            {{ formTitle }}
          </div>
        </div>
      </template>
      <VCardText class="form-modal">
        <VCard flat>
          <VeeForm ref="formRef" @submit="submit">
            <div class="d-flex flex-column flex-md-row gap-4 mb-5">
              <div class="flex-grow-1">
                <AppTextField
                  v-model="formData.name"
                  label="اسم الصلاحية"
                  placeholder="اسم الصلاحية"
                  type="text"
                  name="name"
                  rules="required|min:5|max:50"
                  prepend-inner-icon="tabler-key"
                />
              </div>
              <div class="px-md-3">
                <AppSwitch v-model="formData.is_active" label="الحالة" name="is_active" />
              </div>
            </div>

            <template v-if="!isLoading.data">
              <div class="permissions-list mt-2">
                <VExpansionPanels
                  v-for="(item, index) in permissionList"
                  :key="index"
                  class="expansion-panels-width-border mb-6 permissions-list__item"
                  :model-value="0"
                >
                  <VExpansionPanel elevation="0">
                    <VExpansionPanelTitle>
                      <span class="permissions-list__item__title">
                        <span @click.stop="">
                          <VCheckbox
                            hide-details
                            :ripple="false"
                            @update:model-value="
                              toggleMultipleGroupCheck($event as boolean, item.groups)
                            "
                            :model-value="
                              item.groups.every((group) =>
                                group.permissions.every((role) => role.checked),
                              )
                            "
                          ></VCheckbox>
                        </span>
                        <strong>{{ item.title }}</strong>
                      </span>
                    </VExpansionPanelTitle>
                    <VExpansionPanelText>
                      <div class="d-flex flex-wrap gap-4">
                        <div
                          class="permissions-list__item__group d-flex align-md-center flex-grow-1 flex-column flex-md-row"
                          v-for="(group, index) in item.groups"
                          :key="index"
                        >
                          <div style="min-inline-size: 160px">
                            <VCheckbox
                              class="main-checkbox"
                              :model-value="group.permissions.every((role) => role.checked)"
                              :label="group.title"
                              @update:model-value="
                                toggleSingleGroupCheck($event as boolean, group.permissions)
                              "
                            >
                            </VCheckbox>
                          </div>
                          <div class="permissions-list__item__options">
                            <VCheckbox
                              v-model="permission.checked"
                              v-for="permission in group.permissions"
                              :key="permission.label"
                              :label="permission.label"
                            />
                          </div>
                        </div>
                      </div>
                    </VExpansionPanelText>
                  </VExpansionPanel>
                </VExpansionPanels>
              </div>

              <div cols="12" v-if="formAction !== 'view'" class="d-flex flex-wrap gap-3">
                <VBtn class="px-8" variant="outlined" color="error" @click="goToRolesPage">
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
              </div>
            </template>
          </VeeForm>
        </VCard>
      </VCardText>
    </VCard>
  </div>
</template>

<style lang="scss" scoped>
:deep(.v-card-item) {
  padding-block-end: 12px;
}
</style>
