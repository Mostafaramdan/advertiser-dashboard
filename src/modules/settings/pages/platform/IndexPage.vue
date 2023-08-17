<script setup lang="ts">
import { useAuthStore } from '@/stores/AuthStore'

const { canAccessPage } = useAuthStore()

const navLinks = computed(() => {
  return [
    {
      title: 'بيانات المنصة',
      to: { name: 'platform-settings-details' },
      show: canAccessPage('general_settings'),
    },
    {
      title: 'حسابات التواصل',
      to: { name: 'social-accounts-settings' },
      show: canAccessPage('social_settings'),
    },
    {
      title: 'دوام المنصة',
      to: { name: 'work-time-settings' },
      show: canAccessPage('schedule_settings'),
    },
    {
      title: 'طرق الدفع',
      to: { name: 'payment-methods-settings' },
      show: canAccessPage('billing_cards'),
    },
  ]
})
</script>

<template>
  <VCard class="page-card" title="اعدادات حساب المنصة">
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
