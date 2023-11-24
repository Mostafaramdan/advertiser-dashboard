<script setup lang="ts">
import { OFFER_PAYMENT_METHODS } from '@/constants/settings'
import type { FormModalProps } from '@/interfaces/Forms'
import { useVModel } from '@vueuse/core'

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

// #endregion
</script>

<template>
  <VDialog v-model="showModal" max-width="600" scrollable class="details-modal">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="showModal = !showModal" />

    <!-- Dialog Content -->
    <VCard>
      <div>
        <VCard v-if="activeItem" title="عرض طريقة دفع">
          <VCardText>
            <VList :lines="false">
              <VListItem
                class="px-2 py-2"
                title="نسبة المقدم"
                :subtitle="`${activeItem.down_payment_percentage} %`"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="تسليم المقدم"
                :subtitle="
                  OFFER_PAYMENT_METHODS[
                    activeItem.down_payment_delivering as keyof typeof OFFER_PAYMENT_METHODS
                  ]
                "
                border
              />
              <VListItem
                class="px-2 py-2"
                title="تسليم الباقي"
                :subtitle="
                  OFFER_PAYMENT_METHODS[
                    activeItem.remaining_payment_delivering as keyof typeof OFFER_PAYMENT_METHODS
                  ]
                "
                border
              />
            </VList>
            <AppSwitch :model-value="activeItem.is_active" label="الحالة" name="is_active" />
          </VCardText>
        </VCard>
      </div>
    </VCard>
  </VDialog>
</template>
