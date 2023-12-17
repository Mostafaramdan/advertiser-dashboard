<script setup lang="ts">
import type { FormModalProps } from '@/interfaces/Forms'
import { useVModel } from '@vueuse/core'
import { logsService } from '../services/LogsService'
const WithdrawDetailsCard = defineAsyncComponent(
  () => import('../components/WithdrawDetailsCard.vue'),
)
const RequestDetailsCard = defineAsyncComponent(
  () => import('../components/RequestDetailsCard.vue'),
)
const RefundDetailsCard = defineAsyncComponent(() => import('../components/RefundDetailsCard.vue'))
const ChargeDetailsCard = defineAsyncComponent(() => import('../components/ChargeDetailsCard.vue'))
const SubscriptionDetailsCard = defineAsyncComponent(
  () => import('../components/SubscriptionDetailsCard.vue'),
)
const MarkterCommissionDetailsCard = defineAsyncComponent(
  () => import('../components/MarkterCommissionDetailsCard.vue'),
)
const DefaultDetailsCard = defineAsyncComponent(
  () => import('../components/DefaultDetailsCard.vue'),
)

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
const isLoading = ref<boolean>(false)
const data = ref<any>(null)

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const modalComponent = computed(() => {
  switch (props.activeItem.type_key) {
    case 'withdraw':
      return WithdrawDetailsCard
    case 'request':
      return RequestDetailsCard
    case 'refund':
      return RefundDetailsCard
    case 'charge':
      return ChargeDetailsCard
    case 'subscription':
      return SubscriptionDetailsCard
    case 'markter_commission':
      return MarkterCommissionDetailsCard
    case 'prize':
    case 'release':
    case 'transformed_points':
    default:
      return DefaultDetailsCard
  }
})
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
  logsService
    .getSingleItem(id)
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
  <VDialog v-model="showModal" max-width="900" scrollable class="details-modal">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="showModal = !showModal" />

    <!-- Dialog Content -->
    <VCard v-loading="isLoading">
      <div v-if="modalComponent">
        <Component :is="modalComponent" :data="data" :title="data?.title" />
      </div>
    </VCard>
  </VDialog>
</template>
