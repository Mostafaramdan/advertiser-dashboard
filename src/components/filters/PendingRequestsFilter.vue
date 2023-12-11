<script setup lang="ts">
import { MetaData } from '@/interfaces/Shared'
import { listService } from '@/services/ListService'
/* @ts-expect-error for lodash */
import { debounce } from 'lodash'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
interface Props {
  modelValue: any
  label?: string
  user_id?: number | null
  id: string
  keyword?: string
  locationStrategy?: 'static' | 'connected'
}
const props = withDefaults(defineProps<Props>(), {
  label: 'اختر مستخدم',
  user_id: null,
  keyword: '',
  locationStrategy: 'static',
})
// #endregion

/***************************************
 **** Section Emits Declaration ********
 **************************************/
// #region Emits
const emit = defineEmits<{ (e: 'update:modelValue', value: any): void }>()
// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const usersSelectRef = ref()
const isLoading = ref<boolean>(false)
const usersList = ref([])
const metaData = ref<MetaData | null>(null)
const params: any = reactive({
  page: 1,
  itemPerPage: 20,
  keyword: props.keyword,
  user_id: props.user_id,
})
// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const selectedValue = computed({
  get() {
    return props.modelValue
  },
  set(newValue: any) {
    emit('update:modelValue', newValue)
  },
})
// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
getData()

onMounted(() => {
  document.querySelector(`.${props.id} > .v-list`)?.addEventListener('scroll', handleScroll)
})
// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function getData() {
  isLoading.value = true
  listService
    .getPendingRequests(params)
    .then((res) => {
      const { data, meta } = res.data
      if (params.page === 1) usersList.value = data
      else usersList.value = usersList.value.concat(data)
      metaData.value = meta
    })
    .finally(() => {
      isLoading.value = false
    })
}

async function handleScroll(event: any) {
  const { scrollTop, clientHeight, scrollHeight } = event.target
  if (
    scrollTop + clientHeight >= scrollHeight - 20 &&
    !isLoading.value &&
    metaData.value &&
    usersList.value.length < metaData.value.total
  ) {
    params.page++
    getData()
  }
}

const handleDebounceSearch = debounce((value: any) => {
  selectedValue.value = null
  params.keyword = value
  params.page = 1
  getData()
}, 500)

// #endregion
</script>

<template>
  <div ref="usersSelectRef" class="position-relative">
    <VSelect
      :items="usersList"
      class="mt-2"
      item-value="id"
      item-title="label"
      :label="label"
      :disabled="isLoading && !usersList.length"
      :loading="isLoading && !usersList.length"
      eager
      v-bind="$attrs"
      v-model="selectedValue"
      :menu-props="{
        contentClass: `filter-select dropdown-select-menu ${id}`,
        attach: usersSelectRef,
        locationStrategy,
        maxHeight: '250px',
      }"
    >
      <template #selection="{ item }">
        <span v-if="item.title && !isLoading">{{ item.title }}</span>
      </template>
      <template #prepend-item>
        <div class="search-input pa-1">
          <v-progress-linear
            indeterminate
            height="1"
            color="primary"
            v-if="isLoading"
          ></v-progress-linear>
          <VTextField
            placeholder="بحث"
            @update:model-value="handleDebounceSearch"
            :model-value="params.keyword"
            clearable
          ></VTextField>
        </div>
      </template>
    </VSelect>
  </div>
</template>

<style lang="scss" scoped>
.search-input {
  position: sticky;
  z-index: 1;
  background: rgba(var(--v-theme-white), 1);
  inset-block-start: 0;
}

:deep(.dropdown-select-menu) {
  inline-size: 100%;
  inset-block-start: 100%;

  .v-list {
    padding-block-start: 0;
  }
}
</style>
