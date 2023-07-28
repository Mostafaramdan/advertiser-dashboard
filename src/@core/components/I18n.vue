<script setup lang="ts">
import { useThemeConfig } from '@core/composable/useThemeConfig'
import type { I18nLanguage } from '@layouts/types'

const props = withDefaults(defineProps<Props>(), {
  location: 'bottom end',
})

defineEmits<{
  (e: 'change', id: string): void
}>()

interface Props {
  languages: I18nLanguage[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  location?: any
}

const { locale } = useI18n({ useScope: 'global' })
const { isAppRtl } = useThemeConfig()
const lang = isAppRtl.value ? 'ar' : 'en'

locale.value = lang

watch(locale, val => {
  document.documentElement.setAttribute('lang', val as string)
})
</script>

<template>
  <IconBtn>
    <VIcon
      size="26"
      icon="tabler-language"
    />

    <!-- Menu -->
    <VMenu
      activator="parent"
      :location="props.location"
      offset="14px"
    >
      <!-- List -->
      <VList min-width="175px">
        <!-- List item -->
        <VListItem
          v-for="lang in props.languages"
          :key="lang.i18nLang"
          :value="lang.i18nLang"
          :active="locale === lang.i18nLang"
          @click="locale = lang.i18nLang; $emit('change', lang.i18nLang)"
        >
          <!-- Language label -->
          <VListItemTitle>{{ lang.label }}</VListItemTitle>
        </VListItem>
      </VList>
    </VMenu>
  </IconBtn>
</template>
