<script setup lang="ts">
const filters = reactive({
  from_date: new Date(),
  to_date: new Date(),
})

const statistics = [
  {
    title: 'المعلنين',
    stats: '200',
    icon: 'tabler-user',
    color: 'primary',
  },
  {
    title: 'المستخدمين',
    stats: '300',
    icon: 'tabler-user',
    color: 'info',
  },
  {
    title: 'الإعلانات',
    stats: '600',
    icon: 'tabler-ad-2',
    color: 'error',
  },
  {
    title: 'الحسابات',
    stats: '450',
    icon: 'tabler-users',
    color: 'warning',
  },
  {
    title: 'الاشتراكات',
    stats: '380',
    icon: 'tabler-package',
    color: 'dark',
  },
  {
    title: 'المشتركين',
    stats: '450',
    icon: 'tabler-user-dollar',
    color: 'success',
  },

  {
    title: 'كوبونات المتاجر',
    stats: '200',
    icon: 'tabler-discount-2',
    color: 'primary',
  },
  {
    title: 'الطلبات',
    stats: '300',
    icon: 'tabler-file-check',
    color: 'info',
  },
  {
    title: 'طلبات التنازع',
    stats: '600',
    icon: 'tabler-analyze',
    color: 'error',
  },
  {
    title: 'التذاكر',
    stats: '450',
    icon: 'tabler-ticket',
    color: 'warning',
  },
  {
    title: 'بلاغات الإعلانات',
    stats: '380',
    icon: 'tabler-alert-hexagon',
    color: 'dark',
  },
  {
    title: 'بلاغات المعلنين',
    stats: '450',
    icon: 'tabler-alert-hexagon',
    color: 'success',
  },
]
</script>

<template>
  <section class="pb-4">
    <VCard class="mb-4" title="منصة بي ترند 🚀">
      <VCardText>لوحة تحكم منصة بي ترند</VCardText>
    </VCard>
    <VCard>
      <VCardText>
        <div class="d-flex flex-column flex-md-row align-md-center gap-4">
          <h3>لوحة التحكم</h3>
          <div class="flex-grow-1">
            <AppDateTimePicker
              v-model="filters.from_date"
              placeholder="من"
              clearable
              prepend-inner-icon="tabler-calendar"
              :config="{ disableMobile: true, maxDate: new Date() }"
            />
          </div>
          <div class="flex-grow-1">
            <AppDateTimePicker
              v-model="filters.to_date"
              placeholder="الي"
              clearable
              prepend-inner-icon="tabler-calendar"
              :config="{ disableMobile: true, maxDate: new Date() }"
            />
          </div>
        </div>
      </VCardText>
    </VCard>

    <VCard title="إحصائات عامة" class="mt-4">
      <VCardText>
        <VRow>
          <VCol v-for="item in statistics" :key="item.title" cols="6" md="3" lg="2">
            <div class="d-flex align-center gap-4">
              <VAvatar :color="item.color" variant="tonal" size="42">
                <VIcon :icon="item.icon" />
              </VAvatar>

              <div class="d-flex flex-column">
                <span class="text-h5 font-weight-medium">{{ item.stats }}</span>
                <span class="text-sm">
                  {{ item.title }}
                </span>
              </div>
            </div>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </section>
</template>
