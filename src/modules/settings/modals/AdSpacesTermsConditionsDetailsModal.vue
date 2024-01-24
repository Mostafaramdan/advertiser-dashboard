<script setup lang="ts">
import type { FormModalProps } from '@/interfaces/Forms'
import { useVModel } from '@vueuse/core'
import { adSpacesTermsConditionsService } from '../services/AdSpacesTermsConditionsService'

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
  adSpacesTermsConditionsService
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
              <VListItem class="px-2 py-2" title="العنوان" :subtitle="data.name" border />
              <VListItem class="px-2 py-2" title="النوع" :subtitle="data.type.label" border />

              <VListItem class="px-2 py-2" title="الاجابة" border>
                <AppTextEditor
                  v-model="data.description"
                  name="description"
                  label="الوصف"
                  is-read-only
                  hide-label
                />
              </VListItem>
            </VList>
            <AppSwitch :model-value="data.is_active" label="الحالة" name="is_active" />
          </VCardText>
        </VCard>
      </div>
    </VCard>
  </VDialog>
</template>
