<script setup lang="ts">
import { reportsService } from '@/modules/reports/services/ReportsService'
import { useAuthStore } from '@/stores/AuthStore'

import { ChatBlock, User } from '../interfaces/ChatBlock'

/***************************************
 **** Section Emits Declaration ********
 **************************************/
// #region Emits
const emit = defineEmits<{
  (e: 'open:notificationModal', value: User): void
}>()

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { hasPermission } = useAuthStore()
const route = useRoute()
const chatBlockId: number = +route.params.id
const data = ref<ChatBlock | null>(null)
const isLoading = ref<boolean>(false)

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
getBasicInfo()

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function getBasicInfo() {
  isLoading.value = true
  reportsService
    .getChatBlockItem(chatBlockId)
    .then((res: any) => {
      const response: any = res.data.data

      data.value = response
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
      <div v-else-if="data" class="profile-card d-flex align-md-center">
        <VAvatar variant="outlined" size="80" class="me-3" cover rounded="0">
          <VImg v-if="data.blocked.image_path" :src="data.blocked.image_path" cover />
          <span v-else>!</span>
        </VAvatar>
        <div class="profile-card__content flex-grow-1">
          <h3 class="mb-1 d-flex flex-wrap align-center justify-between gap-x-3">
            <span class="me-auto">{{ data.blocked.username }}</span>

            <IconBtn
              :disabled="!permissions.sendNotification"
              @click="emit('open:notificationModal', data.blocked)"
            >
              <VIcon icon="tabler-mail" />
            </IconBtn>
          </h3>
          <div class="d-flex flex-wrap gap-x-4 gap-y-2">
            <span class="d-flex align-center"
              ><strong class="me-3">رقم المحادثة</strong>
              {{ data.id }}
            </span>
            <span class="d-flex align-center"
              ><strong class="me-3">عدد مرات الحظر</strong>
              {{ data.blocks_count }}
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
