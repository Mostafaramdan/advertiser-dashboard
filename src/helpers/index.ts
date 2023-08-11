export function cloneItem(item: any): any {
  return JSON.parse(JSON.stringify(item))
}

export function getOptionsArrayFromObject(obj: any): any[] {
  return Object.entries(obj).map(([key, value]) => ({ value: key, label: value }))
}
