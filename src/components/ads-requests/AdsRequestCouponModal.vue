<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { formatUrl } from '@/helpers/index'
import { AdsRequestCoupon } from '@/interfaces/AdsRequest'
import { useAuthStore } from '@/stores/AuthStore'
import { useVModel } from '@vueuse/core'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(defineProps<{ showModal: boolean; coupon: AdsRequestCoupon }>(), {
  showModal: false,
})

// #endregion

/***************************************
 **** Section Emits Declaration ********
 **************************************/
// #region Emits
const emit = defineEmits<{
  (e: 'update:showModal', value: boolean): void
}>()

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { hasPermission } = useAuthStore()
const { formatDateTime } = UseGeneralHelpers()
const MODEL_NAME = 'coupons'
const showModal = useVModel(props, 'showModal', emit)
// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const permissions = computed(() => ({
  changeStatus: hasPermission('change_status_ads_request_coupon'),
}))
// #endregion
</script>

<template>
  <VDialog v-model="showModal" max-width="600" persistent scrollable class="form-modal">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="showModal = !showModal" />

    <!-- Dialog Content -->
    <VCard title="عرض الكوبون">
      <VCardText>
        <div class="coupon">
          <div class="d-flex gap-2 flex-wrap flex-sm-nowrap">
            <VAvatar size="80" rounded="0" variant="outlined" cover>
              <VImg v-if="coupon.image_path" :src="coupon.image_path" cover />
              <span v-else>!</span>
            </VAvatar>
            <div class="flex-grow-1">
              <div class="d-flex align-center gap-3 px-2 py-1 rounded border">
                <span class="coupon__code flex-grow-1 text-center">{{ coupon.code }}</span>
                <span class="coupon__discount bg-primary py-1 px-2 rounded d-flex align-center">
                  {{ coupon.discount }}
                  <VIcon icon="tabler-discount-2" size="30" class="ms-1" />
                </span>
              </div>
              <div class="d-flex">
                <ToggleActivationSwitch
                  :id="coupon.id"
                  v-model="coupon.is_active"
                  :model="MODEL_NAME"
                  :disabled="!permissions.changeStatus"
                  :label="coupon.is_active ? 'نشط' : 'غير نشط'"
                />
              </div>
            </div>
          </div>
          <div class="rounded border pa-1 mt-2">
            <h4 class="mb-1">عدد مرات الاستخدام</h4>
            {{ coupon.uses }}
          </div>
          <div class="rounded border pa-1 mt-2">
            <h4 class="mb-1">تاريخ الانتهاء</h4>
            {{ formatDateTime(coupon.ended_at) }}
          </div>
          <div class="rounded border pa-1 mt-2">
            <h4 class="mb-1">الوصف</h4>
            {{ coupon.description }}
          </div>
          <div class="rounded border pa-1 mt-2">
            <h4 class="mb-1">الاحصائيات</h4>
            <div class="d-flex flex-wrap gap-x-5 gap-y-3">
              <div class="text-center">
                <VIcon icon="tabler-share" size="25" class="mx-auto" />
                <span class="d-block">{{ coupon.shares_count }}</span>
              </div>
              <div class="text-center">
                <VIcon icon="tabler-thumb-down" size="25" class="mx-auto" />
                <span class="d-block">{{ coupon.dislikes_count }}</span>
              </div>
              <div class="text-center">
                <VIcon icon="tabler-thumb-up" size="25" class="mx-auto" />
                <span class="d-block">{{ coupon.likes_count }}</span>
              </div>
              <div class="text-center">
                <VIcon icon="tabler-eye" size="25" class="mx-auto" />
                <span class="d-block">{{ coupon.views_count }}</span>
              </div>
            </div>
          </div>
          <div class="rounded border pa-1 mt-2">
            <h4 class="mb-1">المتجر</h4>
            <a :href="formatUrl(coupon.link)" target="_blank" class="content-list__link">
              الذهاب لمتجر {{ coupon.store_name }}
            </a>
            <span class="d-block">عدد مرات الذهاب {{ coupon.goes_count }}</span>
          </div>
        </div>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style lang="scss" scoped>
.coupon {
  font-size: 14px;

  &__code {
    word-break: break-word;
  }
}
</style>
