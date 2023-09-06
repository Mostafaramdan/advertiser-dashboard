/* @ts-expect-error for lodash */
import { differenceBy, find, isEqual } from 'lodash'

export function cloneItem(item: any): any {
  return JSON.parse(JSON.stringify(item))
}

export function getOptionsArrayFromObject(obj: any): any[] {
  return Object.entries(obj).map(([key, value]) => ({
    value: isNaN(+key) ? key : +key,
    label: value,
  }))
}

/**
 * @description Get changes of array
 * @param data - data
 * @param oldData - old data
 * @returns {added: [], deleted: [], modified: []}
 */
export function getChangesOfArray(
  data: any,
  oldData: any,
): { added: []; deleted: []; modified: [] } {
  if (!Array.isArray(data) || !Array.isArray(oldData))
    throw new Error('Both parameters must be arrays.')

  // eslint-disable-next-line no-prototype-builtins
  const hasIdProperty = data[0] && typeof data[0] === 'object' && data[0].hasOwnProperty('id')

  let addedItems, deletedItems, modifiedItems

  if (hasIdProperty) {
    addedItems = differenceBy(data, oldData, 'id')
    deletedItems = differenceBy(oldData, data, 'id')

    modifiedItems = data.reduce((result, newItem) => {
      const oldItem = find(oldData, { id: newItem.id })
      if (oldItem && !isEqual(newItem, oldItem)) result.push(newItem)

      return result
    }, [])
  } else {
    addedItems = differenceBy(data, oldData)
    deletedItems = differenceBy(oldData, data)
    modifiedItems = data.filter((item) => oldData.includes(item) && !isEqual(item, oldData))
  }

  return {
    added: addedItems,
    deleted: deletedItems,
    modified: modifiedItems,
  }
}
