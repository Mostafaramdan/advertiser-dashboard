<script setup lang="ts">
import { AdsRequestAttachment } from '@/interfaces/AdsRequest'
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgVideo from 'lightgallery/plugins/video'
import Lightgallery from 'lightgallery/vue'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
withDefaults(defineProps<{ attachments: AdsRequestAttachment[] }>(), {})

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const plugins = [lgVideo, lgThumbnail]
// #endregion
</script>

<template>
  <lightgallery :settings="{ speed: 500, plugins }">
    <template v-for="attachment in attachments" :key="attachment.id">
      <a v-if="attachment.type === 'image'" :href="attachment.path">
        <img
          width="100"
          height="100"
          class="attachment-thumbnail d-none"
          :src="attachment.thumbnail"
        />
      </a>

      <template v-else-if="attachment.type === 'video'">
        <a v-if="attachment.is_vimeo" :data-src="attachment.path">
          <img
            width="100"
            height="100"
            class="attachment-thumbnail d-none"
            :src="attachment.thumbnail"
          />
        </a>

        <a
          v-else
          :data-video="
            JSON.stringify({
              source: [{ src: attachment.path }],
              attributes: { preload: false, controls: true },
            })
          "
        >
          <img
            width="100"
            height="100"
            class="attachment-thumbnail d-none"
            :src="attachment.thumbnail"
          />
        </a>
      </template>
    </template>
  </lightgallery>
</template>

<style lang="scss">
@import 'lightgallery/css/lg-zoom.css';
@import 'lightgallery/css/lg-video.css';
@import 'lightgallery/css/lg-thumbnail.css';
@import 'lightgallery/css/lightgallery.css';

.lg-container {
  direction: ltr;

  iframe {
    padding-block-end: 40px;
  }
}
</style>
