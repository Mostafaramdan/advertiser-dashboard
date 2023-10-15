<script setup lang="ts">
import type { ReadyReplyItem } from '@/interfaces/Shared'
import { listService } from '@/services/ListService'
/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props

const props = withDefaults(defineProps<{ showModal: boolean; type: string }>(), {
  showModal: false,
})

// #endregion

/***************************************
 **** Section Emits Declaration ********
 **************************************/
// #region Emits
const emit = defineEmits<{
  (e: 'update:showModal', value: boolean): void
  (e: 'select:reply', value: string): void
}>()

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const showModal = useVModel(props, 'showModal', emit)
const isLoading = ref<boolean>(false)
const repliesList = ref<ReadyReplyItem[]>([])
const selectedReply = ref<number | null>(null)

// #endregion

/***************************************
 **** Section Watchers *****************
 **************************************/
// #region Watchers
watch(showModal, (value) => {
  if (value && !repliesList.value.length) {
    getData()
  }
})

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function getData() {
  isLoading.value = true
  listService
    .getReadyReplies(props.type)
    .then((res) => {
      repliesList.value = res.data.data
    })
    .finally(() => {
      isLoading.value = false
    })
}

function hideModal() {
  showModal.value = false
  selectedReply.value = null
}

function save() {
  const reply = repliesList.value.find((reply: ReadyReplyItem) => reply.id === selectedReply.value)
    ?.label
  if (reply) {
    hideModal()
    emit('select:reply', reply)
  }
}
// #endregion
</script>

<template>
  <VDialog v-model="showModal" max-width="700" scrollable persistent eager>
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="showModal = !showModal" />

    <!-- Dialog Content -->
    <VCard>
      <div>
        <VCard title="اختر رد" v-loading="isLoading">
          <VCardText style="min-height: 300px">
            <AppRadio
              v-if="repliesList.length"
              v-model="selectedReply"
              :options="repliesList"
              hide-label
              name="reply"
              label="الرد"
              option-label="label"
              option-value="id"
            />
            <div v-else-if="!isLoading" class="text-h6">
              {{ t('general.no_data') }}
            </div>
          </VCardText>

          <VCardText class="d-flex justify-end flex-wrap gap-3">
            <VBtn variant="outlined" color="error" @click="hideModal">
              {{ t('actions.cancel') }}
            </VBtn>
            <VBtn :loading="isLoading" :disabled="isLoading || !selectedReply" @click="save">
              {{ t('actions.save') }}
            </VBtn>
          </VCardText>
        </VCard>
      </div>
    </VCard>
  </VDialog>
</template>

<style lang="scss" scoped>
:deep(.v-radio-group .v-selection-control-group .v-radio) {
  align-items: baseline;
  margin-block: 0 5px;
  margin-inline: 0;
}
</style>
