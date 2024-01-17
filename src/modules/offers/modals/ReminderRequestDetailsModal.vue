<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { USERS_ROLES } from '@/constants/index'
import { REMINDER_REQUEST_TYPES } from '@/constants/offers'
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
        <VCard v-if="activeItem" title="عرض طلب">
          <VCardText>
            <VList class="py-0" :lines="false">
              <VListItem title="صاحب الطلب" class="px-2 py-2" border>
                <div class="d-flex align-start">
                  <div class="d-flex flex-column align-center me-3 py-1">
                    <VAvatar size="38" variant="tonal" cover>
                      <VImg
                        v-if="activeItem.user.image_path"
                        :src="activeItem.user.image_path"
                        cover
                      />
                      <span v-else>!</span>
                    </VAvatar>
                  </div>
                  <div style="word-wrap: break-word">
                    {{ activeItem.user.account_name }}
                    <span class="text-sm text-disabled d-block">{{
                      USERS_ROLES[activeItem.user.role]
                    }}</span>
                  </div>
                </div>
              </VListItem>
              <VListItem
                class="px-2 py-2"
                title="رقم الجوال"
                :subtitle="activeItem.user.phone"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="البريد الالكتروني"
                :subtitle="activeItem.user.email"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="نوع الطلب"
                :subtitle="REMINDER_REQUEST_TYPES.get(activeItem.type)?.label"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="اسم المنتج"
                :subtitle="activeItem.product.name"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="رقم المنتج"
                :subtitle="activeItem.product.id"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="الكمية من"
                :subtitle="activeItem.from_quantity ?? '-'"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="الكمية الى"
                :subtitle="activeItem.to_quantity ?? '-'"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="تاريخ الطلب"
                :subtitle="formatDateTime(activeItem.created_at)"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="تاريخ عرض المنتج"
                :subtitle="formatDateTime(activeItem.product.from_date)"
                border
              />

              <VListItem class="px-2 py-2" title="الايميلات" border>
                <ul class="ps-5" v-if="activeItem.emails">
                  <li v-for="(email, index) in activeItem.emails" :key="index">
                    <a :href="`mailto:${email}`">{{ email }}</a>
                  </li>
                </ul>
                <span v-else>-</span>
              </VListItem>
            </VList>
          </VCardText>
        </VCard>
      </div>
    </VCard>
  </VDialog>
</template>
