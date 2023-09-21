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
const { formatDate } = UseGeneralHelpers()
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
        <VCard v-if="activeItem" title="عرض متجر">
          <VCardText>
            <VList :lines="false">
              <VListItem v-if="activeItem.image?.path" class="px-2 py-2" title="صورة المتجر" border>
                <VImg :src="activeItem.image.path" max-width="100" class="my-2" />
              </VListItem>
              <VListItem
                class="px-2 py-2"
                title="الاسم عربي"
                :subtitle="activeItem.name.ar"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="الاسم انجليزي"
                :subtitle="activeItem.name.en || '-'"
                border
              />
            </VList>
            <AppSwitch :model-value="activeItem.from_app" label="معتمد من المنصة" name="from_app" />
            <AppSwitch :model-value="activeItem.is_active" label="الحالة" name="is_active" />
          </VCardText>
        </VCard>
      </div>
    </VCard>
  </VDialog>
</template>
