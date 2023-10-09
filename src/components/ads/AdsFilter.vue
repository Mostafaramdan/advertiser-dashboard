<script setup lang="ts">
import UsersSelectFilter from '@/components/filters/UsersSelectFilter.vue'
import FilterSideBar from '@/components/shared/FilterSideBar.vue'
import { AD_DELETE_STATUSES, AD_TYPES, SORT_TYPES, STATUSES_TYPES } from '@/constants/ads'
import { MAIN_TAGS_IDS } from '@/constants/settings'
import { getOptionsArrayFromObject } from '@/helpers/index'
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
  categories: [],
  sort_by: null,
  country_id: null,
  area_id: null,
  advertiser_id: null,
  is_active: null,
  type: null,
  id_deleted: null,
  ad_request_id: null,
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

function getCategories() {
  isLoading.categories = true
  listService
    .getCategories({ tag_id: MAIN_TAGS_IDS.ads })
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
          <VTextField
            label="رقم طلب الاعلان"
            v-model="filters.ad_request_id"
            type="number"
            class="mt-2"
            clearable
          >
          </VTextField>
          <UsersSelectFilter
            label="اختر معلن"
            userRole="advertiser"
            v-model="filters.advertiser_id"
            id="advertisers-select-filter"
            class="mt-3"
            :keyword="extraData.advertiser_name"
          />
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
        <VExpansionPanelTitle> عرض حسب الاقسام</VExpansionPanelTitle>
        <VExpansionPanelText>
          <VSelect
            v-model="filters.categories"
            multiple
            :items="categoriesList"
            class="mt-2"
            item-value="id"
            item-title="label"
            label="الاقسام"
            :loading="isLoading.categories"
            :disabled="isLoading.categories"
            chips
            closable-chips
            :menu-props="{
              maxWidth: '240px',
              contentClass: 'filter-select',
            }"
          />
        </VExpansionPanelText>
      </VExpansionPanel>

      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle>عرض حسب طريقة الاعلان </VExpansionPanelTitle>
        <VExpansionPanelText>
          <AppRadio
            v-model="filters.type"
            :options="getOptionsArrayFromObject(AD_TYPES)"
            hide-label
            name="type"
            label="طريقة الاعلان"
            option-label="label"
            option-value="value"
          />
        </VExpansionPanelText>
      </VExpansionPanel>

      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle>عرض حسب حالة حذف الاعلان </VExpansionPanelTitle>
        <VExpansionPanelText>
          <AppRadio
            v-model="filters.id_deleted"
            :options="getOptionsArrayFromObject(AD_DELETE_STATUSES)"
            hide-label
            name="id_deleted"
            label="حالة الحذف"
            option-label="label"
            option-value="value"
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
