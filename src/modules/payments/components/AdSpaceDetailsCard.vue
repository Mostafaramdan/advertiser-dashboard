<script setup lang="ts">
import type { LogAdSpaceItem } from '../interfaces/Logs'
import LogsInfoList from './LogsInfoList.vue'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(defineProps<{ data: LogAdSpaceItem | null }>(), {})

// #endregion
</script>

<template>
  <VCard min-height="400">
    <VCardText v-if="data">
      <VList :lines="false" class="py-1">
        <VListItem title="المستخدم" class="px-2 py-2" border>
          <div class="d-flex align-center">
            <div class="d-flex flex-column align-center me-3 py-1">
              <VAvatar size="38" variant="tonal" cover>
                <VImg v-if="data.user.image_path" :src="data.user.image_path" cover />
                <span v-else>!</span>
              </VAvatar>
            </div>
            <div style="word-wrap: break-word">
              {{ data.user.username }}
            </div>
          </div>
        </VListItem>
        <VListItem v-if="data.other_user" title="الطرف الاخر" class="px-2 py-2" border>
          <div class="d-flex align-center">
            <div class="d-flex flex-column align-center me-3 py-1">
              <VAvatar size="38" variant="tonal" cover>
                <VImg v-if="data.other_user.image_path" :src="data.other_user.image_path" cover />
                <span v-else>!</span>
              </VAvatar>
            </div>
            <div style="word-wrap: break-word">
              {{ data.other_user.username }}
            </div>
          </div>
        </VListItem>
        <VListItem
          title="نوع العملية"
          class="px-2 py-2"
          border
          :subtitle="data.operation_type"
        ></VListItem>
        <VListItem class="px-2 py-2" border>
          <LogsInfoList :data="Object.values(data.counters)" />
        </VListItem>
      </VList>
    </VCardText>
  </VCard>
</template>
