<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { formatUrl } from '@/helpers/index'
import type { AdvertiserCoupon } from '../interfaces/AdvertiserCoupon'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(defineProps<{ data: AdvertiserCoupon }>(), {})

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
      <VListItem v-if="data.store?.image" class="px-2 py-2" title="صورة الكوبون" border>
        <VImg :src="data.store.image" max-width="100" class="my-2" />
      </VListItem>
      <VListItem title="المعلن" class="px-2 py-2" border>
        <div class="d-flex align-start">
          <div class="d-flex flex-column align-center me-3 py-1">
            <VAvatar size="38" variant="tonal" cover>
              <VImg v-if="data.advertiser.image_path" :src="data.advertiser.image_path" cover />
              <span v-else>!</span>
            </VAvatar>
          </div>
          <div style="word-wrap: break-word">
            {{ data.advertiser.account_name }}
            <span class="text-sm text-disabled d-block">{{ data.advertiser.email }}</span>
            <span class="text-sm text-disabled d-block">{{ data.advertiser.phone }}</span>
          </div>
        </div>
      </VListItem>
      <VListItem class="px-2 py-2" title="كود الكوبون" :subtitle="data.code" border />
      <VListItem class="px-2 py-2" title="الخصم" :subtitle="`${data.discount}%`" border />
      <VListItem class="px-2 py-2" title="حالة الكوبون" :subtitle="data.status_text" border />
      <VListItem class="px-2 py-2" title="الرابط" border>
        <a :href="formatUrl(data.link)" target="_blank" rel="noopener noreferrer">{{
          data.link
        }}</a>
      </VListItem>
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
      <VListItem class="px-2 py-2" title="المتجر" :subtitle="data.store.name" border />
      <VListItem class="px-2 py-2" title="القسم" :subtitle="data.category.label" border />
      <VListItem class="px-2 py-2" title="مرات الاستخدام" :subtitle="data.uses || 0" border />
      <VListItem class="px-2 py-2" title="التقييم" border>
        <div class="d-flex flex-wrap gap-x-5">
          <div class="text-center mt-2">
            <VIcon icon="tabler-thumb-down" size="25" class="mx-auto" />
            <span class="d-block">{{ data.dislikes_count }}</span>
          </div>
          <div class="text-center mt-2">
            <VIcon icon="tabler-thumb-up" size="25" class="mx-auto" />
            <span class="d-block">{{ data.likes_count }}</span>
          </div>
        </div>
      </VListItem>
      <VListItem class="px-2 py-2" title="الشير و مرات الذهاب" border>
        <div class="d-flex flex-wrap gap-x-5">
          <div class="text-center mt-2">
            <VIcon icon="tabler-share" size="25" class="mx-auto" />
            <span class="d-block">{{ data.shares_count }}</span>
          </div>
          <div class="text-center mt-2">
            <VIcon icon="tabler-eye" size="25" class="mx-auto" />
            <span class="d-block">{{ data.goes_count }}</span>
          </div>
        </div>
      </VListItem>
      <VListItem class="px-2 py-2" title="الوصف" :subtitle="data.description" border />
    </VList>
    <AppSwitch :model-value="data.is_active" label="الحالة" name="is_active" />
  </div>
</template>
