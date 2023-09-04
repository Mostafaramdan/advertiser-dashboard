<script setup lang="ts">
import authV1BottomShape from '@images/svg/auth-v1-bottom-shape.svg?raw'
import authV1TopShape from '@images/svg/auth-v1-top-shape.svg?raw'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
</script>

<template>
  <div class="layout-blank">
    <div class="auth-wrapper d-flex align-center justify-center pa-4">
      <div class="position-relative my-sm-16" style="width: 500px">
        <!-- 👉 Top shape -->
        <VNodeRenderer
          :nodes="h('div', { innerHTML: authV1TopShape })"
          class="text-primary auth-v1-top-shape d-none d-sm-block"
        />

        <!-- 👉 Bottom shape -->
        <VNodeRenderer
          :nodes="h('div', { innerHTML: authV1BottomShape })"
          class="text-primary auth-v1-bottom-shape d-none d-sm-block"
        />

        <!-- 👉 Auth Card -->
        <VCard class="auth-card py-2 pa-lg-3">
          <VCardItem>
            <template #prepend>
              <div class="d-flex">
                <VNodeRenderer :nodes="themeConfig.app.logo" />
              </div>
            </template>

            <VCardTitle class="font-weight-bold text-capitalize text-h5 py-1">
              {{ themeConfig.app.title }}
            </VCardTitle>
          </VCardItem>

          <VCardText>
            <RouterView />
          </VCardText>
        </VCard>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use '@core/scss/template/pages/page-auth.scss';
</style>
