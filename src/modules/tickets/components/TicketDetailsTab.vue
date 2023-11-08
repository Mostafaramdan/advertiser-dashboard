<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { useTicketsStore } from '@/stores/TicketsStore'
import type { SupportTicketDetails } from '../interfaces/SupportTicket'
import { supportTicketsService } from '../services/SupportTicketsService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const route = useRoute()
const { formatDateTime } = UseGeneralHelpers()
const ticketsStore = useTicketsStore()
const isLoading = ref<boolean>(false)
const data = ref<SupportTicketDetails | null>(null)
const ticketId = +route.params.id
const defaultFileImage = new URL('../../../assets/images/svg/file-icons/other.svg', import.meta.url)
// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const ticketInfo = computed(() => {
  const { ticketBasicData } = ticketsStore
  if (!ticketBasicData) return []
  return [
    {
      label: 'نوع التذكرة',
      value: ticketBasicData.support_type,
    },
    {
      label: 'القسم',
      value: ticketBasicData.category,
    },
    {
      label: 'تاريخ أخر تعديل',
      value: formatDateTime(ticketBasicData.last_update),
    },
    {
      label: 'التقييم',
      value: ticketBasicData.rate,
      key: 'rate',
    },
    {
      label: 'المسؤول الاول',
      value: ticketBasicData.primary_admin.name,
    },
    {
      label: 'التوقيت',
      value: ticketBasicData.primary_admin.hours,
    },
    {
      label: 'المسؤول الثاني',
      value: ticketBasicData.secondary_admin.name,
    },
    {
      label: 'التوقيت',
      value: ticketBasicData.secondary_admin.hours,
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
  supportTicketsService
    .getTicketDetails(ticketId)
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
  <section class="details-tab" v-loading="isLoading || !ticketInfo.length">
    <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle>بيانات التذكرة</VExpansionPanelTitle>
        <VExpansionPanelText>
          <div class="information-list">
            <VRow>
              <VCol
                v-for="(item, index) in ticketInfo"
                :key="index"
                class="py-2 information-list__item"
                cols="12"
                sm="6"
                lg="4"
              >
                <h5 class="text-primary text-subtitle-2">
                  {{ item.label }}
                </h5>
                <div v-if="item.key === 'rate' && item.value !== null">
                  <span class="d-flex align-center text-sm">
                    <VIcon icon="tabler-star-filled" color="#ffcc00" size="18" start />
                    {{ item.value }}
                  </span>
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
    <template v-if="data">
      <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
        <VExpansionPanel elevation="0">
          <VExpansionPanelTitle>وصف التذكرة</VExpansionPanelTitle>
          <VExpansionPanelText>
            {{ data.details }}
          </VExpansionPanelText>
        </VExpansionPanel>
      </VExpansionPanels>

      <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
        <VExpansionPanel elevation="0">
          <VExpansionPanelTitle>مرفقات التذكرة</VExpansionPanelTitle>
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
            <p v-else class="text-body-1 mb-0">لا يوجد بيانات</p>
          </VExpansionPanelText>
        </VExpansionPanel>
      </VExpansionPanels>

      <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
        <VExpansionPanel elevation="0">
          <VExpansionPanelTitle>تعليقات مقدم التذكرة</VExpansionPanelTitle>
          <VExpansionPanelText v-if="data">
            <VList :lines="false" class="py-0" v-if="data.rates.length">
              <template v-for="(rate, index) of data.rates" :key="index">
                <VListItem class="px-0">
                  <VRating
                    hover
                    readonly
                    :length="5"
                    :size="22"
                    :model-value="rate.rate"
                    active-color="#ffcc00"
                    color="#ffcc00"
                    half-increments
                  />
                  <span class="d-block">{{ rate.comment }}</span>
                </VListItem>
                <VDivider v-if="index !== data.rates.length - 1" />
              </template>
            </VList>
            <p v-else class="text-body-1 mb-0">لا يوجد بيانات</p>
          </VExpansionPanelText>
        </VExpansionPanel>
      </VExpansionPanels>

      <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
        <VExpansionPanel elevation="0">
          <VExpansionPanelTitle>تفاصيل اغلاق التذكرة</VExpansionPanelTitle>
          <VExpansionPanelText>
            <div class="d-flex align-center gap-2" v-if="data.closed_by">
              <VIcon icon="tabler-circle-check" size="30" color="primary" />
              تم الاقفال بواسطة
              <span>{{ data.closed_by.role === 'admin' ? 'المنصة' : 'مقدم التذكرة' }}</span>
            </div>
            <p v-else class="text-body-1 mb-0">لا يوجد بيانات</p>
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
