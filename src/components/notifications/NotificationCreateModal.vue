<script setup lang="ts">
import { NOTIFICATIONS_TYPES } from '@/constants'
import { USERS_ROLES } from '@/constants/index'
import { ACCOUNT_TYPES } from '@/constants/notifications'
import { getOptionsArrayFromObject } from '@/helpers/index'
import type { NotificationCreateModalProps } from '@/interfaces/Notifications'
import { listService } from '@/services/ListService'
import { notificationsService } from '@/services/NotificationsService'
import { useVModel } from '@vueuse/core'
import { useToast } from 'vue-toastification'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(defineProps<{ showModal: boolean }>(), {})

// #endregion

/***************************************
 **** Section Emits Declaration ********
 **************************************/
// #region Emits
const emit = defineEmits<{
  (e: 'update:showModal', value: boolean): void
  (e: 'notification:sent', value: boolean): void
}>()

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const toast = useToast()
const showModal = useVModel(props, 'showModal', emit)
const formRef = ref<any>(null)
const rolesSelectRef = ref<any>(null)
const typesSelectRef = ref<any>(null)
const entitiesList = ref<{ id: number; label: string }[]>([])
const packagesList = ref<{ id: number; label: string }[]>([])

const isLoading = reactive({
  submit: false,
  entities: false,
  packages: false,
})

const formData = reactive<NotificationCreateModalProps>({
  roles: [],
  types: [],
  entities: [],
  packages: [],
  title: '',
  message: '',
  notify_types: [],
})

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
getEntities()
getPackages()

// #endregion

/***************************************
 **** Section Functions  *********
 **************************************/
// #region Functions
function getPackages() {
  isLoading.packages = true
  listService
    .getPackagesLists()
    .then((res: any) => {
      packagesList.value = res.data.data
    })
    .finally(() => {
      isLoading.packages = false
    })
}

function getEntities() {
  isLoading.entities = true
  listService
    .getEntitiesLists()
    .then((res: any) => {
      entitiesList.value = res.data.data
    })
    .finally(() => {
      isLoading.entities = false
    })
}

function sendNotification() {
  isLoading.submit = true
  notificationsService
    .createItem(formData)
    .then((res) => {
      toast.success(res.data.message)
      showModal.value = false
      emit('notification:sent', true)
    })
    .finally(() => {
      isLoading.submit = false
    })
}

function submit() {
  formRef.value.validate().then(({ valid }: any) => {
    if (!valid) return
    sendNotification()
  })
}

// #endregion
</script>

