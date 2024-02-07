<script setup lang="ts">
import FilterSideBar from '@/components/shared/FilterSideBar.vue'
import { REMINDER_REQUEST_TYPES, REMINDER_REQUESTS_SORT_TYPES } from '@/constants/offers'
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
  from_quantity: null,
  to_quantity: null,
  type: null,
  user_id: null,
  product_id: null,
  sort_by: null,
}

const filters = reactive({ ...initFilters, ...props.initFilters })

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
          <DateRangeFilter v-model:fromDate="filters.from_date" v-model:toDate="filters.to_date" />
        </VExpansionPanelText>
      </VExpansionPanel>
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle> عرض حسب الكمية</VExpansionPanelTitle>
        <VExpansionPanelText>
          <div class="mb-3">
            <AppTextField
              name="from"
              label="من"
              placeholder="من"
              hide-default-label
              v-model="filters.from_quantity"
              clearable
              type="number"
              rules="numeric"
            />
          </div>
          <div>
            <AppTextField
              name="to"
              label="الي"
              placeholder="الي"
              hide-default-label
              v-model="filters.to_quantity"
              clearable
              :rules="{ numeric: true, greaterThanValue: filters.from_quantity }"
              type="number"
            />
          </div>
        </VExpansionPanelText>
      </VExpansionPanel>
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle> البحث حسب </VExpansionPanelTitle>
        <VExpansionPanelText>
          <VSelect
            v-model="filters.type"
            class="my-3"
            :items="
              Array.from(REMINDER_REQUEST_TYPES, ([key, value]) => ({
                id: key,
                label: value.label,
              }))
            "
            item-title="label"
            item-value="id"
            label="نوع الطلب"
            clearable
          />
          <UsersSelectFilter
            label="المعلن"
            user-role="advertiser"
            :keyword="extraData.advertiser_name"
            v-model="filters.user_id"
            class="mt-3"
            id="advertisers-select-filter"
            clearable
          />
          <ProductsSelectFilter
            :user-id="filters.user_id"
            :disabled="!filters.user_id"
            label="المنتج"
            class="mt-3"
            v-model="filters.product_id"
            :key="filters.user_id"
            id="products-select-filter"
            clearable
          />
        </VExpansionPanelText>
      </VExpansionPanel>

      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle> عرض النتائج بحسب </VExpansionPanelTitle>
        <VExpansionPanelText>
          <AppRadio
            v-model="filters.sort_by"
            :options="getOptionsArrayFromObject(REMINDER_REQUESTS_SORT_TYPES)"
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
