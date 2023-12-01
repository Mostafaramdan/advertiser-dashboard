<script setup lang="ts">
import UseGeneralHelpers from '@/composables/UseGeneralHelpers'
import { USERS_ROLES } from '@/constants/index'
import { OFFER_STATUSES, OFFER_TYPES, PRODUCT_STATUSES, STORES_TYPES } from '@/constants/offers'
import { formatUrl } from '@/helpers/index'
import type { User } from '@/interfaces/Offer'
import { useOffersStore } from '@/stores/OffersStore'

/***************************************
 **** Section Variables Declaration ****
 **************************************/
// #region Variables
const { formatDate } = UseGeneralHelpers()
const offersStore = useOffersStore()
const defaultFileImage = new URL('../../assets/images/svg/file-icons/other.svg', import.meta.url)
// #endregion

/***************************************
 **** Section Computed Variables  ******
 **************************************/
// #region Computed
const data = computed(() => offersStore.offerDetails)

const offerInfo = computed(() => {
  if (!data.value) return []
  const {
    offer_type,
    from_date,
    to_date,
    user,
    category,
    product_condition,
    status,
    expire_date,
    hide_contact_data,
    store,
    location,
    main_unit,
    sub_unit,
    sub_unit_value,
    main_price,
    discount_price,
    offer_quantity,
    show_offer_quantity,
    available_quantity,
    show_available_quantity,
  } = data.value
  return [
    {
      label: 'النوع',
      value: OFFER_TYPES.get(offer_type)?.label,
    },
    {
      label: 'تاريخ البداية',
      value: from_date,
    },
    {
      label: 'تاريخ النهاية',
      value: to_date,
    },
    {
      label: 'المستخدم',
      value: user,
      key: 'user',
    },
    {
      label: 'نوع المستخدم',
      value: USERS_ROLES[user.role],
    },
    {
      label: 'القسم',
      value: category.label,
    },
    {
      label: 'حالة العرض',
      value: OFFER_STATUSES.get(status)?.label,
    },
    {
      label: 'حالة المنتج',
      value: PRODUCT_STATUSES.get(product_condition)?.label,
    },
    {
      label: 'تاريخ الانتهاء',
      value: formatDate(expire_date),
    },
    {
      label: 'الوحدة الرئيسية',
      value: main_unit.label,
    },
    {
      label: 'الوحدة الفرعية',
      value: sub_unit.label,
    },
    {
      label: 'قيمة الوحدة الفرعية',
      value: sub_unit_value,
    },
    {
      label: 'السعر قبل الخصم',
      value: main_price,
    },
    {
      label: 'السعر بعد الخصم',
      value: discount_price,
    },
    {
      label: 'كمية العرض',
      value: offer_quantity,
    },
    {
      label: 'ظهور كمية العرض',
      value: show_offer_quantity ? 'نشط' : 'غير نشط',
    },
    {
      label: 'الكمية المتاحة',
      value: available_quantity,
    },
    {
      label: 'ظهور الكمية المتاحة',
      value: show_available_quantity,
    },
    {
      label: 'اخفاء بيانات التواصل',
      value: hide_contact_data ? 'نشط' : 'غير نشط',
    },
    {
      label: 'اسم المتجر',
      value: store.name,
    },
    {
      label: 'نوع المتجر',
      value: STORES_TYPES.get(store.type)?.label,
    },
    {
      label: 'رابط المتجر',
      value: store.url,
      key: 'store_url',
    },
    {
      label: 'مكان الشراء والتسليم',
      value: location,
      key: 'location',
    },
  ]
})

const availableQtyInfo = computed(() => {
  if (!data.value) return []
  const { minimum_quantity, maximum_quantity } = data.value
  return [
    {
      label: 'اقل كمية',
      value: minimum_quantity,
    },
    {
      label: 'أعلي كمية',
      value: maximum_quantity,
    },
  ]
})

const responsibleInfo = computed(() => {
  if (!data.value) return []
  const { name, email, phone } = data.value.responsible
  return [
    {
      label: 'الاسم',
      value: name,
    },
    {
      label: 'البريد الالكتروني',
      value: email,
    },
    {
      label: 'الهاتف',
      value: phone,
    },
  ]
})

// #endregion

/***************************************
 **** Section Functions Declaration ****
 **************************************/
// #region Functions
function getProfileUrl(user: User) {
  return {
    name: user.role === 'advertiser' ? 'advertisers-profile-page' : 'user-profile-page',
    params: { id: user.id },
    query: { tab: 'details' },
  }
}
// #endregion
</script>

