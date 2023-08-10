<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import type { Category } from '../interfaces/Category'
import { CATEGORY_TYPES } from '@/constants/settings'
/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
interface EntitiesFormModalProps {
  showModal: boolean
  activeItem: Category | null
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
    <VCard>
      <VCard v-if="activeItem" title="عرض نشاط">
        <VCardText>
          <VList :lines="false">
            <VListItem
              class="px-2 py-2"
              title="اسم النشاط بالعربي"
              :subtitle="activeItem.name.ar"
              border
            />
            <VListItem
              class="px-2 py-2"
              title="اسم النشاط بالانجليزي"
              :subtitle="activeItem.name.en"
              border
            />
            <VListItem
              class="px-2 py-2"
              title="النوع"
              border
            >
              <VChip
                v-for="type in (activeItem.type as unknown)"
                :key="type"
                class="my-2 text-center"
                color="primary"
                variant="outlined"
                label
              >
                {{ CATEGORY_TYPES[type] }}
              </VChip>
            </VListItem>
          </VList>
          <AppSwitch
            :model-value="activeItem.blocked_at"
            label="الحالة"
            name="blocked_at"
          />
        </VCardText>
      </VCard>
    </VCard>
  </VDialog>
</template>
