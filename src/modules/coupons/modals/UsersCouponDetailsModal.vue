<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
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
const { formatDate } = UseGeneralHelpers()
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
        <VCard v-if="activeItem" title="عرض كوبون">
          <VCardText>
            <VList :lines="false">
              <VListItem
                v-if="activeItem.store?.image"
                class="px-2 py-2"
                title="صورة الكوبون"
                border
              >
                <VImg :src="activeItem.store.image" max-width="100" class="my-2" />
              </VListItem>
              <VListItem
                :title="index === 0 ? 'المعلن' : 'التاجر'"
                class="px-2 py-2"
                border
                v-for="(user, index) in [activeItem.advertiser, activeItem.user]"
                :key="index"
              >
                <div class="d-flex align-start" v-if="user">
                  <div class="d-flex flex-column align-center me-3 py-1">
                    <VAvatar size="38" variant="tonal" cover>
                      <VImg v-if="user.image_path" :src="user.image_path" cover />
                      <span v-else>!</span>
                    </VAvatar>
                  </div>
                  <div style="word-wrap: break-word">
                    {{ user.account_name }}
                    <span class="text-sm text-disabled d-block">{{ user.email }}</span>
                  </div>
                </div>
                <span v-else> لا يوجد </span>
              </VListItem>
              <VListItem class="px-2 py-2" title="كود الكوبون" :subtitle="activeItem.code" border />
              <VListItem
                class="px-2 py-2"
                title="الخصم"
                :subtitle="`${activeItem.discount}%`"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="حالة الكوبون"
                :subtitle="activeItem.status_text"
                border
              />
              <VListItem class="px-2 py-2" title="الرابط" border>
                <a :href="activeItem.link" target="_blank" rel="noopener noreferrer">{{
                  activeItem.link
                }}</a>
              </VListItem>
              <VListItem
                class="px-2 py-2"
                title="تاريخ البداية"
                :subtitle="formatDate(activeItem.started_at)"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="تاريخ النهاية"
                :subtitle="formatDate(activeItem.ended_at)"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="المتجر"
                :subtitle="activeItem.store.name"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="القسم"
                :subtitle="activeItem.category.label"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="مرات الاستخدام"
                :subtitle="activeItem.uses || 0"
                border
              />
              <VListItem class="px-2 py-2" title="التقييم" border>
                <div class="d-flex flex-wrap gap-x-5">
                  <div class="text-center mt-2">
                    <VIcon icon="tabler-thumb-down" size="25" class="mx-auto" />
                    <span class="d-block">{{ activeItem.dislikes_count }}</span>
                  </div>
                  <div class="text-center mt-2">
                    <VIcon icon="tabler-thumb-up" size="25" class="mx-auto" />
                    <span class="d-block">{{ activeItem.likes_count }}</span>
                  </div>
                </div>
              </VListItem>
              <VListItem class="px-2 py-2" title="الشير و مرات الذهاب" border>
                <div class="d-flex flex-wrap gap-x-5">
                  <div class="text-center mt-2">
                    <VIcon icon="tabler-share" size="25" class="mx-auto" />
                    <span class="d-block">{{ activeItem.shares_count }}</span>
                  </div>
                  <div class="text-center mt-2">
                    <VIcon icon="tabler-eye" size="25" class="mx-auto" />
                    <span class="d-block">{{ activeItem.goes_count }}</span>
                  </div>
                </div>
              </VListItem>
              <VListItem
                class="px-2 py-2"
                title="الوصف"
                :subtitle="activeItem.description"
                border
              />
            </VList>
            <AppSwitch :model-value="activeItem.is_active" label="الحالة" name="is_active" />
          </VCardText>
        </VCard>
      </div>
    </VCard>
  </VDialog>
</template>
