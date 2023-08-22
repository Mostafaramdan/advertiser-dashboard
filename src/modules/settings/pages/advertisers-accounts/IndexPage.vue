<script setup lang="ts">
import type { PageTabNavItem } from '@/interfaces/Shared'
import { useAuthStore } from '@/stores/AuthStore'

const { canAccessPage } = useAuthStore()

const navLinks = computed<PageTabNavItem[]>(() => {
  return [
    {
      title: 'أنواع الاعلانات',
      to: { name: 'ads-types-settings' },
      show: canAccessPage('ads_types'),
    },
    {
      title: 'انواع تمييز الحسابات',
      to: { name: 'discrimination-types-settings' },
      show: canAccessPage('discrimination_types'),
    },

    // TODO: add permissions
    {
      title: 'شرائح التأثير',
      to: { name: 'effect-slides-settings' },
      show: canAccessPage('entities'),
    },
    {
      title: 'حالات الحسابات',
      to: { name: 'accounts-cases-settings' },
      show: canAccessPage('entities'),
    },
    {
      title: 'إعدادات الاشتراك',
      to: { name: 'subscription-settings' },
      show: canAccessPage('entities'),
    },
  ]
})
</script>

<template>
  <VCard class="page-card" title="إعدادات حسابات المعلنين">
    <VCardText>
      <PageTabsNav :nav-links="navLinks" />
      <RouterView />
    </VCardText>
  </VCard>
</template>
