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
        <VCard v-if="activeItem" title="عرض منطقة">
          <VCardText>
            <VList :lines="false">
              <VListItem
                class="px-2 py-2"
                title="اسم المنطقة بالعربي"
                :subtitle="activeItem.name.ar"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="اسم المنطقة بالانجليزي"
                :subtitle="activeItem.name.en"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="رمز المنطقة"
                :subtitle="activeItem.area_code"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="رابط النطاق الجغرافى"
                border
              >
                <a :href="activeItem.location_url" target="_blank" rel="noopener noreferrer">{{ activeItem.location_url }}</a>
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
