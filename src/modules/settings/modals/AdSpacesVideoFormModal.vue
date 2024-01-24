<script setup lang="ts">
import { USERS_TYPES } from '@/constants/settings'
import { cloneItem, getOptionsArrayFromObject } from '@/helpers/index'
import type { FormModalProps } from '@/interfaces/Forms'
import type { DropdownMenuItem, File } from '@/interfaces/Shared'
import { listService } from '@/services/ListService'
import { useVModel } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import type { Video, VideoBase } from '../interfaces/Video'
import { adSpacesVideosService } from '../services/AdSpacesVideosService'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(defineProps<FormModalProps>(), {
  showModal: false,
})

// #endregion

/***************************************
 **** Section Emits Declaration ********
 **************************************/
// #region Emits
const emit = defineEmits<{
  (e: 'update:showModal', value: boolean): void
  (e: 'createItem', value: Video): void
  (e: 'editItem', value: Video): void
}>()

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const toast = useToast()
const showModal = useVModel(props, 'showModal', emit)

const isLoading = reactive({
  videosLists: false,
  submit: false,
})

const categoriesSelectRef = ref()
const formRef = ref<any>(null)
const MAX_FILE_SIZE = 350
const videosLists = ref<DropdownMenuItem[]>([])

const formData = reactive<Video | VideoBase>({
  name: '',
  is_active: true,
  show_in: null,
  video: null,
  video_id: null,
  for: [],
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const formTitle = computed(() => {
  return props.formAction === 'create'
    ? 'اضافة فيديو'
    : props.formAction === 'edit'
      ? 'تعديل فيديو'
      : 'عرض فيديو'
})

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
initData()
// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function getVideosLists() {
  isLoading.videosLists = true
  listService
    .getVideosLists()
    .then((res) => {
      videosLists.value = res.data
    })
    .finally(() => {
      isLoading.videosLists = false
    })
}

function initData() {
  getVideosLists()
  if (props.activeItem) Object.assign(formData, cloneItem(props.activeItem))
  if (props.formAction === 'edit') formData.show_in = props.activeItem.show_in.id
}

function edit() {
  adSpacesVideosService
    .editItem(formData as Video)
    .then((res) => {
      toast.success(res.data.message)
      emit('editItem', res.data.data)
      showModal.value = false
    })
    .finally(() => {
      isLoading.submit = false
    })
}

function create() {
  adSpacesVideosService
    .createItem(formData)
    .then((res) => {
      toast.success(res.data.message)
      emit('createItem', res.data)
      showModal.value = false
    })
    .finally(() => {
      isLoading.submit = false
    })
}

function updateVideoId(video: File) {
  if (video) formData.video_id = video.id
}

const submit = () => {
  formRef.value.validate().then(({ valid }: any) => {
    if (!valid) return

    isLoading.submit = true
    props.formAction === 'create' ? create() : edit()
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
        <VCard :title="formTitle" class="overflow-auto">
          <VCardText>
            <VRow>
              <VCol cols="12">
                <AppUploadFile
                  v-model="formData.video"
                  name="video"
                  label="الفيديو"
                  rules="required"
                  :accepted-types="['video/mp4', 'video/webm']"
                  width="250px"
                  height="150px"
                  :upload-tip="t('upload_tip', { formats: 'mp4 / webm', size: MAX_FILE_SIZE })"
                  :max-file-size="MAX_FILE_SIZE"
                  @update:model-value="updateVideoId"
                />
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField
                  v-model="formData.name"
                  label="العنوان"
                  name="name"
                  rules="required|min:3|max:50"
                />
              </VCol>
              <VCol cols="12" md="6">
                <div ref="categoriesSelectRef" class="categories-select">
                  <AppSelect
                    v-model="formData.show_in"
                    name="show_in"
                    :items="videosLists"
                    item-title="label"
                    item-value="id"
                    label="مكان شاشة العرض"
                    rules="required"
                    clearable
                    :loading="isLoading.videosLists"
                    :disabled="isLoading.videosLists"
                    :menu-props="{
                      attach: categoriesSelectRef,
                      'location-strategy': 'static',
                      'max-height': 200,
                    }"
                  >
                    <template #selection="{ item }">
                      <span v-if="item.title && !isLoading.videosLists">{{ item.title }}</span>
                    </template>
                  </AppSelect>
                </div>
              </VCol>
              <VCol>
                <AppCheckbox
                  v-model="formData.for"
                  :options="getOptionsArrayFromObject(USERS_TYPES)"
                  name="type"
                  label="نوع المستخدمين"
                  rules="required"
                  option-label="label"
                  option-value="value"
                />
              </VCol>
              <VCol cols="12" class="pt-0">
                <AppSwitch v-model="formData.is_active" label="الحالة" name="is_active" />
              </VCol>
            </VRow>
          </VCardText>

          <VCardText v-if="formAction !== 'view'" class="d-flex justify-end flex-wrap gap-3">
            <VBtn variant="outlined" color="error" @click="showModal = false">
              {{ t('actions.cancel') }}
            </VBtn>
            <VBtn
              :loading="isLoading.submit"
              :disabled="isLoading.submit || !meta.valid"
              @click="submit"
            >
              {{ formAction === 'edit' ? t('actions.save') : t('actions.create') }}
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

  :deep(.v-select__selection-text) {
    @include max-lines(1);
  }
}
</style>
