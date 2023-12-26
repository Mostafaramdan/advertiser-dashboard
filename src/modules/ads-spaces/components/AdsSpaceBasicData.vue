<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { useAdsSpacesStore } from '@/stores/AdsSpacesStore'
import { useAuthStore } from '@/stores/AuthStore'
import { useToast } from 'vue-toastification'
import type { AdsSpace } from '../interfaces/AdsSpace'
import AdsSpacesAddBalanceModal from '../modals/AdsSpacesAddBalanceModal.vue'
import { adsSpacesService } from '../services/AdsSpacesService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const toast = useToast()
const route = useRoute()
const router = useRouter()
const { hasPermission } = useAuthStore()
const adsSpacesStore = useAdsSpacesStore()
const { formatDate } = UseGeneralHelpers()
const MODEL_NAME = 'ad_spaces'
const adsSpaceId = +route.params.id
const confirmModal = ref<any>()
const showAddBalanceModal = ref<boolean>(false)
const isLoading = reactive({
  data: false,
  delete: false,
})
// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const permissions = computed(() => ({
  delete: hasPermission('delete_ad_space'),
  changeStatus: hasPermission('change_status_ad_space'),
  addBalance: hasPermission('add_balance_to_ad_space'),
}))

const data = computed(() => adsSpacesStore.adsSpaceDetails)
// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
getPageData()

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function getPageData() {
  adsSpacesStore.setAdsSpaceDetails(null)
  isLoading.data = true
  adsSpacesService
    .getSingleItem(adsSpaceId)
    .then((res) => {
      adsSpacesStore.setAdsSpaceDetails(res.data.data)
    })
    .finally(() => {
      isLoading.data = false
    })
}

function deleteItem() {
  isLoading.delete = true
  adsSpacesService
    .deleteItem(adsSpaceId)
    .then((res) => {
      toast.success(res.data.message)
      router.push({ name: 'ads-spaces-page' })
    })
    .finally(() => {
      isLoading.delete = false
    })
}
async function showConfirmModal(): Promise<void> {
  const confirm = await confirmModal.value.open('يرجي التاكيد', 'هل انت متاكد من الحذف')

  if (!confirm) return

  deleteItem()
}

function onEditItem(item: AdsSpace) {
  adsSpacesStore.setAdsSpaceDetails(item)
}
// #endregion
</script>

<template>
  <div>
    <ConfirmModal ref="confirmModal" />
    <AdsSpacesAddBalanceModal
      :ad-space-id="adsSpaceId"
      v-if="showAddBalanceModal"
      v-model:showModal="showAddBalanceModal"
      @edit-item="onEditItem"
    />
    <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle> عرض تفاصيل المساحة </VExpansionPanelTitle>
        <VExpansionPanelText>
          <div class="basic-data">
            <VSkeletonLoader v-if="isLoading.data" type="list-item-avatar-two-line" />
            <div v-else-if="data" class="profile-card d-flex align-md-center">
              <div class="me-3">
                <VAvatar variant="outlined" size="80" cover rounded="0">
                  <VImg v-if="data.image_path" :src="data.image_path" cover />
                  <span v-else>!</span>
                </VAvatar>
              </div>
              <div class="profile-card__content flex-grow-1">
                <h3 class="mb-1 d-flex flex-wrap align-center justify-between gap-x-3">
                  <span class="me-auto">{{ data.name }}</span>
                  <VBtn variant="outlined" :max-width="38" :min-width="40">
                    <VIcon icon="tabler-dots-vertical" />
                    <VMenu activator="parent" max-height="265">
                      <VList>
                        <VListItem
                          :disabled="isLoading.delete || !permissions.delete"
                          @click="showConfirmModal"
                        >
                          <template #prepend>
                            <VIcon icon="tabler-trash" />
                          </template>
                          <VListItemTitle>حذف</VListItemTitle>
                        </VListItem>
                        <VListItem
                          :disabled="!permissions.addBalance"
                          @click="showAddBalanceModal = true"
                        >
                          <template #prepend>
                            <VIcon icon="tabler-circle-plus" />
                          </template>

                          <VListItemTitle>إضافة رصيد</VListItemTitle>
                        </VListItem>
                        <VListItem @click.stop :disabled="!permissions.changeStatus">
                          <ToggleActivationSwitch
                            class="ps-2"
                            :id="data.id"
                            v-model="data.is_active"
                            :model="MODEL_NAME"
                            :disabled="!permissions.changeStatus"
                            :label="data.is_active ? 'تنشيط' : 'إيقاف'"
                          />
                        </VListItem>
                      </VList>
                    </VMenu>
                  </VBtn>
                </h3>
                <div class="d-flex flex-wrap gap-x-4 gap-y-2">
                  <span class="d-flex align-center"
                    ><strong class="me-3">رقم المساحة</strong>
                    {{ data.id }}
                  </span>
                  <span class="d-flex align-center"
                    ><strong class="me-3">اسم المستخدم</strong>
                    {{ data.user.username }}
                  </span>
                  <span class="d-flex align-center">
                    <strong class="me-3">المشاهدات الأساسية</strong>
                    {{ data.watches_count }}
                  </span>
                  <span class="d-flex align-center">
                    <strong class="me-3">المشاهدات المتبقية</strong>
                    {{ data.remaining_watches_count }}
                  </span>
                  <span class="d-flex align-center">
                    <strong class="me-3">تاريخ الانشاء</strong>
                    {{ formatDate(data.created_at) }}
                  </span>
                  <span class="d-flex align-center">
                    <strong class="me-3">الرصيد الحالي</strong>
                    {{ data.balance }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
  </div>
</template>

<style lang="scss" scoped>
.profile-card {
  font-size: 14px;
  word-break: break-word;
}
</style>
