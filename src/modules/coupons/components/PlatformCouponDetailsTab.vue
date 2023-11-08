<script setup lang="ts">
import PlatformCouponDetailsCard from '../components/PlatformCouponDetailsCard.vue'
import type { PlatformCoupon } from '../interfaces/PlatformCoupon'
import { couponsService } from '../services/CouponsService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const route = useRoute()
const couponId = +route.params.id
const isLoading = ref<boolean>(false)
const data = ref<PlatformCoupon>({} as PlatformCoupon)
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
  <div v-loading="isLoading">
    <PlatformCouponDetailsCard :data="data" />
  </div>
</template>
