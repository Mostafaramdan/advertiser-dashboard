<script setup lang="ts">
import DonutChart from '@/modules/statistics/components/DonutChart.vue'
import StatsFilter from '@/modules/statistics/components/StatsFilter.vue'
import type { MonthlyStatsData } from '@/modules/statistics/interfaces/General'
import { statisticsService } from '@/modules/statistics/services/StatisticsService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const isLoading = ref<boolean>(false)
const data = ref<MonthlyStatsData | null>(null)
const params = reactive({
  year: new Date().getFullYear(),
  period: null,
})
// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const reportsStats = computed(() => {
  if (!data.value) return []
  const { reports } = data.value
  return [
    {
      avatarColor: 'primary',
      avatarIcon: 'tabler-ad-2',
      title: 'بلاغات الإعلانات',
      count: reports.ads,
      statsColor: 'success',
    },
    {
      avatarColor: 'info',
      avatarIcon: 'tabler-user-dollar',
      title: 'بلاغات المعلنين',
      count: reports.advertisers,
      statsColor: 'success',
    },
    {
      avatarColor: 'error',
      avatarIcon: 'tabler-message',
      title: 'بلاغات الشات',
      count: reports.chats,
      statsColor: 'error',
    },
    {
      avatarColor: 'dark',
      avatarIcon: 'tabler-users',
      title: 'حظر المحتوى الإعلاني',
      count: reports.ads_content,
      statsColor: 'success',
    },
  ]
})
// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
getData()

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function getData() {
  isLoading.value = true
  statisticsService
    .getMonthlyStats(params)
    .then((res: any) => {
      data.value = res.data.data
    })
    .finally(() => {
      isLoading.value = false
    })
}

function onApplyFilter(filters: any) {
  Object.assign(params, { ...filters })
  getData()
}
// #endregion
</script>

<template>
  <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
    <VExpansionPanel elevation="0">
      <VExpansionPanelTitle>احصائيات شهرية</VExpansionPanelTitle>
      <VExpansionPanelText>
        <div class="filter">
          <StatsFilter border flat :init-filters="params" @apply-filter="onApplyFilter" />
        </div>
        <div v-loading="isLoading" style="min-block-size: 250px">
          <template v-if="data">
            <VRow class="my-0">
              <VCol cols="12" md="6" class="py-0 mb-4">
                <DonutChart
                  title="الطلبات"
                  :height="$vuetify.display.smAndDown ? 350 : 220"
                  :labels="data.requests.labels"
                  :series="data.requests.series"
                  class="h-100"
                  flat
                  border
                />
              </VCol>

              <VCol cols="12" md="6" class="py-0 mb-4">
                <VCard title="البلاغات" class="h-100" flat border>
                  <VCardText>
                    <VList class="card-list">
                      <VListItem class="mt-md-2" v-for="item in reportsStats" :key="item.title">
                        <template #prepend>
                          <VAvatar :color="item.avatarColor" variant="tonal" size="34" rounded>
                            <VIcon :icon="item.avatarIcon" />
                          </VAvatar>
                        </template>

                        <VListItemTitle class="font-weight-medium">
                          {{ item.title }}
                        </VListItemTitle>

                        <template #append>
                          <span class="font-weight-medium text-medium-emphasis">{{
                            item.count
                          }}</span>
                        </template>
                      </VListItem>
                    </VList>
                  </VCardText>
                </VCard>
              </VCol>

              <VCol cols="12" md="6" class="py-0 mb-4">
                <VCard title="المعلنين حسب الدول" class="h-100" flat border>
                  <div style="overflow: auto; max-block-size: 315px">
                    <VCardText>
                      <VList class="card-list" v-if="data.advertisers_countries.length">
                        <VListItem v-for="country in data.advertisers_countries" :key="country.id">
                          <template #prepend>
                            <VAvatar size="34" color="secondary" :image="country.image_path" />
                          </template>

                          <VListItemTitle class="font-weight-medium">
                            {{ country.count }}
                          </VListItemTitle>
                          <VListItemSubtitle>
                            {{ country.name }}
                          </VListItemSubtitle>

                          <template #append>
                            <div
                              :class="`d-flex align-center font-weight-medium ${
                                country.percentage > 0 ? 'text-success' : 'text-error'
                              }`"
                            >
                              <VIcon
                                :icon="
                                  country.percentage > 0
                                    ? 'tabler-chevron-up'
                                    : 'tabler-chevron-down'
                                "
                                size="18"
                                class="me-1"
                              />
                              <span>{{ Math.abs(country.percentage) }}%</span>
                            </div>
                          </template>
                        </VListItem>
                      </VList>
                      <div v-else class="text-h6">
                        {{ t('general.no_data') }}
                      </div>
                    </VCardText>
                  </div>
                </VCard>
              </VCol>

              <VCol cols="12" md="6" class="py-0 mb-4">
                <VCard title="المستخدمين حسب الدول" class="h-100" flat border>
                  <div style="overflow: auto; max-block-size: 315px">
                    <VCardText>
                      <VList class="card-list" v-if="data.users_countries.length">
                        <VListItem v-for="country in data.users_countries" :key="country.id">
                          <template #prepend>
                            <VAvatar size="34" color="secondary" :image="country.image_path" />
                          </template>

                          <VListItemTitle class="font-weight-medium">
                            {{ country.count }}
                          </VListItemTitle>
                          <VListItemSubtitle>
                            {{ country.name }}
                          </VListItemSubtitle>

                          <template #append>
                            <div
                              :class="`d-flex align-center font-weight-medium ${
                                country.percentage > 0 ? 'text-success' : 'text-error'
                              }`"
                            >
                              <VIcon
                                :icon="
                                  country.percentage > 0
                                    ? 'tabler-chevron-up'
                                    : 'tabler-chevron-down'
                                "
                                size="18"
                                class="me-1"
                              />
                              <span>{{ Math.abs(country.percentage) }}%</span>
                            </div>
                          </template>
                        </VListItem>
                      </VList>
                      <div v-else class="text-h6">
                        {{ t('general.no_data') }}
                      </div>
                    </VCardText>
                  </div>
                </VCard>
              </VCol>
            </VRow>
          </template>
        </div>
      </VExpansionPanelText>
    </VExpansionPanel>
  </VExpansionPanels>
</template>

<style lang="scss" scoped>
.filter {
  :deep(.v-card-text) {
    padding: 12px;
  }
}
</style>
