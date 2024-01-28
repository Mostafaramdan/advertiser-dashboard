<script setup lang="ts">
import type { PageTabNavItem } from '@/interfaces/Shared'
import { useAuthStore } from '@/stores/AuthStore'

const { hasPermission } = useAuthStore()

const navLinks = computed<PageTabNavItem[]>(() => {
  return [
    {
      title: 'بيانات المنصة',
      to: { name: 'offers-platform-settings-details' },
      show: hasPermission('offers_view_general_settings'),
    },
    {
      title: 'حسابات التواصل',
      to: { name: 'offers-social-accounts-settings' },
      show: hasPermission('offers_view_social_settings'),
    },
    {
      title: 'دوام المنصة',
      to: { name: 'offers-work-time-settings' },
      show: hasPermission('offers_view_schedule_settings'),
    },
    {
      title: 'طرق الدفع',
      to: { name: 'offers-payment-methods-settings' },
      show: hasPermission('offers_view_billing_cards'),
    },
  ]
})
</script>

<template>
  <VCard class="page-card" title="إعدادت حساب المنصة">
    <VCardText>
      <PageTabsNav :nav-links="navLinks" />
      <RouterView />
    </VCardText>
  </VCard>
</template>
