<script setup lang="ts">
import type { AdvertiserStat } from '../interfaces/Coupons'
/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(
  defineProps<{
    stats: AdvertiserStat[]
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
  'عدد المتاجر',
  'عدد الكوبونات',
  'عدد مرات النسخ',
  'عدد مرات الذهاب',
  'عدد مرات المشاركة',
  'عدد مرات الإعجاب ',
  'عدد مرات عدم الإعجاب',
]
// #endregion
</script>

<template>
  <VExpansionPanels :model-value="0" class="mt-5">
    <VExpansionPanel>
      <VExpansionPanelTitle>المعلنين</VExpansionPanelTitle>
      <VExpansionPanelText>
        <v-table class="simple-table" density="compact" v-if="stats.length">
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
                <span class="max-width-180">{{ item.user }}</span>
              </td>
              <td>{{ item.stores }}</td>
              <td>{{ item.count }}</td>
              <td>{{ item.copies }}</td>
              <td>{{ item.goes }}</td>
              <td>{{ item.shares }}</td>
              <td>{{ item.likes }}</td>
              <td>{{ item.dislikes }}</td>
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
