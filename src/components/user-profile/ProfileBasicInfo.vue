<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import type { AdvertiserBasicData } from '@/interfaces/Advertiser'
import { usersService } from '@/services/UsersService'
import { useAuthStore } from '@/stores/AuthStore'
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'

/***************************************
 **** Section Emits Declaration ********
 **************************************/
// #region Emits
const emit = defineEmits<{
  (e: 'update:user', value: AdvertiserBasicData): void
}>()

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { hasPermission } = useAuthStore()
const { formatDate } = UseGeneralHelpers()
const route = useRoute()
const advertiserId: number = +route.params.id
const MODEL_NAME = 'users'
const advertiser = ref<AdvertiserBasicData | null>(null)
const isLoading = ref<boolean>(false)

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
getBasicInfo()

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function getBasicInfo() {
  isLoading.value = true
  usersService
    .getBasicInfo(advertiserId)
    .then((res: any) => {
      const response: any = res.data.data

      advertiser.value = response
      emit('update:user', response)
    })
    .finally(() => {
      isLoading.value = false
    })
}

// #endregion
</script>

<template>
  <VCard class="mb-3">
    <VCardText class="pa-4">
      <VSkeletonLoader v-if="isLoading" type="list-item-avatar-two-line" />
      <div v-else-if="advertiser" class="profile-card d-flex align-md-center">
        <VAvatar variant="outlined" size="80" class="me-3" cover rounded="0">
          <VImg v-if="advertiser.image_path" :src="advertiser.image_path" cover />
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
          <VChip v-if="advertiser.is_deleted" color="error" label class="mb-2"> حساب محذوف </VChip>
          <div class="d-flex flex-wrap gap-x-4 gap-y-2">
            <span class="d-flex align-center"
              ><strong class="me-3">رقم العضوية</strong>
              {{ advertiser.id }}
            </span>
            <span v-if="advertiser.created_at" class="d-flex align-center">
              <strong class="me-3">تاريخ التسجيل</strong>
              {{ formatDate(advertiser.created_at) }}
            </span>
          </div>
        </div>
      </div>
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.profile-card {
  font-size: 14px;
  word-break: break-word;
}
</style>
