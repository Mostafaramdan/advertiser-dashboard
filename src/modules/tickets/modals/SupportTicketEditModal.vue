<script setup lang="ts">
import { TICKETS_STATUSES } from '@/constants/tickets'
import { useVModel } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import type { SupportTicket } from '../interfaces/SupportTicket'
import { supportTicketsService } from '../services/SupportTicketsService'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(defineProps<{ showModal: boolean; ticket: SupportTicket }>(), {
  showModal: false,
})

// #endregion

/***************************************
 **** Section Emits Declaration ********
 **************************************/
// #region Emits
const emit = defineEmits<{
  (e: 'update:showModal', value: boolean): void
  (e: 'editItem', value: any): void
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
const formData = reactive({
  status: null,
})

// #endregion

/***************************************
 **** Section Functions  *********
 **************************************/
// #region Functions

function getTicketsStatuses() {
  return Array.from(TICKETS_STATUSES, ([key, value]) => ({
    id: key,
    label: value.label,
  })).filter((item) => item.id !== 'delayed')
}

function edit() {
  const payload = {
    id: props.ticket.id,
    data: formData,
  }
  isLoading.value = true
  supportTicketsService
    .editTicketStatus(payload)
    .then((res) => {
      toast.success(res.data.message)
      emit('editItem', res.data.data)
      showModal.value = false
    })
    .finally(() => {
      isLoading.value = false
    })
}

function submit() {
  formRef.value.validate().then(({ valid }: any) => {
    if (!valid) return
    edit()
  })
}

// #endregion
</script>

<template>
  <VDialog v-model="showModal" max-width="650" persistent scrollable class="form-modal">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="showModal = !showModal" />

    <!-- Dialog Content -->
    <VCard>
      <VeeForm ref="formRef" v-slot="{ meta }" @submit="submit">
        <VCard title="تعديل التذكرة">
          <VCardText>
            <VRow>
              <VCol cols="12">
                <AppSelect
                  v-model="formData.status"
                  :items="getTicketsStatuses()"
                  item-title="label"
                  item-value="id"
                  name="status"
                  label="حالة التذكرة"
                  clearable
                  rules="required"
                  :hint="`الحالة السابقة هي ${TICKETS_STATUSES.get(ticket.status)?.label}`"
                  persistent-hint
                />
              </VCol>
            </VRow>
          </VCardText>

          <VCardText class="d-flex justify-end flex-wrap gap-3">
            <VBtn variant="outlined" color="error" @click="showModal = false">
              {{ t('actions.cancel') }}
            </VBtn>
            <VBtn :loading="isLoading" :disabled="isLoading || !meta.valid" @click="submit">
              {{ t('actions.save') }}
            </VBtn>
          </VCardText>
        </VCard>
      </VeeForm>
    </VCard>
  </VDialog>
</template>
