<script setup lang="ts">
import type { RemindersRequestsStats } from '../interfaces/ReminderRequest'
import { remindersRequestsService } from '../services/RemindersRequestsService'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(defineProps<{ params: any }>(), {
  params: () => ({}),
})

// #endregion
/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const data = ref<RemindersRequestsStats | any>(null)
const isLoading = ref<boolean>(false)
// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const params = computed(() => props.params)

const statsData = computed(() => {
  if (!data.value) return []
  const startReminderData = data.value.start_reminder_requests
  const availabilityReminderData = data.value.availability_reminder_requests
  const startReminderStats = [
    {
      label: 'عدد الطلبات',
      value: startReminderData.total_requests,
      icon: 'tabler-file-check',
      color: 'primary',
    },
    {
      label: 'منتجات عليها طلب',
      value: startReminderData.total_products,
      icon: 'tabler-file-3d',
      color: 'info',
    },
    {
      label: 'كميات الحد الأدني الغير مؤرشفة',
      value: startReminderData.un_archived.total_minimum_amounts,
      icon: 'tabler-archive-off',
      color: 'success',
    },
    {
      label: 'كميات الحد الأعلي الغير مؤرشفة',
      value: startReminderData.un_archived.total_maximum_amounts,
      icon: 'tabler-archive-off',
      color: 'success',
    },
    {
      label: 'قيمة الطلبات الغير مؤرشفة كحد ادني',
      value: startReminderData.un_archived.total_minimum_product_amount,
      icon: 'tabler-archive-off',
      color: 'success',
    },
    {
      label: 'قيم الطلبات الغير مؤرشفة كحد أقصى',
      value: startReminderData.un_archived.total_maximum_product_amount,
      icon: 'tabler-archive-off',
      color: 'success',
    },
    {
      label: 'كميات الحد الأدني المؤرشفة',
      value: startReminderData.archived.total_minimum_amounts,
      icon: 'tabler-archive',
      color: 'error',
    },
    {
      label: 'كميات الحد الأعلي المؤرشفة',
      value: startReminderData.archived.total_maximum_amounts,
      icon: 'tabler-archive',
      color: 'error',
    },
    {
      label: 'قيمة الطلبات المؤرشفة كحد ادني',
      value: startReminderData.archived.total_minimum_product_amount,
      icon: 'tabler-archive',
      color: 'error',
    },
    {
      label: 'قيم الطلبات المؤرشفة كحد أقصى',
      value: startReminderData.archived.total_maximum_product_amount,
      icon: 'tabler-archive',
      color: 'error',
    },
  ]

  const availabilityReminderStats = [
    {
      label: 'عدد الطلبات',
      value: availabilityReminderData.total_requests,
      icon: 'tabler-file-check',
      color: 'primary',
    },
    {
      label: 'منتجات عليها طلب',
      value: availabilityReminderData.total_products,
      icon: 'tabler-file-3d',
      color: 'info',
    },
    {
      label: 'كميات الحد الأدني الغير مؤرشفة',
      value: availabilityReminderData.un_archived.total_minimum_amounts,
      icon: 'tabler-archive-off',
      color: 'success',
    },
    {
      label: 'كميات الحد الأعلي الغير مؤرشفة',
      value: availabilityReminderData.un_archived.total_maximum_amounts,
      icon: 'tabler-archive-off',
      color: 'success',
    },
    {
      label: 'قيمة الطلبات الغير مؤرشفة كحد ادني',
      value: availabilityReminderData.un_archived.total_minimum_product_amount,
      icon: 'tabler-archive-off',
      color: 'success',
    },
    {
      label: 'قيم الطلبات الغير مؤرشفة كحد أقصى',
      value: availabilityReminderData.un_archived.total_maximum_product_amount,
      icon: 'tabler-archive-off',
      color: 'success',
    },
    {
      label: 'كميات الحد الأدني المؤرشفة',
      value: availabilityReminderData.archived.total_minimum_amounts,
      icon: 'tabler-archive',
      color: 'error',
    },
    {
      label: 'كميات الحد الأعلي المؤرشفة',
      value: availabilityReminderData.archived.total_maximum_amounts,
      icon: 'tabler-archive',
      color: 'error',
    },
    {
      label: 'قيمة الطلبات المؤرشفة كحد ادني',
      value: availabilityReminderData.archived.total_minimum_product_amount,
      icon: 'tabler-archive',
      color: 'error',
    },
    {
      label: 'قيم الطلبات المؤرشفة كحد أقصى',
      value: availabilityReminderData.archived.total_maximum_product_amount,
      icon: 'tabler-archive',
      color: 'error',
    },
  ]

  const totalSummaryStats = [
    {
      label: 'عدد الطلبات',
      value: startReminderData.total_requests + availabilityReminderData.total_requests,
      icon: 'tabler-file-check',
      color: 'primary',
    },
    {
      label: 'منتجات عليها طلب',
      value: startReminderData.total_products + availabilityReminderData.total_products,
      icon: 'tabler-file-3d',
      color: 'info',
    },
    {
      label: 'كميات الحد الأدني الغير مؤرشفة',
      value:
        startReminderData.un_archived.total_minimum_amounts +
        availabilityReminderData.un_archived.total_minimum_amounts,
      icon: 'tabler-archive-off',
      color: 'success',
    },
    {
      label: 'كميات الحد الأعلي الغير مؤرشفة',
      value:
        startReminderData.un_archived.total_maximum_amounts +
        availabilityReminderData.un_archived.total_maximum_amounts,
      icon: 'tabler-archive-off',
      color: 'success',
    },
    {
      label: 'قيمة الطلبات الغير مؤرشفة كحد ادني',
      value:
        startReminderData.un_archived.total_minimum_product_amount +
        availabilityReminderData.un_archived.total_minimum_product_amount,
      icon: 'tabler-archive-off',
      color: 'success',
    },
    {
      label: 'قيم الطلبات الغير مؤرشفة كحد أقصى',
      value:
        startReminderData.un_archived.total_maximum_product_amount +
        availabilityReminderData.un_archived.total_maximum_product_amount,
      icon: 'tabler-archive-off',
      color: 'success',
    },
    {
      label: 'كميات الحد الأدني المؤرشفة',
      value:
        startReminderData.archived.total_minimum_amounts +
        availabilityReminderData.archived.total_minimum_amounts,
      icon: 'tabler-archive',
      color: 'error',
    },
    {
      label: 'كميات الحد الأعلي المؤرشفة',
      value:
        startReminderData.archived.total_maximum_amounts +
        availabilityReminderData.archived.total_maximum_amounts,
      icon: 'tabler-archive',
      color: 'error',
    },
    {
      label: 'قيمة الطلبات المؤرشفة كحد ادني',
      value:
        startReminderData.archived.total_minimum_product_amount +
        availabilityReminderData.archived.total_minimum_product_amount,
      icon: 'tabler-archive',
      color: 'error',
    },
    {
      label: 'قيم الطلبات المؤرشفة كحد أقصى',
      value:
        startReminderData.archived.total_maximum_product_amount +
        availabilityReminderData.archived.total_maximum_product_amount,
      icon: 'tabler-archive',
      color: 'error',
    },
  ]
  return [
    {
      title: 'إحصائات طلبات بدء العرض',
      stats: startReminderStats,
    },
    {
      title: 'إحصائات طلبات توفر الكمية',
      stats: availabilityReminderStats,
    },
    {
      title: 'إحصائات الإجماليات',
      stats: totalSummaryStats,
    },
  ]
})
// #endregion

