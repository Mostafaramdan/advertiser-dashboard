<script setup lang="ts">
import { listService } from '@/services/ListService'
import { useDisputesStore } from '@/stores/DisputesStore'
import { useVModel } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import type { DisputeRequest, DisputeRequestProcedureForm } from '../interfaces/DisputeRequest'
import { requestsService } from '../services/RequestsService'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(defineProps<{ showModal: boolean; requestId: number }>(), {
  showModal: false,
})

// #endregion

/***************************************
 **** Section Emits Declaration ********
 **************************************/
// #region Emits
const emit = defineEmits<{
  (e: 'update:showModal', value: boolean): void
  (e: 'procedure:sent', value: DisputeRequest): void
}>()

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const toast = useToast()
const disputesStore = useDisputesStore()
const showModal = useVModel(props, 'showModal', emit)
const formRef = ref<any>(null)

const isLoading = reactive({
  submit: false,
  procedures: false,
})
const formData = reactive<DisputeRequestProcedureForm>({
  procedure_id: null,
  details: '',
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const proceduresList = computed(() => disputesStore.proceduresList)
// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
getProceduresList()
// #endregion

/***************************************
 **** Section Functions  *********
 **************************************/
// #region Functions
function getProceduresList() {
  if (proceduresList.value.length) return
  isLoading.procedures = true
  listService
    .getDisputesProcedures()
    .then((res: any) => {
      disputesStore.setProceduresList(res.data.data)
    })
    .finally(() => {
      isLoading.procedures = false
    })
}

function takeProcedure() {
  const payload = {
    id: props.requestId,
    data: formData,
  }
  isLoading.submit = true

  requestsService
    .takeProcedure(payload)
    .then((res) => {
      toast.success(res.data.message)
      showModal.value = false
      emit('procedure:sent', res.data.data)
    })
    .finally(() => {
      isLoading.submit = false
    })
}

function submit() {
  formRef.value.validate().then(({ valid }: any) => {
    if (!valid) return
    takeProcedure()
  })
}
// #endregion
</script>

<template>
  <VDialog v-model="showModal" max-width="600" persistent scrollable class="form-modal">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="showModal = !showModal" />

    <!-- Dialog Content -->
    <VCard>
      <VeeForm ref="formRef" v-slot="{ meta }" @submit="submit">
        <VCard title="اتخاذ اجراء تنازع">
          <VCardText>
            <VRow>
              <VCol cols="12">
                <AppAutocomplete
                  v-model="formData.procedure_id"
                  name="admins"
                  :items="proceduresList"
                  item-title="label"
                  item-value="id"
                  label="نوع الاجراء"
                  rules="required"
                  clearable
                  :loading="isLoading.procedures"
                  :disabled="isLoading.procedures"
                />
              </VCol>
              <VCol cols="12">
                <AppTextarea
                  v-model="formData.details"
                  name="details"
                  label="سبب الإجراء"
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
            <VBtn
              :loading="isLoading.submit"
              :disabled="isLoading.submit || !meta.valid"
              @click="submit"
            >
              تنفيذ اجراء
            </VBtn>
          </VCardText>
        </VCard>
      </VeeForm>
    </VCard>
  </VDialog>
</template>
