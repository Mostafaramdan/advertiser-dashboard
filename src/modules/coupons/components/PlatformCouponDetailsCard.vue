<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import type { PlatformCoupon } from '../interfaces/PlatformCoupon'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(defineProps<{ data: PlatformCoupon }>(), {})

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { formatDate } = UseGeneralHelpers()

// #endregion
</script>

<template>
  <div>
    <VList :lines="false" class="pt-0">
      <VListItem v-if="data.image?.path" class="px-2 py-2" title="صورة الكوبون" border>
        <VImg :src="data.image.path" max-width="100" class="my-2 border" />
      </VListItem>
      <VListItem class="px-2 py-2" title="كود الكوبون" :subtitle="data.code" border />
      <VListItem class="px-2 py-2" title="الخصم" :subtitle="`${data.discount}%`" border />
      <VListItem
        class="px-2 py-2"
        title="تاريخ البداية"
        :subtitle="formatDate(data.started_at)"
        border
      />
      <VListItem
        class="px-2 py-2"
        title="تاريخ النهاية"
        :subtitle="formatDate(data.ended_at)"
        border
      />
      <VListItem class="px-2 py-2" title="مرات الاستخدام" :subtitle="data.uses || 0" border />
      <VListItem
        class="px-2 py-2"
        title="نسبة تحمل المسوق"
        :subtitle="`${data.marketer_ratio}%`"
        border
      />
      <VListItem class="px-2 py-2" title="الوصف" :subtitle="data.description" border />
    </VList>
    <AppSwitch :model-value="data.is_active" label="الحالة" name="is_active" />
  </div>
</template>
