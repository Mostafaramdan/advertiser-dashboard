<script lang="ts" setup>
import { authService } from '@/services/AuthService'
import { useAuthStore } from '@/stores/AuthStore'
import { useSkins } from '@core/composable/useSkins'
import { useThemeConfig } from '@core/composable/useThemeConfig'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const DefaultLayoutWithVerticalNav = defineAsyncComponent(() => import('./components/DefaultLayoutWithVerticalNav.vue'))
const AppLoader = defineAsyncComponent(() => import('./components/AppLoader.vue'))
const { width: windowWidth } = useWindowSize()
const { switchToVerticalNavOnLtOverlayNavBreakpoint } = useThemeConfig()

// ℹ️ This will switch to vertical nav when define breakpoint is reached when in horizontal nav layout
// Remove below composable usage if you are not using horizontal nav layout in your app
const { layoutAttrs, injectSkinClasses } = useSkins()

const { setUserPermissions } = useAuthStore()
const isLoading = ref<boolean>(false)

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
switchToVerticalNavOnLtOverlayNavBreakpoint(windowWidth)
injectSkinClasses()
getPermissions()

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function getPermissions() {
  isLoading.value = true
  authService.getPermissions().then((res: any) => {
    setUserPermissions(res.data.data)
  }).finally(() => {
    isLoading.value = false
  })
}

// #endregion
</script>

<template>
  <AppLoader v-if="isLoading" full-screen />
  <DefaultLayoutWithVerticalNav v-else v-bind="layoutAttrs" />
</template>

<style lang="scss">
// As we are using `layouts` plugin we need its styles to be imported
@use "@layouts/styles/default-layout";
</style>
