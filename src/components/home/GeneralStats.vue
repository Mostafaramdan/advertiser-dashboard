<script setup lang="ts">
import type { GeneralStatsData } from '@/modules/statistics/interfaces/General'
import { statisticsService } from '@/modules/statistics/services/StatisticsService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const advertisersTableHeadings = ['المعلن', 'عدد الطلبات', 'عدد الاعلانات']
const isLoading = ref<boolean>(false)
const data = ref<GeneralStatsData | null>(null)
const params = reactive({
  from_date: null,
  to_date: null,
})
// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const generalStats = computed(() => {
  if (!data.value) return []
  const { stats } = data.value
  return [
    {
      title: 'المعلنين',
      stats: stats.advertisers,
      icon: 'tabler-user',
      color: 'primary',
    },
    {
      title: 'المستخدمين',
      stats: stats.users,
      icon: 'tabler-user',
      color: 'info',
    },
    {
      title: 'الإعلانات',
      stats: stats.ads,
      icon: 'tabler-ad-2',
      color: 'error',
    },
    {
      title: 'الاشتراكات',
      stats: stats.subscriptions,
      icon: 'tabler-package',
      color: 'dark',
    },
    {
      title: 'المشتركين',
      stats: stats.subscribers,
      icon: 'tabler-user-dollar',
      color: 'success',
    },
    {
      title: 'كوبونات المتاجر',
      stats: stats.stores_coupons,
      icon: 'tabler-discount-2',
      color: 'primary',
    },
    {
      title: 'كوبونات الطلبات',
      stats: stats.ads_requests_coupons,
      icon: 'tabler-discount-2',
      color: 'warning',
    },
    {
      title: 'الطلبات',
      stats: stats.ads_requests,
      icon: 'tabler-file-check',
      color: 'info',
    },
    {
      title: 'طلبات التنازع',
      stats: stats.disputes,
      icon: 'tabler-analyze',
      color: 'error',
    },
    {
      title: 'التذاكر',
      stats: stats.tickets,
      icon: 'tabler-ticket',
      color: 'warning',
    },
    {
      title: 'بلاغات الإعلانات',
      stats: stats.ads_reports,
      icon: 'tabler-alert-hexagon',
      color: 'dark',
    },
    {
      title: 'بلاغات المعلنين',
      stats: stats.advertisers_reports,
      icon: 'tabler-alert-hexagon',
      color: 'success',
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
    .getGeneralStats(params)
    .then((res: any) => {
      data.value = res.data.data
    })
    .finally(() => {
      isLoading.value = false
    })
}
// #endregion
</script>

<template>
  <VExpansionPanels class="expansion-panels-width-border" :model-value="0">
    <VExpansionPanel elevation="0">
      <VExpansionPanelTitle>احصائيات عامة</VExpansionPanelTitle>
      <VExpansionPanelText>
        <VCard class="mb-3" flat border>
          <VCardText class="pa-3">
            <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between gap-4">
              <h4>حدد القيم المناسبة لاظهار النتائج</h4>
              <div class="flex-grow-1">
                <AppDateTimePicker
                  v-model="params.from_date"
                  placeholder="من"
                  clearable
                  prepend-inner-icon="tabler-calendar"
                  :config="{ disableMobile: true, maxDate: new Date(), onChange: () => getData() }"
                />
              </div>
              <div class="flex-grow-1">
                <AppDateTimePicker
                  v-model="params.to_date"
                  placeholder="الي"
                  clearable
                  prepend-inner-icon="tabler-calendar"
                  :config="{ disableMobile: true, maxDate: new Date(), onChange: () => getData() }"
                />
              </div>
            </div>
          </VCardText>
        </VCard>
        <div v-loading="isLoading" style="min-block-size: 250px">
          <template v-if="data">
            <VRow class="my-0">
              <VCol cols="12" lg="5" class="py-0 mb-4">
                <VCard title="إحصائات عامة" flat border class="h-100">
                  <VCardText>
                    <VRow>
                      <VCol
                        v-for="item in generalStats"
                        :key="item.title"
                        cols="12"
                        sm="6"
                        md="4"
                        lg="6"
                      >
                        <div class="d-flex align-center gap-4">
                          <VAvatar :color="item.color" variant="tonal" size="42">
                            <VIcon :icon="item.icon" />
                          </VAvatar>

                          <div class="d-flex flex-column">
                            <span class="text-h6 font-weight-medium">{{ item.stats }}</span>
                            <span class="text-sm">
                              {{ item.title }}
                            </span>
                          </div>
                        </div>
                      </VCol>
                    </VRow>
                  </VCardText>
                </VCard>
              </VCol>
              <VCol cols="12" lg="7" class="py-0 mb-4">
                <VCard title="أعلى المعلنين طلبا" class="h-100" flat border>
                  <VDivider />
                  <div style="overflow: auto; max-block-size: 390px">
                    <VTable class="text-no-wrap" v-if="data.top_advertisers.length">
                      <thead>
                        <tr>
                          <th
                            class="font-weight-medium"
                            v-for="(title, index) in advertisersTableHeadings"
                            :key="index"
                          >
                            {{ title }}
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr v-for="advertiser in data.top_advertisers" :key="advertiser.id">
                          <td style="padding-block: 0.65rem">
                            <div class="d-flex align-center text-wrap">
                              <div class="d-flex flex-column align-center me-3 py-1">
                                <VAvatar size="38" variant="tonal" cover>
                                  <VImg
                                    v-if="advertiser.image_path"
                                    :src="advertiser.image_path"
                                    cover
                                  />
                                  <span v-else>!</span>
                                </VAvatar>
                              </div>
                              <div class="advertiser-name">
                                {{ advertiser.username }}
                              </div>
                            </div>
                          </td>
                          <td>
                            <p class="font-weight-medium mb-0">{{ advertiser.ads_count }}</p>
                          </td>
                          <td>
                            <span class="font-weight-medium">{{ advertiser.requests_count }}</span>
                          </td>
                        </tr>
                      </tbody>
                    </VTable>
                    <VCardText v-else>
                      <div class="text-h6">
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
.advertiser-name {
  @include max-lines(1);

  max-inline-size: 200px;
  min-inline-size: 150px;
}

.v-table {
  th {
    letter-spacing: normal;
  }

  tbody {
    td {
      font-size: 14px;
    }

    tr:not(:last-child) {
      td {
        border: none !important;
      }
    }
  }
}
</style>
