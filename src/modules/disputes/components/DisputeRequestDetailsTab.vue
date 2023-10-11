<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { sharedService } from '@/services/SharedService'
import { useAuthStore } from '@/stores/AuthStore'
import { useDisputesStore } from '@/stores/DisputesStore'
import { useToast } from 'vue-toastification'
import type { DisputeRequest, DisputeRequestDetails } from '../interfaces/DisputeRequest'
import RequestProcedureModal from '../modals/RequestProcedureModal.vue'
import { requestsService } from '../services/RequestsService'

/***************************************
 **** Section Emits Declaration ********
 **************************************/
// #region Emits
const emit = defineEmits<{ (e: 'reloadBasicData'): void }>()

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const route = useRoute()
const toast = useToast()
const { formatDateTime } = UseGeneralHelpers()
const disputesStore = useDisputesStore()
const { hasPermission } = useAuthStore()
const MODEL_NAME = 'disputes'
const isLoading = ref<boolean>(false)
const showProcedureModal = ref<boolean>(false)
const data = ref<DisputeRequestDetails | null>(null)
const disputeRequestId = +route.params.id
const defaultFileImage = new URL('../../../assets/images/svg/file-icons/other.svg', import.meta.url)
// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const permissions = computed(() => ({
  takeProcedure: hasPermission('make_procedure_dispute'),
}))

const requestDetails = computed(() => disputesStore.requestDetails)
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
  isLoading.value = true
  requestsService
    .getDetails(disputeRequestId)
    .then((res) => {
      data.value = res.data.data
    })
    .finally(() => {
      isLoading.value = false
    })
}

function toggleFavorite(item: DisputeRequest) {
  isLoading.value = true
  item.is_starred = !item.is_starred
  const payload: any = {
    id: item.id,
    model: MODEL_NAME,
    column: 'is_starred',
  }
  sharedService
    .toggleActivation(payload)
    .then((res) => {
      toast.success(res.data.message)
      emit('reloadBasicData')
    })
    .catch(() => {
      item.is_starred = !item.is_starred
    })
    .finally(() => {
      isLoading.value = false
    })
}

function openProcedureModal() {
  showProcedureModal.value = true
}

function onTakeProcedure() {
  emit('reloadBasicData')
  getPageData()
}

// #endregion
</script>

