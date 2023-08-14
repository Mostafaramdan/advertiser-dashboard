<script setup lang="ts">
const { t } = useI18n()
const selectedCountry = ref(0)

const countries = ref([
  {
    id: 0,
    name: 'الكل',
  },
  {
    id: 1,
    name: 'السعودية',
  },
  {
    id: 2,
    name: 'الامارات',
  },
  {
    id: 3,
    name: 'البحرين',
  },
  {
    id: 4,
    name: 'مصر',
  },
])

const isLoading = ref<boolean>(false)
const formRef = ref<any>(null)

const formData = reactive<any>({
  arName: {
    value: '',
    show: true,
  },
  enName: {
    value: '',
    show: true,
  },
  email: {
    value: '',
    show: true,
  },
  unified_number: {
    value: '',
    show: true,
  },
  address: {
    value: '',
    show: true,
  },
  fax: {
    value: '',
    show: true,
  },
  whatsapp: {
    value: '',
    show: true,
  },
  tax_registration_number: {
    value: '',
    show: true,
  },
  commercial_registration_number: {
    value: '',
    show: true,
  },
  logo: null,
})

const submit = () => {
  formRef.value.validate().then(({ valid }: any) => {
    if (!valid)
      return

    // isLoading.value = true
    console.log('submit', formData)
  })
}

function toggleShow(field: string) {
  formData[field].show = !formData[field].show
}
</script>

