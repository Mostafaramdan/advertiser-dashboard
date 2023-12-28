<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { ADS_SPACE_REQUEST_STATUSES } from '@/constants/ads-spaces'
import { useVModel } from '@vueuse/core'
import type { AdSpaceRequest } from '../interfaces/AdsSpace'
import { adsSpacesService } from '../services/AdsSpacesService'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(
  defineProps<{ showModal: boolean; activeItem: AdSpaceRequest | null }>(),
  {
    showModal: false,
  },
)

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
const { t } = useI18n()
const showModal = useVModel(props, 'showModal', emit)
const { formatDateTime } = UseGeneralHelpers()
const isLoading = ref<boolean>(false)
const data = ref(props.activeItem)

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
getItemDetails(props.activeItem?.id)

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function getItemDetails(id: any) {
  isLoading.value = true
  adsSpacesService
    .getRequestDetails(id)
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
  <VDialog v-model="showModal" max-width="600" scrollable class="details-modal">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="showModal = !showModal" />

    <!-- Dialog Content -->
    <VCard v-loading="isLoading">
      <div>
        <VCard v-if="data" title="عرض طلب">
          <VCardText>
            <VList :lines="false">
              <VListItem title="صاحب الطلب" class="px-2 py-2" border>
                <div class="d-flex align-start">
                  <div class="d-flex flex-column align-center me-3 py-1">
                    <VAvatar size="38" variant="tonal" cover>
                      <VImg v-if="data.user.image_path" :src="data.user.image_path" cover />
                      <span v-else>!</span>
                    </VAvatar>
                  </div>
                  <div style="word-wrap: break-word">
                    {{ data.user.account_name }}
                    <span class="text-sm text-disabled d-block">{{ data.user.email }}</span>
                    <span class="text-sm text-disabled d-block">{{ data.user.phone }}</span>
                  </div>
                </div>
              </VListItem>
              <VListItem
                class="px-2 py-2"
                title="تاريخ الانشاء"
                :subtitle="formatDateTime(data.created_at)"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="تاريخ النهاية"
                :subtitle="formatDateTime(data.ended_at)"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="سعر المشاهدة"
                :subtitle="`${data.watch_price} ${data.currency_name}`"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="مشاهدات المشاركة"
                :subtitle="data.shares_watches_count"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="المشاهدات المسحوبة"
                :subtitle="data.watches_count_requested"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="المشاهدات المتبقية"
                :subtitle="data.remaining_watches_count"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="حالة الطلب"
                :subtitle="ADS_SPACE_REQUEST_STATUSES.get(data.status)?.label"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="الساعات المتبقية"
                :subtitle="data.remaining_hours"
                border
              />
              <VListItem class="px-2 py-2" title="القنوات" border>
                <div class="d-flex flex-wrap gap-2 mt-2" v-if="data.channels?.length">
                  <a
                    :href="item.url"
                    target="_blank"
                    class="rounded border pa-2 d-flex align-center flex-grow-1"
                    v-for="item in data.channels"
                    :key="item.id"
                  >
                    <VAvatar size="38" variant="outlined" cover class="me-3">
                      <VImg v-if="item.channel.image_path" :src="item.channel.image_path" cover />
                      <span v-else>!</span>
                    </VAvatar>
                    <div class="flex-grow-1">
                      <div class="d-flex flex-wrap gap-2 justify-space-between">
                        {{ item.channel.label }}
                        <VTooltip location="top">
                          <template v-slot:activator="{ props }">
                            <VIcon
                              v-bind="props"
                              :icon="
                                item.is_confirmed ? 'tabler-circle-check' : 'tabler-playstation-x'
                              "
                              :color="item.is_confirmed ? 'success' : 'error'"
                            />
                          </template>
                          <span> {{ item.is_confirmed ? 'مؤكد' : 'غير مؤكد' }}</span>
                        </VTooltip>
                      </div>
                      <span class="text-sm text-disabled">{{ item.watches_count }}</span>
                    </div>
                  </a>
                </div>
                <div v-else class="text-h6">
                  {{ t('general.no_data') }}
                </div>
              </VListItem>
            </VList>
          </VCardText>
        </VCard>
      </div>
    </VCard>
  </VDialog>
</template>