<template>
  <section class="details-tab" v-loading="isLoading">
    <RequestProcedureModal
      :request-id="disputeRequestId"
      v-if="showProcedureModal && requestDetails"
      v-model:showModal="showProcedureModal"
      @procedure:sent="onTakeProcedure"
    />
    <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle>إجراءات المنصة</VExpansionPanelTitle>
        <VExpansionPanelText v-if="data && requestDetails">
          <div class="d-flex flex-wrap align-center gap-y-3 gap-x-5">
            <VBtn
              variant="outlined"
              class="my-2"
              min-width="200"
              @click="toggleFavorite(requestDetails)"
            >
              اضافة للمفضلة
              <VIcon
                end
                icon="tabler-star-filled"
                :color="requestDetails.is_starred ? '#ffcc00' : 'dark'"
              />
            </VBtn>
            <VBtn
              variant="outlined"
              class="my-2"
              min-width="200"
              @click="openProcedureModal"
              :disabled="!permissions.takeProcedure"
            >
              اتخاذ اجراء <VIcon end icon="tabler-status-change" />
            </VBtn>
            <ToggleActivationSwitch
              :id="disputeRequestId"
              v-model="requestDetails.can_rate"
              :model="MODEL_NAME"
              column="can_rate"
              label="امكانية التقييم للطرفين"
            />
          </div>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>

    <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle>وصف سبب التنازع</VExpansionPanelTitle>
        <VExpansionPanelText v-if="data">
          {{ data.description }}
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>

    <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle>مرفقات طلب التنازع</VExpansionPanelTitle>
        <VExpansionPanelText v-if="data">
          <VRow v-if="data.attachments.length">
            <VCol
              col="12"
              md="6"
              v-for="(attachment, index) of data.attachments"
              :key="attachment.id"
            >
              <a
                :href="attachment.path"
                download
                target="_blank"
                class="attachment d-flex gap-3 border pa-2"
              >
                <div class="attachment__img">
                  <img
                    :src="attachment.thumbnail || attachment.path"
                    @error="(e: any) => (e.target.src = defaultFileImage)"
                  />
                </div>
                <span class="attachment__name">{{ attachment.name }}</span>
              </a>
              <VDivider v-if="index !== data.attachments.length - 1" />
            </VCol>
          </VRow>
          <p v-else class="text-body-1 mb-0">لا يوجد بيانات</p>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>

    <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle>سجل إجراءات المنصة</VExpansionPanelTitle>
        <VExpansionPanelText v-if="data">
          <VList :lines="false" class="py-0" v-if="data.procedures.length">
            <template v-for="(procedure, index) of data.procedures" :key="procedure.id">
              <VListItem class="px-0">
                <VListItemTitle>
                  {{ procedure.details }}
                </VListItemTitle>
                <div class="mt-1">
                  <VIcon icon="tabler-clock" class="me-2"></VIcon>
                  <span class="text-disabled">{{ formatDateTime(procedure.created_at) }}</span>
                </div>
              </VListItem>
              <VDivider v-if="index !== data.procedures.length - 1" />
            </template>
          </VList>
          <p v-else class="text-body-1 mb-0">لا يوجد بيانات</p>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>

    <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle>تقييم الطرفين</VExpansionPanelTitle>
        <VExpansionPanelText v-if="data">
          <VRow>
            <VCol cols="12" md="6">
              <p class="mb-2 font-weight-bold">تقييم الشاكي</p>
              <div v-if="data.disputer_rate">
                <v-rating
                  hover
                  readonly
                  :length="5"
                  :size="25"
                  :model-value="data.disputer_rate.rate"
                  active-color="#ffcc00"
                  color="#ffcc00"
                />
                <p class="text-body-1 mb-0">{{ data.disputer_rate.comment || 'لا يوجد تعليق' }}</p>
              </div>
              <p v-else class="text-body-1 mb-0">لا يوجد بيانات</p>
            </VCol>
            <VCol cols="12" md="6">
              <p class="mb-2 font-weight-bold">تقييم المشكي</p>
              <div v-if="data.disputed_rate">
                <v-rating
                  hover
                  readonly
                  :length="5"
                  :size="25"
                  :model-value="data.disputed_rate.rate"
                  active-color="#ffcc00"
                  color="#ffcc00"
                />
                <p class="text-body-1 mb-0">{{ data.disputed_rate.comment || 'لا يوجد تعليق' }}</p>
              </div>
              <p v-else class="text-body-1 mb-0">لا يوجد بيانات</p>
            </VCol>
          </VRow>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>

    <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle>تفاصيل انهاء التنازع</VExpansionPanelTitle>
        <VExpansionPanelText v-if="data && requestDetails">
          <div class="order-info" v-if="data.finished_action?.user">
            <VRow class="mt-0">
              <VCol class="py-2 order-info__item" cols="12" sm="6" lg="4">
                <h5 class="text-primary text-subtitle-2">
                  {{
                    requestDetails.disputer.id === data.finished_action.user.id
                      ? 'الشاكي'
                      : 'المشكي'
                  }}
                </h5>
                <p class="text-body-2 mb-0">
                  {{ data.finished_action.user.username }}
                </p>
              </VCol>
              <VCol class="py-2 order-info__item" cols="12" sm="6" lg="4">
                <h5 class="text-primary text-subtitle-2">سبب الانهاء</h5>
                <p class="text-body-2 mb-0">
                  {{ data.finished_action.details || '-' }}
                </p>
              </VCol>
            </VRow>
          </div>
          <p v-else class="text-body-1 mb-0">لا يوجد بيانات</p>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
  </section>
</template>

<style lang="scss" scoped>
:deep(.v-list-item-title) {
  white-space: wrap;
}

.attachment {
  &__img {
    block-size: 40px;
    inline-size: 40px;
    min-inline-size: 40px;

    img {
      block-size: 100%;
      inline-size: 100%;
      object-fit: contain;
    }
  }

  &__name {
    @include max-lines(2);
  }

  &:hover &__name {
    opacity: 0.8;
  }
}

.order-info {
  &__item {
    display: flex;
    flex-wrap: wrap;
    gap: 5px 10px;

    @include responsive-down('md') {
      flex-direction: column;
    }

    h5 {
      min-inline-size: 120px;
    }

    p {
      word-break: break-word;
    }
  }
}
</style>
