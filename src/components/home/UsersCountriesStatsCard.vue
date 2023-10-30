<script setup lang="ts">
import type { UsersCountriesStatsItem } from '@/modules/statistics/interfaces/General'
/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
// #endregion

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(
  defineProps<{
    title: string
    data: UsersCountriesStatsItem[]
  }>(),
  {},
)
// #endregion
</script>

<template>
  <VCard title="المستخدمين حسب الدول" class="h-100" flat border>
    <div style="overflow: auto; max-block-size: 315px">
      <VCardText>
        <VList class="card-list" v-if="data.length">
          <VListItem v-for="country in data" :key="country.id">
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
                  :icon="country.percentage > 0 ? 'tabler-chevron-up' : 'tabler-chevron-down'"
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
</template>
