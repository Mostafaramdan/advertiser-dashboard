<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { CHANNEL_TYPES } from '@/constants/settings'
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
  <VDialog
    v-model="showModal"
    max-width="600"
    scrollable
    class="details-modal"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="showModal = !showModal" />

    <!-- Dialog Content -->
    <VCard>
      <div>
        <VCard v-if="activeItem" title="عرض قناة">
          <VCardText>
            <VList :lines="false">
              <VListItem
                v-if="activeItem.image?.path"
                class="px-2 py-2"
                title="صورة القناء"
                border
              >
                <VImg
                  :src="activeItem.image.path"
                  max-width="100"
                  class="my-2"
                />
              </VListItem>
              <VListItem
                class="px-2 py-2"
                title="اسم القناة بالعربي"
                :subtitle="activeItem.name.ar"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="اسم القناة بالانجليزي"
                :subtitle="activeItem.name.en"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="نسبة المتابعين"
                :subtitle="activeItem.followers_percentage || 0"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="النوع"
                border
              >
                <VChip
                  class="text-center mt-2"
                  color="primary"
                  variant="outlined"
                  label
                >
                  {{ CHANNEL_TYPES[activeItem.channel_type] }}
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
      </div>
    </VCard>
  </VDialog>
</template>
