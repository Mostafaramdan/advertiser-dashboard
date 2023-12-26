<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { REPEAT_TYPES } from '@/constants/ads-spaces'
import type { AdsSpaceDetails } from '../interfaces/AdsSpace'
import { adsSpacesService } from '../services/AdsSpacesService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const route = useRoute()
const { t } = useI18n()
const { formatDateTime } = UseGeneralHelpers()
const isLoading = ref<boolean>(false)
const data = ref<AdsSpaceDetails | null>(null)
const adsSpaceId = +route.params.id
const defaultFileImage = new URL('../../../assets/images/svg/file-icons/other.svg', import.meta.url)
// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const adsSpaceInfo = computed<any>(() => {
  if (!data.value) return []
  const {
    from_date,
    to_date,
    watch_price,
    currency_name,
    shares_count,
    shares_watches_count,
    rate,
    location,
    description,
    brief,
  } = data.value
  return [
    {
      label: 'تاريخ البداية',
      value: formatDateTime(from_date),
    },
    {
      label: 'تاريخ النهاية',
      value: formatDateTime(to_date),
    },
    {
      label: 'سعر المشاهدة الواحدة',
      value: watch_price + ' ' + currency_name,
    },
    {
      label: 'التقييم',
      value: rate,
      key: 'rate',
    },
    {
      label: 'عدد المشاركات',
      value: shares_count,
    },
    {
      label: 'م. مشاهدات المشاركات',
      value: shares_watches_count,
    },
    {
      label: 'العنوان',
      value: location,
      key: 'location',
    },
    {
      label: 'الوصف',
      value: description,
    },
    {
      label: 'النبذة',
      value: brief,
    },
  ]
})

