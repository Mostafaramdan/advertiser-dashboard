<script setup lang="ts">
import { GENDER_TYPES, NOTIFICATIONS_TYPES } from '@/constants/index'
import type { UserBasicData, UserDetails } from '@/interfaces/User'
import { usersService } from '@/services/UsersService'
import { useAuthStore } from '@/stores/AuthStore'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
interface DetailsTabProps {
  user: UserBasicData | null
}
withDefaults(defineProps<DetailsTabProps>(), {})

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const route = useRoute()
const { hasPermission } = useAuthStore()
const userId: number = +route.params.id
const data = ref<UserDetails | any>({})
const isLoading = ref<boolean>(false)
const showNotificationModal = ref<boolean>(false)
const selectedNotificationType = ref<string>('')

const statsData = ref([
  {
    label: 'المبيعات',
    key: 'sales',
  },
  {
    label: 'المشتريات',
    key: 'purchases',
  },
  {
    label: 'الطلبات',
    key: 'user_requests',
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
])

const userDetails = ref([
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
    label: 'الجنس',
    key: 'gender',
  },
  {
    label: 'نوع الكيان',
    key: 'type',
  },
])

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const permissions = computed(() => ({
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
  usersService
    .getDetails(userId)
    .then((res: any) => {
      data.value = res.data.data
    })
    .finally(() => {
      isLoading.value = false
    })
}

function openNotificationModal(type: string) {
  selectedNotificationType.value = type
  showNotificationModal.value = true
}
// #endregion
</script>

<template>
  <div v-loading="isLoading">
    <NotificationModal
      v-if="user && showNotificationModal"
      v-model:showModal="showNotificationModal"
      :user="user"
      :defaultSelectedType="selectedNotificationType"
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
                  v-for="item in userDetails"
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
                    <span v-if="item.key === 'gender'">{{
                      GENDER_TYPES[data.gender as 'male' | 'female']
                    }}</span>
                    <span v-else>{{ data[item.key] || '-' }}</span>
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
            <VExpansionPanelText>
              <VBtn
                variant="text"
                class="mt-2 mb-5 px-0"
                @click="openNotificationModal('')"
                :disabled="!permissions.sendNotification"
              >
                ارسال تنبيه عبر
              </VBtn>
              <div class="d-flex flex-wrap gap-3">
                <VBtn
                  :disabled="!permissions.sendNotification"
                  size="38"
                  v-for="type in NOTIFICATIONS_TYPES"
                  :key="type.value"
                  @click="openNotificationModal(type.value)"
                  variant="outlined"
                >
                  <VIcon :icon="type.icon" size="22" />
                </VBtn>
              </div>
            </VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>
      </VCol>
    </VRow>
  </div>
</template>

<style lang="scss" scoped>
.platform-info__card__body {
  min-block-size: 80px;
}
</style>
