<script setup lang="ts">
import type { Store } from '../interfaces/Store'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(defineProps<{ data: Store }>(), {})

// #endregion
</script>

<template>
  <div>
    <VList :lines="false">
      <VListItem v-if="data.image?.path" class="px-2 py-2" title="صورة المتجر" border>
        <VImg :src="data.image.path" max-width="100" class="my-2" />
      </VListItem>
      <VListItem class="px-2 py-2" title="الاسم عربي" :subtitle="data.name.ar" border />
      <VListItem class="px-2 py-2" title="الاسم انجليزي" :subtitle="data.name.en || '-'" border />
    </VList>
    <AppSwitch :model-value="data.from_app" label="معتمد من المنصة" name="from_app" />
    <AppSwitch :model-value="data.is_active" label="الحالة" name="is_active" />
  </div>
</template>
