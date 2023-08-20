<script setup lang="ts">
import { useDisplay } from 'vuetify'
import PaymentMethodCard from '../../components/PaymentMethodCard.vue'
import type { PaymentGetWay, PaymentMethod } from '../../interfaces/PlatformDetails'
import PaymentMethodFormModal from '../../modals/PaymeMethodFormModal.vue'
import { platformService } from '../../services/PlatformService'
import { useAuthStore } from '@/stores/AuthStore'
import { UseCrudHelpers } from '@/composables/UserCrudHelpers'
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const { mdAndDown } = useDisplay()
const { getImageUrl } = UseGeneralHelpers()
const { hasPermission } = useAuthStore()

const {
  showFormModal,
  FormAction,
  activeItem,
  confirmModal,
  showCrateModal,
  showEditModal,
} = UseCrudHelpers<PaymentMethod>(null, null, '')

const selectedGetWay = ref<PaymentGetWay>('bank')

const isLoading = reactive({
  data: false,
  submit: false,
})

const data = reactive<any>({
  bank: [],
  card: [],
  apple_pay: [],
  stc_pay: [],
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const permissions = computed(() => ({
  create: hasPermission('create_billing_card'),
}))

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
  isLoading.data = true
  platformService.getPaymentMethodsData().then(res => {
    Object.assign(data, res.data.data)
  }).finally(() => {
    isLoading.data = false
  })
}

function deleteItem(item: PaymentMethod) {
  if (!item.id) return
  isLoading.data = true
  platformService.deletePaymentMethod(item.id).then(() => {
    if (!item.gateway) return
    const index = data[item.gateway].findIndex((i: PaymentMethod) => i.id === item.id)
    if (index === -1) return
    data[item.gateway].splice(index, 1)
  }).finally(() => {
    isLoading.data = false
  })
}

async function showConfirmDeleteItem(item: PaymentMethod): Promise<void> {
  const confirm = await confirmModal.value.open(
    'يرجي التاكيد',
    'هل انت متاكد من الحذف',
  )

  if (confirm) deleteItem(item)
}

function onShowEditModal(item: PaymentMethod) {
  showEditModal(item)
}

function onCreateItem(item: PaymentMethod) {
  console.log(item)
  if (item.gateway) {
    selectedGetWay.value = item.gateway
    data[item.gateway].push(item)
  }
}

function onEditItem(item: PaymentMethod) {
  if (!item.id || !item.gateway) return
  const index = data[item.gateway].findIndex((i: PaymentMethod) => i.id === item.id)
  if (index === -1) return
  data[item.gateway].splice(index, 1, item)
}

// #endregion
</script>

<template>
  <div v-loading="isLoading.data" class="payments-methods">
    <ConfirmModal ref="confirmModal" />
    <PaymentMethodFormModal
      v-if="showFormModal"
      v-model:showModal="showFormModal"
      :form-action="FormAction"
      :active-item="activeItem"
      :get-way="selectedGetWay"
      @create-item="onCreateItem"
      @edit-item="onEditItem"
    />
    <VBtn v-if="permissions.create" class="mb-6" variant="outlined" @click="showCrateModal">
      اضافة طريقة دفع
      <VIcon
        end
        icon="tabler-plus"
      />
    </VBtn>
    <div class=" d-flex" :class="mdAndDown ? 'flex-column' : 'flex-row'">
      <div>
        <VTabs
          v-model="selectedGetWay"
          :direction="mdAndDown ? 'horizontal' : 'vertical'"
          center-active
        >
          <VTab v-for="(payments, key) in data" :key="key" :value="key">
            <VAvatar size="48" variant="outlined">
              <VImg :src="getImageUrl(`svg/payments-icons/${key}.svg`)" />
            </VAvatar>
            <span class="ms-2">{{ t(`payment_methods.${key}`) }}</span>
          </VTab>
        </VTabs>
      </div>

      <VWindow
        v-model="selectedGetWay"
        class="ms-md-3 mt-3 mt-lg-0 flex-grow-1"
      >
        <VWindowItem v-for="(payments, key) in data" :key="key" :value="key">
          <VRow v-if="payments.length">
            <VCol
              v-for="payment in payments"
              :key="payment.id"
              cols="12"
              md="6"
            >
              <PaymentMethodCard :payment="payment" :gateway="(key) as any" @confirm-delete="showConfirmDeleteItem" @show-edit-modal="onShowEditModal" />
            </VCol>
          </VRow>
          <div v-else class="text-h6">
            {{ t("general.no_data") }}
          </div>
        </VWindowItem>
      </VWindow>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.payments-methods {
  min-block-size: 50vh;

  :deep(.v-tabs) {
    block-size: auto;

    .v-btn {
      block-size: auto;

      .v-avatar {
        border-width: 3px;
      }

      &.v-tab--selected {
        .v-avatar {
          border-color: rgb(var(--v-theme-primary));
        }
      }

      @include responsive-down(lg) {
        margin-block-end: 8px;

        .v-tab__slider {
          inset-block-end: -8px;
        }
      }
    }
  }

  :deep(.v-slide-group--vertical .v-slide-group__content) {
    gap: 24px;
  }
}
</style>
