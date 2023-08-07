<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import type { Entity } from '../interfaces/Entity'
import { entitiesService } from '../services/EntitiesService'
import type { FormActionType } from '@/interfaces/Forms'
import { cloneItem } from '@/helpers/index'
/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
interface EntitiesFormModalProps {
  showModal: boolean
  formAction: FormActionType
  activeItem: Entity | null
}

const props = withDefaults(defineProps<EntitiesFormModalProps>(), {
  showModal: false,
})

// #endregion

/***************************************
 **** Section Emits Declaration ********
 **************************************/
// #region Emits
const emit = defineEmits<{
  (e: 'update:showModal', value: boolean): void
  (e: 'createItem', value: Entity): void
  (e: 'editItem', value: Entity): void
}>()

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const showModal = useVModel(props, 'showModal', emit)
const isLoading = ref<boolean>(false)
const formRef = ref<any>(null)

const formData = reactive({
  name: {
    ar: '',
    en: '',
  },
  blocked_at: true,
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const formTitle = computed(() => {
  return props.formAction === 'create'
    ? 'اضافة كيان'
    : props.formAction === 'edit' ? 'تعديل كيان' : 'عرض كيان'
})

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
if (props.activeItem)
  Object.assign(formData, cloneItem(props.activeItem))

// #endregion
function edit() {
  console.log('edit', formData)
  entitiesService.editEntity(formData).then(res => {
    console.log(res)

    // emit('editItem', res.data)
    emit('editItem', formData)
  }).finally(() => {
    isLoading.value = false
    showModal.value = false
  })
}

function create() {
  console.log('create', formData)
  entitiesService.createEntity(formData).then(res => {
    console.log(res)
    emit('createItem', res.data)
  }).finally(() => {
    isLoading.value = false
    showModal.value = false
  })
}

const submit = () => {
  formRef.value.validate().then(({ valid }: any) => {
    if (!valid)
      return

    isLoading.value = true
    props.formAction === 'create' ? create() : edit()
  })
}
</script>

<template>
  <VDialog
    v-model="showModal"
    max-width="600"
    persistent
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="showModal = !showModal" />

    <!-- Dialog Content -->
    <VeeForm ref="formRef" v-slot="{ meta }" @submit="submit">
      <VCard :title="formTitle">
        <VCardText>
          <VRow>
            <VCol cols="12">
              <AppTextField
                v-model="formData.name.ar"
                label="اسم الكيان بالعربي"
                name="name.ar"
                rules="required|min:3"
              />
            </VCol>
            <VCol cols="12">
              <AppTextField
                v-model="formData.name.en"
                label="اسم الكيان بالانجليزي"
                name="name.en"
                rules="required|min:3"
              />
            </VCol>
            <VCol cols="12">
              <AppSwitch
                v-model="formData.blocked_at"
                label="الحالة"
                name="blocked_at"
              />
            </VCol>
          </VRow>
        </VCardText>

        <VCardText v-if="formAction !== 'view'" class="d-flex justify-end flex-wrap gap-3">
          <VBtn
            variant="outlined"
            color="error"
            @click="showModal = false"
          >
            {{ t('actions.cancel') }}
          </VBtn>
          <VBtn :loading="isLoading" :disabled="isLoading || !meta.valid" @click="submit">
            {{ formAction === 'edit' ? t('actions.save') : t('actions.create') }}
          </VBtn>
        </VCardText>
      </VCard>
    </VeeForm>
  </VDialog>
</template>
