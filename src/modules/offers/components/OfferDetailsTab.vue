<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { USERS_ROLES } from '@/constants/index'
import { OFFER_STATUSES, OFFER_TYPES, STORES_TYPES } from '@/constants/offers'
import { formatUrl } from '@/helpers/index'
import { useOffersStore } from '@/stores/OffersStore'
import type { User } from '../interfaces/Offer'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { formatDate } = UseGeneralHelpers()
const offersStore = useOffersStore()
// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const data = computed(() => offersStore.offerDetails)

const offerInfo = computed(() => {
  if (!data.value) return []
  const {
    offer_type,
    from_date,
    to_date,
    user,
    status,
    expire_date,
    hide_contact_data,
    store,
    location,
  } = data.value
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
    {
      label: 'رابط المتجر',
      value: store.url,
      key: 'store_url',
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
// #endregion
</script>

<template>
  <section class="details-tab" v-loading="!data" style="min-block-size: 300px">
    <template v-if="data">
      <VExpansionPanels class="expansion-panels-width-border" :model-value="0">
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
                    {{ item.value.username }}
                  </router-link>
                  <a
                    :href="formatUrl(item.value)"
                    target="_blank"
                    v-else-if="item.key === 'store_url'"
                    >{{ item.value ?? '-' }}</a
                  >
                  <div v-else-if="item.key === 'location'">
                    <a
                      class="content-list__link"
                      v-if="item.value"
                      :href="`https://www.google.com/maps/search/?api=1&query=${item.value.lat},${item.value.lng}`"
                      target="_blank"
                      ><u>{{ item.value.address }}</u></a
                    >
                    <span v-else> لا يوجد </span>
                  </div>
                  <p v-else class="text-body-2 mb-0">
                    {{ item.value ?? '-' }}
                  </p>
                </VCol>
              </VRow>
            </div>
          </VExpansionPanelText>
        </VExpansionPanel>
      </VExpansionPanels>
    </template>
  </section>
</template>

<style lang="scss" scoped>
:deep(.v-list-item-title) {
  white-space: wrap;
}
</style>
