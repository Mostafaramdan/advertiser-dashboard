<script setup lang="ts">
import { cloneItem } from '@/helpers/index'
import type { FormModalProps } from '@/interfaces/Forms'
import { useVModel } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import type { Category, CategoryBase } from '../interfaces/Category'
import { categoriesService } from '../services/CategoriesService'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
interface CategoryFormModalProps extends FormModalProps {
  tagsList: { id: string; label: string }[]
  isLoadingTags: boolean
}

const props = withDefaults(defineProps<CategoryFormModalProps>(), {
  showModal: false,
})

// #endregion

/***************************************
 **** Section Emits Declaration ********
 **************************************/
// #region Emits
const emit = defineEmits<{
  (e: 'update:showModal', value: boolean): void
  (e: 'createItem', value: Category): void
  (e: 'editItem', value: Category): void
}>()

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { t } = useI18n()
const toast = useToast()
const showModal = useVModel(props, 'showModal', emit)
const isLoading = ref<boolean>(false)
const formRef = ref<any>(null)

const formData = reactive<Category | CategoryBase>({
  name: {
    ar: '',
    en: '',
  },
  tags: [],
  is_active: true,
})

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const formTitle = computed(() => {
  return props.formAction === 'create'
    ? 'اضافة قسم'
    : props.formAction === 'edit'
      ? 'تعديل قسم'
      : 'عرض قسم'
})

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
if (props.activeItem) {
  Object.assign(formData, cloneItem(props.activeItem))
  formData.tags = props.activeItem.tags.map((tag: any) => tag.id)
}

// #endregion

/***************************************
 **** Section Functions  *********
 **************************************/
// #region Functions
function edit() {
  categoriesService
    .editItem(formData as Category)
    .then((res) => {
      toast.success(res.data.message)
      emit('editItem', res.data.data)
      showModal.value = false
    })
    .finally(() => {
      isLoading.value = false
    })
}

function create() {
  categoriesService
    .createItem(formData)
    .then((res) => {
      toast.success(res.data.message)
      emit('createItem', res.data)
      showModal.value = false
    })
    .finally(() => {
      isLoading.value = false
    })
}

const submit = () => {
  formRef.value.validate().then(({ valid }: any) => {
    if (!valid) return

    isLoading.value = true
    props.formAction === 'create' ? create() : edit()
  })
}
// #endregion
</script>

<template>
  <VDialog v-model="showModal" max-width="600" persistent scrollable class="form-modal">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="showModal = !showModal" />

    <!-- Dialog Content -->
    <VCard>
      <VeeForm ref="formRef" v-slot="{ meta }" @submit="submit">
        <VCard :title="formTitle">
          <VCardText>
            <VRow>
              <VCol cols="12" md="6">
                <AppTextField
                  v-model="formData.name.ar"
                  label="اسم القسم بالعربي"
                  name="name.ar"
                  rules="required|min:3|max:50"
                />
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField
                  v-model="formData.name.en"
                  label="اسم القسم بالانجليزي"
                  name="name.en"
                  rules="required|min:3|max:50"
                />
              </VCol>
              <VCol cols="12">
                <AppSelect
                  v-model="formData.tags"
                  :items="tagsList"
                  item-title="label"
                  item-value="id"
                  name="tags"
                  label="التصنيفات"
                  clearable
                  :disabled="isLoadingTags"
                  :loading="isLoadingTags"
                  multiple
                  rules="required"
                >
                  <template #selection="{ item, index }">
                    <VChip v-if="index < 1">
                      <span>{{ item.title }}</span>
                    </VChip>
                    <span v-if="index === 1" class="text-grey text-caption align-self-center">
                      (+{{ formData.tags.length - 1 }} اخري)
                    </span>
                  </template>
                </AppSelect>
              </VCol>
              <VCol cols="12">
                <AppSwitch v-model="formData.is_active" label="الحالة" name="is_active" />
              </VCol>
            </VRow>
          </VCardText>

          <VCardText v-if="formAction !== 'view'" class="d-flex justify-end flex-wrap gap-3">
            <VBtn variant="outlined" color="error" @click="showModal = false">
              {{ t('actions.cancel') }}
            </VBtn>
            <VBtn :loading="isLoading" :disabled="isLoading || !meta.valid" @click="submit">
              {{ formAction === 'edit' ? t('actions.save') : t('actions.create') }}
            </VBtn>
          </VCardText>
        </VCard>
      </VeeForm>
    </VCard>
  </VDialog>
</template>
