<!-- eslint-disable @typescript-eslint/indent -->
<script setup lang="ts">
/* @ts-expect-error for lodash */
import { debounce } from 'lodash'
import { useToast } from 'vue-toastification'
import type { PageActionsProps } from '@/interfaces/Shared'
import { sharedService } from '@/services/SharedService'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props

const props = withDefaults(defineProps<PageActionsProps>(), {
  perPageOptions: () => [1, 10, 25, 50, 100],
  pageActionsButtons: () => [],
  showMultiDelete: false,
  showMultiActivate: false,
  selectedItems: () => [],
  model: '',
})

// #endregion

/***************************************
 **** Section Emits Declaration ********
 **************************************/
// #region Emits
const emit = defineEmits<{
  (e: 'update:itemsPerPage', value: any): void
  (e: 'update:search', value: string): void
  (e: 'reloadData'): void
}>()

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const toast = useToast()
const searchText = ref<string>('')
const confirmModal = ref<any>()

const isLoading = reactive({
  general: false,
  delete: false,
  activate: false,
  deactivate: false,
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const multiSelectOptions = computed(() => {
  if (props.selectedItems.length && (props.showMultiDelete || props.showMultiActivate)) {
    return [
      {
        label: 'حذف المحدد',
        icon: 'tabler-trash',
        handler: () => showConfirmActions('delete'),
        loading: isLoading.delete,
        disabled: isLoading.general || !props.showMultiDelete,
        color: 'error',
      },
      {
        label: 'تفعيل المحدد',
        icon: 'tabler-square-check',
        handler: () => showConfirmActions('activate'),
        loading: isLoading.activate,
        disabled: isLoading.general || !props.showMultiActivate,
        color: 'primary',
      },
      {
        label: 'إلغاء تفعيل المحدد',
        icon: 'tabler-square-off',
        handler: () => showConfirmActions('deactivate'),
        loading: isLoading.deactivate,
        disabled: isLoading.general || !props.showMultiActivate,
        color: 'dark',
      },
    ]
  }
  else {
    return []
  }
})

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function emitItemsPerPage(value: number) {
  emit('update:itemsPerPage', value)
}

function emitSearchText() {
  emit('update:search', searchText.value)
}

const handleDebounceSearch = debounce(() => {
  emitSearchText()
}, 500)

function toggleActivation(action: number) {
  isLoading.general = true
  action ? isLoading.activate = true : isLoading.deactivate = true

  const data = {
    model: props.model,
    ids: props.selectedItems,
    action,
  }

  sharedService
    .toggleActivationBulk(data)
    .then(res => {
      toast.success(res.data.message)
      emit('reloadData')
    })
    .finally(() => {
      isLoading.general = false
      action ? isLoading.activate = false : isLoading.deactivate = false
    })
}

function deleteBulk() {
  isLoading.general = true
  isLoading.delete = true

  const data = {
    model: props.model,
    ids: props.selectedItems,
  }

  sharedService
    .deleteBulk(data)
    .then(res => {
      toast.success(res.data.message)
      emit('reloadData')
    })
    .finally(() => {
      isLoading.general = false
      isLoading.delete = false
    })
}

async function showConfirmActions(operation: 'delete' | 'activate' | 'deactivate') {
  const confirmQuestions = {
    delete: 'هل انت متاكد من حذف العناصر المحددة',
    activate: 'هل انت متاكد من تفعيل العناصر المحددة',
    deactivate: 'هل انت متاكد من إلغاء تفعيل العناصر المحددة',
  }

  const confirm = await confirmModal.value.open('يرجي التاكيد', confirmQuestions[operation])
  if (confirm) {
    switch (operation) {
    case 'delete':
      deleteBulk()
      break
    case 'activate':
      toggleActivation(1)
      break
    case 'deactivate':
      toggleActivation(0)
      break
    }
  }
}

// #endregion
</script>

<template>
  <ConfirmModal ref="confirmModal" />
  <div class="page-actions">
    <div class="page-actions__row">
      <VTextField
        v-model="searchText"
        label="بحث"
        clearable
        prepend-inner-icon="tabler-search"
        class="search-input me-auto"
        @update:model-value="handleDebounceSearch"
      />
      <template v-for="(action, index) in pageActionsButtons" :key="index">
        <VBtn
          v-if="action.show"
          size="38"
          variant="outlined"
          :loading="action.loading"
          :disabled="action.loading || action.disabled"
          @click="action.handler"
        >
          <VIcon
            :icon="action.icon"
            size="22"
          />
        </VBtn>
      </template>
      <VSelect
        v-if="itemsPerPage"
        :items="perPageOptions"
        :model-value="itemsPerPage"
        label="عدد الصفوف"
        class="items-select"
        @update:model-value="emitItemsPerPage"
      />
    </div>

    <div v-if="multiSelectOptions.length" class="d-flex gap-2 mb-3 pb-1 overflow-x-auto">
      <VBtn
        v-for="(option, index) in multiSelectOptions"
        :key="index"
        :disabled="option.disabled"
        :loading="option.loading"
        variant="outlined"
        :color="option.color"
        @click="option.handler"
      >
        {{ option.label }}

        <VIcon
          end
          :icon="option.icon"
        />
      </VBtn>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-actions {
  &__row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-block-end: 20px;
  }

  :deep(.items-select) {
    max-inline-size: 100px;

    @include responsive-down("md") {
      max-inline-size: unset;
    }
  }

  :deep(.search-input) {
    max-inline-size: 320px;

    @include responsive-down("md") {
      inline-size: 100%;
      max-inline-size: unset;
    }
  }
}
</style>
