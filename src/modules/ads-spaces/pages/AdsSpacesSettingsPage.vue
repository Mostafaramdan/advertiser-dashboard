<script setup lang="ts">
import { cloneItem, getChangesOfArray } from '@/helpers/index'
import type { SettingsListItem } from '@/modules/settings/interfaces/Shared'
import { useAuthStore } from '@/stores/AuthStore'
import { useToast } from 'vue-toastification'
import { adsSpacesService } from '../services/AdsSpacesService'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const { hasPermission } = useAuthStore()
const toast = useToast()
const formRef = ref<any>(null)
const data = ref<SettingsListItem[] | null>(null)
const oldData = ref<SettingsListItem[] | null>(null)

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
  edit: hasPermission('update_ad_space_settings'),
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
  adsSpacesService
    .getSettings()
    .then((res) => {
      data.value = res.data.data
      oldData.value = cloneItem(res.data.data)
    })
    .finally(() => {
      isLoading.data = false
    })
}

function saveData(modifiedData: SettingsListItem[]) {
  isLoading.submit = true
  adsSpacesService
    .editSettings({ data: modifiedData })
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
  <VCard
    v-loading="isLoading.data"
    title="اعدادات المساحات"
    class="page-card"
    :disabled="!permissions.edit"
  >
    <VCardText>
      <VeeForm ref="formRef" v-slot="{ meta }" @submit="submit">
        <div v-if="data" class="setting-list pt-4">
          <VRow v-for="item in data" :key="item.id" class="setting-list__item">
            <div
              class="py-0 mb-4 mb-md-0 v-col-12"
              :class="item.has_input && !item.has_radio ? 'v-col-md-8' : 'v-col-md-12'"
            >
              <div class="setting-list__item__title">
                <span>{{ item.id }}</span>
                {{ item.name }}
              </div>
            </div>
            <div v-if="item.has_input" class="py-0 v-col-12 v-col-md-2">
              <AppTextField
                v-model.number="item.value"
                :name="`value-${item.id}`"
                type="number"
                :min="0"
                class="text-center"
                :rules="{
                  required: true,
                  numeric: true,
                  min_value: item.min_value,
                  max_value: item.max_value,
                }"
                label="هذ الحقل"
              >
                <template v-if="item.value_key" #append>
                  {{ item.value_key }}
                </template>
              </AppTextField>
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
    </VCardText>
  </VCard>
</template>
