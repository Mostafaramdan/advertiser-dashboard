<script setup lang="ts">
import { authService } from '@/services/AuthService'
import { useAuthStore } from '@/stores/AuthStore'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const router = useRouter()
const { authUser, clearAuthUser } = useAuthStore()
const isLoading = ref<boolean>(false)

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const userData = computed(() => authUser)

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
/**
 * @description Logout user and clear auth user data
 * @returns void
 */
function logout() {
  isLoading.value = true
  authService.logout().then(() => {
    clearAuthUser()
    router.push({ name: 'login-page' })
  }).finally(() => {
    isLoading.value = false
  })
}

// #endregion
</script>

<template>
  <VBadge
    v-if="userData"
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    bordered
    color="success"
  >
    <VAvatar
      class="cursor-pointer"
      color="primary"
      variant="tonal"
    >
      <VImg :src="userData.image" />

      <!-- SECTION Menu -->
      <VMenu
        activator="parent"
        width="230"
        location="bottom end"
        offset="14px"
      >
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                >
                  <VAvatar
                    color="primary"
                    variant="tonal"
                  >
                    <VImg :src="userData.image" />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              {{ userData.name }}
            </VListItemTitle>
            <VListItemSubtitle>{{ userData.email }}</VListItemSubtitle>
          </VListItem>

          <VDivider class="my-2" />

          <!-- 👉 Profile -->
          <VListItem link>
            <template #prepend>
              <VIcon
                class="me-2"
                icon="tabler-user"
                size="22"
              />
            </template>

            <VListItemTitle>
              الملف الشخصي
            </VListItemTitle>
          </VListItem>

          <!-- Divider -->
          <VDivider class="my-2" />

          <!-- 👉 Logout -->
          <VListItem :disabled="isLoading" @click="logout">
            <template #prepend>
              <VIcon
                class="me-2"
                icon="tabler-logout"
                size="22"
              />
            </template>

            <VListItemTitle>
              تسجيل الخروج
            </VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>
