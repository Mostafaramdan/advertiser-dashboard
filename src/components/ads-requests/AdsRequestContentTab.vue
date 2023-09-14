<script setup lang="ts">
import { useAdsRequestsStore } from '@/stores/AdsRequestsStore'
import AdsRequestAttachmentsModal from './AdsRequestAttachmentsModal.vue'
import AdsRequestCouponModal from './AdsRequestCouponModal.vue'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const adsRequestsStore = useAdsRequestsStore()
const showCouponModal = ref<boolean>(false)
const showAttachmentsModal = ref<boolean>(false)

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const data = computed(() => {
  return adsRequestsStore.adsRequestDetails.order_content
})
// #endregion
</script>

<template>
  <div class="order-content-tab">
    <AdsRequestAttachmentsModal
      v-model:show-modal="showAttachmentsModal"
      :attachments="data.attachments"
    />
    <AdsRequestCouponModal
      v-if="data.coupon"
      v-model:show-modal="showCouponModal"
      :coupon="data.coupon"
    />
    <VRow>
      <VCol cols="12" md="6" lg="3">
        <VExpansionPanels class="expansion-panels-width-border" :model-value="0">
          <VExpansionPanel elevation="0">
            <VExpansionPanelTitle>
              <span class="d-flex align-center gap-3">
                <VIcon size="20" icon="tabler-device-tv" />
                قنوات الاعلان
              </span>
            </VExpansionPanelTitle>
            <VExpansionPanelText>
              <div class="d-flex flex-column gap-2" v-if="data.channels.length">
                <div
                  class="rounded border pa-2 d-flex align-center"
                  v-for="channel in data.channels"
                  :key="channel.id"
                >
                  <VAvatar size="38" variant="outlined" cover class="me-3">
                    <VImg v-if="channel.image_path" :src="channel.image_path" cover />
                    <span v-else>!</span>
                  </VAvatar>
                  {{ channel.name }}
                </div>
              </div>
              <div v-else class="text-h6">
                {{ t('general.no_data') }}
              </div>
            </VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>
      </VCol>

      <VCol cols="12" md="6" lg="3">
        <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
          <VExpansionPanel elevation="0">
            <VExpansionPanelTitle>
              <span class="d-flex align-center gap-3">
                <VIcon size="20" icon="tabler-paperclip" />
                المرفقات
              </span>
            </VExpansionPanelTitle>
            <VExpansionPanelText>
              <VBtn
                block
                variant="outlined"
                v-if="data.attachments.length"
                @click="showAttachmentsModal = true"
              >
                عرض المرفقات
                <VIcon end icon="tabler-paperclip" />
              </VBtn>
              <div v-else class="text-h6">
                {{ t('general.no_data') }}
              </div>
            </VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>

        <VExpansionPanels class="expansion-panels-width-border" :model-value="0">
          <VExpansionPanel elevation="0">
            <VExpansionPanelTitle>
              <span class="d-flex align-center gap-3">
                <VIcon size="20" icon="tabler-discount-2" />
                الكوبون
              </span>
            </VExpansionPanelTitle>
            <VExpansionPanelText>
              <div class="rounded border pa-2 d-flex align-center" v-if="data.coupon">
                <VAvatar size="38" variant="outlined" cover class="me-3">
                  <VImg v-if="data.coupon.store.image" :src="data.coupon.store.image" cover />
                  <span v-else>!</span>
                </VAvatar>
                <a href="#" @click.prevent="showCouponModal = true" class="content-list__link"
                  >عرض الكوبون</a
                >
              </div>
              <div v-else class="text-h6">
                {{ t('general.no_data') }}
              </div>
            </VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>
      </VCol>
      <VCol cols="12" md="6" lg="3">
        <VExpansionPanels class="expansion-panels-width-border" :model-value="0">
          <VExpansionPanel elevation="0">
            <VExpansionPanelTitle>
              <span class="d-flex align-center gap-3">
                <VIcon size="20" icon="tabler-link" />
                الروابط
              </span>
            </VExpansionPanelTitle>
            <VExpansionPanelText>
              <div class="d-flex flex-column gap-2 content-list" v-if="data.links.length">
                <div class="rounded border pa-2" v-for="(link, index) in data.links" :key="link.id">
                  {{ link.name }}
                  <a :href="link.link" target="_blank" class="content-list__link">{{
                    link.link
                  }}</a>
                </div>
              </div>
              <div v-else class="text-h6">
                {{ t('general.no_data') }}
              </div>
            </VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>
      </VCol>
      <VCol cols="12" md="6" lg="3">
        <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
          <VExpansionPanel elevation="0">
            <VExpansionPanelTitle>
              <span class="d-flex align-center gap-3">
                <VIcon size="20" icon="tabler-info-circle" />
                البيانات الأخري
              </span>
            </VExpansionPanelTitle>
            <VExpansionPanelText>
              <div class="d-flex flex-column gap-2 content-list">
                <div class="rounded border pa-2 d-flex" v-if="data.location?.lat">
                  <VAvatar size="38" color="primary" variant="tonal" cover class="me-3">
                    <VIcon icon="tabler-map-pin" size="24" />
                  </VAvatar>
                  <div class="overflow-hidden">
                    {{ data.location.address }}
                    <a
                      class="content-list__link"
                      :href="`https://www.google.com/maps/search/?api=1&query=${data.location.lat},${data.location.lng}`"
                      target="_blank"
                      >عرض الموقع</a
                    >
                  </div>
                </div>

                <div class="rounded border pa-2 d-flex align-center" v-if="data.ads_plan">
                  <VAvatar size="38" color="primary" variant="tonal" cover class="me-3">
                    <VIcon icon="tabler-file-description" size="24" />
                  </VAvatar>
                  <div class="overflow-hidden">
                    <a class="content-list__link" :href="data.ads_plan" target="_blank"
                      >خطة الاعلان</a
                    >
                  </div>
                </div>
                <div class="rounded border pa-2" v-if="data.ads_locations">
                  <h4 class="mb-2">اماكن عرض الاعلان</h4>
                  <div class="d-flex gap-2">
                    <VChip
                      variant="outlined"
                      color="primary"
                      label
                      v-if="data.ads_locations.show_app"
                    >
                      المنصة
                    </VChip>
                    <VChip
                      variant="outlined"
                      color="primary"
                      label
                      v-if="data.ads_locations.show_profile"
                    >
                      الروفايل
                    </VChip>
                  </div>
                </div>
                <div class="rounded border pa-2" v-if="data.notes">
                  <h4 class="mb-1">الملاحظات</h4>
                  {{ data.notes }}
                </div>
              </div>
            </VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>
      </VCol>
    </VRow>
  </div>
</template>

<style lang="scss" scoped>
.order-content-tab {
  .content-list {
    font-size: 13px;

    &__link {
      @include max-lines(1);
    }
  }
}
</style>
