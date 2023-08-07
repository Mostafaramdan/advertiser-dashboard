<script setup lang="ts">
import axios from 'axios'
import { useToast } from 'vue-toastification'
import { FILES_TYPES } from '@/constants/index'
import { getFileType } from '@/helpers/file'
import type { FormFileProps } from '@/interfaces/Forms'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(defineProps<FormFileProps>(), {
  rules: '',
  hideLabel: false,
  maxFileSize: 10,
  uploadTip: '',

  // acceptedTypes: () => ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'],

  acceptedTypes: () => ['*'],
})

// #endregion

/***************************************
 **** Section Emits Declaration ********
 **************************************/
// #region Emits
const emit = defineEmits<{ (e: 'update:modelValue', value: any): void }>()

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const toast = useToast()
const { t } = useI18n()

const uploadedFile = ref()

const isLoading = reactive({
  upload: false,
  delete: false,
})

const percentage = ref(0)
let requestController: any

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const selectedFile = computed({
  get() {
    return props.modelValue
  },
  set(newValue: any) {
    emit('update:modelValue', newValue)
  },
})

const fileInfo = computed(() => {
  let fileType
  let fileIcon
  const fileObj = uploadedFile.value || selectedFile.value
  if (fileObj) {
    fileType = getFileType(fileObj.mimetype || fileObj.type)
    fileIcon = new URL(`../../../assets/images/svg/file-icons/${fileType}.svg`, import.meta.url)
  }

  if (uploadedFile.value) {
    const file = uploadedFile.value
    const blob = new Blob([file])
    const blobURL = URL.createObjectURL(blob)

    return {
      name: file.name,
      type: fileType,
      path: blobURL,
      icon: fileIcon,
    }
  }
  if (selectedFile.value)
    return { ...selectedFile.value, type: fileType, icon: fileIcon }

  return null
})

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function dragStart($event: any) {
  $event.currentTarget.classList.add('active')
}
function dragEnd($event: any) {
  $event.currentTarget.classList.remove('active')
}

function startUploadFile(e: any) {
  const file = e.target.files[0]
  if (!file)
    return

  if ((!props.acceptedTypes.includes('*') && !props.acceptedTypes.includes(file.type)) || file.size > props.maxFileSize * 1024 * 1024) {
    toast.error(props.uploadTip || t('upload_tip', { formats: 'jpg / png / gif / mp4 / webm', size: props.maxFileSize }))

    return
  }

  // selectedFile.value = file
  uploadedFile.value = file
  uploadFile(file)
}

function resetData() {
  selectedFile.value = null
  uploadedFile.value = null
  isLoading.upload = false
  isLoading.delete = false
}

function uploadFile(file: any) {
  isLoading.upload = true
  percentage.value = 0

  requestController = new AbortController()
  axios
    .post('file', {
      file,
    }, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      signal: requestController.signal,
      onUploadProgress: (progressEvent: any) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        )

        percentage.value = progress
        console.log(`Upload Progress: ${progress}%`)
      },
    })
    .then(res => {
      selectedFile.value = res.data.data[0]
      toast.success(res.data.message)
    })
    .finally(() => {
      uploadedFile.value = null
      isLoading.upload = false
    })
}

function removeFile() {
  isLoading.delete = true
  if (fileInfo.value?.id) {
    axios.delete(`file/${fileInfo.value?.id}`).then(res => {
      resetData()
      toast.success(res.data.message)
    })
  }
  else {
    resetData()
  }
}

function cancelUpload() {
  requestController?.abort()
  requestController = null
  selectedFile.value = null
  uploadedFile.value = null
}

// #endregion
</script>

