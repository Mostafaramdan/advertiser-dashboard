<script setup lang="ts">
import type { TopRequestsFromAdvertiser } from '../interfaces/Requests'
/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(
  defineProps<{
    stats: TopRequestsFromAdvertiser[]
  }>(),
  {},
)
// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const tableHeadings = [
  'اسم المعلن',
  'الدولة',
  'المنطقة',
  'عدد طلباته كعميل',
  'عدد طلبات العملاء منه',
  'الطلبات كعميل',
  'الطلبات كمعلن',
  'قيمة المكافآت',
]
// #endregion
</script>

<template>
  <VExpansionPanels :model-value="0" class="mt-5">
    <VExpansionPanel>
      <VExpansionPanelTitle>المعلنين الأكثر عدد طلبات مكتملة</VExpansionPanelTitle>
      <VExpansionPanelText>
        <v-table fixed-header class="simple-table" density="compact" v-if="stats.length">
          <thead>
            <tr>
              <th v-for="item in tableHeadings" :key="item">
                {{ item }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in stats" :key="item.id">
              <td>
                <router-link
                  :to="{
                    name: 'advertisers-profile-page',
                    params: { id: item.id },
                    query: { tab: 'details' },
                  }"
                >
                  <span class="max-width-180">{{ item.name }}</span>
                </router-link>
              </td>
              <td>
                <span class="d-flex align-center gap-2">
                  <img
                    :src="item.country.image"
                    alt="country flag"
                    width="24"
                    style="min-inline-size: 24px"
                  />
                  <span>{{ item.country.name }}</span>
                </span>
              </td>
              <td>{{ item.area }}</td>
              <td>{{ item.requests_as_client || '-' }}</td>
              <td>{{ item.requests_as_advertiser || '-' }}</td>
              <td style="max-inline-size: unset">
                <div>
                  <div class="d-flex align-center gap-2">
                    <strong style="min-inline-size: 155px; text-align: initial"
                      >قيمة الدفع داخل المنصة</strong
                    >
                    <span>{{ item.as_client.payments_in }}</span>
                  </div>
                  <div class="d-flex align-center gap-2">
                    <strong style="min-inline-size: 155px; text-align: initial"
                      >قيمة المدفوعات خارج المنصة</strong
                    >
                    <span>{{ item.as_client.payments_out }}</span>
                  </div>
                  <div class="d-flex align-center gap-2">
                    <strong style="min-inline-size: 155px; text-align: initial"
                      >إجمالي قيمة الخصومات</strong
                    >
                    <span>{{ item.as_client.discounts_total }}</span>
                  </div>
                  <div class="d-flex align-center gap-2">
                    <strong style="min-inline-size: 155px; text-align: initial">خصم مكتسب</strong>
                    <span>{{ item.as_client.discounts_app }}</span>
                  </div>
                  <div class="d-flex align-center gap-2">
                    <strong style="min-inline-size: 155px; text-align: initial">خصم خاص </strong>
                    <span>{{ item.as_client.discounts_bill }}</span>
                  </div>
                </div>
              </td>
              <td>
                <div>
                  <div class="d-flex align-center gap-2">
                    <strong style="min-inline-size: 155px; text-align: initial"
                      >قيمة الدفع داخل المنصة</strong
                    >
                    <span>{{ item.as_advertiser.payments_in }}</span>
                  </div>
                  <div class="d-flex align-center gap-2">
                    <strong style="min-inline-size: 155px; text-align: initial"
                      >قيمة المدفوعات خارج المنصة</strong
                    >
                    <span>{{ item.as_advertiser.payments_out }}</span>
                  </div>
                  <div class="d-flex align-center gap-2">
                    <strong style="min-inline-size: 155px; text-align: initial"
                      >إجمالي قيمة الخصومات</strong
                    >
                    <span>{{ item.as_advertiser.discounts_total }}</span>
                  </div>
                  <div class="d-flex align-center gap-2">
                    <strong style="min-inline-size: 155px; text-align: initial">خصم مكتسب</strong>
                    <span>{{ item.as_advertiser.discounts_app }}</span>
                  </div>
                  <div class="d-flex align-center gap-2">
                    <strong style="min-inline-size: 155px; text-align: initial">خصم خاص </strong>
                    <span>{{ item.as_advertiser.discounts_bill }}</span>
                  </div>
                </div>
              </td>
              <td>
                <div>
                  <div class="d-flex align-center gap-2">
                    <strong style="min-inline-size: 85px; text-align: initial">مكافآت مقدمة</strong>
                    <span>{{ item.prizes_to }}</span>
                  </div>
                  <div class="d-flex align-center gap-2">
                    <strong style="min-inline-size: 85px; text-align: initial"
                      >مكافآت مستلمة</strong
                    >
                    <span>{{ item.prizes_from }}</span>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </v-table>
        <div v-else class="text-h6">
          {{ t('general.no_data') }}
        </div>
      </VExpansionPanelText>
    </VExpansionPanel>
  </VExpansionPanels>
</template>
