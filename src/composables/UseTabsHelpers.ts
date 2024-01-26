export default function UseTabsHelpers(defaultActiveTab: string) {
  /***************************************
   **** Section Variables Declaration ****
   **************************************/
  //#region Variables
  const router = useRouter()
  const route = useRoute()
  const currentTab = ref<any>(defaultActiveTab)
  //#endregion

  /***************************************
   **** Section Watchers *****************
   **************************************/
  //#region Watchers
  watch(route, () => {
    currentTab.value = route.query?.tab
  })
  //#endregion

  /***************************************
   **** Section Lifecycle Hooks  *********
   **************************************/
  //#region Lifecycle Hooks
  checkRouteQuery()
  //#endregion

  /***************************************
   **** Section Functions Declaration ****
   **************************************/
  //#region Functions
  /**
   * @description This function is used to check the route query and update the current tab value
   * @returns void
   */
  function checkRouteQuery(): void {
    const tab = route.query?.tab
    currentTab.value = tab || defaultActiveTab
  }

  /**
   * @description This function is used to update the current tab value and update the route query
   * @returns void
   */
  function updateRouteQuery(): void {
    router.push({ path: route.fullPath, query: { tab: currentTab.value } })
  }
  //#endregion
  return {
    currentTab,
    updateRouteQuery,
  }
}
