<script setup lang="ts">
import type { PlatformInfo } from '../interfaces/PlatformDetails'
/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
interface FormModalProps {
  platformData: PlatformInfo | null
}
withDefaults(defineProps<FormModalProps>(), {})

// #endregion
</script>

<template>
  <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
    <VExpansionPanel elevation="0">
      <VExpansionPanelTitle> عرض بيانات المنصة </VExpansionPanelTitle>
      <VExpansionPanelText v-if="platformData">
        <div class="d-flex gap-3 flex-column flex-sm-row mb-3">
          <VCol class="pa-0">
            <VCard variant="outlined" class="pa-3 h-100">
              <div class="d-flex gap-4 justify-space-between">
                <div>
                  <div class="text-h5 text-primary">
                    {{ platformData.verified_users }}
                  </div>
                  <span class="text-body-2">الحسابات الموثوقة </span>
                </div>
                <VAvatar icon="tabler-users" color="primary" :size="42" variant="tonal" />
              </div>
            </VCard>
          </VCol>
          <VCol class="pa-0">
            <VCard variant="outlined" class="pa-3 h-100">
              <div class="d-flex gap-4 justify-space-between">
                <div>
                  <div class="text-h5 text-primary">
                    {{ platformData.registered_at_marouf }}
                  </div>
                  <span class="text-body-2">الحسابات المسجلة فى معروف </span>
                </div>
                <VAvatar icon="tabler-users" color="primary" :size="42" variant="tonal" />
              </div>
            </VCard>
          </VCol>
        </div>
        <div class="platform-info">
          <div v-if="platformData.logo" class="platform-info__card">
            <h3 class="platform-info__card__title">الشعار</h3>
            <div class="platform-info__card__body">
              <VImg :src="platformData.logo" height="100px" width="100px" cover />
            </div>
          </div>
          <div class="platform-info__card">
            <h3 class="platform-info__card__title">عدد المشتركين</h3>
            <div class="platform-info__card__body">
              {{ platformData.total_users }}
            </div>
          </div>
          <div class="platform-info__card">
            <h3 class="platform-info__card__title">متوسط التقييم</h3>
            <div class="platform-info__card__body">
              <div class="d-flex align-center">
                <VIcon icon="tabler-star-filled" color="#ffcc00" size="18" start />
                {{ platformData.total_rate }}
              </div>
            </div>
          </div>
          <div class="platform-info__card">
            <h3 class="platform-info__card__title">رصيدالمحفظة</h3>
            <div class="platform-info__card__body">
              {{ platformData.wallet }}
            </div>
          </div>
          <div class="platform-info__card">
            <h3 class="platform-info__card__title">رصيد النقاط</h3>
            <div class="platform-info__card__body">
              {{ platformData.points_balance }}
            </div>
          </div>
          <div class="platform-info__card">
            <h3 class="platform-info__card__title">الحسابات النشطة</h3>
            <div class="platform-info__card__body">
              {{ platformData.active }}
            </div>
          </div>
          <div class="platform-info__card">
            <h3 class="platform-info__card__title">ح غير النشطة</h3>
            <div class="platform-info__card__body">
              {{ platformData.inactive }}
            </div>
          </div>
          <div class="platform-info__card">
            <h3 class="platform-info__card__title">الحسابات المكتملة</h3>
            <div class="platform-info__card__body">
              <span class="mt-1"> {{ platformData.complete }}</span>
              <VProgressCircular
                :rotate="360"
                :size="50"
                :width="3"
                :model-value="platformData.complete_percent"
                color="primary"
                class="mt-2 mb-3"
              >
                {{ platformData.complete_percent }}
              </VProgressCircular>
            </div>
          </div>
        </div>
      </VExpansionPanelText>
    </VExpansionPanel>
  </VExpansionPanels>
</template>
