<script setup lang="ts">
import UsersSelectFilter from '@/components/filters/UsersSelectFilter.vue'
import FilterSideBar from '@/components/shared/FilterSideBar.vue'
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
const categoriesList = ref([])

const isLoading = reactive({
  countries: false,
  areas: false,
  categories: false,
})

const initFilters: any = {
  from_date: null,
  to_date: null,
  user_id: null,
  countries: [],
  areas: [],
  categories: null,
}

const filters = reactive({ ...initFilters, ...props.initFilters })

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
getCountries()
getCategories()
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
    .getAdsSpacesCategories()
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
    .getAreas(filters.countries[0])
    .then((res: any) => {
      areasList.value = res.data.data
    })
    .finally(() => {
      isLoading.areas = false
    })
}

function onChangeCountries() {
  const countriesLength = filters.countries.length
  if (countriesLength !== 1) {
    filters.areas = []
    return
  }
  getAreas()
}

function getCategories() {
  isLoading.categories = true
  listService
    .getCategories()
    .then((res: any) => {
      categoriesList.value = res.data.data
    })
    .finally(() => {
      isLoading.categories = false
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
        <VExpansionPanelTitle> البحث حسب </VExpansionPanelTitle>
        <VExpansionPanelText>
          <UsersSelectFilter
            label="المستخدم"
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
            :disabled="isLoading.areas || filters.countries.length !== 1"
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
        <VExpansionPanelTitle> عرض حسب القسم</VExpansionPanelTitle>
        <VExpansionPanelText>
          <VSelect
            v-model="filters.categories"
            :items="categoriesList"
            class="mt-2"
            item-value="id"
            item-title="label"
            label="القسم"
            :loading="isLoading.categories"
            :disabled="isLoading.categories"
            clearable
            multiple
            :menu-props="{
              maxWidth: '240px',
              contentClass: 'filter-select',
            }"
          >
            <template #selection="{ item, index }">
              <VChip v-if="index < 1">
                <span>{{ item.title }}</span>
              </VChip>
              <span v-if="index === 1" class="text-grey text-caption align-self-center">
                (+{{ filters.categories.length - 1 }} اخري)
              </span>
            </template>
          </VSelect>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
  </FilterSideBar>
</template>
