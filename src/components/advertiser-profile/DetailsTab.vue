<script setup lang="ts">
import { useToast } from 'vue-toastification'
import { advertisersService } from '@/services/AdvertisersService'
/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const toast = useToast()
const route = useRoute()
const advertiserId: number = +route.params.id
const data = ref<any>({})
const isLoading = ref<any>(false)

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
])

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
    .then(res => {
      toast.success(res.data.message)
    }).catch(() => {
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
    <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle>
          عرض بيانات التاجر
        </VExpansionPanelTitle>
        <VExpansionPanelText>
          <div class="platform-info">
            <div v-if="data.logo" class="platform-info__card">
              <h3 class="platform-info__card__title">
                عدد المتابعين
              </h3>
              <div class="platform-info__card__body">
                {{ data.followers_count }}
              </div>
            </div>
            <div class="platform-info__card">
              <h3 class="platform-info__card__title">
                عدد الاعلانات
              </h3>
              <div class="platform-info__card__body">
                {{ data.ads_count }}
              </div>
            </div>
            <div class="platform-info__card">
              <h3 class="platform-info__card__title">
                التقييم
              </h3>
              <div class="platform-info__card__body">
                <div class="d-flex align-center">
                  <VIcon icon="tabler-star-filled" color="#ffcc00" size="18" start />  {{ data.rate }}
                </div>
              </div>
            </div>
            <div class="platform-info__card">
              <h3 class="platform-info__card__title">
                المحفظة
              </h3>
              <div class="platform-info__card__body">
                {{ data.wallet }}
              </div>
            </div>
            <div class="platform-info__card">
              <h3 class="platform-info__card__title">
                النقاط
              </h3>
              <div class="platform-info__card__body">
                {{ data.points_balance }}
              </div>
            </div>
            <div class="platform-info__card">
              <h3 class="platform-info__card__title">
                حالة الاشتراك
              </h3>
              <div class="platform-info__card__body">
                {{ data.subscription_status }}
              </div>
            </div>
            <div class="platform-info__card">
              <h3 class="platform-info__card__title">
                الإعدادات
              </h3>
              <div class="platform-info__card__body">
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
            </div>
          </div>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>

    <VRow>
      <VCol cols="12" md="8">
        <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
          <VExpansionPanel elevation="0">
            <VExpansionPanelTitle>
              عرض المزيد من البيانات
            </VExpansionPanelTitle>
            <VExpansionPanelText>
              <VRow>
                <VCol class="py-2" cols="12" sm="6" lg="4">
                  <h5 class="text-primary text-subtitle-2">
                    البريد الإلكتروني
                  </h5>
                  <p class="text-body-2 mb-0">
                    {{ data.email }}
                  </p>
                </VCol>
                <VCol class="py-2" cols="12" sm="6" lg="4">
                  <h5 class="text-primary text-subtitle-2">
                    الهاتف
                  </h5>
                  <p class="text-body-2 mb-0">
                    {{ data.phone }}
                  </p>
                </VCol>
                <VCol class="py-2" cols="12" sm="6" lg="4">
                  <h5 class="text-primary text-subtitle-2">
                    اسم المستخدم
                  </h5>
                  <p class="text-body-2 mb-0">
                    {{ data.username }}
                  </p>
                </VCol>
                <VCol class="py-2" cols="12" sm="6" lg="4">
                  <h5 class="text-primary text-subtitle-2">
                    اسم صاحب الحساب
                  </h5>
                  <p class="text-body-2 mb-0">
                    {{ data.account_name }}
                  </p>
                </VCol>
                <VCol class="py-2" cols="12" sm="6" lg="4">
                  <h5 class="text-primary text-subtitle-2">
                    الدولة
                  </h5>
                  <p class="text-body-2 mb-0">
                    {{ data.country_name || '-' }}
                  </p>
                </VCol>
                <VCol class="py-2" cols="12" sm="6" lg="4">
                  <h5 class="text-primary text-subtitle-2">
                    المدينة
                  </h5>
                  <p class="text-body-2 mb-0">
                    {{ data.area_name || '-' }}
                  </p>
                </VCol>
                <VCol class="py-2" cols="12" sm="6" lg="4">
                  <h5 class="text-primary text-subtitle-2">
                    حالة الحساب
                  </h5>
                  <VChip
                    label
                    :color="data.profile_completion === 100 ? 'success' : 'error'"
                    :prepend-icon="data.profile_completion === 100 ? 'tabler-circle-check' : 'tabler-playstation-x'"
                    class="px-2"
                  >
                    {{ data.profile_completion === 100 ? 'مكتمل' : 'غير مكتمل' }}
                  </VChip>
                </VCol>
                <VCol class="py-2" cols="12" sm="6" lg="4">
                  <h5 class="text-primary text-subtitle-2">
                    نوع الكيان
                  </h5>
                  <p class="text-body-2 mb-0">
                    {{ data.type || '-' }}
                  </p>
                </VCol>
                <VCol class="py-2" cols="12" sm="6" lg="4">
                  <h5 class="text-primary text-subtitle-2">
                    باقة الاشتراك
                  </h5>
                  <p class="text-body-2 mb-0">
                    {{ data.subscription_name || '-' }}
                  </p>
                </VCol>

                <VCol class="py-2" cols="12" sm="6" lg="4">
                  <h5 class="text-primary text-subtitle-2">
                    بيانات موثوق
                  </h5>
                  <VChip
                    label
                    :color="data.mawthooq ? 'success' : 'error'"
                    :prepend-icon="data.mawthooq ? 'tabler-circle-check' : 'tabler-playstation-x'"
                    class="mb-2 me-2"
                  >
                    {{ data.mawthooq ? 'تم الادخال' : 'لا يوجد بيانات' }}
                  </VChip>
                </VCol>
                <VCol class="py-2" cols="12" sm="6" lg="4">
                  <h5 class="text-primary text-subtitle-2">
                    بيانات معروف
                  </h5>
                  <VChip
                    label
                    :color="data.ma3roof ? 'success' : 'error'"
                    :prepend-icon="data.ma3roof ? 'tabler-circle-check' : 'tabler-playstation-x'"
                    class="mb-2 me-2"
                  >
                    {{ data.ma3roof ? 'تم الادخال' : 'لا يوجد بيانات' }}
                  </VChip>
                </VCol>
              </VRow>
            </VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>
      </VCol>
      <VCol cols="12" md="4">
        <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
          <VExpansionPanel elevation="0">
            <VExpansionPanelTitle>
              عرض الاجراءات
            </VExpansionPanelTitle>
            <VExpansionPanelText v-if="data.procedures">
              <VSwitch
                v-for="procedure in procedures"
                :key="procedure.key"
                v-model="data.procedures[procedure.key]"
                :label="procedure.label"
                hide-details
                :loading="procedure.loading"
                :disabled="procedure.loading"
                density="comfortable"
                :inset="false"
                class="mb-2"
                @click="takeProcedure(procedure)"
              />
              <VBtn variant="outlined" class="mt-2">
                ارسال رسالة عبر
                <VIcon end icon="tabler-mail" />
              </VBtn>
            </VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>
      </VCol>
    </VRow>
    <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle>
          عرض بيانات الحساب البنكي
        </VExpansionPanelTitle>
        <VExpansionPanelText>
          <VRow v-if="data.bank_account">
            <VCol class="py-2" cols="12" sm="6" lg="4">
              <h5 class="text-primary text-subtitle-2">
                اسم الحساب
              </h5>
              <p class="text-body-2 mb-0">
                {{ data.bank_account.account_name }}
              </p>
            </VCol>
            <VCol class="py-2" cols="12" sm="6" lg="4">
              <h5 class="text-primary text-subtitle-2">
                رقم الحساب
              </h5>
              <p class="text-body-2 mb-0">
                {{ data.bank_account.account_number }}
              </p>
            </VCol>
            <VCol class="py-2" cols="12" sm="6" lg="4">
              <h5 class="text-primary text-subtitle-2">
                اسم البنك
              </h5>
              <p class="text-body-2 mb-0">
                {{ data.bank_account.name }}
              </p>
            </VCol>
            <VCol class="py-2" cols="12" sm="6" lg="4">
              <h5 class="text-primary text-subtitle-2">
                رمز السويفت
              </h5>
              <p class="text-body-2 mb-0">
                {{ data.bank_account.swift_code }}
              </p>
            </VCol>
            <VCol class="py-2" cols="12" sm="6" lg="4">
              <h5 class="text-primary text-subtitle-2">
                نوع الحساب
              </h5>
              <p class="text-body-2 mb-0">
                {{ data.bank_account.type }}
              </p>
            </VCol>
          </VRow>
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
