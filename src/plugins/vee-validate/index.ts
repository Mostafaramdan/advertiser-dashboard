import { localize, setLocale } from '@vee-validate/i18n'
import { confirmed, email, max, max_value, min, min_value, required } from '@vee-validate/rules'
import { Field, Form, configure, defineRule } from 'vee-validate'
import {
  greaterThanTime,
  isNumber,
  lessThanTime,
  lessThanValue,
  greaterThanValue,
  minDate,
  minWords,
  validIcloud,
  validUrl,
} from './custom-rules'
import arMessages from './messages/ar'
import enMessages from './messages/en'

export default (app: any) => {
  defineRule('required', required)
  defineRule('email', email)
  defineRule('min', min)
  defineRule('max', max)
  defineRule('validUrl', validUrl)
  defineRule('confirmed', confirmed)
  defineRule('min_value', min_value)
  defineRule('max_value', max_value)
  defineRule('numeric', isNumber)
  defineRule('greaterThanTime', greaterThanTime)
  defineRule('lessThanTime', lessThanTime)
  defineRule('minWords', minWords)
  defineRule('validIcloud', validIcloud)
  defineRule('minDate', minDate)
  defineRule('lessThanValue', lessThanValue)
  defineRule('greaterThanValue', greaterThanValue)

  configure({
    generateMessage: localize({
      en: {
        messages: enMessages,
      },
      ar: {
        messages: arMessages,
      },
    }),
  })
  setLocale('ar')

  app.component('VeeForm', Form)
  app.component('VeeField', Field)
}
