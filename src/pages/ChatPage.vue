<script setup lang="ts"></script>

<template>
  <VCard class="page-card text-center d-flex align-center justify-center" v-loading="false">
    <VCardText>
      <div class="mb-5">
        <VIcon icon="tabler-message" size="70" color="primary" />
      </div>
      <!-- <h4 class="text-h3 font-weight-medium my-3">جاري تحويلك الي الشات</h4> -->

      <VBtn variant="outlined">الذهاب الي الشات <VIcon end icon="tabler-external-link" /></VBtn>
    </VCardText>
  </VCard>
</template>
