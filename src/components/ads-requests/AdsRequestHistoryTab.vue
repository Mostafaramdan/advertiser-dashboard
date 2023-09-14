<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { useAdsRequestsStore } from '@/stores/AdsRequestsStore'
import { VDataTableServer } from 'vuetify/labs/VDataTable'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const adsRequestsStore = useAdsRequestsStore()
const { formatDateTime } = UseGeneralHelpers()

const headers: any = [
  {
    title: 'المستخدم',
    key: 'user',
  },
  {
    title: 'اسم الحركة',
    key: 'title',
  },
  {
    title: 'التاريخ',
    key: 'created_at',
  },
  {
    title: 'الوصف',
    key: 'description',
  },
]

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const data = computed(() => {
  return {
    advertiser: adsRequestsStore.adsRequestDetails.advertiser,
    user: adsRequestsStore.adsRequestDetails.user,
    history: adsRequestsStore.adsRequestDetails.ads_request_logs,
  }
})
// #endregion
</script>

<template>
  <div class="order-history-tab">
    <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle> بيانات المعلن والعميل</VExpansionPanelTitle>
        <VExpansionPanelText>
          <VRow>
            <VCol
              cols="12"
              md="6"
              v-for="(user, index) in [data.advertiser, data.user]"
              :key="index"
            >
              <VListItem :title="index === 0 ? 'المعلن' : 'العميل'" class="px-2 py-2" border>
                <div class="d-flex align-start">
                  <div class="d-flex flex-column align-center me-3 py-1">
                    <VAvatar size="38" variant="tonal" cover>
                      <VImg v-if="user.image_path" :src="user.image_path" cover />
                      <span v-else>!</span>
                    </VAvatar>
                    <span class="d-flex align-center text-sm">
                      <VIcon icon="tabler-star-filled" color="#ffcc00" size="18" start />
                      {{ user.rate }}
                    </span>
                  </div>
                  <div style="word-wrap: break-word">
                    {{ user.account_name }}
                    <span class="text-sm text-disabled d-block">{{ user.email }}</span>
                    <div>
                      <VBtn
                        :href="`mailto:${user.email}`"
                        size="33"
                        variant="outlined"
                        class="me-2 mt-1"
                      >
                        <VIcon icon="tabler-mail" size="20" />
                      </VBtn>
                      <VBtn
                        :href="`tel:${user.phone}`"
                        size="33"
                        variant="outlined"
                        class="me-2 mt-1"
                      >
                        <VIcon icon="tabler-phone" size="20" />
                      </VBtn>
                      <VBtn
                        :href="`sms:${user.phone}`"
                        size="33"
                        variant="outlined"
                        class="me-2 mt-1"
                        style="font-size: 11px"
                      >
                        SMS
                      </VBtn>
                      <VBtn
                        :href="`https://wa.me/${user.phone}`"
                        size="33"
                        variant="outlined"
                        class="me-2 mt-1"
                        target="_blank"
                      >
                        <VIcon icon="tabler-brand-whatsapp" size="20" />
                      </VBtn>
                    </div>
                  </div>
                </div>
              </VListItem>
            </VCol>
          </VRow>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
    <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle>عرض سجل الطلب</VExpansionPanelTitle>
        <VExpansionPanelText>
          <VDataTableServer
            :headers="headers"
            :items="data.history"
            :items-length="data.history.length"
            class="app-table"
            :no-data-text="t('general.no_data')"
          >
            <template #item.created_at="{ item }">
              <div class="text-no-wrap">
                {{ formatDateTime(item.raw.created_at) }}
                <span class="text-sm text-disabled d-block">{{ item.raw.time_ago }}</span>
              </div>
            </template>
            <template #item.title="{ item }">
              <div style="min-width: 200px">
                {{ item.raw.title }}
              </div>
            </template>
            <template #item.description="{ item }">
              <div style="min-width: 250px">
                {{ item.raw.description || '-' }}
              </div>
            </template>
            <template #bottom> </template>
          </VDataTableServer>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
  </div>
</template>
