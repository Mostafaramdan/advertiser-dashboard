<script setup lang="ts">
import type { PageTabNavItem } from '@/interfaces/Shared'
import { useAuthStore } from '@/stores/AuthStore'

const { hasPermission } = useAuthStore()

const navLinks = computed<PageTabNavItem[]>(() => {
  return [
    {
      title: 'اعدادت الحسابات',
      to: { name: 'accounts-settings' },
      show: hasPermission('view_financial_settings'),
    },
    {
      title: 'شرائح عمولة الدفع',
      to: { name: 'payment-commission-settings' },
      show: hasPermission('view_payment_commissions'),
    },
    {
      title: 'اعدادت النقاط',
      to: { name: 'points-settings' },
      show: hasPermission('view_point_settings'),
    },
    {
      title: 'اعدادت الضريبة',
      to: { name: 'tax-settings' },
      show: hasPermission('view_tax_settings'),
    },
  ]
})
</script>

<template>
  <VCard class="page-card" title="الإعدادات المالية">
    <VCardText>
      <PageTabsNav :nav-links="navLinks" />
      <RouterView />
    </VCardText>
  </VCard>
</template>