<template>
  <section class="details-tab" v-loading="!data" style="min-block-size: 300px">
    <template v-if="data">
      <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
        <VExpansionPanel elevation="0">
          <VExpansionPanelTitle>بيانات التذكرة</VExpansionPanelTitle>
          <VExpansionPanelText>
            <div class="information-list">
              <VRow>
                <VCol
                  v-for="(item, index) in offerInfo"
                  :key="index"
                  class="py-2 information-list__item"
                  cols="12"
                  sm="6"
                  lg="4"
                >
                  <h5 class="text-primary text-subtitle-2">
                    {{ item.label }}
                  </h5>

                  <router-link v-if="item.key === 'user'" :to="getProfileUrl(item.value)">
                    {{ item.value.username }}
                  </router-link>
                  <a
                    :href="formatUrl(item.value)"
                    target="_blank"
                    v-else-if="item.key === 'store_url'"
                    >{{ item.value }}</a
                  >
                  <div v-else-if="item.key === 'location'">
                    <a
                      class="content-list__link"
                      v-if="item.value"
                      :href="`https://www.google.com/maps/search/?api=1&query=${item.value.lat},${item.value.lng}`"
                      target="_blank"
                      ><u>{{ item.value.address }}</u></a
                    >
                    <span v-else> لا يوجد </span>
                  </div>
                  <p v-else class="text-body-2 mb-0">
                    {{ item.value ?? '-' }}
                  </p>
                </VCol>
              </VRow>
            </div>
          </VExpansionPanelText>
        </VExpansionPanel>
      </VExpansionPanels>

      <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
        <VExpansionPanel elevation="0">
          <VExpansionPanelTitle>وصف العرض</VExpansionPanelTitle>
          <VExpansionPanelText>
            {{ data.description }}
          </VExpansionPanelText>
        </VExpansionPanel>
      </VExpansionPanels>

      <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
        <VExpansionPanel elevation="0">
          <VExpansionPanelTitle> عرض الدول المدن </VExpansionPanelTitle>
          <VExpansionPanelText>
            <h4 class="mb-2">الدول</h4>
            <div class="d-flex flex-wrap gap-3" v-if="data.countries.length">
              <VChip label color="primary" v-for="country in data.countries" :key="country.id">
                {{ country.label }}
              </VChip>
            </div>
            <p v-else class="text-body-1 mb-0">لا يوجد بيانات</p>
            <VDivider class="my-4" />
            <h4 class="mb-2">المدن</h4>
            <div class="d-flex flex-wrap gap-3" v-if="data.areas.length">
              <VChip label color="primary" v-for="area in data.areas" :key="area.id">
                {{ area.label }}
              </VChip>
            </div>
            <p v-else class="text-body-1 mb-0">لا يوجد بيانات</p>
          </VExpansionPanelText>
        </VExpansionPanel>
      </VExpansionPanels>

      <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
        <VExpansionPanel elevation="0">
          <VExpansionPanelTitle>كمية البيع المسموحة للعميل الواحد</VExpansionPanelTitle>
          <VExpansionPanelText>
            <div class="information-list">
              <VRow>
                <VCol
                  v-for="(item, index) in availableQtyInfo"
                  :key="index"
                  class="py-2 information-list__item"
                  cols="12"
                  sm="6"
                  lg="4"
                >
                  <h5 class="text-primary text-subtitle-2">
                    {{ item.label }}
                  </h5>
                  <p class="text-body-2 mb-0">
                    {{ item.value ?? '-' }}
                  </p>
                </VCol>
              </VRow>
            </div>
          </VExpansionPanelText>
        </VExpansionPanel>
      </VExpansionPanels>

      <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
        <VExpansionPanel elevation="0">
          <VExpansionPanelTitle>تسعير شرائح البيع</VExpansionPanelTitle>
          <VExpansionPanelText>
            <VTable density="compact" v-if="data.prices.length">
              <thead>
                <tr class="bg-background">
                  <th class="text-uppercase">من</th>
                  <th class="text-uppercase">الي</th>
                  <th class="text-uppercase">السعر</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(price, index) in data.prices" :key="index">
                  <td>
                    {{ price.minimum_quantity }}
                  </td>
                  <td>
                    {{ price.maximum_quantity }}
                  </td>
                  <td>
                    {{ price.price }}
                  </td>
                </tr>
              </tbody>
            </VTable>
            <p v-else class="text-body-1 mb-0">لا يوجد بيانات</p>
          </VExpansionPanelText>
        </VExpansionPanel>
      </VExpansionPanels>

      <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
        <VExpansionPanel elevation="0">
          <VExpansionPanelTitle>بيانات المسؤول</VExpansionPanelTitle>
          <VExpansionPanelText>
            <div class="information-list">
              <VRow>
                <VCol
                  v-for="(item, index) in responsibleInfo"
                  :key="index"
                  class="py-2 information-list__item"
                  cols="12"
                  sm="6"
                  lg="4"
                >
                  <h5 class="text-primary text-subtitle-2">
                    {{ item.label }}
                  </h5>
                  <p class="text-body-2 mb-0">
                    {{ item.value ?? '-' }}
                  </p>
                </VCol>
              </VRow>
            </div>
          </VExpansionPanelText>
        </VExpansionPanel>
      </VExpansionPanels>

      <VExpansionPanels class="expansion-panels-width-border mb-6" :model-value="0">
        <VExpansionPanel elevation="0">
          <VExpansionPanelTitle>المرفقات</VExpansionPanelTitle>
          <VExpansionPanelText>
            <VRow v-if="data.attachments.length">
              <VCol
                col="12"
                md="6"
                v-for="(attachment, index) of data.attachments"
                :key="attachment.id"
              >
                <a
                  :href="attachment.path"
                  download
                  target="_blank"
                  class="attachment d-flex gap-3 border pa-2"
                >
                  <div class="attachment__img">
                    <img
                      :src="attachment?.thumbnail || attachment?.path"
                      @error="(e: any) => (e.target.src = defaultFileImage)"
                    />
                  </div>
                  <span class="attachment__name">{{ attachment.name }}</span>
                </a>
                <VDivider v-if="index !== data.attachments.length - 1" />
              </VCol>
            </VRow>
            <p v-else class="text-body-1 mb-0">لا يوجد بيانات</p>
          </VExpansionPanelText>
        </VExpansionPanel>
      </VExpansionPanels>
    </template>
  </section>
</template>

<style lang="scss" scoped>
:deep(.v-list-item-title) {
  white-space: wrap;
}

.attachment {
  &__img {
    block-size: 40px;
    inline-size: 40px;
    min-inline-size: 40px;

    img {
      block-size: 100%;
      inline-size: 100%;
      object-fit: contain;
    }
  }

  &__name {
    @include max-lines(2);
  }

  &:hover &__name {
    opacity: 0.8;
  }
}
</style>
