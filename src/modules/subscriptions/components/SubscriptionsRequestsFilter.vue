<script setup lang="ts">
import UsersSelectFilter from '@/components/filters/UsersSelectFilter.vue'
import FilterSideBar from '@/components/shared/FilterSideBar.vue'
import { GENDER_TYPES } from '@/constants/index'
import { SORT_TYPES } from '@/constants/subscriptions'
import { getOptionsArrayFromObject } from '@/helpers/index'
import { listService } from '@/services/ListService'

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
const countriesList = ref([])
const areasList = ref([])
const packagesList = ref([])

const isLoading = reactive({
  countries: false,
  areas: false,
  packages: false,
})

const initFilters = {
  from_date: null,
  to_date: null,
  gender: null,
  sort_by: null,
  country_id: null,
  area_id: null,
  packages: [],
  advertiser_id: null,
}

const filters = reactive({ ...initFilters, ...props.initFilters })

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
getCountries()
getPackages()

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
  filters.area_id = null
  if (!filters.country_id) return
  isLoading.areas = true
  listService
    .getAreas(filters.country_id)
    .then((res: any) => {
      areasList.value = res.data.data
    })
    .finally(() => {
      isLoading.areas = false
    })
}

function getPackages() {
  isLoading.packages = true
  listService
    .getPackagesLists()
    .then((res: any) => {
      packagesList.value = res.data.data
    })
    .finally(() => {
      isLoading.packages = false
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
            :config="{ maxDate: new Date() }"
            class="mb-3"
          />
          <AppDateTimePicker
            v-model="filters.to_date"
            placeholder="الي"
            clearable
            prepend-inner-icon="tabler-calendar"
            :config="{ maxDate: new Date() }"
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
          <VSelect
            v-model="filters.country_id"
            :items="countriesList"
            class="mt-2"
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
        <VExpansionPanelTitle> البحث بالجنس </VExpansionPanelTitle>
        <VExpansionPanelText>
          <AppRadio
            v-model="filters.gender"
            :options="getOptionsArrayFromObject(GENDER_TYPES)"
            hide-label
            name="gender"
            label="الجنس"
            option-label="label"
            option-value="value"
          />
        </VExpansionPanelText>
      </VExpansionPanel>
      <VExpansionPanel v-loading="isLoading.packages" elevation="0">
        <VExpansionPanelTitle> بحث بنوع / فئة الاشتراك </VExpansionPanelTitle>
        <VExpansionPanelText>
          <AppCheckbox
            v-model="filters.packages"
            :options="packagesList"
            hide-label
            name="packages"
            label="فئة الاشتراك"
            option-label="label"
            option-value="id"
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
    </VExpansionPanels>
  </FilterSideBar>
</template>
