<script setup lang="ts">
import { LINK_TYPES } from '@/constants/banners'
import { FILES_TYPES } from '@/constants/index'
import { getFileType } from '@/helpers/file'
import { formatUrl } from '@/helpers/index'
import type { FormModalProps } from '@/interfaces/Forms'
import { useVModel } from '@vueuse/core'

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
const showModal = useVModel(props, 'showModal', emit)

// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const isVideo = computed(() => props.activeItem?.type === 'video')
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
        <VCard v-if="activeItem" title="عرض بنر">
          <VCardText>
            <VList :lines="false">
              <VListItem
                class="px-2 py-2"
                title="اسم البنر بالعربي"
                :subtitle="activeItem.name.ar"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="اسم البنر بالانجليزي"
                :subtitle="activeItem.name.en"
                border
              />
              <VListItem class="px-2 py-2" title="نوع الملف" border>
                <div class="my-2">
                  <VChip variant="outlined" color="primary" label v-if="activeItem.file">
                    {{
                      getFileType(activeItem.file.mimetype) === FILES_TYPES.image ? 'صورة' : 'فيديو'
                    }}
                  </VChip>
                </div>
                <video v-if="isVideo" controls :src="activeItem.file.path" class="w-100 my-2" />
                <VImg v-else :src="activeItem.file.path" max-width="100" class="my-2" />
              </VListItem>
              <VListItem
                class="px-2 py-2"
                title="نوع الرابط"
                :subtitle="LINK_TYPES[activeItem.link_type as keyof typeof LINK_TYPES]"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="الرابط"
                border
                v-if="activeItem.link_type === 'external'"
              >
                <a
                  :href="formatUrl(activeItem.external_link)"
                  target="_blank"
                  rel="noopener noreferrer"
                  >{{ activeItem.external_link }}</a
                >
              </VListItem>
            </VList>
            <AppSwitch :model-value="activeItem.is_active" label="الحالة" name="is_active" />
          </VCardText>
        </VCard>
      </div>
    </VCard>
  </VDialog>
</template>