/***************************************
 **** Section Watchers *****************
 **************************************/
// #region Watchers
watch(params.value, () => {
  getData()
})

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
getData()

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function getData() {
  isLoading.value = true
  remindersRequestsService
    .getStats(props.params)
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
  <div class="subscriptions-logs-stats">
    <template v-if="statsData.length === 0 && isLoading">
      <VSkeletonLoader
        type="card"
        height="40"
        class="overflow-hidden mb-3"
        v-for="i in 3"
        :key="i"
      />
    </template>
    <VExpansionPanels
      class="expansion-panels-width-border mb-3"
      v-for="(item, index) in statsData"
      :key="index"
    >
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle> {{ item.title }} </VExpansionPanelTitle>
        <VExpansionPanelText>
          <VRow class="mt-0" v-if="isLoading">
            <VCol v-for="i in 10" :key="i" cols="12" sm="6" md="4" lg="3" class="pt-0">
              <VSkeletonLoader type="list-item-avatar-two-line" />
            </VCol>
          </VRow>

          <VRow class="mt-0" v-else-if="data">
            <VCol v-for="(stat, index) in item.stats" :key="index" cols="12" sm="6" md="4" lg="3">
              <div class="h-100 d-flex gap-2">
                <VAvatar :color="stat.color" variant="tonal" size="40">
                  <VIcon :icon="stat.icon" />
                </VAvatar>
                <div class="d-flex flex-column">
                  <span class="text-h5 font-weight-medium">{{ stat.value.toFixed(2) }}</span>
                  <span class="text-sm">
                    {{ stat.label }}
                  </span>
                </div>
              </div>
            </VCol>
          </VRow>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
  </div>
</template>
