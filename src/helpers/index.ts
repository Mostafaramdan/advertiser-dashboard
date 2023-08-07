export function cloneItem(item: any): any {
  return JSON.parse(JSON.stringify(item))
}
