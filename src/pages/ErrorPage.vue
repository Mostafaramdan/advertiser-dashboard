<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import pages404 from '@images/pages/404.png'
import miscMaskDark from '@images/pages/misc-mask-dark.png'
import miscMaskLight from '@images/pages/misc-mask-light.png'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const authThemeMask = useGenerateImageVariant(miscMaskLight, miscMaskDark)
const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const { message, status } = route.query

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const pageTitle = computed(() => {
  return +status === 401 ? t('errors.you_are_not_authorized') : t('errors.something_went_wrong')
})

const pageDescription = computed(() => {
  return message ? t(message) : ''
})

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks

// clear the message from the url
if (message || status) router.replace({ name: 'error-page' })

// #endregion
</script>

<template>
  <div class="misc-wrapper">
    <ErrorHeader :error-title="pageTitle" :error-description="pageDescription" />
    <VBtn to="/" class="mb-12">
      {{ t('links.back_to_home') }}
    </VBtn>

    <!-- 👉 Image -->
    <div class="misc-avatar w-100 text-center">
      <VImg :src="pages404" alt="Coming Soon" :max-width="200" class="mx-auto" />
    </div>

    <VImg :src="authThemeMask" class="misc-footer-img d-none d-md-block" />
  </div>
</template>

<style lang="scss">
@use '@core/scss/template/pages/misc.scss';
</style>
