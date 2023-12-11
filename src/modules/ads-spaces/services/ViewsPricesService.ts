import type { AxiosPromise } from 'axios'
import axios from 'axios'
import type { ViewsPrice, ViewsPriceBase } from '../interfaces/ViewsPrice'

class ViewsPricesService {
  contextPath = 'views_prices'

  /** **************** get ******************/
  getItem(params: any): AxiosPromise {
    return axios.get(`${this.contextPath}`, { params })
  }

  /** **************** post ******************/
  createItem(data: ViewsPriceBase): AxiosPromise {
    return axios.post(`${this.contextPath}`, data)
  }

  /** **************** put ******************/
  editItem(data: ViewsPrice): AxiosPromise {
    return axios.put(`${this.contextPath}/${data.id}`, data)
  }

  /** **************** delete ******************/
  deleteItem(id: number): AxiosPromise {
    return axios.delete(`${this.contextPath}/${id}`)
  }
}

export const viewsPricesService = new ViewsPricesService()
