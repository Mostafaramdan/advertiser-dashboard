<script setup lang="ts">
import { PaymentStatsCardProps } from '@/modules/statistics/interfaces/General'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(
  defineProps<{
    stats: PaymentStatsCardProps
  }>(),
  {},
)
// #endregion
</script>

<template>
  <div>
    <div class="d-flex align-center">
      <VAvatar rounded size="33" :color="stats.color" variant="tonal" class="me-2">
        <VIcon size="25" :icon="stats.icon" />
      </VAvatar>

      <h6 class="text-base font-weight-medium">
        {{ stats.title }}
      </h6>
    </div>
    <h6 class="text-h5 my-2">
      {{ stats.amount }}
    </h6>
    <VProgressLinear
      :model-value="stats.progress"
      :color="stats.color"
      height="6"
      rounded
      rounded-bar
    />
  </div>
</template>
