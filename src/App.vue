<script setup lang="ts">
import { useTheme } from 'vuetify'
import UseAppLayouts from '@/composables/UseAppLayouts'
import ScrollToTop from '@core/components/ScrollToTop.vue'
import { useThemeConfig } from '@core/composable/useThemeConfig'
import { hexToRgb } from '@layouts/utils'

import UseLocaleHelpers from '@/composables/UseLocaleHelpers'

const { layoutComponent } = UseAppLayouts()
const {
  syncInitialLoaderTheme,
  syncVuetifyThemeWithTheme: syncConfigThemeWithVuetifyTheme,
  isAppRtl,
  handleSkinChanges,
} = useThemeConfig()

const { global } = useTheme()

// ℹ️ Sync current theme with initial loader theme
syncInitialLoaderTheme()
syncConfigThemeWithVuetifyTheme()
handleSkinChanges()

const { initAppLanguage } = UseLocaleHelpers()

initAppLanguage()
</script>

<template>
  <VLocaleProvider :rtl="isAppRtl">
    <!-- ℹ️ This is required to set the background color of active nav link based on currently active global theme's primary -->
    <VApp :style="`--v-global-theme-primary: ${hexToRgb(global.current.value.colors.primary)}`">
      <Component :is="layoutComponent" v-if="layoutComponent">
        <RouterView />
      </Component>
      <ScrollToTop />
    </VApp>
  </VLocaleProvider>
</template>
