<script setup lang="ts">
import type { PageTabNavItem } from '@/interfaces/Shared'
import { useAuthStore } from '@/stores/AuthStore'

const { hasPermission } = useAuthStore()

const navLinks = computed<PageTabNavItem[]>(() => {
  return [
    {
      title: 'بيانات المنصة',
      to: { name: 'ad-spaces-platform-settings-details' },
      show: hasPermission('ad_spaces_view_general_settings'),
    },
    {
      title: 'حسابات التواصل',
      to: { name: 'ad-spaces-social-accounts-settings' },
      show: hasPermission('ad_spaces_view_social_settings'),
    },
    {
      title: 'دوام المنصة',
      to: { name: 'ad-spaces-work-time-settings' },
      show: hasPermission('ad_spaces_view_schedule_settings'),
    },
    {
      title: 'طرق الدفع',
      to: { name: 'ad-spaces-payment-methods-settings' },
      show: hasPermission('ad_spaces_view_billing_cards'),
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
