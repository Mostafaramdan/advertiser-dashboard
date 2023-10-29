<script setup lang="ts">
import DailyStats from '@/components/home/DailyStats.vue'
import GeneralStats from '@/components/home/GeneralStats.vue'
import MonthlyStats from '@/components/home/MonthlyStats.vue'
</script>

<template>
  <div>
    <DailyStats />
    <MonthlyStats />
    <GeneralStats />
  </div>
</template>

<style lang="scss" scoped>
:deep(.v-card-item) {
  padding-block: 15px 10px;
}

:deep(.v-card-title) {
  font-size: 1rem;
}

:deep(.v-card .v-card-text) {
  padding-block-end: 20px;
}
</style>
