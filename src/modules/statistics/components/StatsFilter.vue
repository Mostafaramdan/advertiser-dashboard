<script setup lang="ts">
/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = defineProps({
  initFilters: { type: Object, default: {} },
})

// #endregion

/***************************************
 **** Section Emits Declaration ********
 **************************************/
// #region Emits
const emit = defineEmits<{
  (e: 'applyFilter', value: any): void
}>()

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const filters = reactive({ ...props.initFilters })
const monthsList = ref<{ label: string; value: number }[]>([])
const yearsList = ref<{ label: string; value: number }[]>([])
// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
initFiltersData()

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function getMoths() {
  for (let i = 1; i <= 12; i++) {
    monthsList.value.push({ label: `اخر ${i} اشهر`, value: i })
  }
}

function getYears() {
  const currentYear = new Date().getFullYear()
  for (let i = currentYear; i >= 1970; i--) {
    yearsList.value.push({ label: i.toString(), value: i })
  }
}

function initFiltersData() {
  getMoths()
  getYears()
}

function applyFilter() {
  emit('applyFilter', filters)
}
// #endregion
</script>

<template>
  <VCard class="mb-4">
    <VCardText>
      <div class="d-flex flex-column flex-md-row align-md-center gap-4">
        <h4>حدد القيم المناسبة لاظهار النتائج</h4>
        <VSelect
          :items="monthsList"
          label="الفترة الزمنية"
          v-model="filters.period"
          item-title="label"
          item-value="value"
          clearable
          @update:model-value="applyFilter"
        />
        <VSelect
          :items="yearsList"
          label="السنة"
          v-model="filters.year"
          item-title="label"
          item-value="value"
          @update:model-value="applyFilter"
        />
      </div>
    </VCardText>
  </VCard>
</template>
