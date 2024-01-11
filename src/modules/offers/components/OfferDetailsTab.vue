<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { USERS_ROLES } from '@/constants/index'
import { OFFER_STATUSES, OFFER_TYPES, STORES_TYPES } from '@/constants/offers'
import { productsService } from '@/services/ProductsService'
import { useOffersStore } from '@/stores/OffersStore'
import { useToast } from 'vue-toastification'
import type { User } from '../interfaces/Offer'
import OfferProductsTable from './OfferProductsTable.vue'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const toast = useToast()
const { formatDate } = UseGeneralHelpers()
const offersStore = useOffersStore()
const isLoading = reactive({
  products: false,
})
// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const data = computed(() => offersStore.offerDetails)

const offerInfo = computed(() => {
  if (!data.value) return []
  const { offer_type, from_date, to_date, user, status, expire_date, store } = data.value
  return [
    {
      label: 'النوع',
      value: OFFER_TYPES.get(offer_type)?.label,
    },
    {
      label: 'تاريخ البداية',
      value: from_date,
    },
    {
      label: 'تاريخ النهاية',
      value: to_date,
    },
    {
      label: 'المستخدم',
      value: user,
      key: 'user',
    },
    {
      label: 'نوع المستخدم',
      value: USERS_ROLES[user.role],
    },
    {
      label: 'حالة العرض',
      value: OFFER_STATUSES.get(status)?.label,
    },
    {
      label: 'تاريخ الانتهاء',
      value: formatDate(expire_date),
    },
    {
      label: 'اسم المتجر',
      value: store.name,
    },
    {
      label: 'نوع المتجر',
      value: STORES_TYPES.get(store.type)?.label,
    },
  ]
})

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function getProfileUrl(user: User) {
  return {
    name: user.role === 'advertiser' ? 'advertisers-profile-page' : 'user-profile-page',
    params: { id: user.id },
    query: { tab: 'details' },
  }
}

function deleteProduct(productId: number) {
  isLoading.products = true
  productsService
    .deleteItem(productId)
    .then((res) => {
      const targetIndex = data.value.products.findIndex((product: any) => product.id === productId)
      data.value.products.splice(targetIndex, 1)
      toast.success(res.data.message)
    })
    .finally(() => {
      isLoading.products = false
    })
}

// #endregion
</script>

<template>
  <section class="details-tab" v-if="data">
    <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle>بيانات العرض</VExpansionPanelTitle>
        <VExpansionPanelText>
          <div class="information-list">
            <VRow>
              <VCol
                v-for="(item, index) in offerInfo"
                :key="index"
                class="py-2 information-list__item"
                cols="12"
                sm="6"
                lg="4"
              >
                <h5 class="text-primary text-subtitle-2">
                  {{ item.label }}
                </h5>

                <router-link v-if="item.key === 'user'" :to="getProfileUrl(item.value)">
                  {{ item.value.account_name }}
                </router-link>
                <p v-else class="text-body-2 mb-0">
                  {{ item.value ?? '-' }}
                </p>
              </VCol>
            </VRow>
          </div>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>

    <VExpansionPanels class="expansion-panels-width-border" :model-value="0">
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle>المنتجات</VExpansionPanelTitle>
        <VExpansionPanelText v-loading="isLoading.products">
          <OfferProductsTable
            v-model="data.products"
            @delete-product="deleteProduct"
            v-loading="isLoading.products"
            :show-title="false"
            :store-type="data.store.type"
            :user-id="data.user.id"
          />
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
  </section>
  <div v-else v-loading="true" style="min-block-size: 300px"></div>
</template>

<style lang="scss" scoped>
:deep(.v-list-item-title) {
  white-space: wrap;
}
</style>
