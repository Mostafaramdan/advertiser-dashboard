<script setup lang="ts">
import type { AdvertiserStatsData } from '@/interfaces/Advertiser'
import { advertisersService } from '@/services/AdvertisersService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const route = useRoute()
const isLoading = ref<boolean>(false)
const data = ref<AdvertiserStatsData | null>(null)
const advertiserId: number = +route.params.id
// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed

const statsData = computed(() => {
  if (!data.value) return null
  const {
    statistics,
    statistics_ads_request,
    statistics_ads,
    statistics_coupons,
    statistics_Tickets_And_coupons,
  } = data.value
  return {
    accountsSummary: [
      {
        label: 'حجم المبيعات',
        value: `${statistics.sales_volume} ريال`,
      },
      {
        label: 'مدفوع داخل المنصة',
        value: `${statistics.sales_in_platform} ريال`,
      },
      {
        label: 'مدفوع خارج المنصة',
        value: `${statistics.sales_out_platform} ريال`,
      },
      {
        label: 'مجموع الشحن',
        value: `${statistics.charge_total} ريال`,
      },
      {
        label: 'مجموع المسحوبات',
        value: `${statistics.total_withdraw} ريال`,
      },
      {
        label: 'مجموع المرتجعات',
        value: `${statistics.total_refunds} ريال`,
      },
      {
        label: 'رصيد المحفظة الحالي',
        value: `${statistics.current_total_wallet} ريال`,
      },
      {
        label: 'مجموع النقاط المكتسبة',
        value: `${statistics.total_points_earned} نقطة`,
      },
      {
        label: 'مجموع النقاط المحولة',
        value: `${statistics.total_points_transferred} نقطة`,
      },
      {
        label: 'مجموع النقاط الضائعة',
        value: `${statistics.wasted_points} نقطة`,
      },
      {
        label: 'مجموع قيمة النقاط المستخدمة',
        value: `${statistics.total_point_values_used} نقطة`,
      },
      {
        label: 'مجموع المكافات المحصلة',
        value: `${statistics.total_prizes} ريال`,
      },
    ],
    adsRequestsSummary: [
      {
        label: 'مجموع عدد طلبات الاعلانات',
        value: `${statistics_ads_request.total_ads_request} طلب`,
      },
      {
        label: 'طلبات قيد التنفيذ',
        value: `${statistics_ads_request.in_progress_ads_requests} طلب`,
      },
      {
        label: 'طلبات منتهية',
        value: `${statistics_ads_request.finished_ads_requests} طلب`,
      },
      {
        label: 'طلبات مرفوضة من التاجر',
        value: `${statistics_ads_request.refused_ads_requests_by_client} طلب`,
      },
      {
        label: 'طلبات مرفوضة من المعلن',
        value: `${statistics_ads_request.refused_ads_requests_by_advertiser} طلب`,
      },
      {
        label: 'طلبات ملغية من التاجر',
        value: `${statistics_ads_request.cancelled_ads_requests_by_client} طلب`,
      },
      {
        label: 'طلبات ملغية من المعلن',
        value: `${statistics_ads_request.cancelled_ads_requests_by_advertiser} طلب`,
      },
      {
        label: 'طلبات قيد التنازع',
        value: `${statistics_ads_request.disputed_ads_request} طلب`,
      },
      {
        label: 'مجموع تعليقات إعلانات الطلبات',
        value: `${statistics_ads_request.ads_request_comments_count} تعليق`,
      },
      {
        label: 'مجموع الردود علي التعليقات',
        value: `${statistics_ads_request.ads_request_replies_count} رد`,
      },
    ],
    adsSummary: [
      {
        label: 'مجموع عدد مرات الاعلان',
        value: `${statistics_ads.total_ads} اعلان`,
      },
      {
        label: 'اعلانات مباشرة',
        value: `${statistics_ads.total_direct_ads} اعلان`,
      },
      {
        label: 'اعلانات غير مباشرة',
        value: `${statistics_ads.total_inDirect_ads} اعلان`,
      },
      {
        label: 'عدد مشاهدات الاعلانات',
        value: `${statistics_ads.total_views}`,
      },
      {
        label: 'عدد البلاغات',
        value: `${statistics_ads.total_reports} بلاغ`,
      },
      {
        label: 'متوسط البلاغات',
        value: `${statistics_ads.average_reports}`,
      },
      {
        label: 'عدد التقيمات',
        value: `${statistics_ads.total_rats} تقييم `,
      },
      {
        label: 'متوسط تقييمات الاعلانات',
        value: `${statistics_ads.average_rats} تقييم`,
      },
    ],
    couponsSummary: [
      {
        label: 'مجموع كوبونات الطلبات',
        value: `${statistics_coupons.total_ads_request_coupons} كوبون`,
      },
      {
        label: 'مجموع كوبونات المتاجر / كوبوناتي',
        value: `${statistics_coupons.total_my_coupons} كوبون`,
      },
      {
        label: 'الكوبونات النشطة',
        value: `${statistics_coupons.active_coupons} كوبون`,
      },
      {
        label: 'الكوبونات الغير نشطة',
        value: `${statistics_coupons.inActive_coupons} كوبون`,
      },
      {
        label: 'مجموع الذهاب للمتاجر',
        value: `${statistics_coupons.total_goes_coupons} مرة`,
      },
      {
        label: 'مجموع مرات نسخ الكوبون',
        value: `${statistics_coupons.total_copies} مرة`,
      },
      {
        label: 'مرات استخدام كوبونات المنصة',
        value: `${statistics_coupons.total_uses} مرة`,
      },
      {
        label: 'مجموع استخدام كوبونات المنصة',
        value: `${statistics_coupons.total_using_platform_coupons} مرة`,
      },
      {
        label: 'كوبونات المنصة المفعلة حاليا',
        value: `${statistics_coupons.total_active_platform_coupons} كوبون`,
      },
    ],
    ticketsSummary: [
      {
        label: 'مجموع التذاكر',
        value: `${statistics_Tickets_And_coupons.total_tickets} تذكرة`,
      },
      {
        label: 'تذاكر نشطة',
        value: `${statistics_Tickets_And_coupons.total_active_tickets} تذكرة`,
      },
      {
        label: 'طلبات تنازع منتهية / شاكي',
        value: `${statistics_Tickets_And_coupons.total_finished_as_disputer} طلب`,
      },
      {
        label: 'طلبات تنازع منتهية / مشكي',
        value: `${statistics_Tickets_And_coupons.total_finished_as_disputed} طلب`,
      },
      {
        label: 'طلبات تنازع قيد التداول',
        value: `${statistics_Tickets_And_coupons.total_active_disputes} طلب`,
      },
    ],
  }
})

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
getPageData()

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function getPageData() {
  isLoading.value = true
  advertisersService
    .getStatistics(advertiserId)
    .then((res) => {
      data.value = res.data.data
    })
    .finally(() => {
      isLoading.value = false
    })
}
// #endregion
</script>

<template>
  <section class="details-tab" v-loading="isLoading" style="min-block-size: 200px">
    <VRow v-if="statsData">
      <VCol cols="12" lg="4">
        <StatsCard title="ملخص الاعلانات" :stats="statsData.adsSummary" />
        <StatsCard title="ملخص الكوبونات" :stats="statsData.couponsSummary" />
      </VCol>
      <VCol cols="12" lg="4">
        <StatsCard title="ملخص الحسابات" :stats="statsData.accountsSummary" />
        <StatsCard title="ملخص التذاكر والتنازع" :stats="statsData.ticketsSummary" />
      </VCol>
      <VCol cols="12" lg="4">
        <StatsCard title="ملخص الطلبات والاعلانات" :stats="statsData.adsRequestsSummary" />
      </VCol>
    </VRow>
  </section>
</template>
