<script setup lang="ts">
import { PRODUCT_STATUSES } from '@/constants/offers'
import type { FormActionType } from '@/interfaces/Forms'
import { useAuthStore } from '@/stores/AuthStore'
import type { OfferProduct, OfferStoreType } from '../interfaces/Offer'
import ProductFormModal from '../modals/ProductFormModal.vue'
import ProductNotesModal from '../modals/ProductNotesModal.vue'
import ProductPostModal from '../modals/ProductPostModal.vue'
/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(
  defineProps<{
    modelValue: OfferProduct[]
    storeType?: OfferStoreType
    userId?: number | null
    offerId?: number | null
    showTitle?: boolean
  }>(),
  {
    showTitle: true,
    offerId: null,
  },
)

// #endregion

/***************************************
 **** Section Emits Declaration ********
 **************************************/
// #region Emits
const emit = defineEmits<{
  (e: 'deleteProduct', value: number): void
  (e: 'update:modelValue', value: OfferProduct[]): void
}>()

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { hasPermission } = useAuthStore()
const PRODUCTS_MODULE_NAME = 'products'
const confirmModal = ref<any>()
const activeProduct = ref<any>(null)
const showProductPostModal = ref<boolean>(false)
const showProductFormModal = ref<boolean>(false)
const showProductNotesModal = ref<boolean>(false)
const productFormAction = ref<FormActionType>('create')
// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed

const products = computed({
  get() {
    return props.modelValue
  },
  set(newValue: any) {
    emit('update:modelValue', newValue)
  },
})
const permissions = computed(() => ({
  createProduct: hasPermission('create_product'),
  editProduct: hasPermission('update_product'),
  deleteProduct: hasPermission('delete_product'),
  changeProductStatus: hasPermission('change_status_product'),
  viewProducts: hasPermission('view_products'),
  postProduct: hasPermission('post_product'),
  viewNotes: hasPermission('view_product_notes'),
}))
// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
async function showConfirmDeleteItem(product: OfferProduct): Promise<void> {
  const confirm = await confirmModal.value.open('يرجي التاكيد', 'هل انت متاكد من الحذف')

  if (confirm) emit('deleteProduct', product.id)
}

function openProductFormModal(
  product: OfferProduct | null = null,
  action: FormActionType = 'create',
): void {
  activeProduct.value = product
  productFormAction.value = action
  showProductFormModal.value = true
}

function openProductPostModal(product: OfferProduct) {
  activeProduct.value = product
  showProductPostModal.value = true
}

function openProductNotesModal(product: OfferProduct) {
  activeProduct.value = product
  showProductNotesModal.value = true
}

function onPostProduct(productId: number) {
  const targetIndex = products.value.findIndex((product: OfferProduct) => product.id === productId)
  if (targetIndex === -1) return
  products.value[targetIndex].status = 'posted'
}

function onCreateProduct(product: OfferProduct) {
  products.value.push(product)
}
function onEditProduct(product: OfferProduct) {
  const targetIndex = products.value.findIndex((p: OfferProduct) => p.id === product.id)
  products.value.splice(targetIndex, 1, product)
}

// #endregion
</script>

