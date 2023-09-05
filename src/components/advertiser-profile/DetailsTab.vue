<script setup lang="ts">
import type { AdvertiserBasicData, AdvertiserDetails } from '@/interfaces/Advertiser'
import { advertisersService } from '@/services/AdvertisersService'
import { useAuthStore } from '@/stores/AuthStore'
import { useToast } from 'vue-toastification'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
interface DetailsTabProps {
  user: AdvertiserBasicData | null
}
withDefaults(defineProps<DetailsTabProps>(), {})

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const toast = useToast()
const route = useRoute()
const { hasPermission } = useAuthStore()
const advertiserId: number = +route.params.id
const data = ref<AdvertiserDetails | any>({})
const isLoading = ref<boolean>(false)
const showNotificationModal = ref<boolean>(false)

const procedures = ref([
  {
    label: 'التحقق من الاعدادات',
    key: 'trustes_settings',
    loading: false,
  },
  {
    label: 'مرخص في موثوق',
    key: 'licensed_at_mawthoq',
    loading: false,
  },
  {
    label: 'معتمد في المنصة',
    key: 'verified',
    loading: false,
  },
  {
    label: 'موثق في معروف',
    key: 'ma3roof_verified',
    loading: false,
  },
  {
    label: 'معلن موزع',
    key: 'marketer',
    loading: false,
  },
])

const statsData = ref([
  {
    label: 'عدد المتابعين',
    key: 'followers_count',
  },
  {
    label: 'عدد الاعلانات',
    key: 'ads_count',
  },
  {
    label: 'التقييم',
    key: 'rate',
  },
  {
    label: 'المحفظة',
    key: 'wallet',
  },
  {
    label: 'النقاط',
    key: 'points_balance',
  },
  {
    label: 'حالة الاشتراك',
    key: 'subscription_status',
  },
  {
    label: 'الإعدادات',
    key: 'profile_completion',
  },
])

const advertiserDetails = ref([
  {
    label: 'البريد الإلكتروني',
    key: 'email',
  },
  {
    label: 'الهاتف',
    key: 'phone',
  },
  {
    label: 'اسم المستخدم',
    key: 'username',
  },
  {
    label: 'اسم صاحب الحساب',
    key: 'account_name',
  },
  {
    label: 'الدولة',
    key: 'country_name',
  },
  {
    label: 'المدينة',
    key: 'area_name',
  },
  {
    label: 'حالة الحساب',
    key: 'profile_completion',
  },
  {
    label: 'نوع الكيان',
    key: 'type',
  },
  {
    label: 'باقة الاشتراك',
    key: 'subscription_name',
  },
  {
    label: 'بيانات موثوق',
    key: 'mawthooq',
  },
  {
    label: 'بيانات معروف',
    key: 'ma3roof',
  },
])

const advertiserBankAccountData = ref([
  {
    label: 'اسم الحساب',
    key: 'account_name',
  },
  {
    label: 'رقم الحساب',
    key: 'account_number',
  },
  {
    label: 'اسم البنك',
    key: 'name',
  },
  {
    label: 'رمز السويفت',
    key: 'swift_code',
  },
  {
    label: 'نوع الحساب',
    key: 'type',
  },
])

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const permissions = computed(() => ({
  takeProcedure: hasPermission('take_procedure'),
  sendNotification: hasPermission('notify_users'),
}))

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
getData()

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function getData() {
  isLoading.value = true
  advertisersService
    .getDetails(advertiserId)
    .then((res: any) => {
      data.value = res.data.data
    })
    .finally(() => {
      isLoading.value = false
    })
}

function takeProcedure(procedure: any) {
  procedure.loading = true
  advertisersService
    .takeProcedure({ id: advertiserId, type: procedure.key })
    .then((res) => {
      toast.success(res.data.message)
    })
    .catch(() => {
      data.value.procedures[procedure.key] = !data.value.procedures[procedure.key]
    })
    .finally(() => {
      procedure.loading = false
      console.log('finally', procedure)
    })
}

// #endregion
</script>

