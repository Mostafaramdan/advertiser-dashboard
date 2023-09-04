<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { CATEGORY_TYPES } from '@/constants/settings'
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
        <VCard v-if="activeItem" title="عرض قسم">
          <VCardText>
            <VList :lines="false">
              <VListItem
                class="px-2 py-2"
                title="اسم القسم بالعربي"
                :subtitle="activeItem.name.ar"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="اسم القسم بالانجليزي"
                :subtitle="activeItem.name.en"
                border
              />
              <VListItem class="px-2 py-2" title="النوع" border>
                <VChip
                  v-for="type in activeItem.type as unknown"
                  :key="type"
                  class="my-2 me-2 text-center"
                  color="primary"
                  variant="outlined"
                  label
                >
                  {{ CATEGORY_TYPES[type] }}
                </VChip>
              </VListItem>
            </VList>
            <AppSwitch :model-value="activeItem.is_active" label="الحالة" name="is_active" />
          </VCardText>
        </VCard>
      </div>
    </VCard>
  </VDialog>
</template>
