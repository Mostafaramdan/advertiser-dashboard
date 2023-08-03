import type { VerticalNavItems } from '@/@layouts/types'

export default [
  {
    title: 'الرئيسية',
    to: { name: 'home-page' },
    icon: { icon: 'tabler-smart-home' },
  },
  {
    title: 'الاعدادات',
    icon: { icon: 'tabler-settings' },

    children: [
      { title: 'الكيانات', to: { name: 'entities-settings' } },
    ],
  },

] as VerticalNavItems
