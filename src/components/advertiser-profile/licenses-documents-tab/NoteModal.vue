<script setup lang="ts">
import { usersService } from '@/services/UsersService'
import { useVModel } from '@vueuse/core'
import { useToast } from 'vue-toastification'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
interface LicensesAndDocumentsNoteModalProps {
  showModal: boolean
  activeId: number
}

const props = withDefaults(defineProps<LicensesAndDocumentsNoteModalProps>(), {
  showModal: false,
})

// #endregion

/***************************************
 **** Section Emits Declaration ********
 **************************************/
// #region Emits
const emit = defineEmits<{
  (e: 'update:showModal', value: boolean): void
}>()

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const toast = useToast()
const showModal = useVModel(props, 'showModal', emit)
const isLoading = ref<boolean>(false)
const formRef = ref<any>(null)
const formData = reactive<{ note: string }>({
  note: '',
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
// #endregion

function sendNotification() {
  const payload = {
    id: props.activeId,
    data: { ...formData },
  }

  isLoading.value = true

  usersService
    .sendLicensesDocumentsNote(payload)
    .then((res) => {
      toast.success(res.data.message)
      showModal.value = false
    })
    .finally(() => {
      isLoading.value = false
    })
}

function submit() {
  formRef.value.validate().then(({ valid }: any) => {
    if (!valid) return
    sendNotification()
  })
}
</script>

<template>
  <VDialog v-model="showModal" max-width="700" persistent scrollable class="form-modal">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="showModal = !showModal" />

    <!-- Dialog Content -->
    <VCard>
      <VeeForm ref="formRef" v-slot="{ meta }" @submit="submit">
        <VCard title="اضافة ملاحظة">
          <VCardText>
            <VRow>
              <VCol cols="12">
                <AppTextarea
                  v-model="formData.note"
                  name="note"
                  label="نص الملاحظة"
                  rows="4"
                  rules="required|min:10|max:250"
                />
              </VCol>
            </VRow>
          </VCardText>

          <VCardText class="d-flex justify-end flex-wrap gap-3">
            <VBtn variant="outlined" color="error" @click="showModal = false">
              {{ t('actions.cancel') }}
            </VBtn>
            <VBtn :loading="isLoading" :disabled="isLoading || !meta.valid" @click="submit">
              {{ t('actions.send') }}
            </VBtn>
          </VCardText>
        </VCard>
      </VeeForm>
    </VCard>
  </VDialog>
</template>
