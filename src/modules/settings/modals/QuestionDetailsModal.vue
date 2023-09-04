<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { questionsService } from '../services/QuestionsService'
import { USERS_TYPES } from '@/constants/settings'
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
  questionsService
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
  <VDialog v-model="showModal" max-width="1000" scrollable class="details-modal">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="showModal = !showModal" />

    <!-- Dialog Content -->
    <VCard v-loading="isLoading">
      <div>
        <VCard v-if="data" title="عرض سؤال">
          <VCardText>
            <VList :lines="false">
              <VListItem class="px-2 py-2" title="السؤال" :subtitle="data.question" border />
              <VListItem class="px-2 py-2" title="القسم" :subtitle="data.category.name" border />

              <VListItem class="px-2 py-2" title="الاجابة" border>
                <AppTextEditor
                  v-model="data.answer"
                  name="answer"
                  label="الاجابة"
                  is-read-only
                  hide-label
                />
              </VListItem>

              <VListItem class="px-2 py-2" title="نوع المستخدمين" border>
                <VChip
                  v-for="type in data.for as unknown"
                  :key="type"
                  class="my-2 me-2 text-center"
                  color="primary"
                  variant="outlined"
                  label
                >
                  {{ USERS_TYPES[type] }}
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
