<script setup lang="ts">
import type { StatsTableListItem } from '../interfaces/Statistics'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(
  defineProps<{
    stats: StatsTableListItem[]
    title?: string
  }>(),
  {
    title: 'الاحصائيات',
  },
)
// #endregion
</script>

<template>
  <VExpansionPanels :model-value="0">
    <VExpansionPanel>
      <VExpansionPanelTitle>{{ title }}</VExpansionPanelTitle>
      <VExpansionPanelText>
        <div class="overflow-auto">
          <table class="stats-table">
            <tbody>
              <tr v-for="(item, index) in stats" :key="index">
                <td style="min-width: 145px">
                  {{ item.title }}
                </td>
                <td>
                  <span
                    v-if="item.hasOwnProperty('percentage')"
                    :class="{
                      'text-error': item.percentage < 0,
                      'text-success': item.percentage >= 0,
                    }"
                    >{{ item.percentage }}%</span
                  >
                </td>
                <td>
                  <div class="d-flex gap-2 justify-end text-primary">
                    {{ item.value }}
                    <!-- TODO: ADD ICON FROM DATA -->
                    <VIcon icon="tabler-license" size="20" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </VExpansionPanelText>
    </VExpansionPanel>
  </VExpansionPanels>
</template>

<style lang="scss" scoped>
.stats-table {
  border-spacing: 7px;
  inline-size: 100%;

  td {
    padding: 5px;
    background: rgba(var(--v-theme-grey-300), 0.2);
    font-size: 14px;
    font-weight: 500;

    &:last-of-type {
      background: rgba(var(--v-theme-grey-300), 0.45);
    }
  }
}
</style>
