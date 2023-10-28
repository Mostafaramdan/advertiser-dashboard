<script setup lang="ts">
import { formatUrl } from '@/helpers/index'
import type { AccountSettingsData, AdvertiserBasicData } from '@/interfaces/Advertiser'
import { advertisersService } from '@/services/AdvertisersService'

/***************************************
 **** Section Props Declaration  ******
 **************************************/
// #region Props
interface DetailsTabProps {
  user: AdvertiserBasicData | null
}
withDefaults(defineProps<DetailsTabProps>(), {})

// #endregion

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const route = useRoute()
const advertiserId: number = +route.params.id
const data = ref<AccountSettingsData | any>({})
const isLoading = ref<boolean>(false)
// #endregion

/***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
// #region Lifecycle Hooks
getData()

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function getData() {
  isLoading.value = true
  advertisersService
    .getAccountSettingsData(advertiserId)
    .then((res: any) => {
      data.value = res.data.data
    })
    .finally(() => {
      isLoading.value = false
    })
}
// #endregion
</script>

<template>
  <div v-loading="isLoading" class="account-settings-tab">
    <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle> عرض القنوات والتأثير </VExpansionPanelTitle>
        <VExpansionPanelText>
          <VRow v-if="data.channels?.length">
            <VCol cols="12" md="6" v-for="channel in data.channels" :key="channel.id">
              <VCard class="channel-card pa-3 h-100" variant="outlined">
                <div class="d-flex flex-wrap flex-md-nowrap gap-3">
                  <VAvatar size="70" variant="outlined" rounded="0">
                    <VImg :src="channel.channel.image_path" />
                  </VAvatar>
                  <div class="channel-card__content">
                    <h2 class="text-h6">{{ channel.channel.name }}</h2>
                    <a :href="formatUrl(channel.link)" target="_blank" class="channel-card__link">{{
                      channel.link
                    }}</a>
                    <ToggleActivationSwitch
                      :id="channel.id"
                      v-model="channel.is_active"
                      model="user_channels"
                      class="me-auto ms-2"
                    />
                  </div>
                </div>
                <div class="d-flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  <span class="d-flex align-center flex-wrap"
                    ><strong class="me-3">اسم الحساب</strong>
                    {{ channel.name }}
                  </span>
                  <span class="d-flex align-center flex-wrap"
                    ><strong class="me-3">نوع القناة</strong>
                    {{ channel.type }}
                  </span>
                  <span class="d-flex align-center flex-wrap"
                    ><strong class="me-3">عدد المتابعين</strong>
                    {{ channel.followers_count }}
                  </span>
                </div>
              </VCard>
            </VCol>
          </VRow>
          <p v-else class="text-body-1 mb-0">لا يوجد بيانات</p>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
    <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle> عرض الاقسام </VExpansionPanelTitle>
        <VExpansionPanelText>
          <div class="d-flex flex-wrap gap-3" v-if="data.categories?.length">
            <VChip label color="primary" v-for="category in data.categories" :key="category.id">
              {{ category.name }}
            </VChip>
          </div>
          <p v-else class="text-body-1 mb-0">لا يوجد بيانات</p>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
    <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle> عرض نطاق التأثير الجغرافي </VExpansionPanelTitle>
        <VExpansionPanelText>
          <h4 class="mb-2">الدول</h4>
          <div class="d-flex flex-wrap gap-3" v-if="data.countries?.length">
            <VChip label color="primary" v-for="category in data.countries" :key="category.id">
              {{ category.name }}
            </VChip>
          </div>
          <p v-else class="text-body-1 mb-0">لا يوجد بيانات</p>
          <VDivider class="my-4" />
          <h4 class="mb-2">المناطق</h4>
          <div class="d-flex flex-wrap gap-3" v-if="data.areas?.length">
            <VChip label color="primary" v-for="area in data.areas" :key="area.id">
              {{ area.name }}
            </VChip>
          </div>
          <p v-else class="text-body-1 mb-0">لا يوجد بيانات</p>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
  </div>
</template>

<style lang="scss" scoped>
.account-settings-tab {
  :deep(.v-chip) {
    @include responsive-down('sm') {
      flex-grow: 1;
      justify-content: center;
    }
  }
}

.channel-card {
  word-break: break-word;

  &__link {
    @include max-lines(2);
  }

  .min-w-80 {
    min-inline-size: 90px;
    white-space: nowrap;
  }
}
</style>
