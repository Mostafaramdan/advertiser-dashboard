<script setup lang="ts">
import AdvertiserCouponDetailsCard from '../components/AdvertiserCouponDetailsCard.vue'
import type { AdvertiserCoupon } from '../interfaces/AdvertiserCoupon'
import { couponsService } from '../services/CouponsService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const route = useRoute()
const couponId = +route.params.id
const isLoading = ref<boolean>(false)
const data = ref<AdvertiserCoupon | null>(null)
// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
getItemDetails()
// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function getItemDetails() {
  isLoading.value = true
  couponsService
    .getSingleItem(couponId)
    .then((res) => {
      data.value = res.data.data
    })
    .finally(() => {
      isLoading.value = false
    })
}

// #endregion
</script>

<template>
  <VCard class="page-card" v-loading="isLoading">
    <template #title>
      <div class="d-flex align-center">
        <PageBackBtn :link="{ name: 'advertisers-coupons-page' }" />
        <div>
          كوبون المعلنين
          <span>رقم ({{ route.params.id }})</span>
        </div>
      </div>
    </template>
    <VCardText v-if="data">
      <AdvertiserCouponDetailsCard :data="data" />
    </VCardText>
  </VCard>
</template>
