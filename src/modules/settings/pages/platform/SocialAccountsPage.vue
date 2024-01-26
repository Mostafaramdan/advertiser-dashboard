<script setup lang="ts">
import { cloneItem, getChangesOfArray } from '@/helpers/index'
import { useAuthStore } from '@/stores/AuthStore'
import { useToast } from 'vue-toastification'
import type { SocialAccount } from '../../interfaces/SocialAccount'
import { platformService } from '../../services/PlatformService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const { hasPermission } = useAuthStore()
const toast = useToast()
const formRef = ref<any>(null)
const data = ref<SocialAccount[] | null>(null)
const oldData = ref<any>(null)

const isLoading = reactive({
  data: false,
  submit: false,
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const permissions = computed(() => ({
  edit: hasPermission('betrend_update_social_settings'),
}))

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
getPageData()

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function getPageData() {
  isLoading.data = true
  platformService
    .getSocialsData()
    .then((res) => {
      data.value = res.data.data
      oldData.value = cloneItem(res.data.data)
    })
    .finally(() => {
      isLoading.data = false
    })
}

function saveData(modifiedData: SocialAccount[]) {
  isLoading.submit = true
  platformService
    .editSocialsData({ data: modifiedData })
    .then((res) => {
      toast.success(res.data.message)
      oldData.value = cloneItem(data.value)
    })
    .finally(() => {
      isLoading.submit = false
    })
}

function submit() {
  formRef.value.validate().then(({ valid }: any) => {
    if (!valid) return

    const { modified } = getChangesOfArray(data.value, oldData.value)

    saveData(modified)
  })
}

// #endregion
</script>

<template>
  <VCard v-loading="isLoading.data" min-height="60vh" variant="flat" :disabled="!permissions.edit">
    <VeeForm ref="formRef" v-slot="{ meta }" @submit="submit">
      <div v-if="data" class="setting-list pt-4">
        <VRow v-for="item in data" :key="item.id" class="setting-list__item">
          <div class="py-0 mb-4 mb-md-0 v-col-12 v-col-md-4">
            <div class="setting-list__item__title">
              <VAvatar size="38" variant="tonal" class="me-3">
                <VImg cover :src="item.image" />
              </VAvatar>
              {{ item.name }}
            </div>
          </div>
          <div class="py-0 v-col-12 v-col-md-6">
            <AppTextField
              v-if="item.type === 'number'"
              v-model="item.value"
              :name="`value-${item.id}`"
              :rules="{ required: item.is_active, numeric: true, min: 10, max: 14 }"
              label="هذ الحقل"
              class="text-input"
              type="number"
              placeholder="ادخل الرقم"
            />
            <AppTextField
              v-else-if="item.type === 'text'"
              v-model.number="item.value"
              :name="`value-${item.id}`"
              :rules="{ required: item.is_active, validUrl: true }"
              label="هذ الحقل"
              class="text-input"
              placeholder="ادخل الرابط"
            />
          </div>

          <div class="py-0 v-col-12 v-col-md-2 d-flex justify-md-center">
            <VSwitch v-model="item.is_active" hide-details density="comfortable" :inset="false" />
          </div>
        </VRow>

        <VBtn
          v-if="permissions.edit"
          class="mt-4 px-9"
          :disabled="isLoading.submit || !meta.valid"
          :loading="isLoading.submit"
          @click="submit"
        >
          {{ t('actions.save') }}
        </VBtn>
      </div>
    </VeeForm>
  </VCard>
</template>

<style lang="scss" scoped>
.setting-list {
  :deep(.v-input) {
    display: flex;

    .v-input__control {
      inline-size: 100%;
    }

    .v-field {
      inline-size: auto;

      .v-field__input {
        text-align: initial;
      }
    }
  }
}
</style>
