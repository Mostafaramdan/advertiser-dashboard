<script setup lang="ts">
import { FILES_TYPES } from '@/constants/index'
import { BANNER_LINK_TYPES, BANNER_LINKABLE_TYPES } from '@/constants/offers'
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
const isImage = computed(() => getFileType(props.activeItem.file.mimetype) === FILES_TYPES.image)
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
                    {{ isImage ? 'صورة' : 'فيديو' }}
                  </VChip>
                </div>
                <VImg v-if="isImage" :src="activeItem.file.path" max-width="100" class="my-2" />
                <video v-else controls :src="activeItem.file.path" class="w-100 my-2" />
              </VListItem>
              <VListItem
                class="px-2 py-2"
                title="نوع الرابط"
                :subtitle="
                  BANNER_LINK_TYPES[activeItem.link_type as keyof typeof BANNER_LINK_TYPES]
                "
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

              <template v-else-if="activeItem.link_type === 'internal'">
                <VListItem
                  class="px-2 py-2"
                  title="نوع الربط"
                  :subtitle="
                    BANNER_LINKABLE_TYPES[
                      activeItem.linkable_type as keyof typeof BANNER_LINKABLE_TYPES
                    ]
                  "
                  border
                />

                <VListItem
                  class="px-2 py-2"
                  title="المعلن"
                  border
                  v-if="activeItem.linkable_type === 'users'"
                >
                  <router-link
                    :to="{
                      name: 'advertisers-profile-page',
                      params: { id: activeItem.model.id },
                      query: { tab: 'details' },
                    }"
                    class="d-inline-flex"
                  >
                    {{ activeItem.model.username }}
                  </router-link></VListItem
                >
                <!-- TODO: add offer link after creating offers page -->
                <VListItem
                  v-else-if="activeItem.linkable_type === 'offers'"
                  class="px-2 py-2"
                  title="العرض"
                  :subtitle="activeItem.model.name"
                  border
                />
              </template>
            </VList>
            <AppSwitch :model-value="activeItem.is_active" label="الحالة" name="is_active" />
          </VCardText>
        </VCard>
      </div>
    </VCard>
  </VDialog>
</template>
