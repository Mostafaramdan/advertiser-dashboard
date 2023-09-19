<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { adsService } from '@/services/AdsService'
import { useAdsStore } from '@/stores/AdsStore'
import { useAuthStore } from '@/stores/AuthStore'
import { useToast } from 'vue-toastification'
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const router = useRouter()
const toast = useToast()
const { hasPermission } = useAuthStore()
const adsStore = useAdsStore()
const { formatDateTime } = UseGeneralHelpers()
const showNotificationModal = ref<boolean>(false)
const activeUser = ref(null)
const confirmModal = ref<any>()
const isDeleting = ref<boolean>(false)
// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const permissions = computed(() => ({
  sendNotification: hasPermission('notify_users'),
  delete: hasPermission('delete_ads'),
}))

const adData = computed(() => {
  return adsStore.adDetails
})
// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function openNotificationModal(user: any) {
  activeUser.value = user
  showNotificationModal.value = true
}

function deleteRequest() {
  isDeleting.value = true
  adsService
    .deleteItem(adData.value.id)
    .then((res) => {
      toast.success(res.data.message)
      router.push({ name: 'ads-page' })
    })
    .finally(() => {
      isDeleting.value = false
    })
}

async function showConfirmDeleteRequest(): Promise<void> {
  const confirm = await confirmModal.value.open('يرجي التاكيد', 'هل انت متاكد من الحذف')

  if (confirm) deleteRequest()
}
// #endregion
</script>

<template>
  <div>
    <NotificationModal
      v-if="activeUser && showNotificationModal"
      v-model:showModal="showNotificationModal"
      :user="activeUser"
    />
    <ConfirmModal ref="confirmModal" />
    <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle> عرض تفاصيل الاعلان </VExpansionPanelTitle>
        <VExpansionPanelText>
          <div class="basic-data">
            <VSkeletonLoader v-if="!adData" type="list-item-avatar-two-line" />
            <div v-else-if="adData" class="profile-card d-flex flex-column flex-sm-row gap-3">
              <VAvatar variant="outlined" size="80" cover rounded="0">
                <VImg v-if="adData.image_path" :src="adData.image_path" cover />
                <span v-else>!</span>
              </VAvatar>
              <div class="profile-card__content flex-grow-1">
                <div class="d-flex flex-wrap gap-x-4 gap-y-1">
                  <span class="d-flex align-center flex-wrap"
                    ><strong class="me-3">اسم المعلن</strong>
                    {{ adData.advertiser.username }}
                  </span>
                  <span class="d-flex align-center flex-wrap" v-if="adData.user">
                    <strong class="me-3">اسم العميل</strong>
                    {{ adData.user.username }}
                  </span>
                  <span class="w-100"></span>
                  <span class="d-flex align-center"
                    ><strong class="me-3">رقم الاعلان</strong>
                    {{ adData.id }}
                  </span>
                  <span class="d-flex align-center">
                    <strong class="me-3">تاريخ البداية</strong>
                    {{ formatDateTime(adData.started_at) }}
                  </span>
                  <span class="d-flex align-center">
                    <strong class="me-3">تاريخ النهاية</strong>
                    {{ adData.ended_at ? formatDateTime(adData.ended_at) : 'لا يوجد' }}
                  </span>
                  <span class="d-flex align-center">
                    <strong class="me-3">حالة الاعلان</strong>
                    {{ adData.status_txt }}
                  </span>
                  <div class="d-flex flex-wrap gap-3 w-100 mt-2">
                    <VMenu>
                      <template v-slot:activator="{ props }">
                        <VBtn
                          color="primary"
                          v-bind="props"
                          variant="outlined"
                          :disabled="!permissions.sendNotification"
                        >
                          ارسال اشعار <VIcon end icon="tabler-mail" />
                        </VBtn>
                      </template>
                      <VList>
                        <VListItem @click="openNotificationModal(adData.advertiser)">
                          <VListItemTitle>ارسال اشعار للمعلن</VListItemTitle>
                        </VListItem>
                        <VListItem v-if="adData.user" @click="openNotificationModal(adData.user)">
                          <VListItemTitle>ارسال اشعار للعميل</VListItemTitle>
                        </VListItem>
                      </VList>
                    </VMenu>
                    <VBtn
                      variant="outlined"
                      color="error"
                      class="me-3"
                      @click="showConfirmDeleteRequest"
                      :loading="isDeleting"
                      :disabled="isDeleting || !permissions.delete"
                    >
                      حذف الاعلان<VIcon end icon="tabler-trash" />
                    </VBtn>
                  </div>
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
