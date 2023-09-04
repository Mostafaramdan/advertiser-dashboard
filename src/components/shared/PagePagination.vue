<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import type { PagePaginationProps } from '@/interfaces/Shared'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props

const props = withDefaults(defineProps<PagePaginationProps>(), {})

// #endregion

/***************************************
 **** Section Emits Declaration ********
 **************************************/
// #region Emits
const emit = defineEmits<{
  (e: 'update:page', value: number): void
}>()

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const page = useVModel(props, 'page', emit)

// #endregion
</script>

<template>
  <div v-if="metaData && metaData.last_page > 1" class="page-pagination">
    <VPagination
      v-model="page"
      total-visible="4"
      :length="metaData.last_page"
      class="pt-5 pb-0"
      @update:model-value="getPageData"
    />
  </div>
</template>
