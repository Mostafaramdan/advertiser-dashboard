<script setup lang="ts">
import { chatService } from '@/services/ChatService'
/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const isLoading = ref<boolean>(false)
// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function openChat(link: string) {
  window.location.href = link
}

function getChatUrl() {
  isLoading.value = true
  chatService
    .getChatUrl()
    .then((res) => {
      openChat(res.data.data)
    })
    .finally(() => {
      isLoading.value = false
    })
}
// #endregion
</script>

<template>
  <VCard class="page-card text-center d-flex align-center justify-center">
    <VCardText>
      <div class="mb-5">
        <VIcon icon="tabler-message" size="70" color="primary" />
      </div>
      <VBtn @click="getChatUrl" variant="outlined" :loading="isLoading" :disabled="isLoading"
        >الذهاب الي الشات <VIcon end icon="tabler-external-link"
      /></VBtn>
    </VCardText>
  </VCard>
</template>
