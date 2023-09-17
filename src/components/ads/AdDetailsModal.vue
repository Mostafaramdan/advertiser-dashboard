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
const showModal = useVModel(props, 'showModal', emit)
const { formatDateTime } = UseGeneralHelpers()
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
        <VCard v-if="activeItem" title="عرض الاعلان">
          <VCardText>
            <VList :lines="false">
              <VListItem class="px-2 py-2" title="صورة الاعلان" border>
                <VAvatar variant="outlined" size="100" rounded="0" class="mt-1">
                  <VImg v-if="activeItem.image_path" :src="activeItem.image_path" />
                  <span v-else>!</span>
                </VAvatar>
              </VListItem>
              <VListItem
                :title="index === 0 ? 'المعلن' : 'العميل'"
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
                    <span class="d-flex align-center text-sm">
                      <VIcon icon="tabler-star-filled" color="#ffcc00" size="18" start />
                      {{ user.rate }}
                    </span>
                  </div>
                  <div style="word-wrap: break-word">
                    {{ user.account_name }}
                    <span class="text-sm text-disabled d-block">{{ user.email }}</span>
                    <span class="text-sm text-disabled d-block">{{ user.phone }}</span>
                  </div>
                </div>
                <span v-else> لا يوجد </span>
              </VListItem>

              <VListItem class="px-2 py-2" title="تقييم الاعلان" border>
                <span class="d-flex align-center text-sm">
                  <VIcon icon="tabler-star-filled" color="#ffcc00" size="18" start />
                  {{ activeItem.rate }}
                </span>
              </VListItem>
              <VListItem
                class="px-2 py-2"
                title="طريقة الاعلان"
                :subtitle="activeItem.ads_type"
                border
              />

              <VListItem
                class="px-2 py-2"
                title="تاريخ البداية"
                :subtitle="formatDateTime(activeItem.started_at)"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="تاريخ النهاية"
                :subtitle="activeItem.ended_at ? formatDateTime(activeItem.ended_at) : 'لا يوجد'"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="القسم"
                :subtitle="activeItem.category_name || 'لا يوجد'"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="حالة الاعلان"
                :subtitle="activeItem.status_txt"
                border
              />
              <VListItem
                class="px-2 py-2"
                title="المشاهدات"
                :subtitle="activeItem.seen_count"
                border
              />
              <VListItem class="px-2 py-2" title="اماكن العرض" border>
                <div class="d-flex gap-2 mt-2" v-if="activeItem.ads_locations">
                  <VChip
                    variant="outlined"
                    color="primary"
                    label
                    v-if="activeItem.ads_locations.show_app"
                  >
                    المنصة
                  </VChip>
                  <VChip
                    variant="outlined"
                    color="primary"
                    label
                    v-if="activeItem.ads_locations.show_profile"
                  >
                    البروفايل
                  </VChip>
                </div>
                <span v-else> لا يوجد </span>
              </VListItem>
            </VList>
            <AppSwitch :model-value="activeItem.is_active" label="الحالة" name="is_active" />
          </VCardText>
        </VCard>
      </div>
    </VCard>
  </VDialog>
</template>
