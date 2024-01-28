<script setup lang="ts">
import { REPLIES_TYPES } from '@/constants/settings'
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
const isLoading = ref<boolean>(false)
const data = ref(props.activeItem)

// #endregion
</script>

<template>
  <VDialog v-model="showModal" max-width="600" scrollable class="details-modal">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="showModal = !showModal" />

    <!-- Dialog Content -->
    <VCard v-loading="isLoading">
      <div>
        <VCard v-if="data" title="عرض رد">
          <VCardText>
            <VList :lines="false">
              <VListItem class="px-2 py-2" title="نص الرد" :subtitle="data.reply" border />
              <VListItem class="px-2 py-2" title="النوع" border>
                <VChip
                  v-for="type in data.types as unknown"
                  :key="type"
                  class="my-2 me-2 text-center"
                  color="primary"
                  variant="outlined"
                  label
                >
                  {{ REPLIES_TYPES[type] }}
                </VChip>
              </VListItem>
            </VList>
            <AppSwitch :model-value="data.is_active" label="الحالة" name="is_active" />
          </VCardText>
        </VCard>
      </div>
    </VCard>
  </VDialog>
</template>
