<script setup lang="ts">
import { USERS_TYPES } from '@/constants/tickets'
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
        <VCard v-if="activeItem" title="عرض النوع">
          <VCardText>
            <VList :lines="false">
              <VListItem class="px-2 py-2" title="الاسم" :subtitle="activeItem.name" border />
              <VListItem class="px-2 py-2" title="نوع المستخدم" border>
                <div class="mt-2 d-flex flex-wrap gap-2">
                  <VChip
                    v-for="role in activeItem.user_types"
                    :key="role"
                    class="text-center"
                    color="primary"
                    variant="outlined"
                    label
                  >
                    {{ USERS_TYPES[role] }}
                  </VChip>
                </div>
              </VListItem>
              <VListItem class="px-2 py-2" title="الموظفين المسؤولين" border>
                <div class="mt-2 d-flex flex-wrap gap-2">
                  <VChip
                    v-for="admin in activeItem.admins"
                    :key="admin.id"
                    class="text-center"
                    color="primary"
                    variant="outlined"
                    label
                  >
                    {{ admin.label }}
                  </VChip>
                </div>
              </VListItem>
            </VList>
            <AppSwitch :model-value="activeItem.is_active" label="الحالة" name="is_active" />
          </VCardText>
        </VCard>
      </div>
    </VCard>
  </VDialog>
</template>
