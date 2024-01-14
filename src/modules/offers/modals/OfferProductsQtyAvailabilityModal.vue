<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import type { OfferProduct } from '../interfaces/Offer'
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
const showModal = useVModel(props, 'showModal', emit)
const productList = ref<OfferProduct[]>([])
const isLoading = reactive({
  data: false,
  submit: false,
})

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
getData()
// #endregion

/***************************************
 **** Section Functions  *********
 **************************************/
// #region Functions
function submit() {
  const payload = productList.value.map((product: OfferProduct) => ({
    id: product.id,
    show: product.show_available_quantity,
  }))

  isLoading.submit = true
  offersService
    .offerProductsQtyAvailability(payload)
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
    .getOfferProducts(props.offerId)
    .then((res) => {
      productList.value = res.data.data
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
      <VCardTitle class="py-3">تعديل حالة كمية المنتجات</VCardTitle>
      <div style="block-size: 2px">
        <VProgressLinear
          v-if="isLoading.data"
          indeterminate
          color="primary"
          height="2"
        ></VProgressLinear>
      </div>
      <VCardText style="block-size: 400px; overflow-y: auto" class="pa-0">
        <VList :lines="false" v-if="productList.length" class="py-0">
          <VListItem border v-for="product in productList" :key="product.id" class="text-sm">
            <VRow class="align-center my-0">
              <VCol cols="12" sm="8" class="py-1">
                <div class="d-flex align-center gap-3">
                  <div class="d-flex flex-column align-center">
                    <VAvatar size="38" variant="tonal" cover>
                      <VImg v-if="product.image_path" :src="product.image_path" cover />
                      <span v-else>!</span>
                    </VAvatar>
                  </div>
                  <div class="product-name">
                    {{ product.name }}
                  </div>
                </div>
              </VCol>
              <VCol cols="12" sm="4" class="py-1">
                <div class="d-flex justify-sm-end px-2">
                  <VSwitch
                    v-model="product.show_available_quantity"
                    :inset="false"
                    :disabled="!product.can_change_quantity_status"
                  />
                </div>
              </VCol>
            </VRow>
          </VListItem>
        </VList>

        <VCardText v-if="!isLoading.data && productList.length === 0" class="text-body-1">
          لا يوجد بيانات
        </VCardText>
      </VCardText>

      <VDivider />
      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn variant="outlined" color="error" @click="showModal = false">
          {{ t('actions.cancel') }}
        </VBtn>
        <VBtn
          :loading="isLoading.submit"
          :disabled="isLoading.submit || !productList.length"
          @click="submit"
        >
          {{ t('actions.save') }}
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style lang="scss" scoped>
.product-name {
  @include max-lines(2);

  word-wrap: break-word;
}
</style>
