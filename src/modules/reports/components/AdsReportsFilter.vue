<script setup lang="ts">
import UsersSelectFilter from '@/components/filters/UsersSelectFilter.vue'
import FilterSideBar from '@/components/shared/FilterSideBar.vue'
import { AD_DELETE_STATUSES, AD_TYPES, SORT_TYPES, STATUSES_TYPES } from '@/constants/ads'
import { getOptionsArrayFromObject } from '@/helpers/index'

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

const initFilters: any = {
  from_date: null,
  to_date: null,
  report_id: null,
  ad_id: null,
  advertiser_id: null,
  reporter_id: null,
  is_active: null,
  sort_by: null,
  type: null,
  id_deleted: null,
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
          <VTextField
            label="بحث برقم البلاغ"
            clearable
            prepend-inner-icon="tabler-search"
            v-model="filters.report_id"
            class="mt-2"
          />
          <VTextField
            label="بحث برقم الاعلان"
            clearable
            prepend-inner-icon="tabler-search"
            v-model="filters.ad_id"
            class="mt-3"
          />

          <UsersSelectFilter
            label="اختر معلن"
            user-role="advertiser"
            v-model="filters.advertiser_id"
            id="advertisers-select-filter"
            class="mt-2"
            :keyword="extraData.advertiser_name"
          />
          <UsersSelectFilter
            label="اختر مبلغ"
            class="mt-3"
            v-model="filters.reporter_id"
            id="users-select-filter"
            :user-role="null"
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
        <VExpansionPanelTitle>عرض حسب حالة الاعلان </VExpansionPanelTitle>
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
