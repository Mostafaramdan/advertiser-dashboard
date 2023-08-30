<script setup lang="ts">
import FilterSideBar from '@/components/shared/FilterSideBar.vue'
import { SORT_TYPES } from '@/constants/advertisers'
import { GENDER_TYPES } from '@/constants/index'
import { getOptionsArrayFromObject } from '@/helpers/index'
import { listService } from '@/services/ListService'

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
  (e: 'update:showFilter', value: boolean): void
  (e: 'applyFilter', value: any): void
}>()

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { locale } = useI18n()
const showFilter = useVModel(props, 'showFilter', emit)
const countriesList = ref([])
const areasList = ref([])

const isLoading = reactive({
  countries: false,
  areas: false,
})

const initFilters = {
  from_date: null,
  to_date: null,
  gender: null,
  sort_by: null,
  country_id: null,
  area_id: null,
}

const filters = reactive({ ...initFilters })

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
  listService.getCountries().then((res: any) => {
    countriesList.value = res.data.data
  }).finally(() => {
    isLoading.countries = false
  })
}

function getAreas() {
  filters.area_id = null
  if (!filters.country_id) return
  console.log('getAreas', filters.country_id)
}

// #endregion
</script>

<template>
  <FilterSideBar v-model:showFilter="showFilter" @apply-filter="applyFilter" @reset-filter="resetFilter">
    <VExpansionPanels :model-value="0" multiple>
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle>
          عرض حسب التاريخ
        </VExpansionPanelTitle>
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
        <VExpansionPanelTitle>
          البحث بالجنس
        </VExpansionPanelTitle>
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
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle>
          عرض النتائج بحسب
        </VExpansionPanelTitle>
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
        <VExpansionPanelTitle>
          البحث بالدول - المدن
        </VExpansionPanelTitle>
        <VExpansionPanelText>
          <VSelect
            v-model="filters.country_id"
            :items="countriesList"
            class="mt-2"
            item-value="id"
            :item-title="`name[${locale}]`"
            prepend-inner-icon="tabler-flag"
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
            :item-title="`name[${locale}]`"
            prepend-inner-icon="tabler-flag"
            label="المدينة"
            :loading="isLoading.areas"
            :disabled="isLoading.areas || !filters.country_id"
            clearable
            @update:model-value="getAreas"
          />
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
  </FilterSideBar>
</template>