const adsSpaceSettings = computed(() => {
  if (!data.value) return []
  const {
    request_watch_distance_status,
    request_watch_distance,
    share_distance_status,
    share_distance,
    share_statistics,
    share_rate,
    hide_comments,
    can_whatsapp,
    can_chat,
    can_add_balance,
    user_repeat,
    repeat_type,
  } = data.value
  return [
    {
      label: 'السماح بالسحب عن قرب',
      value: request_watch_distance_status,
      labelValue: request_watch_distance ? request_watch_distance + 'متر' : '-',
    },
    {
      label: 'السماح بالمشاركة عن قرب',
      value: share_distance_status,
      labelValue: share_distance ? share_distance + 'متر' : '-',
    },
    {
      label: 'مشاركة إحصاءات المساحة مع الآخرين',
      value: share_statistics,
    },
    {
      label: 'مشاركة تقييم المساحة مع الآخرين',
      value: share_rate,
    },
    {
      label: 'اخفاء التعليقات',
      value: hide_comments,
    },
    {
      label: 'امكانية فتح واتساب',
      value: can_whatsapp,
    },
    {
      label: 'امكانية فتح الشات',
      value: can_chat,
    },
    {
      label: 'امكانية اضافة رصيد',
      value: can_add_balance,
    },
    {
      label: 'تكرار المشاركة في المساحة للمستخدم الواحد',
      value: user_repeat,
      labelValue: repeat_type ? 'مرة كل ' + REPEAT_TYPES[repeat_type] : '-',
    },
  ]
})

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
getPageData()

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function getPageData() {
  isLoading.value = true
  adsSpacesService
    .getDetails(adsSpaceId)
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
  <section class="details-tab" v-loading="isLoading">
    <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle>بيانات المساحة</VExpansionPanelTitle>
        <VExpansionPanelText>
          <div class="information-list">
            <VRow class="my-0">
              <VCol
                v-for="(item, index) in adsSpaceInfo"
                :key="index"
                class="py-2 information-list__item"
                cols="12"
                sm="6"
                lg="4"
              >
                <h5 class="text-primary text-subtitle-2">
                  {{ item.label }}
                </h5>
                <div v-if="item.key === 'rate'" class="d-flex align-center">
                  <VIcon icon="tabler-star-filled" color="#ffcc00" size="18" start />
                  {{ item.value ?? '-' }}
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
                <p v-else class="text-body-2 mb-0">
                  {{ item.value ?? '-' }}
                </p>
              </VCol>
            </VRow>
          </div>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>

    <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle> القنوات </VExpansionPanelTitle>
        <VExpansionPanelText v-if="data">
          <div class="d-flex flex-wrap gap-2" v-if="data.channels.length">
            <div
              class="rounded border pa-2 d-flex align-center flex-grow-1"
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

    <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle> الاقسام </VExpansionPanelTitle>
        <VExpansionPanelText v-if="data">
          <div class="d-flex flex-wrap gap-3" v-if="data.categories?.length">
            <VChip label color="primary" v-for="category in data.categories" :key="category.id">
              {{ category.label }}
            </VChip>
          </div>
          <div v-else class="text-h6">
            {{ t('general.no_data') }}
          </div>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>

    <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle>المرفقات</VExpansionPanelTitle>
        <VExpansionPanelText v-if="data">
          <VRow v-if="data.attachments.length">
            <VCol
              col="12"
              md="6"
              v-for="(attachment, index) of data.attachments"
              :key="attachment.id"
            >
              <a
                :href="attachment.path"
                download
                target="_blank"
                class="attachment d-flex gap-3 border pa-2"
              >
                <div class="attachment__img">
                  <img
                    :src="attachment.thumbnail || attachment.path"
                    @error="(e: any) => (e.target.src = defaultFileImage)"
                  />
                </div>
                <span class="attachment__name">{{ attachment.name }}</span>
              </a>
              <VDivider v-if="index !== data.attachments.length - 1" />
            </VCol>
          </VRow>
          <div v-else class="text-h6">
            {{ t('general.no_data') }}
          </div>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>

    <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle>الموافقة الآلية على سحب المشاهدات</VExpansionPanelTitle>
        <VExpansionPanelText v-if="data">
          <div class="information-list">
            <VRow class="my-0">
              <VCol
                v-for="(item, index) in [
                  { label: 'حد أدنى', value: data.automatic_minimum },
                  { label: 'حد اعلي', value: data.automatic_maximum },
                ]"
                :key="index"
                class="py-2 information-list__item"
                cols="12"
                sm="6"
              >
                <h5 class="text-primary text-subtitle-2">
                  {{ item.label }}
                </h5>
                <p class="text-body-2 mb-0">
                  {{ item.value ?? '-' }}
                </p>
              </VCol>
            </VRow>
          </div>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>

    <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle>الموافقة اليدوية على سحب المشاهدات</VExpansionPanelTitle>
        <VExpansionPanelText v-if="data">
          <div class="information-list">
            <VRow class="my-0">
              <VCol
                v-for="(item, index) in [
                  { label: 'حد أدنى', value: data.manual_minimum },
                  { label: 'حد اعلي', value: data.manual_maximum },
                ]"
                :key="index"
                class="py-2 information-list__item"
                cols="12"
                sm="6"
              >
                <h5 class="text-primary text-subtitle-2">
                  {{ item.label }}
                </h5>
                <p class="text-body-2 mb-0">
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
        <VExpansionPanelTitle>اعدادات المساحة</VExpansionPanelTitle>
        <VExpansionPanelText v-if="data">
          <VRow>
            <VCol cols="12" md="4" v-for="(item, index) in adsSpaceSettings" :key="index">
              <div class="border py-1 px-2 rounded h-100">
                <VSwitch :inset="false" readonly :model-value="item.value">
                  <template #label>
                    <span>
                      <span class="me-2">{{ item.label }}</span>
                      <span class="text-primary" v-if="item.labelValue">{{ item.labelValue }}</span>
                    </span>
                  </template>
                </VSwitch>
              </div>
            </VCol>
          </VRow>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
  </section>
</template>

<style lang="scss" scoped>
:deep(.v-list-item-title) {
  white-space: wrap;
}

.attachment {
  &__img {
    block-size: 40px;
    inline-size: 40px;
    min-inline-size: 40px;

    img {
      block-size: 100%;
      inline-size: 100%;
      object-fit: contain;
    }
  }

  &__name {
    @include max-lines(2);
  }

  &:hover &__name {
    opacity: 0.8;
  }
}
</style>
