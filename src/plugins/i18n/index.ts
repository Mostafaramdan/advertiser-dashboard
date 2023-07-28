import { createI18n } from 'vue-i18n'
import { useThemeConfig } from '@core/composable/useThemeConfig'

const messages = Object.fromEntries(
  Object.entries(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    import.meta.glob<{ default: any }>('./locales/*.json', { eager: true }))
    .map(([key, value]) => [key.slice(10, -5), value.default]),
)

const { isAppRtl } = useThemeConfig()
const lang = isAppRtl.value ? 'ar' : 'en'

export default createI18n({
  legacy: false,
  locale: lang,
  fallbackLocale: lang,
  messages,
})
