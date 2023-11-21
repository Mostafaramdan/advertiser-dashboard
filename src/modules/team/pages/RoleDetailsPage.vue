<script setup lang="ts">
import PermissionsList from '../components/PermissionsList.vue'
import type { RoleFormData } from '../interfaces/Role'
import { rolesService } from '../services/RolesService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const route = useRoute()
const isLoading = ref<boolean>(false)
const data = ref<RoleFormData | null>(null)
let employeeId: number = +route.params.id
// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
getEmployeeData()
// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions

function getEmployeeData() {
  isLoading.value = true
  rolesService
    .getSingleItem(employeeId)
    .then((res) => {
      data.value = res.data.data
    })
    .finally(() => {
      isLoading.value = false
    })
}
// #endregion
</script>

<template>
  <VCard class="page-card" v-loading="isLoading">
    <template #title>
      <div class="d-flex align-center">
        <PageBackBtn :to="{ name: 'team-roles-page' }" />
        <div>عرض صلاحية</div>
      </div>
    </template>
    <VCardText class="form-modal" v-if="data">
      <VList :lines="false" class="d-flex flex-column flex-md-row gap-4 mb-5">
        <VListItem class="px-2 py-2 flex-grow-1" title="الاسم" :subtitle="data.name" border />
        <VListItem class="px-2 py-2" border>
          <VSwitch
            :model-value="data.is_active"
            :inset="false"
            :label="data.is_active ? 'نشط' : 'غير نشط'"
            name="is_active"
            class="px-2"
            readonly
          />
        </VListItem>
      </VList>
      <PermissionsList v-if="data" :permissions="data.permissions" />
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
:deep(.v-card-item) {
  padding-block-end: 12px;
}
</style>
