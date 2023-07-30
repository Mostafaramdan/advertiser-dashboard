import { setLocale } from '@vee-validate/i18n'

import { useThemeConfig } from '@core/composable/useThemeConfig'

export default function UseLocaleHelpers() {
  /***************************************
   **** Section Variables Declaration ****
   **************************************/
  // #region Variables
  const { locale } = useI18n()

  const { isAppRtl } = useThemeConfig()

  // #endregion

  /***************************************
 **** Section Watchers *****************
 **************************************/
  // #region Watchers

  // #endregion

  /***************************************
 **** Section Lifecycle Hooks  *********
 **************************************/
  // #region Lifecycle Hooks

  // #endregion

  /***************************************
 **** Section Functions Declaration ****
 **************************************/
  // #region Functions
  function changeAppLocale(lang: string) {
    document.documentElement.setAttribute('lang', lang as string)
    locale.value = lang
    setLocale(lang)
  }

  function initAppLanguage() {
    changeAppLocale(isAppRtl.value ? 'ar' : 'en')
    watch(locale, val => {
      changeAppLocale(val)
    })
  }

  // #endregion

  return {
    initAppLanguage,
  }
}
