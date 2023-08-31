export default function UseGeneralHelpers() {
  /***************************************
   **** Section Variables Declaration ****
   **************************************/
  // #region Variables
  const { locale } = useI18n()

  // #endregion

  /***************************************
   **** Section Functions Declaration ****
   **************************************/
  // #region Functions
  function getImageUrl(path: string): any {
    return new URL(`../assets/images/${path}`, import.meta.url).href
  }

  /**
   * Format date time to be in the format of: dd/mm/yyyy hh:mm
   * @param {string}  date date to be formatted
   * @returns {string}  formatted date
   */
  function formatDateTime(date: string): string {
    const language = locale.value === 'ar' ? 'ar-EG' : 'en-US'

    return new Date(date).toLocaleDateString(language, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    })
  }

  function formatDate(date: string): string {
    const language = locale.value === 'ar' ? 'ar-EG' : 'en-US'

    return new Date(date).toLocaleDateString(language, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    })
  }

  // #endregion
  return {
    getImageUrl,
    formatDate,
    formatDateTime,
  }
}
