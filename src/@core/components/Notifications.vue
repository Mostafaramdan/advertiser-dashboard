<script lang="ts" setup>
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import type { Notification } from '@layouts/types'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'

interface Props {
  notifications: any
  badgeProps?: any
  location?: any
}
interface Emit {
  (e: 'read', value: number[]): void
  (e: 'unread', value: number[]): void
  (e: 'remove', value: number): void
  (e: 'click:notification', value: Notification): void
}

const props = withDefaults(defineProps<Props>(), {
  location: 'bottom end',
  badgeProps: undefined,
})

const emit = defineEmits<Emit>()
const router = useRouter()
const { formatDateTime } = UseGeneralHelpers()
const showMenu = ref<boolean>(false)
const isAllMarkRead = computed(() =>
  props.notifications.some((item: any) => item.is_seen === false),
)

const markAllReadOrUnread = () => {
  const allNotificationsIds = props.notifications.map((item: any) => item.id)

  if (!isAllMarkRead.value) emit('unread', allNotificationsIds)
  else emit('read', allNotificationsIds)
}

const totalUnseenNotifications = computed(() => {
  return props.notifications.filter((item: any) => item.is_seen === false).length
})

function toggleRead(notification: any) {
  if (notification.is_seen) emit('unread', [notification.id])
  else emit('read', [notification.id])
}

function goToNotificationsPage() {
  router.push({ name: 'dashboard-notifications-page' })
  showMenu.value = false
}
</script>

<template>
  <IconBtn id="notification-btn">
    <VBadge
      v-bind="props.badgeProps"
      :model-value="props.notifications.some((n: any) => !n.is_seen)"
      color="error"
      :content="totalUnseenNotifications"
      class="notification-badge"
    >
      <VIcon size="26" icon="tabler-bell" />
    </VBadge>

    <VMenu
      activator="parent"
      width="380px"
      :location="props.location"
      offset="14px"
      :close-on-content-click="false"
      v-model="showMenu"
    >
      <VCard class="d-flex flex-column">
        <!-- 👉 Header -->
        <VCardItem class="notification-section py-2">
          <VCardTitle class="text-lg"> الاشعارات </VCardTitle>

          <template #append v-if="props.notifications.some((item: any) => !item.is_seen)">
            <IconBtn v-show="props.notifications.length" @click="markAllReadOrUnread">
              <VIcon icon="tabler-mail-check" />

              <VTooltip activator="parent" location="start"> تحديد الكل كمقروء </VTooltip>
            </IconBtn>
          </template>
        </VCardItem>

        <VDivider />

        <!-- 👉 Notifications list -->
        <PerfectScrollbar :options="{ wheelPropagation: false }" style="max-block-size: 23.75rem">
          <VList class="notification-list rounded-0 py-0">
            <template
              v-for="(notification, index) in props.notifications"
              :key="notification.title"
            >
              <VDivider v-if="index > 0" />
              <VListItem
                link
                lines="one"
                min-height="66px"
                class="list-item-hover-class"
                @click="$emit('click:notification', notification)"
              >
                <!-- Slot: Prepend -->
                <!-- Handles Avatar: Image, Icon, Text -->
                <template #prepend>
                  <VListItemAction start>
                    <VAvatar size="40">
                      <VImg
                        v-if="notification.action_by.image_path"
                        :src="notification.action_by.image_path"
                        cover
                      />
                      <span v-else>!</span>
                    </VAvatar>
                  </VListItemAction>
                </template>

                <VListItemTitle>{{ notification.title }}</VListItemTitle>
                <VListItemSubtitle>{{ notification.body }}</VListItemSubtitle>
                <span class="text-xs text-disabled">{{
                  formatDateTime(notification.created_at)
                }}</span>

                <!-- Slot: Append -->
                <template #append>
                  <div class="d-flex flex-column align-center gap-4">
                    <VBadge
                      dot
                      :color="notification.is_seen ? 'success' : 'error'"
                      :class="`${notification.is_seen ? 'visible-in-hover' : ''} ms-1`"
                      @click.stop="toggleRead(notification)"
                    />

                    <div style="block-size: 28px; inline-size: 28px">
                      <IconBtn
                        size="small"
                        class="visible-in-hover"
                        @click="$emit('remove', notification.id)"
                      >
                        <VIcon size="20" icon="tabler-trash" />
                      </IconBtn>
                    </div>
                  </div>
                </template>
              </VListItem>
            </template>

            <VListItem
              v-show="!props.notifications.length"
              class="text-center text-medium-emphasis"
              style="block-size: 56px"
            >
              <VListItemTitle>لا توجد اشعارات</VListItemTitle>
            </VListItem>
          </VList>
        </PerfectScrollbar>

        <VDivider />

        <!-- 👉 Footer -->
        <VCardActions v-show="props.notifications.length" class="notification-footer">
          <VBtn block @click="goToNotificationsPage"> عرض جميع الاشعارات </VBtn>
        </VCardActions>
      </VCard>
    </VMenu>
  </IconBtn>
</template>

<style lang="scss">
.notification-section {
  padding: 14px !important;
}

.notification-footer {
  padding: 6px !important;
}

.list-item-hover-class {
  .visible-in-hover {
    display: none;
  }

  &:hover {
    .visible-in-hover {
      display: block;
    }
  }
}

.notification-list.v-list {
  .v-list-item {
    border-radius: 0 !important;
    margin: 0 !important;
  }
}

// Badge Style Override for Notification Badge
.notification-badge {
  .v-badge__badge {
    /* stylelint-disable-next-line liberty/use-logical-spec */
    min-width: 18px;
    padding: 0;
    block-size: 18px;
  }
}
</style>