<template>
  <VeeField
    v-slot="{ errorMessage }"
    v-model="selectedFile"
    class="app-select flex-grow-1"
    :class="$attrs.class"
    :name="name"
    :label="label"
    :rules="rules"
  >
    <VLabel
      v-if="label && !hideLabel"
      class="mb-1 text-body-2 text-high-emphasis"
      :text="label"
    />
    <div class="upload-container">
      <div v-if="fileInfo" class="preview-box">
        <img v-if="fileInfo.type === FILES_TYPES.image" :src="fileInfo.path">
        <video v-else-if="fileInfo.type === FILES_TYPES.video" :src="fileInfo.path" controls />
        <a
          v-else
          :href="fileInfo.path"
          :download="fileInfo.name"
          target="_blank"
          rel="noopener noreferrer"
          class="preview-box__details"
        >
          <img v-if="fileInfo.icon" :src="fileInfo.icon" width="30" height="30">
          <span>
            {{ fileInfo.name }}
          </span>
        </a>
        <div v-if="isLoading.upload" class="preview-box__loader">
          <VProgressCircular
            :rotate="360"
            :size="80"
            :width="6"
            :model-value="percentage"
            bg-color="#fff"
            color="info"
          >
            {{ percentage }}
          </VProgressCircular>
          <VBtn
            density="compact"
            icon="tabler-x"
            color="error"
            class="delete-btn"
            @click="cancelUpload"
          />
        </div>
        <VBtn
          v-else
          density="compact"
          icon="tabler-trash"
          :color="isLoading.delete ? 'info' : 'error'"
          class="delete-btn"
          :loading="isLoading.delete"
          :disabled="isLoading.delete"
          @click="removeFile"
        />
      </div>
      <label
        v-else
        class="upload-label"
        for="logo-image"
        @dragenter="dragStart($event)"
        @dragleave="dragEnd($event)"
        @dragend="dragEnd($event)"
        @drop="dragEnd($event)"
        @dragexit="dragEnd($event)"
      >
        <input
          id="logo-image"
          class="upload-label__input"
          type="file"
          :accept="props.acceptedTypes.join(',')"
          @change="startUploadFile"
        >
        <span class="upload-label__content">
          <VIcon icon="tabler-cloud-upload" />
          {{ $t('click_or_drag_to_add_file') }}
        </span>
      </label>
    </div>
    <AppErrorMessage :error-message="errorMessage" />
  </VeeField>
</template>

<style lang="scss" scoped>
.upload-container {
  position: relative;
  background: rgba(var(--v-theme-grey-100), 100%);
  block-size: 180px;
  inline-size: 180px;

  .preview-box {
    block-size: 100%;
    inline-size: 100%;

    &__loader {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(#000, 0.4);
      inset: 0;
    }

    img,
    video {
      block-size: 100%;
      inline-size: 100%;
      object-fit: cover;
    }

    .delete-btn {
      position: absolute;
      z-index: 2;
      inset-block-start: 10px;
      inset-inline-end: 10px;
    }

    &__details {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      block-size: 100%;
      gap: 6px;
      padding-block: 0;
      text-align: center;

      span {
        display: -webkit-box;
        overflow: hidden;
        -webkit-box-orient: vertical;
        font-size: 12px;
        inline-size: 100%;
        -webkit-line-clamp: 2;
        padding-inline: 10px;
        text-overflow: ellipsis;
      }

      img {
        block-size: 50px;
        object-fit: contain;
      }
    }
  }
}

.upload-label {
  display: block;
  border: 2px dashed #9ca3af;
  border-radius: 8px;
  block-size: 100%;
  font-size: 12px;
  font-weight: 500;
  inline-size: 100%;

  &__input {
    position: absolute;
    z-index: 1;
    cursor: pointer;
    inset: 0;
    opacity: 0;
  }

  &__content {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    block-size: 100%;
    inline-size: 100%;
    inset-block-start: 0;
    inset-inline-start: 0;
    padding-inline: 10px;
    text-align: center;
    word-break: break-all;

    svg {
      display: block;
      block-size: 40px;
      inline-size: 40px;
      margin-block: 0 5px;
      margin-inline: auto;
      transition: transform 0.3s;
    }
  }

  &:hover,
  &.active {
    border-color: rgba(var(--v-theme-primary), 100%);

    svg {
      transform: scale(1.1);
    }
  }
}
</style>
@/helpers/file