<template>
  <VDialog v-model="showModal" max-width="700" persistent scrollable class="form-modal">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="showModal = !showModal" />

    <!-- Dialog Content -->
    <VCard>
      <VeeForm ref="formRef" v-slot="{ meta }" @submit="submit">
        <VCard title="إرسال إشعار">
          <VCardText>
            <VRow>
              <VCol cols="12" md="6">
                <div ref="rolesSelectRef" class="categories-select" style="z-index: 2">
                  <AppSelect
                    v-model="formData.roles"
                    name="roles"
                    :items="getOptionsArrayFromObject(USERS_ROLES)"
                    item-title="label"
                    item-value="value"
                    label="نوع المستخدم"
                    rules="required"
                    clearable
                    multiple
                    :menu-props="{
                      attach: rolesSelectRef,
                      'location-strategy': 'static',
                    }"
                  >
                    <template #selection="{ item, index }">
                      <VChip v-if="index < 1">
                        <span>{{ item.title }}</span>
                      </VChip>
                      <span v-if="index === 1" class="text-grey text-caption align-self-center">
                        (+{{ formData.roles.length - 1 }} اخري)
                      </span>
                    </template>
                  </AppSelect>
                </div>
              </VCol>
              <VCol cols="12" md="6">
                <div ref="typesSelectRef" class="categories-select">
                  <AppSelect
                    v-model="formData.types"
                    name="types"
                    :items="getOptionsArrayFromObject(ACCOUNT_TYPES)"
                    item-title="label"
                    item-value="value"
                    label="نوع الحساب"
                    rules="required"
                    clearable
                    multiple
                    :menu-props="{
                      attach: typesSelectRef,
                      'location-strategy': 'static',
                    }"
                  >
                    <template #selection="{ item, index }">
                      <VChip v-if="index < 1">
                        <span>{{ item.title }}</span>
                      </VChip>
                      <span v-if="index === 1" class="text-grey text-caption align-self-center">
                        (+{{ formData.types.length - 1 }} اخري)
                      </span>
                    </template>
                  </AppSelect>
                </div>
              </VCol>
              <VCol cols="12" v-if="formData.roles.includes('advertiser')">
                <AppSelect
                  v-model="formData.packages"
                  name="packages"
                  :items="packagesList"
                  item-title="label"
                  item-value="id"
                  label="الباقات"
                  rules="required"
                  clearable
                  multiple
                  :disabled="isLoading.packages"
                  :loading="isLoading.packages"
                >
                  <template #selection="{ item, index }">
                    <VChip v-if="index < 1">
                      <span>{{ item.title }}</span>
                    </VChip>
                    <span v-if="index === 1" class="text-grey text-caption align-self-center">
                      (+{{ formData.packages.length - 1 }} اخري)
                    </span>
                  </template>
                </AppSelect>
              </VCol>
              <VCol cols="12" v-if="formData.types.includes('company')">
                <AppSelect
                  v-model="formData.entities"
                  name="entities"
                  :items="entitiesList"
                  item-title="label"
                  item-value="id"
                  label="نوع الكيان"
                  rules="required"
                  clearable
                  multiple
                  :disabled="isLoading.entities"
                  :loading="isLoading.entities"
                >
                  <template #selection="{ item, index }">
                    <VChip v-if="index < 1">
                      <span>{{ item.title }}</span>
                    </VChip>
                    <span v-if="index === 1" class="text-grey text-caption align-self-center">
                      (+{{ formData.entities.length - 1 }} اخري)
                    </span>
                  </template>
                </AppSelect>
              </VCol>
              <VCol cols="12">
                <AppTextField
                  v-model="formData.title"
                  name="title"
                  label="عنوان الرسالة"
                  rules="required|min:10|max:50"
                />
              </VCol>
              <VCol cols="12">
                <AppTextarea
                  v-model="formData.message"
                  name="message"
                  label="نص الرسالة"
                  rows="4"
                  rules="required|min:10|max:250"
                />
              </VCol>
              <VCol cols="12">
                <VeeField
                  v-slot="{ errorMessage, value, handleChange }"
                  v-model="formData.notify_types"
                  name="notify_types"
                  label="نوع التنبيه"
                  rules="required"
                >
                  <VLabel class="mb-1 text-body-2 text-high-emphasis d-block" text="نوع التنبيه" />
                  <VBtnToggle
                    :model-value="value"
                    multiple
                    variant="outlined"
                    divided
                    color="primary"
                    rounded="0"
                    class="flex-wrap"
                    @update:model-value="handleChange"
                  >
                    <VBtn
                      v-for="type in NOTIFICATIONS_TYPES"
                      :key="type.value"
                      :value="type.value"
                      size="small"
                      rounded="0"
                    >
                      <VIcon size="28">
                        {{ type.icon }}
                      </VIcon>
                    </VBtn>
                  </VBtnToggle>
                  <AppErrorMessage :error-message="errorMessage" />
                </VeeField>
              </VCol>
            </VRow>
          </VCardText>

          <VCardText class="d-flex justify-end flex-wrap gap-3">
            <VBtn variant="outlined" color="error" @click="showModal = false">
              {{ t('actions.cancel') }}
            </VBtn>
            <VBtn
              :loading="isLoading.submit"
              :disabled="isLoading.submit || !meta.valid"
              @click="submit"
            >
              {{ t('actions.send') }}
            </VBtn>
          </VCardText>
        </VCard>
      </VeeForm>
    </VCard>
  </VDialog>
</template>

<style lang="scss" scoped>
.categories-select {
  position: relative;
  z-index: 1;

  :deep(.v-menu > .v-overlay__content) {
    inline-size: 100%;
    inset-block-start: 70px;
    inset-inline-start: 0;
  }
}
</style>
