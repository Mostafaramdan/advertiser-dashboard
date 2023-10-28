<script setup lang="ts">
import DailyReports from '@/components/home/DailyReports.vue'
import DonutChart from '@/modules/statistics/components/DonutChart.vue'

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

const requestsChart = {
  labels: [
    'إجمالي الطلبات',
    'الطلبات الجديدة',
    'الطلبات قيد التنفيذ',
    'الطلبات الملغية',
    'الطلبات بإنتظار الدفع',
  ],
  series: [85, 16, 50, 50, 22],
}

const coursesData = [
  {
    title: 'Videography Basic Design Course',
    views: '1.2k',
    icon: 'tabler-brand-zoom',
    color: 'primary',
  },
  { title: 'Basic Front-end Development Course', views: '834', icon: 'tabler-code', color: 'info' },
  {
    title: 'Basic Fundamentals of Photography',
    views: '3.7k',
    icon: 'tabler-camera',
    color: 'success',
  },
  {
    title: 'Advance Dribble Base Visual Design',
    views: '2.5k',
    icon: 'tabler-brand-dribbble',
    color: 'warning',
  },
  { title: 'Your First Singing Lesson', views: '948', icon: 'tabler-microphone', color: 'error' },
]
</script>

<template>
  <section class="pb-4">
    <DailyReports />
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

    <VRow>
      <VCol cols="12" lg="6">
        <DonutChart
          title="الطلبات"
          :labels="requestsChart.labels"
          :series="requestsChart.series"
          class="mt-4 h-100"
        />
      </VCol>

      <VCol cols="12" lg="6">
        <VCard class="mt-4 h-100" title="البلاغات">
          <VCardText>
            <VList class="card-list">
              <VListItem v-for="(course, index) in coursesData" :key="index">
                <template #prepend>
                  <VAvatar rounded variant="tonal" :color="course.color">
                    <VIcon :icon="course.icon" size="24" />
                  </VAvatar>
                </template>

                <VListItemTitle class="me-4">
                  <div class="d-flex flex-column">
                    <div class="font-weight-medium text-truncate">
                      {{ course.title }}
                    </div>
                    <div>
                      <VChip variant="tonal" color="secondary" label>
                        {{ course.views }} Views
                      </VChip>
                    </div>
                  </div>
                </VListItemTitle>
              </VListItem>
            </VList>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>

<style lang="scss" scoped>
:deep(.v-expansion-panel) {
  background: transparent;
}

:deep(.v-card-item) {
  padding-block-end: 15px;
}

:deep(.v-card-title) {
  font-size: 1rem;
}
</style>
