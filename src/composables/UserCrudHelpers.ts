import { useToast } from 'vue-toastification'
import type { FormActionType } from '@/interfaces/Forms'
import type { MetaData } from '@/interfaces/Shared'
import { sharedService } from '@/services/SharedService'

export function UseCrudHelpers<ItemType>(
  ItemService: any,
  params: any,
  modelName: string,
) {
  /***************************************
   **** Section Variables Declaration ****
   **************************************/
  // #region Variables
  const toast = useToast()
  const selectedItems = ref<number[]>([])
  const tableData = ref<ItemType[]>([])
  const metaData = ref<MetaData | null>(null)
  const showFormModal = ref<boolean>(false)
  const showDetailsModal = ref<boolean>(false)
  const FormAction = ref<FormActionType>('create')
  const activeItem: Ref<ItemType | null> = ref(null)
  const confirmModal = ref<any>()
  const IsLoadingData = ref<boolean>(false)

  // #endregion

  /***************************************
   **** Section Functions Declaration ****
   **************************************/
  // #region Functions

  /**
   * @description show create modal
   * @return  {void}
   */
  function showCrateModal(): void {
    activeItem.value = null
    FormAction.value = 'create'
    showFormModal.value = true
  }

  /**
   * @description show edit modal
   * @param  {ItemType} item
   * @return  {void}
   */
  function showEditModal(item: ItemType): void {
    activeItem.value = item
    FormAction.value = 'edit'
    showFormModal.value = true
  }

  /**
   * @description show view modal
   * @param  {ItemType} item
   * @return  {void}
   */
  function showViewModal(item: ItemType): void {
    activeItem.value = item
    showDetailsModal.value = true
  }

  /**
   * @description close form modal
   * @return  {void}
   */
  function getPageData(): void {
    IsLoadingData.value = true
    ItemService.getItem(params)
      .then((res: any) => {
        const { data, meta } = res.data

        tableData.value = data
        metaData.value = meta
      })
      .finally(() => {
        IsLoadingData.value = false
      })
  }

  /**
    * @description reload page data
    * @return  {void}
   */
  function reloadPageData(): void {
    params.page = 1
    getPageData()
  }

  /**
   * @description reload page data and reset selected items
  */
  function onReloadData(): void {
    reloadPageData()
    selectedItems.value = []
  }

  /**
   * @description update items per page and reload page data
   * @param  {number} value
   * @return  {void}
  */
  function onChangeItemsPerPage(value: number): void {
    params.itemPerPage = value
    reloadPageData()
  }

  /**
   * @description update search keyword and reload page data
   * @param  {string} value
   * @return  {void}
   */
  function onChangeSearch(value: string): void {
    params.keyword = value
    getPageData()
  }

  /**
   * @description reload data on create item
   * @param  {ItemType} item
   * @return  {void}
   */
  function onCreateItem(item: ItemType): void {
    console.log('created', item)

    reloadPageData()
  }

  /**
   * @description update item in data table after edit
   * @param  {any} item
   * @return  {void}
   */
  function onEditItem(item: any): void {
    console.log('edited', item)

    const targetIndex = tableData.value.findIndex((i: any) => i.id === item.id)

    if (targetIndex === -1) return
    tableData.value.splice(targetIndex, 1, item)
  }

  /**
   * @description show confirm modal before delete item
   * @param  {ItemType} item
   * @return  {Promise<void>}
   */
  async function showConfirmDeleteItem(item: ItemType): Promise<void> {
    const confirm = await confirmModal.value.open(
      'يرجي التاكيد',
      'هل انت متاكد من الحذف',
    )

    if (confirm) deleteItem(item)
  }

  /**
   * @description delete item from selected items
   * @param  {any} item
   * @return  {void}
   */
  function deleteItemFromSelectedItems(item: any): void {
    const targetItemIndex = selectedItems.value.findIndex(
      (i: number) => i === item.id,
    )

    if (targetItemIndex !== -1) selectedItems.value.splice(targetItemIndex, 1)
  }

  /**
   * @description delete item from table data after delete from server and update meta data
   * @param  {any} item
   * @return  {void}
   */
  function deleteItemFromTableData(item: any): void {
    const targetIndex = tableData.value.findIndex((i: any) => i.id === item.id)

    if (targetIndex === -1) return
    tableData.value.splice(targetIndex, 1)

    if (metaData.value) {
      metaData.value.total -= 1
      metaData.value.last_page = Math.ceil(
        metaData.value.total / params.itemPerPage,
      )
      if (tableData.value.length === 0 && metaData.value.current_page > 1) {
        params.page = metaData.value.current_page - 1
        getPageData()
      }

      // handle it for first page
      else if (
        tableData.value.length === 0
        && metaData.value.current_page === 1
      ) {
        getPageData()
      }
    }
  }

  /**
   * @description delete item from server
   * @param  {any} item
   * @return  {void}
   */
  function deleteItem(item: any): void {
    console.log('delete')

    deleteItemFromSelectedItems(item)

    IsLoadingData.value = true
    ItemService.deleteItem(item.id as number)
      .then((res: any) => {
        toast.success(res.data.message)
        deleteItemFromTableData(item)
      })
      .finally(() => {
        IsLoadingData.value = false
      })
  }

  /**
   * @description sort items and reload page data
   * @param  {number} target_id
   * @return  {void}
   */
  function sortItems(target_id: number): void {
    const payload = {
      target_id,
      ids: selectedItems.value,
      model: modelName,
    }

    IsLoadingData.value = true
    sharedService
      .sortBulk(payload)
      .then(res => {
        toast.success(res.data.message)
        onReloadData()
      })
      .catch(() => {
        IsLoadingData.value = false
      })
  }

  // #endregion

  return {
    selectedItems,
    tableData,
    metaData,
    showFormModal,
    showDetailsModal,
    FormAction,
    activeItem,
    confirmModal,
    IsLoadingData,
    showCrateModal,
    showEditModal,
    showViewModal,
    getPageData,
    reloadPageData,
    onReloadData,
    onChangeItemsPerPage,
    onChangeSearch,
    onCreateItem,
    onEditItem,
    showConfirmDeleteItem,
    deleteItemFromSelectedItems,
    deleteItemFromTableData,
    deleteItem,
    sortItems,
  }
}
