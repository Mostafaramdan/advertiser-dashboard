<script setup lang="ts">
import type { PageTabNavItem } from '@/interfaces/Shared'
import { useAuthStore } from '@/stores/AuthStore'

const { hasPermission } = useAuthStore()

const navLinks = computed<PageTabNavItem[]>(() => {
  return [
    {
      title: 'بيانات المنصة',
      to: { name: 'platform-settings-details' },
      show: hasPermission('view_general_settings'),
    },
    {
      title: 'حسابات التواصل',
      to: { name: 'social-accounts-settings' },
      show: hasPermission('view_social_settings'),
    },
    {
      title: 'دوام المنصة',
      to: { name: 'work-time-settings' },
      show: hasPermission('view_schedule_settings'),
    },
    {
      title: 'طرق الدفع',
      to: { name: 'payment-methods-settings' },
      show: hasPermission('view_billing_cards'),
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
