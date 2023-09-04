<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import type { FormModalProps } from '@/interfaces/Forms'

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
        <VCard v-if="activeItem" title="عرض نشاط">
          <VCardText>
            <VList :lines="false">
              <VListItem class="px-2 py-2" title="اسم الشريحة" :subtitle="activeItem.name" border />
              <VListItem
                class="px-2 py-2"
                title="الحد الادنى للشريحة"
                :subtitle="activeItem.minimum"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="الحد الاعلي للشريحة"
                :subtitle="activeItem.maximum"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="نسبة العمولة داخل المنصة"
                :subtitle="activeItem.value_in_platform"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="نسبة العمولة خارج المنصة"
                :subtitle="activeItem.value_out_platform"
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
