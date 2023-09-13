<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
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
const { formatDateTime } = UseGeneralHelpers()
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
        <VCard v-if="activeItem" title="عرض طلب الاعلان">
          <VCardText>
            <VList :lines="false">
              <VListItem
                :title="index === 0 ? 'المعلن' : 'العميل'"
                class="px-2 py-2"
                border
                v-for="(user, index) in [activeItem.advertiser, activeItem.user]"
                :key="index"
              >
                <div class="d-flex align-start">
                  <div class="d-flex flex-column align-center me-3 py-1">
                    <VAvatar size="38" variant="tonal" cover>
                      <VImg v-if="user.image_path" :src="user.image_path" cover />
                      <span v-else>!</span>
                    </VAvatar>
                    <span class="d-flex align-center text-sm">
                      <VIcon icon="tabler-star-filled" color="#ffcc00" size="18" start />
                      {{ user.rate }}
                    </span>
                  </div>
                  <div style="word-wrap: break-word">
                    {{ user.account_name }}
                    <span class="text-sm text-disabled d-block">{{ user.email }}</span>
                    <span class="text-sm text-disabled d-block">{{ user.phone }}</span>
                  </div>
                </div>
              </VListItem>

              <VListItem class="px-2 py-2" title="رقم الطلب" :subtitle="activeItem.id" border />

              <VListItem
                class="px-2 py-2"
                title="تاريخ الطلب"
                :subtitle="formatDateTime(activeItem.created_at)"
                border
              />
              <VListItem class="px-2 py-2" title="قيمة الطلب" :subtitle="activeItem.price" border />
              <VListItem
                class="px-2 py-2"
                title="عمولة المنصة"
                :subtitle="activeItem.commission"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="المفرج عنه"
                :subtitle="activeItem.release_total"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="المكافات"
                :subtitle="activeItem.total_prize"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="حالة الدفع"
                :subtitle="activeItem.payment_status"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="طريقة الدفع"
                :subtitle="activeItem.payment_method"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="حالة الطلب"
                :subtitle="activeItem.ads_request_status"
                border
              />
            </VList>
          </VCardText>
        </VCard>
      </div>
    </VCard>
  </VDialog>
</template>
