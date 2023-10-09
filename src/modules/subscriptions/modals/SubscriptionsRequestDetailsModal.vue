<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { GENDER_TYPES, USERS_ROLES, USERS_TYPES } from '@/constants/index'
import { PAYMENT_STATUSES, REQUEST_STATUSES } from '@/constants/subscriptions'
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
        <VCard v-if="activeItem" title="عرض طلب الاشتراك">
          <VCardText>
            <VList :lines="false">
              <VListItem class="px-2 py-2" border>
                <div class="d-flex align-center">
                  <div class="d-flex flex-column align-center me-3 py-1">
                    <VAvatar size="38" variant="tonal" cover>
                      <VImg v-if="activeItem.user.image" :src="activeItem.user.image" cover />
                      <span v-else>!</span>
                    </VAvatar>
                  </div>
                  <div style="min-width: 205px">
                    {{ activeItem.user.account_name }}
                    <span class="text-sm text-disabled d-block">{{ activeItem.user.email }}</span>
                  </div>
                </div>
              </VListItem>
              <VListItem
                class="px-2 py-2"
                title="رقم الجوال"
                :subtitle="activeItem.user.phone"
                border
              />
              <VListItem class="px-2 py-2" title="رقم الطلب" :subtitle="activeItem.id" border />
              <VListItem
                class="px-2 py-2"
                title="وقت الطلب"
                :subtitle="formatDateTime(activeItem.created_at)"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="تاريخ الانتهاء"
                :subtitle="formatDateTime(activeItem.ended_at)"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="عدد ايام الايقاف المتبقية"
                :subtitle="activeItem.remaining_stop_days"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="الدولة"
                :subtitle="activeItem.user.country"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="المدينة"
                :subtitle="activeItem.user.area_name"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="الجنس"
                :subtitle="GENDER_TYPES[activeItem.user.gender as 'male' | 'female']"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="نوع المشترك"
                :subtitle="
                  USERS_ROLES[activeItem.user.role] + ' ' + USERS_TYPES[activeItem.user.type]
                "
                border
              />
              <VListItem
                class="px-2 py-2"
                title="اسم باقة الإشتراك"
                :subtitle="activeItem.package_name"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="قيمة الاشتراك"
                :subtitle="activeItem.total"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="حالة الطلب"
                :subtitle="REQUEST_STATUSES[activeItem.request_status]"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="حالة الدفع"
                :subtitle="PAYMENT_STATUSES[activeItem.payment_status]"
                border
              />
              <VListItem class="px-2 py-2" title="اسم المسوق" border>
                <router-link
                  v-if="activeItem.marketer_info?.user_id"
                  :to="{
                    name: 'advertisers-profile-page',
                    params: { id: activeItem.marketer_info.user_id },
                  }"
                >
                  {{ activeItem.marketer_info.account_name }}</router-link
                >
                <span v-else>لا يوجد</span>
              </VListItem>
              <VListItem
                class="px-2 py-2"
                title="كود الخصم"
                :subtitle="activeItem.marketer_info?.code || 'لا يوجد'"
                border
              />
            </VList>
          </VCardText>
        </VCard>
      </div>
    </VCard>
  </VDialog>
</template>