<template>
  <div v-loading="isLoading">
    <NotificationModal
      v-if="user && showNotificationModal"
      v-model:showModal="showNotificationModal"
      :user="user"
    />
    <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle> عرض بيانات التاجر </VExpansionPanelTitle>
        <VExpansionPanelText>
          <div class="platform-info">
            <div v-for="stat in statsData" :key="stat.key" class="platform-info__card">
              <h3 class="platform-info__card__title">
                {{ stat.label }}
              </h3>
              <div v-if="stat.key === 'rate'" class="platform-info__card__body">
                <div class="d-flex align-center">
                  <VIcon icon="tabler-star-filled" color="#ffcc00" size="18" start />
                  {{ data.rate }}
                </div>
              </div>
              <div v-else-if="stat.key === 'profile_completion'" class="platform-info__card__body">
                <VProgressCircular
                  :rotate="360"
                  :size="50"
                  :width="3"
                  :model-value="data.profile_completion"
                  color="primary"
                  class="my-2"
                >
                  {{ data.profile_completion }}%
                </VProgressCircular>
              </div>
              <template v-else>
                <div class="platform-info__card__body">
                  {{ data[stat.key] }}
                </div>
              </template>
            </div>
          </div>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>

    <VRow class="py-3">
      <VCol cols="12" md="8" class="py-0">
        <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
          <VExpansionPanel elevation="0">
            <VExpansionPanelTitle> عرض المزيد من البيانات </VExpansionPanelTitle>
            <VExpansionPanelText>
              <VRow>
                <VCol
                  v-for="item in advertiserDetails"
                  :key="item.key"
                  class="py-2"
                  cols="12"
                  sm="6"
                  lg="4"
                >
                  <h5 class="text-primary text-subtitle-2">
                    {{ item.label }}
                  </h5>
                  <VChip
                    v-if="item.key === 'profile_completion'"
                    label
                    :color="data.profile_completion === 100 ? 'success' : 'error'"
                    :prepend-icon="
                      data.profile_completion === 100
                        ? 'tabler-circle-check'
                        : 'tabler-playstation-x'
                    "
                    class="px-2 mt-1 mb-3"
                  >
                    {{ data.profile_completion === 100 ? 'مكتمل' : 'غير مكتمل' }}
                  </VChip>
                  <VChip
                    v-else-if="item.key === 'mawthooq'"
                    label
                    :color="data.mawthooq ? 'success' : 'error'"
                    :prepend-icon="data.mawthooq ? 'tabler-circle-check' : 'tabler-playstation-x'"
                    class="px-2 mt-1 mb-3"
                  >
                    {{ data.mawthooq ? 'تم الادخال' : 'لا يوجد بيانات' }}
                  </VChip>
                  <VChip
                    v-else-if="item.key === 'ma3roof'"
                    label
                    :color="data.ma3roof ? 'success' : 'error'"
                    :prepend-icon="data.ma3roof ? 'tabler-circle-check' : 'tabler-playstation-x'"
                    class="px-2 mt-1 mb-3"
                  >
                    {{ data.ma3roof ? 'تم الادخال' : 'لا يوجد بيانات' }}
                  </VChip>
                  <p v-else class="text-body-2 mb-0">
                    {{ data[item.key] || '-' }}
                  </p>
                </VCol>
              </VRow>
            </VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>
      </VCol>
      <VCol cols="12" md="4" class="py-0">
        <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
          <VExpansionPanel elevation="0">
            <VExpansionPanelTitle> عرض الاجراءات </VExpansionPanelTitle>
            <VExpansionPanelText v-if="data.procedures">
              <VSwitch
                v-for="procedure in procedures"
                :key="procedure.key"
                v-model="data.procedures[procedure.key]"
                :label="procedure.label"
                hide-details
                :loading="procedure.loading"
                :disabled="procedure.loading"
                :readonly="!permissions.takeProcedure"
                density="comfortable"
                :inset="false"
                class="mb-1"
                @click="takeProcedure(procedure)"
              />
              <VBtn
                variant="outlined"
                class="mt-2"
                @click="showNotificationModal = true"
                :disabled="!permissions.sendNotification"
              >
                ارسال تنبيه عبر
                <VIcon end icon="tabler-mail" />
              </VBtn>
            </VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>
      </VCol>
    </VRow>
    <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle> عرض بيانات الحساب البنكي </VExpansionPanelTitle>
        <VExpansionPanelText>
          <VRow v-if="data.bank_account">
            <VCol
              v-for="item in advertiserBankAccountData"
              :key="item.key"
              class="py-2"
              cols="12"
              sm="6"
              lg="4"
            >
              <h5 class="text-primary text-subtitle-2">
                {{ item.label }}
              </h5>
              <p class="text-body-2 mb-0">
                {{ data.bank_account[item.key] }}
              </p>
            </VCol>
          </VRow>
          <p v-else class="text-body-1 mb-0">لا يوجد بيانات</p>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
  </div>
</template>

<style lang="scss" scoped>
.platform-info__card__body {
  min-block-size: 80px;
}
</style>
