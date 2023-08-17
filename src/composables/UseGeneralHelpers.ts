export default function UseGeneralHelpers() {
  /***************************************
 **** Section Functions Declaration ****
 **************************************/
  // #region Functions
  function getImageUrl(path: string): any {
    return new URL(`../assets/images/${path}`, import.meta.url).href
  }

  // #endregion
  return {
    getImageUrl,
  }
}
