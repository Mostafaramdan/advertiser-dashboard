<script setup lang="ts">
import { PERMISSIONS_LIST } from '@/constants/team'
import { cloneItem } from '@/helpers/index'
import type { Permission, PermissionListItem, PermissionsGroup } from '../interfaces/Role'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(defineProps<{ permissions: string[] }>(), {})
// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const permissionList = ref<PermissionListItem[]>(cloneItem(PERMISSIONS_LIST))
// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
checkPermissions()
filterGroupsAndPermissions()
// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function checkPermissions() {
  permissionList.value.forEach((item) => {
    item.groups.forEach((group) => {
      group.permissions.forEach((permission) => {
        if (props.permissions.includes(permission.key)) {
          permission.checked = true
        }
      })
    })
  })
}

function filterGroupPermissions(groups: PermissionsGroup[]) {
  return groups.filter((group) => {
    group.permissions = filterPermissionChecked(group.permissions)
    return group.permissions.some((permission) => permission.checked)
  })
}

function filterItemListGroups(itemList: PermissionListItem[]) {
  return itemList.filter((item) =>
    item.groups.some((group) => group.permissions.some((permission) => permission.checked)),
  )
}

function filterPermissionChecked(permissions: Permission[]) {
  return permissions.filter((permission) => permission.checked)
}

function filterGroupsAndPermissions() {
  permissionList.value.forEach((item) => {
    item.groups = filterGroupPermissions(item.groups)
  })

  permissionList.value = filterItemListGroups(permissionList.value)
}
// #endregion
</script>

<template>
  <div class="permissions-list mt-2">
    <VExpansionPanels
      v-for="(item, index) in permissionList"
      :key="index"
      class="expansion-panels-width-border permissions-list__item"
      :model-value="0"
    >
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle>
          <span class="permissions-list__item__title">
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
              <div style="min-inline-size: 160px" class="font-weight-medium py-2">
                {{ group.title }}
              </div>
              <div class="permissions-list__item__options">
                <VCheckbox
                  v-model="permission.checked"
                  v-for="permission in group.permissions"
                  :key="permission.label"
                  :label="permission.label"
                  readonly
                />
              </div>
            </div>
          </div>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
  </div>
</template>
