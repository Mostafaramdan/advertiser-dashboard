<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { USERS_ROLES } from '@/constants/index'
import type { LogRefundItem } from '../interfaces/Logs'
import LogsInfoList from './LogsInfoList.vue'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
const props = withDefaults(defineProps<{ data: LogRefundItem | null }>(), {})

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { getImageUrl } = UseGeneralHelpers()

// #endregion
</script>

<template>
  <VCard min-height="400">
    <VCardText v-if="data">
      <VList :lines="false" class="py-1">
        <VListItem title="المستخدم" class="px-2 py-2" border>
          <div class="d-flex align-start">
            <div class="d-flex flex-column align-center me-3 py-1">
              <VAvatar size="38" variant="tonal" cover>
                <VImg v-if="data.user.image_path" :src="data.user.image_path" cover />
                <span v-else>!</span>
              </VAvatar>
            </div>
            <div style="word-wrap: break-word">
              {{ data.user.username }}
              <span class="text-sm text-disabled d-block">{{ USERS_ROLES[data.user.role] }}</span>
            </div>
          </div>
        </VListItem>
        <VListItem
          title="نوع العملية"
          class="px-2 py-2"
          border
          :subtitle="data.operation_type"
        ></VListItem>
        <VListItem class="px-2 py-2" title="رقم الطلب" border>
          <router-link
            class="content-list__link"
            :to="{ name: 'ads-request-details-page', params: { id: data.request_id } }"
            ><u>{{ data.request_id }}</u></router-link
          >
        </VListItem>
        <VListItem title="مبلغ الارجاع" class="px-2 py-2" border :subtitle="data.total"></VListItem>
        <VListItem
          title="رقم طلب التنازع"
          class="px-2 py-2"
          border
          :subtitle="data.dispute_request_id"
        ></VListItem>
        <VListItem
          title="سبب الارجاع"
          class="px-2 py-2"
          border
          :subtitle="data.request_details || '-'"
        ></VListItem>
        <VListItem class="px-2 py-2" border>
          <LogsInfoList
            :data="[...Object.values(data.counters), ...Object.values(data.details.counters)]"
          />
        </VListItem>
      </VList>
      <h3 class="my-3 text-h6">قنوات الصرف</h3>
      <VListItem
        class="px-2 py-2"
        border
        v-for="account in data.details.bank_accounts"
        :key="account.id"
      >
        <div class="d-flex align-center gap-3">
          <VAvatar size="48" variant="outlined">
            <VImg :src="getImageUrl(`svg/payments-icons/bank.svg`)" />
          </VAvatar>
          <div>{{ account.info.name }} | {{ account.info.type }}</div>
        </div>
        <LogsInfoList
          :data="[
            { title: 'رقم الحساب', value: account.info.ipan },
            { title: 'اسم الحساب', value: account.info.account_name },
            { title: 'رقم المرجع', value: account.info.swift_code },
          ]"
        />
      </VListItem>
    </VCardText>
  </VCard>
</template>
