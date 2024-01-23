<script setup lang="ts">
import { MAIN_APPS } from '@/constants'
import { useAuthStore } from '@/stores/AuthStore'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const router = useRouter()
const store = useAuthStore()
// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const selectedApp = computed(() => store.selectedApp)
const availableApps = computed(() => {
  return Array.from(MAIN_APPS, ([key, value]) => ({
    id: key,
    label: value.label,
  })).filter((app) => store.authUser?.apps.includes(app.id))
})
// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function updateSelectedApp(value: string) {
  store.setSelectedApp(value)
}
// #endregion

/***************************************
 **** Section Watchers *****************
 **************************************/
// #region Watchers
watch(selectedApp, () => {
  router.push({ name: 'home-page' })
})

// #endregion
</script>

<template>
  <VSelect
    style="max-inline-size: 125px"
    :model-value="selectedApp"
    :items="availableApps"
    item-title="label"
    item-value="id"
    label="التطبيق"
    @update:model-value="updateSelectedApp"
  />
</template>
