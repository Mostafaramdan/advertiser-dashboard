<script setup lang="ts">
import { useAuthStore } from '@/stores/AuthStore'

const { canAccessPage } = useAuthStore()

const navLinks = computed(() => {
  return [
    {
      title: 'اعدادت الحسابات',
      to: { name: 'accounts-settings' },
      show: canAccessPage('financial_settings'),
    },
    {
      title: 'شرائح عمولة الدفع',
      to: { name: 'payment-commission-settings' },
      show: canAccessPage('payment_commissions'),
    },
    {
      title: 'اعدادت النقاط',
      to: { name: 'points-settings' },
      show: canAccessPage('point_settings'),
    },
    {
      title: 'اعدادت الضريبة',
      to: { name: 'tax-settings' },
      show: canAccessPage('tax_settings'),
    },
  ]
})
</script>

<template>
  <VCard class="page-card" title="الإعدادات المالية">
    <VCardText>
      <VTabs class="mb-3 v-tabs-pill" center-active>
        <VTab v-for="link in navLinks" :key="link.title" :to="link.to" active-class="active">
          {{ link.title }}
        </VTab>
      </VTabs>
      <RouterView />
    </VCardText>
  </VCard>
</template>
