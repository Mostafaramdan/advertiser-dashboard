<script setup lang="ts">
import UsersSelectFilter from '@/components/filters/UsersSelectFilter.vue'
import FilterSideBar from '@/components/shared/FilterSideBar.vue'
import { FILTER_TYPES, OFFER_STATUSES, OFFER_TYPES, SORT_TYPES } from '@/constants/offers'
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

const isLoading = reactive({
  countries: false,
  areas: false,
})

const initFilters: any = {
  user_id: null,
  countries: [],
  areas: [],
  offer_type: null,
  filter_type: null,
  status: null,
  sort_by: null,
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
  isLoading.areas = true
  listService
    .getCountriesAreas({ countries: filters.countries })
    .then((res: any) => {
      areasList.value = res.data.data
    })
    .finally(() => {
      isLoading.areas = false
    })
}

function onChangeCountries() {
  if (!filters.countries.length) {
    areasList.value = []
    filters.areas = []
    return
  }
  getAreas()
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
        <VExpansionPanelTitle> البحث حسب </VExpansionPanelTitle>
        <VExpansionPanelText>
          <UsersSelectFilter
            label="صاحب العرض"
            :user-role="null"
            v-model="filters.user_id"
            id="advertisers-select-filter"
          />
          <VSelect
            v-model="filters.countries"
            :items="countriesList"
            class="mt-3"
            item-value="id"
            item-title="label"
            label="الدول"
            :loading="isLoading.countries"
            :disabled="isLoading.countries"
            clearable
            multiple
            @update:model-value="onChangeCountries"
          >
            <template #selection="{ item, index }">
              <VChip v-if="index < 1">
                <span>{{ item.title }}</span>
              </VChip>
              <span v-if="index === 1" class="text-grey text-caption align-self-center">
                (+{{ filters.countries.length - 1 }} اخري)
              </span>
            </template>
          </VSelect>
          <VSelect
            v-model="filters.areas"
            class="mt-3"
            :items="areasList"
            item-value="id"
            item-title="label"
            label="المدن"
            :loading="isLoading.areas"
            :disabled="isLoading.areas || filters.countries.length === 0"
            clearable
            multiple
          >
            <template #selection="{ item, index }">
              <VChip v-if="index < 1">
                <span>{{ item.title }}</span>
              </VChip>
              <span v-if="index === 1" class="text-grey text-caption align-self-center">
                (+{{ filters.areas.length - 1 }} اخري)
              </span>
            </template>
          </VSelect>
        </VExpansionPanelText>
      </VExpansionPanel>

      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle>عرض حسب النوع </VExpansionPanelTitle>
        <VExpansionPanelText>
          <VSelect
            v-model="filters.offer_type"
            name="offer_type"
            :items="
              Array.from(OFFER_TYPES, ([key, value]) => ({
                id: key,
                label: value.label,
              }))
            "
            class="mt-2"
            item-title="label"
            item-value="id"
            label="نوع العرض"
            clearable
          />
        </VExpansionPanelText>

        <VExpansionPanelText>
          <VSelect
            v-model="filters.filter_type"
            name="filter_type"
            :items="getOptionsArrayFromObject(FILTER_TYPES)"
            class="mt-2"
            item-title="label"
            item-value="value"
            label="نوع الفلتر"
            clearable
          />
        </VExpansionPanelText>
      </VExpansionPanel>

      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle>عرض حسب حالة العرض </VExpansionPanelTitle>
        <VExpansionPanelText>
          <VSelect
            v-model="filters.status"
            name="status"
            :items="
              Array.from(OFFER_STATUSES, ([key, value]) => ({
                id: key,
                label: value.label,
              }))
            "
            class="mt-2"
            item-title="label"
            item-value="id"
            label="الحالة"
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
    </VExpansionPanels>
  </FilterSideBar>
</template>
