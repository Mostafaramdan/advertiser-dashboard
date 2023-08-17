<script setup lang="ts">
import { useToast } from 'vue-toastification'
import type { WorkTimeData } from '../../interfaces/WorkTime'
import { platformService } from '../../services/PlatformService'
import { WORK_DAYS } from '@/constants/settings'
import { cloneItem, getChangesOfArray } from '@/helpers/index'
import { useAuthStore } from '@/stores/AuthStore'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const { hasPermission } = useAuthStore()
const toast = useToast()
const formRef = ref<any>(null)

const data = ref<WorkTimeData | null>(null)

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
  edit: hasPermission('update_schedule_settings'),
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
    .getWorkTimeData()
    .then(res => {
      data.value = res.data
      oldData.value = cloneItem(res.data.data)
    })
    .finally(() => {
      isLoading.data = false
    })
}

function saveData(modifiedData: WorkTimeData) {
  isLoading.submit = true
  platformService
    .editWorkTimeData(modifiedData)
    .then(res => {
      toast.success(res.data.message)
      oldData.value = cloneItem(data.value?.data)
    })
    .finally(() => {
      isLoading.submit = false
    })
}

function submit() {
  formRef.value.validate().then(({ valid }: any) => {
    if (!valid || !data.value) return

    const { modified } = getChangesOfArray(data.value.data, oldData.value)

    const payload: WorkTimeData = {
      data: modified,
      show: data.value.show,
    }

    saveData(payload)
  })
}

// #endregion
</script>

<template>
  <VCard v-loading="isLoading.data" min-height="60vh" variant="flat" :disabled="!permissions.edit">
    <VeeForm v-if="data" ref="formRef" v-slot="{ meta }" @submit="submit">
      <div class="ps-2">
        <AppSwitch
          v-model="data.show"
          label="الظهور"
          name="show"
        />
      </div>
      <VDivider class="my-4" />
      <div v-if="data" class="setting-list pt-4">
        <div
          v-for="day in data.data"
          :key="day.id"
          class="setting-list__item v-row"
        >
          <div class="py-0 mb-4 mb-md-0 v-col-12 v-col-md-2">
            <div class="setting-list__item__title">
              {{ WORK_DAYS[day.day] }}
            </div>
          </div>
          <div class="py-0 v-col-12 v-col-md-8">
            <VRow>
              <VCol cols="12" sm="6">
                <AppTextField
                  v-model="day.from_time"
                  label="بداية الدوام"
                  :name="`from-time-${day.id}`"
                  type="time"
                  :rules="{ required: true, lessThanTime: day.to_time }"
                />
              </VCol>
              <VCol cols="12" sm="6">
                <AppTextField
                  v-model="day.to_time"
                  :name="`to-time-${day.id}`"
                  label="نهاية الدوام "
                  type="time"
                  :rules="{ required: true, greaterThanTime: day.from_time }"
                />
              </VCol>
            </VRow>
          </div>

          <div class="py-0 v-col-12 v-col-md-2 d-flex justify-md-center">
            <VSwitch
              v-model="day.is_vacation"
              hide-details
              density="comfortable"
              :inset="false"
              :label="!day.is_vacation ? 'عطلة' : 'دوام'"
            />
          </div>
        </div>

        <VBtn
          v-if="permissions.edit"
          class="mt-4 px-9"
          :disabled="isLoading.submit || !meta.valid"
          :loading="isLoading.submit"
          @click="submit"
        >
          {{ t("actions.save") }}
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
