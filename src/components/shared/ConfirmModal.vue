<script lang="ts">
/**
 * Vuetify Confirm Dialog component
 *
 * Insert component where you want to use it:
 * <confirm ref="confirm"></confirm>
 *
 * Call it:
 * this.$refs.confirm.open('Delete', 'Are you sure?').then((confirm) => {})
 */
export default defineComponent({
  setup() {
    const dialog = ref(false)
    const resolvePromise = ref<any>(null)
    const rejectPromise = ref<any>(null)
    const message = ref<string>('')
    const title = ref<string>('')

    function open(titleText: string, messageText: string) {
      dialog.value = true
      title.value = titleText
      message.value = messageText

      return new Promise((resolve: any, reject: any) => {
        resolvePromise.value = resolve
        rejectPromise.value = reject
      })
    }

    function agree() {
      resolvePromise.value(true)
      dialog.value = false
    }

    function cancel() {
      resolvePromise.value(false)
      dialog.value = false
    }

    return {
      dialog,
      resolvePromise,
      rejectPromise,
      message,
      title,
      open,
      agree,
      cancel,
    }
  },
})
</script>

<template>
  <VDialog v-model="dialog" width="410" persistent>
    <VCard class="px-6 py-6 overflow-y-auto">
      <div class="modal__header">
        <h3 class="mb-2">
          {{ title }}
        </h3>
      </div>
      <div>{{ message }}</div>
      <div class="d-flex justify-end mt-8">
        <VBtn
          size="small"
          color="error"
          variant="outlined"
          class="me-2"
          @click="cancel"
        >
          {{ $t('actions.cancel') }}
        </VBtn>
        <VBtn size="small" @click="agree">
          {{ $t('actions.confirm') }}
        </VBtn>
      </div>
    </VCard>
  </VDialog>
</template>
