<script setup lang="ts">
import { RouterView } from 'vue-router'
/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions

// #endregion
</script>

<template>
  <section class="reports-container">
    <RouterView />
  </section>
</template>

<style lang="scss" scoped>
.reports-container {
  :deep(.v-card-item) {
    padding-block-end: 10px;
  }

  :deep(.v-card-title),
  :deep(.v-expansion-panel-title) {
    font-size: 1rem;
  }

  // :deep(.simple-table > .v-table__wrapper) {
  //   max-block-size: 75vh;
  // }
}
</style>
