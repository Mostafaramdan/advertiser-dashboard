<script lang="ts" setup>
const notifications = ref<any>([
  {
    id: '1',
    title: 'Lorem Ipsum 1',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    notification_type: 'Type A',
    created_at: '2023-10-10T08:30:00.000Z',
    action_by: {
      id: '101',
      role: 'Admin',
      account_name: 'admin_user1',
      image_path: 'https://picsum.photos/200/300/?random=1',
    },
    is_seen: true,
  },
  {
    id: '2',
    title: 'Lorem Ipsum 2',
    body: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    notification_type: 'Type B',
    created_at: '2023-10-11T14:45:00.000Z',
    action_by: {
      id: '102',
      role: 'User',
      account_name: 'user123',
      image_path: 'https://picsum.photos/200/300/?random=2',
    },
    is_seen: false,
  },
  {
    id: '3',
    title: 'Lorem Ipsum 3',
    body: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    notification_type: 'Type C',
    created_at: '2023-10-12T10:15:00.000Z',
    action_by: {
      id: '103',
      role: 'Manager',
      account_name: 'manager456',
      image_path: 'https://picsum.photos/200/300/?random=3',
    },
    is_seen: true,
  },
  {
    id: '4',
    title: 'Lorem Ipsum 4',
    body: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.',
    notification_type: 'Type A',
    created_at: '2023-10-13T19:20:00.000Z',
    action_by: {
      id: '104',
      role: 'Admin',
      account_name: 'admin_user2',
      image_path: 'https://picsum.photos/200/300/?random=4',
    },
    is_seen: false,
  },
  {
    id: '5',
    title: 'Lorem Ipsum 5',
    body: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.',
    notification_type: 'Type B',
    created_at: '2023-10-14T16:10:00.000Z',
    action_by: {
      id: '105',
      role: 'User',
      account_name: 'user789',
      image_path: 'https://picsum.photos/200/300/?random=5',
    },
    is_seen: true,
  },
])

const removeNotification = (notificationId: number) => {
  notifications.value.forEach((item: any, index: number) => {
    if (notificationId === item.id) notifications.value.splice(index, 1)
  })
}

const markRead = (notificationId: number[]) => {
  notifications.value.forEach((item: any) => {
    notificationId.forEach((id) => {
      if (id === item.id) item.is_seen = true
    })
  })
}

const markUnRead = (notificationId: number[]) => {
  notifications.value.forEach((item: any) => {
    notificationId.forEach((id) => {
      if (id === item.id) item.is_seen = false
    })
  })
}

const handleNotificationClick = (notification: any) => {
  if (!notification.is_seen) markRead([notification.id])
}
</script>

<template>
  <Notifications
    :notifications="notifications"
    @remove="removeNotification"
    @read="markRead"
    @unread="markUnRead"
    @click:notification="handleNotificationClick"
  />
</template>
