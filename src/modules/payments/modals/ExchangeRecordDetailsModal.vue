<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import type { FormModalProps } from '@/interfaces/Forms'
import { useVModel } from '@vueuse/core'
import type { ExchangeRecordDetails } from '../interfaces/ExchangeRecord'
import { exchangeRecordsService } from '../services/ExchangeRecordsService'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(defineProps<FormModalProps>(), {
  showModal: false,
})

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
const showModal = useVModel(props, 'showModal', emit)
const { formatDate } = UseGeneralHelpers()
const isLoading = ref<boolean>(false)
const data = ref<ExchangeRecordDetails | null>(null)

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
getItemDetails(props.activeItem.id)

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function getItemDetails(id: any) {
  isLoading.value = true
  exchangeRecordsService
    .getSingleItem(id)
    .then((res) => {
      data.value = res.data
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
        <VCard title="تفاصيل العملية" min-height="400">
          <VCardText v-if="data">
            <VList :lines="false">
              <VListItem class="px-2 py-2" title="رقم العملية" :subtitle="data.id" border />
              <VListItem class="px-2 py-2" title="المدينة" :subtitle="data.area" border />
              <VListItem
                class="px-2 py-2"
                title="تاريخ الطلب"
                :subtitle="formatDate(data.created_at)"
                border
              />
              <VListItem class="px-2 py-2" title="اسم المستخدم" :subtitle="data.username" border />
              <VListItem class="px-2 py-2" title="حالة الطلب" :subtitle="data.status" border />
              <VListItem class="px-2 py-2" title="قيمة الطلب" :subtitle="data.total" border />
              <VListItem class="px-2 py-2" title="نقاط المستخدم" :subtitle="data.points" border />
              <VListItem
                class="px-2 py-2"
                title="قيمة النقاط"
                :subtitle="data.points_value"
                border
              />
            </VList>
          </VCardText>
        </VCard>
      </div>
    </VCard>
  </VDialog>
</template>
