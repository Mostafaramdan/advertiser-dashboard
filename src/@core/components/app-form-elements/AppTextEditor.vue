<script setup lang="ts">
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import ImageUploader from 'quill-image-uploader'
import type { FormTextEditor } from '@/interfaces/Forms'
import type { File } from '@/interfaces/Shared'
import { sharedService } from '@/services/SharedService'
import 'quill-image-uploader/dist/quill.imageUploader.min.css'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(defineProps<FormTextEditor>(), {
  rules: '',
  hideLabel: false,
  isReadOnly: false,
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
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote'],
  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
  [{ direction: 'rtl' }], // text direction
  [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ align: [] }],
  ['link', 'image', 'video'],
  ['clean'], // remove formatting button

]

const modules = {
  name: 'imageUploader',
  module: ImageUploader,
  options: {
    upload: uploadImage,
  },
}

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const value = computed({
  get() {
    return props.modelValue
  },
  set(newValue: any) {
    emit('update:modelValue', newValue)
  },
})

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function uploadImage(file: File) {
  return new Promise((resolve, reject) => {
    sharedService.uploadFile(file).then((res: any) => {
      resolve(res.data.data[0].path)
    })
      .catch((err: any) => {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('Upload failed')
        console.error('Error:', err)
      })
  })
}

// #endregion
</script>

<template>
  <div variant="flat" class="quill-editor-container flex-grow-1" :class="{ 'read-only': isReadOnly }">
    <VeeField
      v-slot="{ handleChange, errorMessage, handleBlur }"
      v-model="value"
      :name="name"
      :label="label"
      :rules="rules"
    >
      <VLabel
        v-if="label && !hideLabel"
        class="mb-1 text-body-2 text-high-emphasis"
        :text="label"
      />
      <div :class="{ 'invalid-border': !!errorMessage }">
        <QuillEditor
          v-model:content="value"
          content-type="html"
          theme="snow"
          :toolbar="toolbarOptions"
          :modules="modules"
          v-bind="$attrs"
          @update:content="handleChange"
          @blur="handleBlur"
        >
          <template
            v-for="(_, slotName) in $slots"
            #[slotName]="slotProps"
          >
            <slot
              :name="slotName"
              v-bind="slotProps || {}"
            />
          </template>
        </QuillEditor>
      </div>
      <AppErrorMessage :error-message="errorMessage" />
    </VeeField>
  </div>
</template>

<style lang="scss" scoped>
.invalid-border {
  border: 1px solid rgb(var(--v-theme-error));
}

.quill-editor-container {
  &.read-only {
    :deep(.ql-toolbar,) {
      display: none;
    }

    :deep(.ql-container.ql-snow) {
      border: none;
    }
  }

  :deep(.ql-editor) {
    font-size: 16px;
    min-block-size: 140px;
    resize: vertical;

    ol,
    ul {
      padding: inherit;

      > li {
        direction: ltr;

        &.ql-align-right {
          direction: rtl;
        }

        &::before {
          display: none;
        }
      }
    }

    ul li {
      list-style-type: disc;
    }

    ol li {
      list-style-type: decimal;
    }
  }

  :deep(.ql-picker:not(.ql-color-picker, .ql-icon-picker) svg) {
    @include rtl {
      inset-inline: auto 0;
    }
  }

  :deep(.ql-snow) {
    .ql-tooltip {
      inset-block-start: 0 !important;
      transform: translateX(-50%);

      @include ltr {
        inset-inline-start: 50% !important;
      }

      @include rtl {
        inset-inline-end: 50% !important;
      }
    }

    .ql-fill,
    .ql-stroke.ql-fill {
      fill: rgb(var(--v-theme-grey-900), 1);
    }

    .ql-stroke {
      stroke: rgb(var(--v-theme-grey-900), 1);
    }

    .ql-picker {
      color: rgb(var(--v-theme-grey-900), 1);
    }

    &.ql-toolbar button:hover,
    &.ql-toolbar button:focus,
    &.ql-toolbar .ql-picker-label:hover,
    &.ql-toolbar .ql-picker-item:hover {
      background-color: rgba(var(--v-theme-grey-200), 100%) !important;
    }
  }
}
</style>
