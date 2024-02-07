<script setup lang="ts">
import { useToast } from 'vue-toastification'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = defineProps({
  showFilter: { type: Boolean, required: true },
})

// #endregion

/***************************************
 **** Section Emits Declaration ********
 **************************************/
// #region Emits
const emit = defineEmits<{
  (e: 'resetFilter'): void
  (e: 'applyFilter'): void
}>()

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const toast = useToast()
const formRef = ref<any>(null)
const showFilter = defineModel<boolean>('showFilter')

watch(
  () => showFilter.value,
  (value) => {
    if (value) document.documentElement.classList.add('overflow-hidden')
    else document.documentElement.classList.remove('overflow-hidden')
  },
)

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function hideFilter() {
  showFilter.value = false
}

function resetFilter() {
  emit('resetFilter')
}

function applyFilter() {
  emit('applyFilter')
  hideFilter()
}

function submit() {
  formRef.value.validate().then(({ errors }: any) => {
    const errorsArr = Object.values(errors)
    if (errorsArr.length) {
      toast.error(errorsArr.slice(0, 3).join('\n'))
      return
    }
    applyFilter()
  })
}

// #endregion
</script>

<template>
  <div class="app-filter">
    <VeeForm ref="formRef" @submit="submit">
      <VNavigationDrawer v-model="showFilter" temporary width="290">
        <div class="app-filter__row">
          <div class="app-filter__header pa-3 bg-grey-50 d-flex align-center gap-3">
            <VIcon icon="tabler-filter" />
            <h3 class="me-auto">
              {{ t('filter_results') }}
            </h3>
            <VBtn size="33" icon="mdi-close" variant="outlined" @click="hideFilter" />
          </div>
          <div class="app-filter__body pa-3">
            <slot />
          </div>
          <div class="app-filter__footer d-flex pa-3">
            <VBtn size="small" variant="outlined" color="error" @click="resetFilter">
              {{ t('actions.reset_filter') }}
            </VBtn>
            <VBtn size="small" @click="submit">
              {{ t('actions.apply_filter') }}
            </VBtn>
          </div>
        </div>

        <VDivider />
      </VNavigationDrawer>
    </VeeForm>
  </div>
</template>

<style lang="scss" scoped>
.app-filter {
  :deep(.v-navigation-drawer__content) {
    overflow: hidden;
  }

  &__row {
    display: flex;
    flex-direction: column;
    block-size: 100vh;
  }

  &__header {
    border-block-end: 1px solid rgba(var(--v-theme-grey-300), 1);
  }

  &__body {
    overflow: auto;
    flex-grow: 1;

    :deep(.v-expansion-panel) {
      border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));

      .v-expansion-panel-title[class] {
        min-block-size: auto;
        padding-block: 12px;
        padding-inline: 6px;
      }

      .v-expansion-panel-text__wrapper {
        padding: 6px;
      }

      .v-app-loader .spinner-circle {
        block-size: 30px;
        inline-size: 30px;
      }
    }

    :deep(.demo-space-x) {
      flex-direction: column;
      align-items: flex-start;
      margin-block-start: 0;

      * {
        margin: 0;
      }

      .v-selection-control {
        align-items: flex-start;
      }
    }

    :global(.filter-select .v-list-item-title) {
      font-size: 13px;
    }
  }

  &__footer {
    gap: 10px;

    button.v-btn {
      block-size: auto;
      inline-size: calc(50% - 5px);
      padding-block: 10px;
    }
  }
}
</style>
