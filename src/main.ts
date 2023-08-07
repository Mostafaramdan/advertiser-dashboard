/* eslint-disable import/order */
import '@/@iconify/icons-bundle'
import App from '@/App.vue'
import loadingDirective from '@/directives/loading'
import axios from '@/plugins/axios'
import i18n from '@/plugins/i18n'
import layoutsPlugin from '@/plugins/layouts'
import VeeValidatePlugin from '@/plugins/veeValidatePlugin'
import VueToastification from '@/plugins/vue-toastification'
import vuetify from '@/plugins/vuetify'
import { loadFonts } from '@/plugins/webfontloader'
import router from '@/router'
import '@core/scss/template/index.scss'
import '@styles/styles.scss'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

loadFonts()

// Create vue app
const app = createApp(App)

// Use plugins
app.use(vuetify)
app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(axios)
app.use(VeeValidatePlugin)
app.use(VueToastification)
app.use(layoutsPlugin)
app.directive('loading', loadingDirective)

// Mount vue app
app.mount('#app')
