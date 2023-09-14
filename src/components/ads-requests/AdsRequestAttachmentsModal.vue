<script setup lang="ts">
import { AdsRequestAttachment } from '@/interfaces/AdsRequest'
import { useVModel } from '@vueuse/core'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(
  defineProps<{ showModal: boolean; attachments: AdsRequestAttachment[] }>(),
  {
    showModal: false,
  },
)

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
const carousel = ref(0)
// #endregion
</script>

<template>
  <VDialog v-model="showModal" fullscreen transition="dialog-bottom-transition">
    <div class="attachments-modal">
      <!-- Dialog close btn -->
      <VBtn size="38" class="close-btn" @click="showModal = !showModal">
        <VIcon icon="tabler-x" size="22" />
      </VBtn>
      <!-- Dialog Content -->
      <VCarousel height="100%" width="100%" hide-delimiters v-model="carousel" :touch="true">
        <VCarouselItem v-for="(item, index) in attachments" :key="index">
          <VSheet height="100%">
            <div
              class="d-flex fill-height justify-center align-center pa-4"
              v-if="carousel === index"
            >
              <VImg :src="item.path" v-if="item.type === 'image'" alt="attachment image" />
              <video
                controls
                v-else-if="item.type === 'video'"
                style="width: 600px; max-width: 100%; max-height: 100%"
              >
                <source :src="item.path" />
              </video>
            </div>
          </VSheet>
        </VCarouselItem>
      </VCarousel>
    </div>
  </VDialog>
</template>

<style lang="scss" scoped>
.attachments-modal {
  position: relative;
  block-size: 100vh;

  :deep(.close-btn) {
    position: absolute;
    z-index: 1;
    inset-block-start: 10px;
    inset-inline-end: 10px;
  }

  :deep(.v-sheet) {
    background: transparent;
  }

  :deep(.v-btn--icon) {
    block-size: 45px;
    inline-size: 45px;
  }
}
</style>