<template>
  <div>
    <ConfirmModal ref="confirmModal" />
    <ProductFormModal
      v-if="showProductFormModal"
      v-model:showModal="showProductFormModal"
      :form-action="productFormAction"
      :active-item="activeProduct"
      @create-item="onCreateProduct"
      @edit-item="onEditProduct"
      :store-type="storeType"
      :user-id="userId"
      :offer-id="offerId"
    />
    <ProductPostModal
      v-if="showProductPostModal"
      v-model:showModal="showProductPostModal"
      :product="activeProduct"
      @postProduct="onPostProduct"
    />
    <ProductNotesModal
      :product-id="activeProduct?.id"
      v-if="showProductNotesModal && activeProduct"
      v-model:showModal="showProductNotesModal"
    />

    <div class="d-flex gap-3 flex-wrap align-center mb-3">
      <h3 class="text-h6" v-if="showTitle">المنتجات</h3>
      <VBtn
        variant="outlined"
        @click="openProductFormModal(null, 'create')"
        class="py-2 d-block ms-auto"
        height="auto"
        size="small"
        :disabled="!userId || !permissions.createProduct"
      >
        اضافة منتج
        <VIcon end icon="tabler-plus" />
      </VBtn>
    </div>
    <VTable density="compact" v-if="products.length">
      <thead>
        <tr class="bg-background">
          <th class="text-uppercase">الاسم</th>
          <th class="text-uppercase">السعر بعد</th>
          <th class="text-uppercase">السعر قبل</th>
          <th class="text-uppercase">حالة المنتج</th>
          <th class="text-uppercase">حالة التنشيط</th>
          <th class="text-uppercase">العمليات</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>
            <div class="d-flex align-center gap-3">
              <div class="d-flex flex-column align-center py-1">
                <VAvatar size="38" variant="tonal" cover>
                  <VImg v-if="product.image_path" :src="product.image_path" cover />
                  <span v-else>!</span>
                </VAvatar>
              </div>
              <div style="word-wrap: break-word">
                {{ product.name }}
              </div>
            </div>
          </td>
          <td>
            {{ product.discount_price ?? '-' }}
          </td>
          <td>
            {{ product.main_price ?? '-' }}
          </td>
          <td>
            {{ PRODUCT_STATUSES.get(product.status)?.label }}
          </td>
          <td>
            <ToggleActivationSwitch
              :id="product.id"
              v-model="product.is_active"
              :model="PRODUCTS_MODULE_NAME"
            />
          </td>
          <td>
            <div class="d-flex">
              <IconBtn
                :disabled="!permissions.editProduct"
                @click="openProductFormModal(product, 'edit')"
              >
                <VIcon icon="tabler-edit" />
              </IconBtn>

              <VBtn icon variant="text" size="small" color="medium-emphasis">
                <VIcon size="24" icon="tabler-dots-vertical" />

                <VMenu activator="parent" max-height="265">
                  <VList>
                    <VListItem
                      :disabled="!permissions.viewProducts"
                      @click="openProductFormModal(product, 'view')"
                    >
                      <template #prepend>
                        <VIcon icon="tabler-eye" />
                      </template>

                      <VListItemTitle>عرض</VListItemTitle>
                    </VListItem>
                    <VListItem
                      :disabled="!permissions.createProduct"
                      @click="openProductFormModal(product, 'create')"
                    >
                      <template #prepend>
                        <VIcon icon="tabler-copy" />
                      </template>

                      <VListItemTitle>تكرار</VListItemTitle>
                    </VListItem>
                    <VListItem
                      :disabled="!permissions.postProduct"
                      @click="openProductPostModal(product)"
                    >
                      <template #prepend>
                        <VIcon icon="tabler-send" />
                      </template>

                      <VListItemTitle>نشر</VListItemTitle>
                    </VListItem>
                    <VListItem
                      :disabled="!permissions.viewNotes"
                      @click="openProductNotesModal(product)"
                    >
                      <template #prepend>
                        <VIcon icon="tabler-notes" />
                      </template>

                      <VListItemTitle>التوصيات</VListItemTitle>
                    </VListItem>
                    <VListItem
                      :disabled="!permissions.deleteProduct"
                      @click="showConfirmDeleteItem(product)"
                    >
                      <template #prepend>
                        <VIcon icon="tabler-trash" />
                      </template>

                      <VListItemTitle>حذف</VListItemTitle>
                    </VListItem>
                  </VList>
                </VMenu>
              </VBtn>
            </div>
          </td>
        </tr>
      </tbody>
    </VTable>
    <div v-else class="text-disabled">لا يوجد منتجات</div>
  </div>
</template>
