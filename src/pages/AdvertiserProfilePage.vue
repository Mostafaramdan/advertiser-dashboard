<script setup lang="ts">
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'
import DetailsTab from '@/components/advertiser-profile/DetailsTab.vue'
import LicensesAndDocumentsTab from '@/components/advertiser-profile/LicensesAndDocumentsTab.vue'
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { advertisersService } from '@/services/AdvertisersService'
import { useAuthStore } from '@/stores/AuthStore'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const route = useRoute()
const router = useRouter()
const { hasPermission } = useAuthStore()
const { formatDate } = UseGeneralHelpers()
const MODEL_NAME = 'advertisers'
const advertiserId: number = +route.params.id
const currentTab = ref<any>()
const advertiser = ref<any>()
const isLoading = ref<boolean>(false)

// #endregion

// TODO: ADD permissions
const tabs = [
  {
    title: 'بيانات التاجر',
    value: 'details',
    component: DetailsTab,
    show: true,
  },
  {
    title: 'التراخيص والوثائق',
    value: '',
    component: LicensesAndDocumentsTab,
    show: true,
  },
]

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const permissions = computed(() => ({
  changeStatus: hasPermission('change_status_advertiser'),
}))

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
// check tab from query
getBasicInfo()
onMounted(() => {
  const tab = route.query.tab
  if (tab) currentTab.value = tab
  else currentTab.value = tabs[0].value
})

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function updateRouteQuery() {
  router.push({ path: route.fullPath, query: { tab: currentTab.value } })
}

function getBasicInfo() {
  isLoading.value = true
  advertisersService
    .getBasicInfo(advertiserId)
    .then((res: any) => {
      advertiser.value = res.data.data
    })
    .finally(() => {
      isLoading.value = false
    })
}

// #endregion
</script>

<template>
  <section class="advertiser-profile">
    <div class="d-flex overflow-auto text-nowrap mb-3 align-center">
      <PageBackBtn :link="{ name: 'advertisers-page' }" />
      <VBtn variant="outlined" class="me-3">
        سجل النشاطات
        <VIcon end icon="tabler-history" />
      </VBtn>
      <VBtn variant="outlined" class="me-3">
        استعراض الإعلانات <VIcon end icon="tabler-ad-2" />
      </VBtn>
      <VBtn variant="outlined" class="me-3">
        استعراض الطلبات <VIcon end icon="tabler-file-check" />
      </VBtn>
    </div>
    <VCard class="mb-3">
      <VCardText class="pa-4">
        <VSkeletonLoader v-if="isLoading" type="list-item-avatar-two-line" />
        <div v-else class="profile-card d-flex align-md-center">
          <VAvatar
            variant="outlined"
            size="80"
            class="me-3"
            cover
            rounded="0"
          >
            <VImg v-if="advertiser.image" :src="advertiser.image" cover />
            <span v-else>!</span>
          </VAvatar>
          <div class="profile-card__content flex-grow-1">
            <h3 class="mb-1 d-flex flex-wrap align-center justify-between gap-x-3">
              <span class="me-auto">{{ advertiser.username }}</span>
              <ToggleActivationSwitch
                :id="advertiser.id"
                v-model="advertiser.is_active"
                :model="MODEL_NAME"
                :disabled="!permissions.changeStatus || advertiser.is_deleted"
                :label="advertiser.is_active ? 'تنشيط' : 'إيقاف'"
              />
            </h3>
            <VChip
              v-if="advertiser.is_deleted || true"
              color="error"
              label
              class="mb-2"
            >
              حساب محذوف
            </VChip>
            <div class="d-flex flex-wrap gap-x-4 gap-y-2">
              <span class="d-flex align-center"><strong class="me-3">رقم العضوية</strong>
                {{ advertiser.id }}
              </span>
              <span v-if="advertiser.created_at" class="d-flex align-center">
                <strong class="me-3">بداية النشاط</strong>
                {{ formatDate(advertiser.created_at) }}
              </span>
              <span
                v-if="advertiser.subscription_end_date"
                class="d-flex align-center"
              >
                <strong class="me-3">ينتهي الاشتراك بتاريخ</strong>
                {{ formatDate(advertiser.subscription_end_date) }}
              </span>
            </div>
          </div>
        </div>
      </VCardText>
    </VCard>
    <VCard>
      <VCardText class="pa-4">
        <VTabs
          v-model="currentTab"
          class="mb-3 v-tabs-pill"
          @update:model-value="updateRouteQuery"
        >
          <template v-for="tab in tabs" :key="tab.value">
            <VTab v-if="tab.show" :value="tab.value">
              {{ tab.title }}
            </VTab>
          </template>
        </VTabs>
        <div v-for="tab in tabs" :key="tab.value">
          <Component :is="tab.component" v-if="currentTab === tab.value" />
        </div>
      </VCardText>
    </VCard>
  </section>
</template>

<style lang="scss">
.profile-card {
  font-size: 14px;
  word-break: break-word;
}
</style>
