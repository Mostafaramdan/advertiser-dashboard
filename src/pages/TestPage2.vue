<script setup lang="ts">
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgVideo from 'lightgallery/plugins/video'
import Lightgallery from 'lightgallery/vue'

const plugins = [lgVideo, lgThumbnail]

function showAttachments() {
  const img: HTMLImageElement | null = document.querySelector('.attachment-img')
  img?.click()
}
</script>

<template>
  <VBtn @click="showAttachments">show</VBtn>
  <lightgallery :settings="{ speed: 500, plugins }">
    <!-- Image -->
    <a
      href="https://images.unsplash.com/photo-1696225339703-bf3eeaa7ddac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1778&q=80"
    >
      <img
        width="100"
        height="100"
        class="attachment-img d-none"
        src="https://images.unsplash.com/photo-1696225339703-bf3eeaa7ddac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1778&q=80"
      />
    </a>

    <!-- YouTube Video --->
    <a
      data-src="//www.youtube.com/watch?v=EIUJfXk3_3w"
      data-poster="https://img.youtube.com/vi/EIUJfXk3_3w/maxresdefault.jpg"
    >
      <img
        width="100"
        height="100"
        class="attachment-img d-none"
        src="https://img.youtube.com/vi/EIUJfXk3_3w/maxresdefault.jpg"
      />
    </a>

    <!-- VImeo Video --->
    <a
      data-src="https://player.vimeo.com/video/835912881"
      data-poster="https://images.unsplash.com/photo-1682695797873-aa4cb6edd613?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    >
      <img
        width="100"
        height="100"
        class="attachment-img d-none"
        src="https://images.unsplash.com/photo-1682695797873-aa4cb6edd613?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      />
    </a>

    <!-- HTML5 Video --->
    <a
      data-video='{"source": [{"src":"http://127.0.0.1:8000/video.mp4", "type":"video/mp4"}], "attributes": {"preload": false, "controls": true}}'
      data-poster="https://images.unsplash.com/photo-1683009427666-340595e57e43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    >
      <img
        width="100"
        height="100"
        class="attachment-img d-none"
        src="https://images.unsplash.com/photo-1683009427666-340595e57e43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      />
    </a>
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
