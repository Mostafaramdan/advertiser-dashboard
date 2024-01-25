<script setup lang="ts">
import FilterSideBar from '@/components/shared/FilterSideBar.vue'
import { SORT_TYPES, STATUSES_TYPES } from '@/constants/team'
import { getOptionsArrayFromObject } from '@/helpers/index'
import { listService } from '@/services/ListService'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = defineProps({
  showFilter: { type: Boolean, required: true },
  initFilters: { type: Object, default: {} },
  extraData: { type: Object, default: {} },
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
const countriesList = ref([])
const areasList = ref([])

const isLoading = reactive({
  countries: false,
  areas: false,
})

const initFilters: any = {
  from_date: null,
  to_date: null,
  sort_by: null,
  country_id: null,
  area_id: null,
  is_active: null,
}

const filters = reactive({ ...initFilters, ...props.initFilters })

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
getCountries()
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

function getCountries() {
  isLoading.countries = true
  listService
    .getCountries()
    .then((res: any) => {
      countriesList.value = res.data.data
    })
    .finally(() => {
      isLoading.countries = false
    })
}

function getAreas() {
  const country_id = filters.country_id
  filters.area_id = null
  if (!country_id) return
  isLoading.areas = true
  listService
    .getCountriesAreas({ country_id })
    .then((res: any) => {
      areasList.value = res.data.data
    })
    .finally(() => {
      isLoading.areas = false
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
        <VExpansionPanelTitle>عرض حسب تاريخ التعاقد</VExpansionPanelTitle>
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
          <VSelect
            v-model="filters.country_id"
            :items="countriesList"
            class="mt-3"
            item-value="id"
            item-title="label"
            label="الدولة"
            :loading="isLoading.countries"
            :disabled="isLoading.countries"
            clearable
            @update:model-value="getAreas"
          />
          <VSelect
            v-model="filters.area_id"
            class="mt-3"
            :items="areasList"
            item-value="id"
            item-title="label"
            label="المدينة"
            :loading="isLoading.areas"
            :disabled="isLoading.areas || !filters.country_id"
            clearable
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
