import { localize, setLocale } from '@vee-validate/i18n'
import {
  confirmed,
  email,
  max_value,
  min,
  min_value,
  numeric,
  required,
  url,
} from '@vee-validate/rules'
import {
  Field, Form,
  configure,
  defineRule,
} from 'vee-validate'
import i18n from './i18n/index'

function getMessages(messages: any) {
  return Object.fromEntries(Object.entries(messages).map(([key, value]) => {
    return [key, (value as any).source]
  }))
}

export default (app: any) => {
  defineRule('required', required)
  defineRule('email', email)
  defineRule('min', min)
  defineRule('url', url)
  defineRule('confirmed', confirmed)
  defineRule('min_value', min_value)
  defineRule('max_value', max_value)
  defineRule('numeric', numeric)

  configure({
    generateMessage: localize({
      en: {
        messages: getMessages(i18n.global.messages.value.en.validations),
      },
      ar: {
        messages: getMessages(i18n.global.messages.value.ar.validations),
      },
    }),
  })
  setLocale('ar')

  app.component('VeeForm', Form)
  app.component('VeeField', Field)
}
