<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import type { FormModalProps } from '@/interfaces/Forms'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(defineProps<FormModalProps>(), {
  showModal: false,
})

// #endregion

/***************************************
 **** Section Emits Declaration ********
 **************************************/
// #region Emits
const emit = defineEmits<{
  (e: 'update:showModal', value: boolean): void
}>()

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { locale } = useI18n()
const showModal = useVModel(props, 'showModal', emit)

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed

// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks

// #endregion
</script>

<template>
  <VDialog v-model="showModal" max-width="600" scrollable class="details-modal">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="showModal = !showModal" />

    <!-- Dialog Content -->
    <VCard>
      <div>
        <VCard v-if="activeItem" title="عرض دولة">
          <VCardText>
            <VList :lines="false">
              <VListItem v-if="activeItem.image" class="px-2 py-2" title="صورة الدولة" border>
                <a
                  :href="activeItem.google_map"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="d-inline-block"
                >
                  <VImg :src="activeItem.image" width="100" class="my-2" />
                </a>
              </VListItem>
              <VListItem
                class="px-2 py-2"
                title="اسم الدولة بالعربي"
                :subtitle="activeItem.name.ar"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="اسم الدولة بالانجليزي"
                :subtitle="activeItem.name.en"
                border
              />

              <VListItem
                class="px-2 py-2"
                title="رمز الدولة"
                :subtitle="activeItem.iso_name"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="عدد المناطق"
                :subtitle="activeItem.areas_count"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="مفتاح الدولة"
                :subtitle="activeItem.phone_key"
                border
              />

              <VListItem class="px-2 py-2" title="تصنيف الدولة" border>
                <VChip
                  v-for="(item, index) in activeItem.country_categories"
                  :key="index"
                  class="text-center my-2 me-2"
                  color="primary"
                  variant="outlined"
                  label
                >
                  {{ item[locale] }}
                </VChip>
              </VListItem>
              <VListItem class="px-2 py-2" title="رابط النطاق الجغرافى" border>
                <a :href="activeItem.google_map" target="_blank" rel="noopener noreferrer">{{
                  activeItem.google_map
                }}</a>
              </VListItem>
            </VList>
            <AppSwitch :model-value="activeItem.is_active" label="الحالة" name="is_active" />
          </VCardText>
        </VCard>
      </div>
    </VCard>
  </VDialog>
</template>
