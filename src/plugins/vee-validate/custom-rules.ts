export function greaterThanTime(value: string, [min]: any) {
  if (!value || !value.length) return true
  else if (new Date(`2000-01-01 ${value}`) <= new Date(`2000-01-01 ${min}`)) return false

  return true
}

export function lessThanTime(value: string, [max]: any) {
  if (!value || !value.length) return true
  else if (new Date(`2000-01-01 ${value}`) >= new Date(`2000-01-01 ${max}`)) return false

  return true
}

export function minWords(value: string, [min]: any) {
  if (!value || !value.length) return true
  else if (value.trim().split(' ').length < min) return false

  return true
}

export function validIcloud(value: string) {
  if (!value || !value.length) return true
  else if (!/^[a-zA-Z0-9._%+-]+@icloud\.com$/i.test(value)) return false

  return true
}

export function minDate(value: string, [min]: any) {
  if (!value || !value.length) return true
  else if (new Date(min) > new Date(value)) return false
  return true
}

export function lessThanValue(value: string, [max]: any) {
  if (!value || !value.length || !max) return true
  else if (Number(value) >= Number(max)) return false
  return true
}
