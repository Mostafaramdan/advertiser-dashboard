<script setup lang="ts">
import FilterSideBar from '@/components/shared/FilterSideBar.vue'
import { USERS_ROLES } from '@/constants/index'
import { CATEGORIES_TYPES, NOTIFICATION_TYPES, SORT_TYPES } from '@/constants/notifications'
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
  sort_by: null,
  role: null,
  notify_type: null,
  categories: [],
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
        <VExpansionPanelTitle> البحث حسب توع الاشعار </VExpansionPanelTitle>
        <VExpansionPanelText>
          <VSelect
            v-model="filters.notify_type"
            :items="NOTIFICATION_TYPES"
            class="mt-2"
            item-value="id"
            item-title="label"
            label="نوع الاشعار"
            :clearable="filters.notify_type !== null"
          />
        </VExpansionPanelText>
      </VExpansionPanel>
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle> عرض حسب توع المستخدم </VExpansionPanelTitle>
        <VExpansionPanelText>
          <AppRadio
            v-model="filters.role"
            :options="getOptionsArrayFromObject(USERS_ROLES)"
            hide-label
            name="role"
            label="نوع المستخدم"
            option-label="label"
            option-value="value"
          />
        </VExpansionPanelText>
      </VExpansionPanel>
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle> عرض حسب الاقسام</VExpansionPanelTitle>
        <VExpansionPanelText>
          <AppCheckbox
            v-model="filters.categories"
            :options="CATEGORIES_TYPES"
            hide-label
            name="categories"
            label="القسم"
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
