<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { rateItemsService } from '../services/RateItemsService'
import { RATE_ITEM_TARGETS, RATE_ITEM_TYPES, RATE_ITEM_WAYS } from '@/constants/settings'
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
const isLoading = ref<boolean>(false)
const data = ref(props.activeItem)

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
getItemDetails(props.activeItem.id)

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function getItemDetails(id: any) {
  isLoading.value = true
  rateItemsService
    .getSingleItem(id)
    .then((res) => {
      data.value = res.data.data
    })
    .finally(() => {
      isLoading.value = false
    })
}

// #endregion
</script>

<template>
  <VDialog v-model="showModal" max-width="800" scrollable class="details-modal">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="showModal = !showModal" />

    <!-- Dialog Content -->
    <VCard v-loading="isLoading">
      <div>
        <VCard v-if="data" title="عرض تقييم">
          <VCardText>
            <VList :lines="false">
              <VListItem
                class="px-2 py-2"
                title="اسم التقييم بالعربي"
                :subtitle="data.name.ar"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="اسم التقييم بالانجليزي"
                :subtitle="data.name.en"
                border
              />
              <VListItem class="px-2 py-2" title="النوع" border>
                <VChip class="text-center mt-2" color="primary" variant="outlined" label>
                  {{ RATE_ITEM_TYPES[data.type] }}
                </VChip>
              </VListItem>
              <VListItem class="px-2 py-2" title="المستهدف" border>
                <VChip class="text-center mt-2" color="primary" variant="outlined" label>
                  {{ RATE_ITEM_TARGETS[data.for] }}
                </VChip>
              </VListItem>
              <VListItem class="px-2 py-2" title="الطريقة" border>
                <VChip class="text-center mt-2" color="primary" variant="outlined" label>
                  {{ RATE_ITEM_WAYS[data.way] }}
                </VChip>
              </VListItem>
              <VListItem
                v-if="data.way === 'straight'"
                class="px-2 py-2"
                title="نقاط التقييم"
                :subtitle="data.points"
                border
              />
              <VListItem
                v-else-if="data.way === 'question'"
                class="px-2 py-2"
                title="الاجابات"
                border
              >
                <VTable density="compact">
                  <thead>
                    <tr>
                      <th style="min-width: 180px" class="text-uppercase ps-0">الإجابة بالعربي</th>
                      <th style="min-width: 180px" class="text-uppercase">الإجابة بالانجليزي</th>
                      <th class="text-uppercase text-center">النقاط</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr v-for="(answer, index) in data.answers" :key="index">
                      <td class="ps-0">
                        {{ answer.answer.ar }}
                      </td>
                      <td>
                        {{ answer.answer.en }}
                      </td>
                      <td class="text-center">
                        {{ answer.points }}
                      </td>
                    </tr>
                  </tbody>
                </VTable>
              </VListItem>
            </VList>
            <AppSwitch :model-value="data.is_active" label="الحالة" name="is_active" />
          </VCardText>
        </VCard>
      </div>
    </VCard>
  </VDialog>
</template>
