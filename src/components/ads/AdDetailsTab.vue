<script setup lang="ts">
import { useAdsStore } from '@/stores/AdsStore'
import AdAttachmentsModal from './AdAttachmentsModal.vue'
/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const adsStore = useAdsStore()
const showAttachmentsModal = ref<boolean>(false)
// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const data = computed(() => {
  if (!adsStore.adDetails) return []
  const {
    ads_type,
    country_name,
    likes_count,
    dislikes_count,
    updated_count,
    seen_count,
    category_name,
    ads_locations,
    rate,
    description,
    location,
    ads_request_id,
    reports_count,
    reports_percentage,
    attachments,
  } = adsStore.adDetails
  return [
    {
      label: 'نوع الاعلان',
      value: ads_type,
    },
    {
      label: 'الدولة',
      value: country_name,
    },
    {
      label: 'مرات الاعجاب',
      value: likes_count,
    },
    {
      label: 'عدم الاعجاب',
      value: dislikes_count,
    },
    {
      label: 'مرات التحديث',
      value: updated_count,
    },
    {
      label: 'المشاهدات',
      value: seen_count,
    },
    {
      label: 'رقم الطلب',
      value: ads_request_id,
      key: 'ads_request_id',
    },
    {
      label: 'القسم',
      value: category_name,
    },
    {
      label: 'تقييم الاعلان',
      value: rate,
      key: 'rate',
    },
    {
      label: 'اماكن العرض',
      value: ads_locations,
      key: 'ads_locations',
    },
    {
      label: 'عدد البلاغات',
      value: reports_count,
    },
    {
      label: 'نسبة البلاغات',
      value: reports_percentage,
    },
    {
      label: 'المرفقات',
      value: attachments,
      key: 'attachments',
    },
    {
      label: 'العنوان',
      value: location,
      key: 'location',
    },
    {
      label: 'وصف الاعلان',
      value: description,
    },
  ]
})

// #endregion
</script>

<template>
  <div class="details-tab" v-loading="!adsStore.adDetails">
    <AdAttachmentsModal
      v-model:show-modal="showAttachmentsModal"
      v-if="adsStore.adDetails?.attachments.length"
      :attachments="adsStore.adDetails.attachments"
    />
    <!-- ad details info -->
    <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle>بيانات الطلب</VExpansionPanelTitle>
        <VExpansionPanelText>
          <div class="card-info">
            <VRow>
              <VCol
                v-for="(item, index) in data"
                :key="index"
                class="py-2 card-info__item"
                cols="12"
                sm="6"
                lg="4"
              >
                <h5 class="text-primary text-subtitle-2">
                  {{ item.label }}
                </h5>
                <div class="text-body-2 mb-0">
                  <div v-if="item.key === 'rate'">
                    <span class="d-flex align-center text-sm">
                      <VIcon icon="tabler-star-filled" color="#ffcc00" size="18" start />
                      {{ item.value }}
                    </span>
                  </div>
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
                  <div v-else-if="item.key === 'ads_request_id'">
                    <router-link
                      class="content-list__link"
                      v-if="item.value"
                      :to="{ name: 'ads-request-details-page', params: { id: item.value } }"
                      ><u>{{ item.value }}</u></router-link
                    >
                    <span v-else> لا يوجد </span>
                  </div>
                  <div v-else-if="item.key === 'attachments'">
                    <VBtn
                      variant="outlined"
                      size="small"
                      v-if="item.value.length"
                      @click="showAttachmentsModal = true"
                    >
                      <VIcon start icon="tabler-paperclip" />
                      عرض المرفقات
                    </VBtn>
                    <span v-else> لا يوجد </span>
                  </div>
                  <div v-else-if="item.key === 'ads_locations'">
                    <div class="d-flex gap-2" v-if="item.value">
                      <VChip label color="primary" v-if="item.value.show_app"> المنصة </VChip>
                      <VChip label color="primary" v-if="item.value.show_profile">
                        البروفايل
                      </VChip>
                    </div>
                    <span v-else> لا يوجد </span>
                  </div>
                  <span v-else>
                    {{ item.value ?? '-' }}
                  </span>
                </div>
              </VCol>
            </VRow>
          </div>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
    <!-- end ad details info -->
  </div>
</template>

<style lang="scss" scoped>
.card-info {
  &__item {
    display: flex;
    flex-wrap: wrap;
    gap: 5px 10px;

    @include responsive-down('md') {
      flex-direction: column;
    }

    h5 {
      min-inline-size: 120px;
    }

    p {
      word-break: break-word;
    }
  }
}
</style>
