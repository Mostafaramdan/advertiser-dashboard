<script setup lang="ts">
import { useAuthStore } from '@/stores/AuthStore'
import { useVModel } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import type { OfferPermissionsFormData } from '../interfaces/Offer'
import { offersService } from '../services/OffersService'
/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(
  defineProps<{
    showModal: boolean
    offerId: number
  }>(),
  {
    showModal: false,
  },
)

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
const { t } = useI18n()
const toast = useToast()
const { hasPermission } = useAuthStore()
const showModal = useVModel(props, 'showModal', emit)
const formData = reactive<OfferPermissionsFormData>({
  store_type: false,
  offer_date: false,
  main_data: false,
})
const isLoading = reactive({
  data: false,
  submit: false,
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const permissions = computed(() => ({
  updateEditPermissions: hasPermission('update_offer_permissions'),
}))
// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
getData()
// #endregion

/***************************************
 **** Section Functions  *********
 **************************************/
// #region Functions
function submit() {
  isLoading.submit = true
  offersService
    .updatePermissions(props.offerId, formData)
    .then((res) => {
      toast.success(res.data.message)
      showModal.value = false
    })
    .finally(() => {
      isLoading.submit = false
    })
}

function getData() {
  isLoading.data = true
  offersService
    .getPermissions(props.offerId)
    .then((res) => {
      Object.assign(formData, res.data.data)
    })
    .finally(() => {
      isLoading.data = false
    })
}

// #endregion
</script>

<template>
  <VDialog v-model="showModal" max-width="600" persistent>
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="showModal = !showModal" />

    <!-- Dialog Content -->
    <VCard>
      <VCardTitle class="py-3">صلاحيات تعديل العرض</VCardTitle>
      <VCardText
        style="block-size: 400px; overflow-y: auto"
        class="pa-0"
        v-loading="isLoading.data"
      >
        <VList :lines="false" class="py-0">
          <VListItem border v-for="(value, key) in formData" :key="key">
            <div class="ps-2 py-2">
              <VCheckbox
                density="compact"
                v-model="formData[key]"
                :label="t(`offers.permissions.${key}`)"
              />
            </div>
          </VListItem>
        </VList>
      </VCardText>

      <VDivider />
      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn variant="outlined" color="error" @click="showModal = false">
          {{ t('actions.cancel') }}
        </VBtn>
        <VBtn
          :loading="isLoading.submit"
          :disabled="isLoading.submit || !permissions.updateEditPermissions"
          @click="submit"
        >
          {{ t('actions.save') }}
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
