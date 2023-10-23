<script setup lang="ts">
import type { TopRequestsFromClient } from '../interfaces/Requests'
/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(
  defineProps<{
    stats: TopRequestsFromClient[]
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
  'الاسم',
  'الدولة',
  'المنطقة',
  'عدد الطلبات',
  'قيمة الدفع داخل المنصة',
  'قيمة المدفوعات خارج المنصة',
  'قيمة الخصومات',
  'قيمة المكافآت',
]
// #endregion
</script>

<template>
  <VExpansionPanels :model-value="0" class="mt-5">
    <VExpansionPanel>
      <VExpansionPanelTitle>العملاء الأكثر طلبا</VExpansionPanelTitle>
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
                    name: 'user-profile-page',
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
                  <span class="ml-50">{{ item.country.name }}</span>
                </span>
              </td>
              <td>{{ item.area }}</td>
              <td>{{ item.requests }}</td>
              <td>{{ item.payments_in }}</td>
              <td>{{ item.payments_out }}</td>
              <td>
                <div>
                  <div class="d-flex align-center gap-2">
                    <strong style="min-inline-size: 75px; text-align: initial">خصم مكتسب</strong>
                    <span>{{ item.discounts_app }}</span>
                  </div>
                  <div class="d-flex align-center gap-2 my-1">
                    <strong style="min-inline-size: 75px; text-align: initial">خصم خاص</strong>
                    <span>{{ item.discounts_bill }}</span>
                  </div>
                  <div class="d-flex align-center gap-2">
                    <strong style="min-inline-size: 75px; text-align: initial">إجمالي</strong>
                    <span>{{ item.discounts_total }}</span>
                  </div>
                </div>
              </td>
              <td>{{ item.prizes }}</td>
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
