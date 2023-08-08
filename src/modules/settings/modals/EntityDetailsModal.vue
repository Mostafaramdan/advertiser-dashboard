<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import type { Entity } from '../interfaces/Entity'
/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
interface EntitiesFormModalProps {
  showModal: boolean
  activeItem: Entity | null
}

const props = withDefaults(defineProps<EntitiesFormModalProps>(), {
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
  <VDialog
    v-model="showModal"
    max-width="600"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="showModal = !showModal" />

    <!-- Dialog Content -->
    <VCard v-if="activeItem" title="عرض كيان">
      <VCardText>
        <VList :lines="false">
          <VListItem
            class="px-2 py-2"
            title="اسم الكيان بالعربي"
            :subtitle="activeItem.name.ar"
            border
          />
          <VListItem
            class="px-2 py-2"
            title="اسم الكيان بالانجليزي"
            :subtitle="activeItem.name.en"
            border
          />
        </VList>
        <AppSwitch
          :model-value="activeItem.blocked_at"
          label="الحالة"
          name="blocked_at"
        />
      </VCardText>
    </VCard>
  </VDialog>
</template>
