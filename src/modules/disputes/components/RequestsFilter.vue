<script setup lang="ts">
import FilterSideBar from '@/components/shared/FilterSideBar.vue'
import { ADS_REQUEST_STATUSES } from '@/constants/ads-requests'
import { DISPUTES_STATUSES } from '@/constants/disputes'
import { listService } from '@/services/ListService'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = defineProps({
  showFilter: { type: Boolean, required: true },
  initFilters: { type: Object, default: {} },
  extraData: { type: Object, default: { advertiser_name: '' } },
})

// #endregion

/***************************************
 **** Section Emits Declaration ********
 **************************************/
// #region Emits
const emit = defineEmits<{
  (e: 'update:showFilter', value: boolean): void
  (e: 'applyFilter', value: any): void
}>()

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const showFilter = useVModel(props, 'showFilter', emit)
const typesList = ref([])
const proceduresList = ref([])

const isLoading = reactive({
  types: false,
  procedures: false,
})

const initFilters: any = {
  from_date: null,
  to_date: null,
  types: [],
  statuses: [],
  ads_request_statuses: [],
  procedure_id: null,
}

const filters = reactive({ ...initFilters, ...props.initFilters })

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
getDisputesTypes()
getDisputesProcedures()
// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function applyFilter() {
  emit('applyFilter', filters)
}

function resetFilter() {
  Object.assign(filters, { ...initFilters })
}

function getDisputesTypes() {
  isLoading.types = true
  listService
    .getDisputesTypes()
    .then((res: any) => {
      typesList.value = res.data.data
    })
    .finally(() => {
      isLoading.types = false
    })
}

function getDisputesProcedures() {
  isLoading.procedures = true
  listService
    .getDisputesProcedures()
    .then((res: any) => {
      proceduresList.value = res.data.data
    })
    .finally(() => {
      isLoading.procedures = false
    })
}
// #endregion
</script>

<template>
  <FilterSideBar
    v-model:showFilter="showFilter"
    @apply-filter="applyFilter"
    @reset-filter="resetFilter"
  >
    <VExpansionPanels :model-value="0" multiple>
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle> عرض حسب التاريخ </VExpansionPanelTitle>
        <VExpansionPanelText>
          <AppDateTimePicker
            v-model="filters.from_date"
            placeholder="من"
            clearable
            prepend-inner-icon="tabler-calendar"
            :config="{ disableMobile: true, maxDate: new Date() }"
            class="mb-3"
          />
          <AppDateTimePicker
            v-model="filters.to_date"
            placeholder="الي"
            clearable
            prepend-inner-icon="tabler-calendar"
            :config="{ disableMobile: true, maxDate: new Date() }"
          />
        </VExpansionPanelText>
      </VExpansionPanel>
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle>عرض حسب حالة طلب الاعلان</VExpansionPanelTitle>
        <VExpansionPanelText>
          <AppCheckbox
            v-model="filters.ads_request_statuses"
            :options="ADS_REQUEST_STATUSES"
            hide-label
            name="ads_request_statuses"
            label="حالة الطلب"
            option-label="label"
            option-value="id"
          />
        </VExpansionPanelText>
      </VExpansionPanel>
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle>عرض حسب حالة التنازع</VExpansionPanelTitle>
        <VExpansionPanelText>
          <AppCheckbox
            v-model="filters.statuses"
            :options="
              Array.from(DISPUTES_STATUSES, ([key, value]) => ({
                id: key,
                label: value.label,
              }))
            "
            hide-label
            name="statuses"
            label="حالة التنازع"
            option-label="label"
            option-value="id"
          />
        </VExpansionPanelText>
      </VExpansionPanel>
      <VExpansionPanel v-loading="isLoading.types" elevation="0">
        <VExpansionPanelTitle>عرض حسب أنواع التنازع</VExpansionPanelTitle>
        <VExpansionPanelText>
          <AppCheckbox
            v-model="filters.types"
            :options="typesList"
            hide-label
            name="types"
            label="أنواع التنازع"
            option-label="label"
            option-value="id"
          />
        </VExpansionPanelText>
      </VExpansionPanel>
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle>عرض حسب إجراء التنازع</VExpansionPanelTitle>
        <VExpansionPanelText>
          <VSelect
            v-model="filters.procedure_id"
            class="my-3"
            :items="proceduresList"
            item-value="id"
            item-title="label"
            label="إجراء التنازع"
            :loading="isLoading.procedures"
            :disabled="isLoading.procedures"
            clearable
          />
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
  </FilterSideBar>
</template>
