<script setup lang="ts">
import StoreDetailsCard from '../components/StoreDetailsCard.vue'
import type { Store } from '../interfaces/Store'
import { storesService } from '../services/StoresService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const route = useRoute()
const couponId = +route.params.id
const isLoading = ref<boolean>(false)
const data = ref<Store | null>(null)
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
  storesService
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
        <PageBackBtn :link="{ name: 'stores-page' }" />
        <div>
          تفاصيل المتجر
          <span>رقم ({{ route.params.id }})</span>
        </div>
      </div>
    </template>
    <VCardText v-if="data">
      <StoreDetailsCard :data="data" />
    </VCardText>
  </VCard>
</template>
