<script setup lang="ts">
import FilterSideBar from '@/components/shared/FilterSideBar.vue'
import { FAVORITE_STATUSES, TICKETS_STATUSES, USERS_TYPES } from '@/constants/tickets'
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
const typesList = ref([])

const isLoading = reactive({
  types: false,
})

const initFilters: any = {
  from_date: null,
  to_date: null,
  role_types: [],
  statuses: [],
  types: [],
  is_starred: null,
}

const filters = reactive({ ...initFilters, ...props.initFilters })

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
getTicketsTypes()
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

function getTicketsTypes() {
  isLoading.types = true
  listService
    .getTicketsTypes()
    .then((res: any) => {
      typesList.value = res.data.data
    })
    .finally(() => {
      isLoading.types = false
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
          <DateRangeFilter v-model:fromDate="filters.from_date" v-model:toDate="filters.to_date" />
        </VExpansionPanelText>
      </VExpansionPanel>
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle>عرض حسب نوع المستخدمين</VExpansionPanelTitle>
        <VExpansionPanelText>
          <AppCheckbox
            v-model="filters.role_types"
            :options="getOptionsArrayFromObject(USERS_TYPES)"
            hide-label
            name="role_types"
            label="نوع المستخدمين"
            option-label="label"
            option-value="value"
          />
        </VExpansionPanelText>
      </VExpansionPanel>
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle>عرض حسب حالات التذاكر</VExpansionPanelTitle>
        <VExpansionPanelText>
          <AppCheckbox
            v-model="filters.statuses"
            :options="
              Array.from(TICKETS_STATUSES, ([key, value]) => ({
                id: key,
                label: value.label,
              }))
            "
            hide-label
            name="statuses"
            label="حالات التذاكر"
            option-label="label"
            option-value="id"
          />
        </VExpansionPanelText>
      </VExpansionPanel>
      <VExpansionPanel v-loading="isLoading.types" elevation="0">
        <VExpansionPanelTitle>عرض حسب أنواع التذاكر</VExpansionPanelTitle>
        <VExpansionPanelText>
          <AppCheckbox
            v-model="filters.types"
            :options="typesList"
            hide-label
            name="types"
            label="أنواع التذاكر"
            option-label="label"
            option-value="id"
          />
        </VExpansionPanelText>
      </VExpansionPanel>
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle>عرض حسب المفضلة</VExpansionPanelTitle>
        <VExpansionPanelText>
          <VSelect
            v-model="filters.is_starred"
            class="my-3"
            :items="getOptionsArrayFromObject(FAVORITE_STATUSES)"
            item-title="label"
            item-value="value"
            label="المفضلة"
            clearable
          />
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
  </FilterSideBar>
</template>