<template>
  <section class="platform-settings-details">
    <VRow>
      <VCol col="12" md="6" lg="5" class="mb-4">
        <VSelect
          v-model="selectedCountry"
          :items="countries"
          item-value="id"
          item-title="name"
          prepend-inner-icon="tabler-flag"
          label="الدولة"
          :clearable="selectedCountry !== 0"
          @click:clear="selectedCountry = 0"
        />
      </VCol>
    </VRow>
    <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle>
          عرض بيانات المنصة
        </VExpansionPanelTitle>
        <VExpansionPanelText>
          <div class="platform-info">
            <div class="platform-info__card">
              <h3 class="platform-info__card__title">
                الشعار
              </h3>
              <div class="platform-info__card__body">
                <VImg
                  src="https://plus.unsplash.com/premium_photo-1690749740487-01bbb8e51e71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1965&q=80"
                  height="100px"
                  width="100px"
                  cover
                />
              </div>
            </div>
            <div class="platform-info__card">
              <h3 class="platform-info__card__title">
                عدد المشتركين
              </h3>
              <div class="platform-info__card__body">
                5000
              </div>
            </div>
            <div class="platform-info__card">
              <h3 class="platform-info__card__title">
                متوسط التقييم
              </h3>
              <div class="platform-info__card__body">
                <div class="d-flex align-center">
                  <VIcon icon="tabler-star-filled" color="#ffcc00" size="18" start />  3.63
                </div>
              </div>
            </div>
            <div class="platform-info__card">
              <h3 class="platform-info__card__title">
                رصيدالمحفظة
              </h3>
              <div class="platform-info__card__body">
                100
              </div>
            </div>
            <div class="platform-info__card">
              <h3 class="platform-info__card__title">
                رصيد النقاط
              </h3>
              <div class="platform-info__card__body">
                100
              </div>
            </div>
            <div class="platform-info__card">
              <h3 class="platform-info__card__title">
                الحسابات النشطة
              </h3>
              <div class="platform-info__card__body">
                100
              </div>
            </div>
            <div class="platform-info__card">
              <h3 class="platform-info__card__title">
                ح غير النشطة
              </h3>
              <div class="platform-info__card__body">
                100
              </div>
            </div>
            <div class="platform-info__card">
              <h3 class="platform-info__card__title">
                الحسابات المكتملة
              </h3>
              <div class="platform-info__card__body">
                <span class="mt-1">100</span>
                <VProgressCircular
                  :rotate="360"
                  :size="50"
                  :width="3"
                  :model-value="50"
                  color="primary"
                  class="mt-2 mb-3"
                >
                  50
                </VProgressCircular>
              </div>
            </div>
          </div>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>

    <VeeForm ref="formRef" v-slot="{ meta }" @submit="submit">
      <VRow>
        <VCol col="12" lg="9">
          <VRow>
            <VCol cols="12" md="6">
              <AppTextField
                v-model="formData.arName.value"
                label="اسم المنصة عربي"
                name="arName"
                rules="required|min:3"
              >
                <template #append>
                  <VBtn size="38" variant="outlined" @click="toggleShow('arName')">
                    <VIcon
                      :icon="formData.arName.show ? 'tabler-eye' : 'tabler-eye-off'"
                      size="22"
                    />
                  </VBtn>
                </template>
              </AppTextField>
            </VCol>
            <VCol cols="12" md="6">
              <AppTextField
                v-model="formData.enName.value"
                label="اسم المنصة انجليزي"
                name="enName"
                rules="required|min:3"
              >
                <template #append>
                  <VBtn size="38" variant="outlined" @click="toggleShow('enName')">
                    <VIcon
                      :icon="formData.enName.show ? 'tabler-eye' : 'tabler-eye-off'"
                      size="22"
                    />
                  </VBtn>
                </template>
              </AppTextField>
            </VCol>
            <VCol cols="12" md="6">
              <AppTextField
                v-model="formData.email.value"
                label="البريد الالكتروني"
                name="email"
                rules="required|email"
                type="email"
              >
                <template #append>
                  <VBtn size="38" variant="outlined" @click="toggleShow('email')">
                    <VIcon
                      :icon="formData.email.show ? 'tabler-eye' : 'tabler-eye-off'"
                      size="22"
                    />
                  </VBtn>
                </template>
              </AppTextField>
            </VCol>
            <VCol cols="12" md="6">
              <AppTextField
                v-model="formData.unified_number.value"
                label="الرقم الموحد"
                name="unified_number"
                rules="required|numeric|min:10"
                type="number"
              >
                <template #append>
                  <VBtn size="38" variant="outlined" @click="toggleShow('unified_number')">
                    <VIcon
                      :icon="formData.unified_number.show ? 'tabler-eye' : 'tabler-eye-off'"
                      size="22"
                    />
                  </VBtn>
                </template>
              </AppTextField>
            </VCol>
            <VCol cols="12">
              <AppTextField
                v-model="formData.address.value"
                label="العنوان"
                name="address"
                rules="required|min:3"
              >
                <template #append>
                  <VBtn size="38" variant="outlined" @click="toggleShow('address')">
                    <VIcon
                      :icon="formData.address.show ? 'tabler-eye' : 'tabler-eye-off'"
                      size="22"
                    />
                  </VBtn>
                </template>
              </AppTextField>
            </VCol>
            <VCol cols="12" md="6">
              <AppTextField
                v-model="formData.tax_registration_number.value"
                label="السجل الضريبي"
                name="tax_registration_number"
                rules="required|numeric|min:10"
                type="number"
              >
                <template #append>
                  <VBtn size="38" variant="outlined" @click="toggleShow('tax_registration_number')">
                    <VIcon
                      :icon="formData.tax_registration_number.show ? 'tabler-eye' : 'tabler-eye-off'"
                      size="22"
                    />
                  </VBtn>
                </template>
              </AppTextField>
            </VCol>
            <VCol cols="12" md="6">
              <AppTextField
                v-model="formData.commercial_registration_number.value"
                label="السجل التجاري"
                name="commercial_registration_number"
                rules="required|numeric|min:10"
                type="number"
              >
                <template #append>
                  <VBtn size="38" variant="outlined" @click="toggleShow('commercial_registration_number')">
                    <VIcon
                      :icon="formData.commercial_registration_number.show ? 'tabler-eye' : 'tabler-eye-off'"
                      size="22"
                    />
                  </VBtn>
                </template>
              </AppTextField>
            </VCol>
          </VRow>
        </VCol>
        <VCol cols="12" lg="3">
          <AppUploadFile v-model="formData.logo" name="logo" label="شعار المنصة" rules="required" />
        </VCol>
      </VRow>
      <VBtn :loading="isLoading" :disabled="isLoading || !meta.valid" class="mt-6 px-10" @click="submit">
        {{ t('actions.save') }}
      </VBtn>
    </VeeForm>
  </section>
</template>

<style lang="scss" scoped>
.platform-settings-details {
  .platform-info {
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    gap: 10px;

    &__card {
      display: flex;
      overflow: hidden;
      flex-direction: column;
      flex-grow: 1;
      border: 1px solid rgba(var(--v-theme-grey-400), 1);
      border-radius: 5px;
      min-inline-size: 110px;
      text-align: center;

      &__title {
        padding: 5px;
        background: rgba(var(--v-theme-grey-200), 1);
        font-size: 12px;
      }

      &__body {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        align-items: center;
        justify-content: center;
        color: rgba(var(--v-theme-primary), 1);
        min-block-size: 100px;
      }
    }
  }

  :deep(.v-input--horizontal .v-input__append) {
    padding: 0;
    margin-inline-start: 10px;
  }
}
</style>
