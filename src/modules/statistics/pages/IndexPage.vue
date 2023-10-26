<script setup lang="ts">
const stats = [
  {
    icon: 'tabler-user-plus',
    color: 'primary',
    title: 'الاشتراكات',
    to: { name: 'subscriptions-statistics' },
  },
  {
    icon: 'tabler-package',
    color: 'primary',
    title: 'الباقات',
    to: { name: 'packages-statistics' },
  },
  {
    icon: 'tabler-user-dollar',
    color: 'primary',
    title: 'المشتركين',
    to: { name: 'subscribers-statistics' },
  },
  {
    icon: 'tabler-user',
    color: 'primary',
    title: 'المستخدمين',
    to: { name: 'users-statistics' },
  },
  {
    icon: 'tabler-user-question',
    color: 'primary',
    title: 'الزوار',
    to: { name: 'guests-statistics' },
  },
  {
    icon: 'tabler-users-group',
    color: 'primary',
    title: 'الدخول العام',
    to: { name: 'visits-statistics' },
  },
  {
    icon: 'tabler-ad-2',
    color: 'primary',
    title: 'الإعلانات',
    to: { name: 'ads-statistics' },
  },
  {
    icon: 'tabler-discount-2',
    color: 'primary',
    title: 'الكوبونات',
    to: { name: 'coupons-statistics' },
  },
  {
    icon: 'tabler-file-check',
    color: 'primary',
    title: 'الطلبات',
    to: { name: 'requests-statistics' },
  },
  {
    icon: 'tabler-license',
    color: 'primary',
    title: 'الوثائق والتراخيص',
    to: { name: 'documents-statistics' },
  },
  {
    icon: 'tabler-wallet',
    color: 'primary',
    title: 'المحافظ و الدفع الالكترونى',
    // to: null,
  },
  {
    icon: 'tabler-gift',
    color: 'primary',
    title: 'النقاط والمكافآت',
    // to: null,
  },
  {
    icon: 'tabler-analyze',
    color: 'primary',
    title: 'طلبات التنازع',
    // to: null,
  },
  {
    icon: 'tabler-ticket',
    color: 'primary',
    title: 'التذاكر',
    // to: null,
  },
]
</script>

<template>
  <VCard title="التقارير" class="page-card">
    <VCardText>
      <VRow>
        <VCol v-for="item in stats" :key="item.title" cols="12" sm="6" md="4" lg="3">
          <VCard class="text-center border" flat>
            <VCardText>
              <VIcon :icon="item.icon" size="38" />
              <h5 class="text-h6 my-4">
                {{ item.title }}
              </h5>
              <VBtn v-if="item.to" :to="item.to" variant="tonal" class="py-2" height="auto"
                >عرض <VIcon end icon="tabler-eye"
              /></VBtn>
              <v-tooltip v-else text="قيد التطوير" location="bottom">
                <template v-slot:activator="{ props }">
                  <VBtn variant="tonal" v-bind="props" class="py-2" height="auto"
                    >عرض <VIcon end icon="tabler-eye"
                  /></VBtn>
                </template>
              </v-tooltip>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
