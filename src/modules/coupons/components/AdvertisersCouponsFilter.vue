<script setup lang="ts">
import UsersSelectFilter from '@/components/filters/UsersSelectFilter.vue'
import FilterSideBar from '@/components/shared/FilterSideBar.vue'
import { SORT_TYPES, STATUSES_TYPES } from '@/constants/coupons'
import { getOptionsArrayFromObject } from '@/helpers/index'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = defineProps({
  showFilter: { type: Boolean, required: true },
  initFilters: { type: Object, default: {} },
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

const initFilters: any = {
  from_date: null,
  to_date: null,
  sort_by: null,
  advertiser_id: null,
  is_active: null,
}

const filters = reactive({ ...initFilters, ...props.initFilters })

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
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
        <VExpansionPanelTitle> البحث حسب </VExpansionPanelTitle>
        <VExpansionPanelText>
          <UsersSelectFilter
            label="اختر معلن"
            userRole="advertiser"
            v-model="filters.advertiser_id"
            id="advertisers-select-filter"
            class="mt-2"
          />
        </VExpansionPanelText>
      </VExpansionPanel>
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle> عرض النتائج بحسب </VExpansionPanelTitle>
        <VExpansionPanelText>
          <AppRadio
            v-model="filters.sort_by"
            :options="getOptionsArrayFromObject(SORT_TYPES)"
            hide-label
            name="sort_by"
            label="الترتيب"
            option-label="label"
            option-value="value"
          />
        </VExpansionPanelText>
      </VExpansionPanel>
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle>عرض حسب الحالة </VExpansionPanelTitle>
        <VExpansionPanelText>
          <AppRadio
            v-model="filters.is_active"
            :options="getOptionsArrayFromObject(STATUSES_TYPES)"
            hide-label
            name="is_active"
            label="الحالة"
            option-label="label"
            option-value="value"
          />
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
  </FilterSideBar>
</template>
