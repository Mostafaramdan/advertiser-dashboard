<script setup lang="ts">
import { File } from '@/interfaces/Shared'
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgVideo from 'lightgallery/plugins/video'
import Lightgallery from 'lightgallery/vue'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(defineProps<{ attachments: File[] }>(), {})

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const plugins = [lgVideo, lgThumbnail]

const attachmentsFiles = computed<any>(() => [...props.attachments, null].filter(Boolean))
// #endregion
</script>

<template>
  <lightgallery :settings="{ speed: 500, plugins }" :key="attachmentsFiles.length">
    <template v-for="attachment in attachmentsFiles" :key="attachment.id">
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
              source: [{ src: attachment.path, type: attachment.mimetype }],
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
