/* eslint-disable indent */
import { useRoute } from 'vue-router'
import BlankLayout from '@/layouts/BlankLayout.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import FormsLayout from '@/layouts/FormsLayout.vue'

export default function UseAppLayouts() {
  /***************************************
   **** Section Composables Declaration  ******
   **************************************/
  // #region Composables
  const route: any = useRoute()

  // #endregion

  /***************************************
   **** Section Computed Declaration ****
   **************************************/
  // #region Computed
  const layoutComponent = computed(() => {
    let layout
    switch (route.meta.layout) {
      case 'blank':
        layout = BlankLayout
        break
      case 'forms':
        layout = FormsLayout
        break
      case 'default':
        layout = DefaultLayout
        break
    }

    return layout
  })

  // #endregion

  /***************************************
   **** Section Lifecycle Hooks  *********
   **************************************/
  // #region Lifecycle Hooks

  // #endregion
  return {
    layoutComponent,
  }
}
